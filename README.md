# Code-Review-Node-TSK5

# Collaborative Code Review Platform API

A comprehensive API-driven platform for code review collaboration with real-time updates.

## Features

- JWT Authentication
- Project & Team Management
- Code Submission & Review
- Inline Comments
- Review Workflow (Approve/Request Changes)
- Real-time Notifications via WebSocket
- Project Analytics Dashboard

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL
- WebSocket (ws)
- JWT Authentication

## Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE code_review_db;
```

2. Run the schema file to create tables:
```bash
psql -U postgres -d code_review_db -f src/database/schema.sql
```

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env` file):
```env
PORT=3000
NODE_ENV=development

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=code_review_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here

JWT_SECRET=your_very_secure_random_secret_key_here
JWT_EXPIRES_IN=7d
```

3. Build and start the server:
```bash
npm run build
npm start
```

The server will be available at `http://localhost:3000`

## 🧪 API Testing Guide

This section will help you test all the API endpoints step by step. We've included three ways to test the API:

### Method 1: REST Client Extension (VS Code)
If you're using VS Code, install the "REST Client" extension and use the `api-tests.http` file.

### Method 2: Postman Collection
Import the `postman-collection.json` file into Postman for a complete testing suite.

### Method 3: Manual Testing with curl/HTTP client

Below is a comprehensive testing workflow that covers all API functionality:

#### 🚀 Step 1: Health Check
First, verify the server is running:
```bash
curl http://localhost:3000/health
```
**Expected Response:** `{"status":"ok","timestamp":"2025-10-06T..."}`

#### 🔐 Step 2: User Registration & Authentication

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "submitter"
  }'
```
**Expected Response:** User created with JWT token

**Login to get authentication token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```
**Expected Response:** JWT token - **Copy this token for use in subsequent requests!**

#### 👥 Step 3: User Profile Management

**Get your profile (replace YOUR_JWT_TOKEN):**
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update your profile:**
```bash
curl -X PUT http://localhost:3000/api/users/YOUR_USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "display_picture": "https://example.com/avatar.jpg"
  }'
```

#### 📁 Step 4: Project Creation & Management

**Create a new project:**
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "React Dashboard",
    "description": "Modern React dashboard with TypeScript"
  }'
```
**Expected Response:** Project created - **Save the project ID for next steps!**

**Get all projects:**
```bash
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Add a team member to your project:**
```bash
curl -X POST http://localhost:3000/api/projects/YOUR_PROJECT_ID/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "MEMBER_USER_ID",
    "role": "reviewer"
  }'
```

#### 📝 Step 5: Code Submission

**Submit code for review:**
```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "YOUR_PROJECT_ID",
    "title": "User Authentication Module",
    "description": "JWT-based authentication implementation",
    "code_content": "import jwt from '\''jsonwebtoken'\'';\n\nexport const generateToken = (payload) => {\n  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '\''7d'\'' });\n};\n\nexport const verifyToken = (token) => {\n  return jwt.verify(token, process.env.JWT_SECRET);\n};",
    "file_name": "auth.js",
    "language": "javascript"
  }'
```
**Expected Response:** Submission created - **Save the submission ID!**

**Get your submissions:**
```bash
curl -X GET http://localhost:3000/api/submissions/my-submissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 💬 Step 6: Comments & Feedback

**Add a comment to a submission:**
```bash
curl -X POST http://localhost:3000/api/submissions/YOUR_SUBMISSION_ID/comments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great implementation! Consider adding input validation for the payload parameter.",
    "line_number": 3
  }'
```

**Get all comments for a submission:**
```bash
curl -X GET http://localhost:3000/api/submissions/YOUR_SUBMISSION_ID/comments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### ✅ Step 7: Review Process

**Approve a submission:**
```bash
curl -X POST http://localhost:3000/api/submissions/YOUR_SUBMISSION_ID/approve \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Code looks excellent! Clean implementation and follows best practices."
  }'
```

**Request changes:**
```bash
curl -X POST http://localhost:3000/api/submissions/YOUR_SUBMISSION_ID/request-changes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Please add error handling for invalid tokens and consider rate limiting."
  }'
```

#### 🔔 Step 8: Notifications

**Check your notifications:**
```bash
curl -X GET http://localhost:3000/api/notifications/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get only unread notifications:**
```bash
curl -X GET "http://localhost:3000/api/notifications/me?unread=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 📊 Step 9: Analytics & Statistics

**Get project statistics:**
```bash
curl -X GET http://localhost:3000/api/projects/YOUR_PROJECT_ID/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 🚫 Step 10: Error Testing

Test how the API handles various error scenarios:

**Invalid email format:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123", 
    "name": "Test User"
  }'
```
**Expected:** Validation error with helpful message

**Unauthorized request:**
```bash
curl -X GET http://localhost:3000/api/users/me
```
**Expected:** Authentication error

**Non-existent resource:**
```bash
curl -X GET http://localhost:3000/api/projects/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Expected:** "Resource not found" error

### 🌐 WebSocket Testing

The API includes real-time notifications via WebSocket. Connect to:
```
ws://localhost:3000/ws
```

You'll receive real-time updates for:
- New comments on your submissions
- Review status changes  
- Project activity notifications

### 📱 Testing Tips

1. **Save Important IDs**: Throughout testing, save the user ID, project ID, and submission ID for use in subsequent requests.

2. **Token Management**: The JWT token expires in 7 days. If you get authentication errors, login again to get a fresh token.

3. **Error Messages**: The API provides human-friendly error messages to help you understand what went wrong.

4. **Rate Limiting**: Be mindful of making too many rapid requests during testing.

5. **Database State**: Each test creates real data. You can reset the database by running the schema file again.

### 🔧 Troubleshooting

**Server won't start?**
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure the database `code_review_db` exists

**Authentication errors?**
- Make sure you're including the `Authorization: Bearer YOUR_TOKEN` header
- Check if your token has expired (login again)

**Database connection issues?**
- Verify PostgreSQL service is running
- Check database credentials and network connectivity
- Ensure the database schema has been applied

### 📋 Complete Test Checklist

Use this checklist to verify all functionality works:

- [ ] ✅ Health check responds
- [ ] 🔐 User registration works
- [ ] 🔑 User login returns JWT token
- [ ] 👤 Profile retrieval and update work
- [ ] 📁 Project creation successful
- [ ] 👥 Adding project members works  
- [ ] 📝 Code submission created
- [ ] 💬 Comments can be added
- [ ] ✅ Approval process works
- [ ] 🔄 Change requests work
- [ ] 🔔 Notifications are received
- [ ] 📊 Statistics are generated
- [ ] 🚫 Error handling works properly
- [ ] 🌐 WebSocket connections work

## REST Client Variables for VS Code

If you're using the REST Client extension in VS Code, copy these variables to the top of your `api-tests.http` file:

```http
### Base URL
@baseUrl = http://localhost:3000/api
@contentType = application/json

### Variables (update these after running tests)
@authToken = your_jwt_token_here
@userId = user_id_here
@projectId = project_id_here
@submissionId = submission_id_here
```

## Project Structure

```
src/
├── server.ts              # Main server file
├── config/
│   ├── database.ts        # Database connection
│   └── env.ts            # Environment configuration
├── controllers/          # Request handlers
├── middleware/           # Auth & validation middleware
├── models/              # Database models
├── routes/              # API routes
├── services/            # Business logic
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── websocket/           # WebSocket server
```

## License

This project is for educational purposes as part of CodeTribe assessment.