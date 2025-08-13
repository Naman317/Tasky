
## Introduction
Tasky is a cloud‐based task management application built with a modern JavaScript stack. The project features a backend API built using Express and Mongoose on Node.js, and a frontend built with React powered by Vite. Tasky enables users to register, log in, create and manage tasks and subtasks, and view tasks in both board and list views. The application supports role-based accesses such as admin and regular users, and includes functionality for user notifications and team collaboration. 

## Features
- **Task Management** – Create, update, and soft delete tasks using endpoints defined in the server routes (see taskRoutes.js fileciteturn0file2).
- **Subtask Functionality** – Add subtasks to existing tasks with validations and activity logging (refer to createSubTask in taskControllers).
- **Role-Based Access Control** – Utilize middleware to protect routes so that only authorized team members or admins are allowed to perform sensitive operations, as shown in userRoutes.js and taskRoutes.js .
- **Dashboard and Analytics** – Aggregate tasks based on stage and priority, providing a summary view that is useful for a quick overview of recent and pending tasks.
- **Voice Commands** -Users can create, or delete tasks by speaking instead of typing.Example: “Create a new task called Finish Project Report"

## Requirements
- **Node.js** – Version 14.x or above is recommended.
- **MongoDB** – A running instance is required for storing tasks, users, notifications, and related data.
- **npm or yarn** – To install dependencies for both the server and the client.
- **Vite** – Used as the frontend bundler (configured in client/vite.config.js fileciteturn0file18).

## Installation
### Backend
1. Navigate to the server directory.
2. Install the dependencies:
   Code:
   ------------------------------------------------------------
   npm install
   ------------------------------------------------------------
3. Create a .env file in the server root and define environment variables such as the MongoDB connection string and JWT secrets.

### Frontend
1. Navigate to the client directory.
2. Install the dependencies:
   Code:
   ------------------------------------------------------------
   npm install
   ------------------------------------------------------------
3. The client is configured to proxy API requests to the backend using the base URL defined in client/src/assets/axios.js .

## Usage
### Backend Server
- Run the server with the following npm script:
   Code:
   ------------------------------------------------------------
   npm run start
   ------------------------------------------------------------
- The server exposes endpoints under the `/api` namespace. Routes are organized into user and task endpoints (for example, `/api/task` and `/api/user` – see server/routes for further details ).

### Frontend Application
- Start the frontend application with:
   Code:
   ------------------------------------------------------------
   npm run dev
   ------------------------------------------------------------
- Once the Vite development server is running, open the provided localhost URL in a web browser. 

## Configuration
- **Environment Variables (Server):**
  - MONGODB_URI – MongoDB connection URI.
  - JWT_SECRET – Secret key for generating JSON Web Tokens.
  - PORT – Port on which the backend will run.
- **Client Configuration:**
  - API Base URL is set up in `client/src/assets/axios.js` to point to the running backend endpoint.
- **TailwindCSS:**
  - The client’s styling configuration is provided in tailwind.config.js to scan the appropriate files 

## Contributing
We welcome contributions from the community. To contribute:
- **Fork the repository** and create your branch from the main branch.
- **Follow established coding conventions** – ensure that your code follows a clear and consistent style. Refer to existing code files like routes and components for guidance.
- **Write tests and update documentation** as needed.
- **Submit pull requests** along with a clear description of your changes.
- **Communicate with maintainers** if you have any questions or require further guidance.
