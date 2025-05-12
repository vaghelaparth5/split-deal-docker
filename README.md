# Split-Deal
This repository contains the code written for Split Deal, a deal sharing platform. Its going to use Vanilla JS and node.

A RESTful API for group buying deals with JWT authentication

Features
✅ JWT Authentication (/register, /login)
✅ Group Management (Create groups, update status)
✅ Role-Based Access Control (Admin/User)
✅ MongoDB Data Models (Users, Groups, Deals)

Tech Stack
Backend: Node.js, Express
Database: MongoDB
Authentication: JWT, Bcrypt
Testing: Postman
Frontend: Vanilla JS

Setup
Clone the repo

git clone https://github.com/vaghelaparth5/Split-Deal.git
cd Split-Deal

Install dependencies:
npm install

Configure environment variables:
Create a .env file (see Environment Variables).

Run the server:
npm run start

API Endpoints

Authentication
Endpoint	Method	Description	Request Body Example
/api/auth/register	POST	Register a new user	{ "user_email": "test@example.com", "user_password": "123456", "name": "John Doe", "phone_number": "+1234567890" }
/api/auth/login	POST	Login and get JWT token	{ "user_email": "test@example.com", "user_password": "123456" }

Group Management (Requires JWT)
Endpoint	Method	Description	Request Body Example
/api/groups/create-group	POST	Create a new group	{ "dealTitle": "50% Off Gym Membership", "storeLocation": "Sydney", ... }
/api/groups/update-group-status/:id	PUT	Update group status (Admin-only)	{ "status": "completed" }

Testing
Manual Testing in Postman

