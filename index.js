const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const databasePath = path.join(__dirname, "travel_diary.db");

let db = null;

const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: databasePath,
            driver: sqlite3.Database
        });

        console.log('Database connected');

        app.use(bodyParser.json());

        await createTables();

        defineRoutes();

        const PORT = 5002;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();

const createTables = async () => {
    await db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            email TEXT NOT NULL
        )
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author_id INTEGER NOT NULL,
            location_id INTEGER NOT NULL,
            FOREIGN KEY (author_id) REFERENCES users(id),
            FOREIGN KEY (location_id) REFERENCES locations(id)
        )
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL
        )
    `);
};

const defineRoutes = () => {
    
    app.get('/', (req, res) => {
        res.send(`[DEMO] Welcome to the Travel Diary Platform!
        <br>
        <br> To access users data, use: <a href="/users">/users</a>
        <br> To access travel entries, use: <a href="/entries">/entries</a>
        <br> To access locations, use: <a href="/locations">/locations</a>
        <br> ...`);
    });

    app.get('/users', async (req, res) => {
        try {
            const users = await db.all('SELECT * FROM users');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    app.get('/users/:id', async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    app.post('/users', async (req, res) => {
        const { username, email } = req.body;
        try {
            const newUser = await db.run('INSERT INTO users (username, email) VALUES (?, ?)', [username, email]);
            res.status(201).json({ id: newUser.lastID, username, email });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Similar routes for updating and deleting users

    app.get('/entries', async (req, res) => {
        try {
            const entries = await db.all('SELECT * FROM entries');
            res.json(entries);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    app.post('/diaryentries', async (req, res) => {
        const { title, content, author_id, location_id } = req.body;
        try {
            // Check if author and location exist before adding entry
            const authorExists = await db.get('SELECT * FROM users WHERE id = ?', [author_id]);
            const locationExists = await db.get('SELECT * FROM locations WHERE id = ?', [location_id]);
            if (!authorExists || !locationExists) {
                return res.status(404).json({ message: 'Author or location not found' });
            }
            const newEntry = await db.run('INSERT INTO entries (title, content, author_id, location_id) VALUES (?, ?, ?, ?)', [title, content, author_id, location_id]);
            res.status(201).json({ id: newEntry.lastID, title, content, author_id, location_id });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Similar routes for updating and deleting entries

    app.get('/locations', async (req, res) => {
        try {
            const locations = await db.all('SELECT * FROM locations');
            res.json(locations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    app.post('/locations', async (req, res) => {
        const { name, latitude, longitude } = req.body;
        try {
            const newLocation = await db.run('INSERT INTO locations (name, latitude, longitude) VALUES (?, ?, ?)', [name, latitude, longitude]);
            res.status(201).json({ id: newLocation.lastID, name, latitude, longitude });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Similar routes for updating and deleting locations

    // Error handling middleware
    app.use((err, req, res, next) => {
        res.status(500).json({ message: err.message });
    });
};
