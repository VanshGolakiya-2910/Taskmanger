# Task Manager

A full-stack web application for managing tasks, designed to help teams organize workflows and track progress. This application features a React frontend for an interactive user interface and a Node.js/Express backend connected to a MySQL database.

## 🚀 Features

* **Task Management:** Create, read, update, and delete tasks efficiently.
* **Team Collaboration:** Assign members to specific tasks.
* **Kanban/List View:** Organize tasks visually (inferred from project structure).
* **RESTful API:** Robust backend API handling data operations.
* **Responsive Design:** User-friendly interface built with React.

## 🛠️ Tech Stack

### Backend

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL (using `mysql2` driver)
* **Environment Management:** Dotenv
* **CORS:** Cross-Origin Resource Sharing enabled

### Frontend

* **Framework:** React
* **HTTP Client:** Axios
* **Icons:** React Icons
* **Styling:** CSS

## 📂 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) installed
* [MySQL](https://www.mysql.com/) installed and running locally or via a cloud provider.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/taskmanger.git
cd taskmanger

```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install

```

**Database Configuration:**

1. Create a MySQL database for the project.
2. Create a `.env` file in the `backend` root.
3. Add your database credentials (example configuration):

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name

```

Start the backend server:

```bash
npm start

```

*The server typically runs on http://localhost:5000*

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install

```

Start the React development server:

```bash
npm start

```

*The application will open in your browser at http://localhost:3000*

## 📜 Scripts

**Backend**

* `npm start`: Starts the server using `node server.js`.
* `npm run dev`: Starts the server in development mode using `nodemon`.

**Frontend**

* `npm start`: Runs the app in development mode.
* `npm run build`: Builds the app for production.

## 📄 License

This project is licensed under the MIT License.
