<h1>Swivl - Travel Diary Platform (Backend)</h1>

Features
--------
User registration: Allows users to register with their email and password. 
User login: Enables users to login with their registered credentials. 
Profile management: Users can update their profile information. 
Travel diary entry management: Users can create, read, update, and delete their travel diary entries. 
JWT authentication: Secure access to API endpoints using JSON Web Tokens.

Setup
-----
Install dependencies by running "npm install". 
Start the server with "npm run dev" / "node app.js".

-------------
here are response of my API endpoints- 
--------------

![First response](https://github.com/Mrinalummadising/swivl-backend/blob/Dev/Screenshot%20(60).png)
<hr/> 

![Second Response](https://github.com/Mrinalummadising/swivl-backend/blob/Dev/Screenshot%20(61).png?raw=true)
<hr/> 

![Third Response](https://github.com/Mrinalummadising/swivl-backend/blob/Dev/Screenshot%20(62).png?raw=true)
<hr/>

![Fourth Response](https://github.com/Mrinalummadising/swivl-backend/blob/Dev/Screenshot%20(64).png?raw=true)
<hr/>

API Endpoints
-------------
POST /register: Register a new user. 
Request body : json
{ "email": "example@gmail.com", "password": "password" }

POST /login:  Log in with existing user credentials. 
Request body : json
{ "email": "example@gmail.com", "password": "password" }

POST /diary : Add a new travel diary entry (requires authentication). 
Request body: json
{ "title": "Trip to Paris", "description": "Visited Eiffel Tower", "date": "2024-04-10", "location": "Paris, France" }

GET /diary :  Get all travel diary entries for the authenticated user. 

PUT /diary/:id  : Update a specific travel diary entry (requires authentication). 
Request body: json
{ "title": "Updated Title", "description": "Updated Description", "date": "2024-04-10", "location": "Paris, France" }

DELETE  /diary/:id  :  Delete a specific travel diary entry (requires authentication).

Authentication 
--------------
Authentication is done using JWT (JSON Web Tokens). After successful login, a JWT token is generated and sent in the response. This token should be included in the Authorization header of subsequent requests to authenticated endpoints.
