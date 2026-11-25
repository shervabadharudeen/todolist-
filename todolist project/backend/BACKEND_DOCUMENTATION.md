# ZenTask Backend Documentation

> **Complete Node.js, Express.js & MongoDB REST API Documentation for ZenTask To-Do Web Application**  
> **Author:** Backend Development Team  
> **Version:** 1.0.0  
> **Module Format:** CommonJS (`require` / `module.exports`)  
> **Base URL:** `http://localhost:5000/api`

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Backend Technologies Used](#2-backend-technologies-used)
3. [Folder Structure & File Purpose](#3-folder-structure--file-purpose)
4. [MongoDB Database Setup (Local & MongoDB Atlas)](#4-mongodb-database-setup-local--mongodb-atlas)
5. [Environment Variables Setup (`.env`)](#5-environment-variables-setup-env)
6. [Installation Steps](#6-installation-steps)
7. [Starting the Server](#7-starting-the-server)
8. [API Endpoints Reference Table](#8-api-endpoints-reference-table)
9. [API Request & Response Examples](#9-api-request--response-examples)
10. [Frontend-Backend Communication Flow](#10-frontend-backend-communication-flow)
11. [Error Handling Architecture & Status Codes](#11-error-handling-architecture--status-codes)
12. [Testing APIs with Postman & cURL](#12-testing-apis-with-postman--curl)
13. [Common Errors & Troubleshooting](#13-common-errors--troubleshooting)

---

## 1. Project Overview

The **ZenTask Backend** is a high-performance, modular RESTful API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. It serves as the primary data persistence engine for the ZenTask To-Do List frontend.

### Key Capabilities
- **Full CRUD Operations**: Create, read, update, patch completion status, and delete tasks.
- **Advanced Query Engine**: Server-side filtering by completion status (`Pending`, `Completed`, `All`), priority (`Low`, `Medium`, `High`), category (`Work`, `Personal`, `DevOps`, etc.), search across title/description/category, and multiple sorting algorithms (`newest`, `dueSoon`, `dueLate`, `priority`, `alphabetical`).
- **Data Integrity & Two-Way Sync**: Pre-save Mongoose middleware synchronizes `status` ('Completed'/'Pending') with `completed` boolean and automatically records `completedAt` timestamps.
- **Fail-Safe Offline Resiliency**: Fast database readiness middleware (`checkDbConnection`) prevents hanging queries when MongoDB is unreachable, allowing the React frontend to seamlessly switch between MongoDB and offline LocalStorage.
- **Consistent Response Standard**: Standardized JSON envelopes across all successful queries and errors.

---

## 2. Backend Technologies Used

| Technology | Role & Purpose in Backend |
| :--- | :--- |
| **Node.js** (`>= 18.x`) | JavaScript runtime environment executing backend code asynchronously on the server. |
| **Express.js** (`^4.19.2`) | Fast, unopinionated web framework handling HTTP routing, request parsing, and error middleware. |
| **MongoDB** | High-availability NoSQL document database storing task documents as flexible BSON objects. |
| **Mongoose** (`^8.4.1`) | Elegant MongoDB object modeling for Node.js providing strict schemas, validation, middleware hooks, and query helpers. |
| **dotenv** (`^16.4.5`) | Zero-dependency module that loads environment variables from `.env` into `process.env`. |
| **cors** (`^2.8.5`) | Middleware providing Cross-Origin Resource Sharing headers to allow frontend access from Vite (`http://localhost:5173`). |
| **nodemon** (`^3.1.4`) | Development utility monitoring file changes and automatically restarting the Node server. |

---

## 3. Folder Structure & File Purpose

```
backend/
├── config/
│   └── db.js                       # MongoDB Mongoose connection manager with reconnect logic
├── controllers/
│   └── todoController.js           # CRUD business logic, query filtering & sorting handlers
├── models/
│   └── Todo.js                     # Mongoose schema, validation rules, virtuals & pre-save hooks
├── routes/
│   └── todoRoutes.js               # Express route declarations mapped to controller functions
├── middleware/
│   └── errorMiddleware.js          # Centralized error handler, 404 handler, and DB connectivity guard
├── .env                            # Active environment variables (git-ignored)
├── .env.example                    # Template environment variables with placeholder values
├── .gitignore                      # Git ignore file preventing node_modules and .env from being committed
├── package.json                    # Project metadata, dependencies, and npm run scripts
├── server.js                       # Express app bootstrap, CORS config, route mounting & listener
└── BACKEND_DOCUMENTATION.md        # Comprehensive backend documentation and API specifications
```

### Detailed File Responsibilities

1. **`server.js`**:
   - Initializes the Express application.
   - Loads configuration via `dotenv.config()`.
   - Establishes MongoDB database connection via `connectDB()`.
   - Configures global middleware: CORS, JSON body parser (`express.json()`), URL-encoded parser.
   - Declares the root health-check endpoint (`GET /`).
   - Mounts task routes under `/api/todos`.
   - Registers fallback 404 handler and central error handling middleware.
   - Starts HTTP listener on `PORT`.

2. **`config/db.js`**:
   - Manages Mongoose connection using `process.env.MONGODB_URI`.
   - Sets a 2500ms `serverSelectionTimeoutMS` to prevent server hanging when the database service is unavailable.
   - Logs connection success or diagnostic connection errors.

3. **`models/Todo.js`**:
   - Defines schema constraints: `title` (required, 1-200 chars), `description` (0-1000 chars), `priority` (`Low`, `Medium`, `High`), `dueDate` (YYYY-MM-DD), `dueTime` (e.g. 14:30), `category` (`Work`, `Personal`, etc.), `status` (`Pending`, `Completed`), and `completed` (boolean).
   - Pre-save hook: keeps `status`, `completed`, and `completedAt` strictly in sync.
   - JSON/Object virtuals: transforms `_id` into client-friendly `id` string and removes internal `__v`.

4. **`controllers/todoController.js`**:
   - `getTodos`: Handles status filtering, priority filtering, category filtering, regex text search, and sorting.
   - `getTodoById`: Validates MongoDB ObjectId format and retrieves single task.
   - `createTodo`: Validates request body and creates new task document.
   - `updateTodo`: Updates task properties and recalculates completion timestamp if changed.
   - `updateTodoStatus`: Lightweight endpoint toggling or assigning status (`Completed` vs `Pending`).
   - `deleteTodo`: Deletes task document and returns confirmation.

5. **`routes/todoRoutes.js`**:
   - Attaches `checkDbConnection` guard to all `/api/todos` requests.
   - Maps HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) to corresponding controller functions.

6. **`middleware/errorMiddleware.js`**:
   - `checkDbConnection`: Returns HTTP 503 immediately if `mongoose.connection.readyState !== 1`.
   - `notFound`: Catches requests to unmapped routes and passes 404 error to next middleware.
   - `errorHandler`: Formats Mongoose `CastError`, `ValidationError`, duplicate key errors, and server 500s into standardized JSON.

---

## 4. MongoDB Database Setup (Local & MongoDB Atlas)

You can run ZenTask with either a local MongoDB installation or MongoDB Atlas (free cloud database).

### Option A: Local MongoDB Community Server

1. **Download & Install**:
   - Download the MongoDB Community Server MSI installer for Windows from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).
   - Run the installer and choose "Complete". Keep "Install MongoDB as a Service" checked.
2. **Start MongoDB Service in Windows**:
   - Open PowerShell or Command Prompt as Administrator and run:
     ```powershell
     net start MongoDB
     ```
   - Or start it through Windows Services (`services.msc` -> `MongoDB Server` -> `Start`).
3. **Verify Local Connection**:
   - Default connection URI: `mongodb://127.0.0.1:27017/zentask_todo_db`

---

### Option B: MongoDB Atlas (Free Cloud Database)

1. **Create an Account & Cluster**:
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
   - Create a free **M0 Sandbox** cluster (choose AWS or Google Cloud in your closest region).
2. **Configure Database Access (User Credentials)**:
   - Navigate to **Security** -> **Database Access**.
   - Click **Add New Database User**.
   - Choose **Password** authentication, enter username (e.g. `zentask_user`) and a secure password.
   - Grant role: **Read and write to any database**.
3. **Configure Network Access (IP Whitelist)**:
   - Navigate to **Security** -> **Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) or enter your current public IP address.
4. **Obtain Connection String**:
   - Click **Database** -> **Connect** -> **Drivers** -> Select **Node.js**.
   - Copy connection string URI, which looks like:
     ```
     mongodb+srv://zentask_user:<password>@cluster0.abcde.mongodb.net/zentask_todo_db?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password and update `backend/.env`.

---

## 5. Environment Variables Setup (`.env`)

Inside `backend/`, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Environment Variables Reference

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | The network port the Express server listens on. | `5000` |
| `MONGODB_URI` | MongoDB connection string (local or Atlas URI). | `mongodb://127.0.0.1:27017/zentask_todo_db` |
| `NODE_ENV` | Application runtime environment (`development` or `production`). | `development` |

### Sample `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/zentask_todo_db
NODE_ENV=development
```

> **Security Warning:** Never commit `.env` into source control. Keep `.env` included in `backend/.gitignore`.

---

## 6. Installation Steps

Make sure Node.js (version 18 or newer) is installed on your machine.

1. Navigate to the `backend` directory:
   ```bash
   cd "backend"
   ```

2. Install all required dependencies:
   ```bash
   npm install
   ```

This installs `express`, `mongoose`, `dotenv`, `cors`, and development dependency `nodemon`.

---

## 7. Starting the Server

Inside the `backend` directory:

### Development Mode (with Nodemon Auto-Restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Expected Terminal Output:
```text
[ZenTask Server] Running in development mode on port 5000
[MongoDB] Successfully connected to MongoDB host: 127.0.0.1:27017 / Database: zentask_todo_db
```

---

## 8. API Endpoints Reference Table

All endpoints are prefixed with `/api/todos`.

| Method | Endpoint | Description | Query / Body Parameters | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Root server health check | None | `200 OK` |
| `GET` | `/api/todos` | Retrieve todos with filters & sorting | `status`, `priority`, `category`, `search`, `sortBy` | `200 OK` |
| `GET` | `/api/todos/:id` | Retrieve single todo by ID | Route param: `:id` (MongoDB ObjectId) | `200 OK` |
| `POST` | `/api/todos` | Create a new todo | Request Body (JSON) | `201 Created` |
| `PUT` | `/api/todos/:id` | Update an existing todo | Route param: `:id`, Request Body (JSON) | `200 OK` |
| `PATCH` | `/api/todos/:id/status` | Toggle or set task completion | Route param: `:id`, Request Body (`completed` or `status`) | `200 OK` |
| `DELETE` | `/api/todos/:id` | Delete a todo | Route param: `:id` | `200 OK` |

### Supported Query Parameters for `GET /api/todos`:
- `status`: `all` | `Pending` | `Completed` (case-insensitive)
- `priority`: `all` | `Low` | `Medium` | `High` (case-insensitive)
- `category`: `all` | `Work` | `Personal` | `Design` | `DevOps` | `Study` | `Finance` | `Health` | `Other`
- `search`: Searches substring matches across `title`, `description`, and `category` (case-insensitive)
- `sortBy`: `newest` (default) | `dueSoon` | `dueLate` | `priority` | `alphabetical`

---

## 9. API Request & Response Examples

### 1. `GET /api/todos` (Get All or Filtered Todos)
**Request:**
```http
GET /api/todos?status=Pending&priority=High&search=architecture&sortBy=dueSoon HTTP/1.1
Host: localhost:5000
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "message": "Todos retrieved successfully",
  "data": {
    "todos": [
      {
        "id": "674332ab88e1a53c1d9b4001",
        "title": "Review Node.js Backend Architecture",
        "description": "Inspect controller, middleware, and schema implementation.",
        "priority": "High",
        "dueDate": "2026-11-25",
        "dueTime": "14:00",
        "category": "DevOps",
        "status": "Pending",
        "completed": false,
        "completedAt": null,
        "createdAt": "2026-11-24T10:00:00.000Z",
        "updatedAt": "2026-11-24T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. `POST /api/todos` (Create New Todo)
**Request:**
```http
POST /api/todos HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "Implement MongoDB Indexing",
  "description": "Add indexes for title search and status sorting.",
  "priority": "High",
  "dueDate": "2026-11-28",
  "dueTime": "16:30",
  "category": "DevOps"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "todo": {
      "id": "674332ab88e1a53c1d9b4002",
      "title": "Implement MongoDB Indexing",
      "description": "Add indexes for title search and status sorting.",
      "priority": "High",
      "dueDate": "2026-11-28",
      "dueTime": "16:30",
      "category": "DevOps",
      "status": "Pending",
      "completed": false,
      "completedAt": null,
      "createdAt": "2026-11-24T10:45:00.000Z",
      "updatedAt": "2026-11-24T10:45:00.000Z"
    }
  }
}
```

---

### 3. `GET /api/todos/:id` (Get Single Todo)
**Request:**
```http
GET /api/todos/674332ab88e1a53c1d9b4002 HTTP/1.1
Host: localhost:5000
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo retrieved successfully",
  "data": {
    "todo": {
      "id": "674332ab88e1a53c1d9b4002",
      "title": "Implement MongoDB Indexing",
      "description": "Add indexes for title search and status sorting.",
      "priority": "High",
      "dueDate": "2026-11-28",
      "dueTime": "16:30",
      "category": "DevOps",
      "status": "Pending",
      "completed": false,
      "completedAt": null,
      "createdAt": "2026-11-24T10:45:00.000Z",
      "updatedAt": "2026-11-24T10:45:00.000Z"
    }
  }
}
```

---

### 4. `PUT /api/todos/:id` (Update Existing Todo)
**Request:**
```http
PUT /api/todos/674332ab88e1a53c1d9b4002 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "Implement MongoDB Indexing & Caching",
  "description": "Add compound indexes and verify execution plans.",
  "priority": "Medium",
  "dueDate": "2026-11-29",
  "dueTime": "18:00",
  "category": "DevOps"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "todo": {
      "id": "674332ab88e1a53c1d9b4002",
      "title": "Implement MongoDB Indexing & Caching",
      "description": "Add compound indexes and verify execution plans.",
      "priority": "Medium",
      "dueDate": "2026-11-29",
      "dueTime": "18:00",
      "category": "DevOps",
      "status": "Pending",
      "completed": false,
      "completedAt": null,
      "createdAt": "2026-11-24T10:45:00.000Z",
      "updatedAt": "2026-11-24T11:00:00.000Z"
    }
  }
}
```

---

### 5. `PATCH /api/todos/:id/status` (Toggle Completion Status)
**Request:**
```http
PATCH /api/todos/674332ab88e1a53c1d9b4002/status HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "completed": true
}
```
*(Accepts either `{"completed": true}` or `{"status": "Completed"}`)*

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo marked as completed",
  "data": {
    "todo": {
      "id": "674332ab88e1a53c1d9b4002",
      "title": "Implement MongoDB Indexing & Caching",
      "status": "Completed",
      "completed": true,
      "completedAt": "2026-11-24T11:05:00.000Z",
      "updatedAt": "2026-11-24T11:05:00.000Z"
    }
  }
}
```

---

### 6. `DELETE /api/todos/:id` (Delete Todo)
**Request:**
```http
DELETE /api/todos/674332ab88e1a53c1d9b4002 HTTP/1.1
Host: localhost:5000
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": {
    "deletedId": "674332ab88e1a53c1d9b4002",
    "deletedTitle": "Implement MongoDB Indexing & Caching"
  }
}
```

---

### 7. Standardized Error Response Examples

#### Bad Request / Validation Failure (400)
```json
{
  "success": false,
  "message": "Validation Error: Task title is required"
}
```

#### Resource Not Found (404)
```json
{
  "success": false,
  "message": "Todo not found with ID: 674332ab88e1a53c1d9b9999"
}
```

#### Database Service Offline (503 Service Unavailable)
```json
{
  "success": false,
  "message": "Database service is unavailable. Please ensure MongoDB is running."
}
```

---

## 10. Frontend-Backend Communication Flow

The frontend connects to the backend through the dedicated `frontend/src/services/todoApi.js` HTTP client.

```
┌────────────────────────────────────────────────────────┐
│                   ZenTask React App                   │
│   (App.jsx / Header.jsx / TaskList.jsx / TaskForm.jsx) │
└───────────────────────────┬────────────────────────────┘
                            │
               Calls REST Client Functions
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            frontend/src/services/todoApi.js            │
│  fetchTodos(), createTodo(), updateTodo(),             │
│  updateTodoStatus(), deleteTodo()                      │
└───────────────────────────┬────────────────────────────┘
                            │  HTTP Requests (JSON)
                            │  CORS: http://localhost:5173
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Express.js Router                     │
│                  (routes/todoRoutes.js)                │
└───────────────────────────┬────────────────────────────┘
                            │
               checkDbConnection Guard Middleware
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Controller Logic                       │
│             (controllers/todoController.js)            │
└───────────────────────────┬────────────────────────────┘
                            │
               Mongoose Query / Validation
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   MongoDB Database                     │
│          Collection: todos (models/Todo.js)            │
└────────────────────────────────────────────────────────┘
```

### Communication Lifecycle
1. **Initial Load**:
   - `App.jsx` executes `todoApi.checkBackendHealth()`.
   - If online (`200 OK`), tasks are fetched via `todoApi.fetchTodos()` and rendered, updating the header badge to **"MongoDB API Live"**.
   - If offline, the app displays **"Local Mode"** and reads existing tasks from LocalStorage without crashing.
2. **Task Creation (`POST`)**:
   - Submitting the task form calls `todoApi.createTodo(taskData)`.
   - On success, the task prepends to the state list and toast feedback is displayed.
3. **Status Toggle (`PATCH`)**:
   - Clicking the task completion checkbox triggers `todoApi.updateTodoStatus(id, willBeCompleted)`.
   - Updates task completion status in MongoDB and recalculates completion rate in the dashboard stats.
4. **Priority Cycling (`PUT`)**:
   - Clicking the priority badge cycles (`Low` -> `Medium` -> `High` -> `Low`) and updates the document via `todoApi.updateTodo()`.
5. **Deletion (`DELETE`)**:
   - Confirming deletion in the modal calls `todoApi.deleteTodo(id)`, removing the task from MongoDB.

---

## 11. Error Handling Architecture & Status Codes

Centralized error handling is handled in `backend/middleware/errorMiddleware.js`.

### Status Codes Reference

| HTTP Status | Meaning | When It Occurs |
| :--- | :--- | :--- |
| `200 OK` | Success | Tasks fetched, updated, status toggled, or deleted. |
| `201 Created` | Created | New task successfully created in MongoDB. |
| `400 Bad Request` | Client Error | Empty title, invalid priority enum, or malformed MongoDB ObjectId. |
| `404 Not Found` | Not Found | Route does not exist or task ID does not exist in database. |
| `500 Server Error`| Internal Error | Unhandled server exception (stack trace included in development). |
| `503 Service Unavailable` | Offline DB | MongoDB service disconnected; triggers instant fallback to LocalStorage. |

---

## 12. Testing APIs with Postman & cURL

### 1. Test Root Health Check
```bash
curl -X GET http://localhost:5000/
```

### 2. Fetch All Todos
```bash
curl -X GET http://localhost:5000/api/todos
```

### 3. Filter by Pending & High Priority
```bash
curl -X GET "http://localhost:5000/api/todos?status=Pending&priority=High"
```

### 4. Create a Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Build Backend API\",\"description\":\"Express and MongoDB\",\"priority\":\"High\",\"category\":\"Work\"}"
```

### 5. Update a Todo (Replace `<ID>` with MongoDB ObjectId)
```bash
curl -X PUT http://localhost:5000/api/todos/<ID> \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Build Backend API v2\",\"priority\":\"Medium\"}"
```

### 6. Toggle Completion Status
```bash
curl -X PATCH http://localhost:5000/api/todos/<ID>/status \
  -H "Content-Type: application/json" \
  -d "{\"completed\":true}"
```

### 7. Delete a Todo
```bash
curl -X DELETE http://localhost:5000/api/todos/<ID>
```

---

## 13. Common Errors & Troubleshooting

### 1. `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`
- **Cause:** MongoDB service is not currently running on your local machine.
- **Fix:**
  - Start the MongoDB service:
    ```powershell
    net start MongoDB
    ```
  - Or switch to a MongoDB Atlas cloud URI in `backend/.env`.

---

### 2. `CastError: Cast to ObjectId failed for value "..." at path "_id"`
- **Cause:** Client passed an invalid format as `:id` parameter (must be a 24-character hexadecimal string).
- **Fix:** Ensure the requested ID is a valid MongoDB ObjectId. The controller automatically intercepts malformed IDs and returns a clean `400 Bad Request` message.

---

### 3. `ValidationError: Task title is required`
- **Cause:** Attempting to create or update a task with an empty or whitespace-only `title`.
- **Fix:** Ensure the JSON request body contains a non-empty `title` property.

---

### 4. `CORS Error: Access to fetch has been blocked by CORS policy`
- **Cause:** Frontend origin is rejected by the backend server.
- **Fix:** `backend/server.js` is preconfigured with `cors({ origin: '*' })` to permit cross-origin requests from any development port. Ensure `server.js` uses `app.use(cors())` before declaring routes.

---

### 5. `Error: listen EADDRINUSE: address already in use :::5000`
- **Cause:** Another process is already running on port 5000.
- **Fix:**
  - Change `PORT=5001` in `backend/.env`, or
  - Terminate the conflicting process on Windows:
    ```powershell
    netstat -ano | findstr :5000
    taskkill /PID <PID_NUMBER> /F
    ```

---

*ZenTask Backend — Engineered for Speed, Resiliency, and Clarity.*
