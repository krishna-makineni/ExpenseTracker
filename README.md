# Expense Tracker

A full-stack expense tracking application built with React.js, Axios, and JSON-Server. This application allows users to track their income and expenses, manage budgets, and analyze their financial data with beautiful charts and insights.

## Features

- ✅ **Tailwind CSS** - Clean and responsive user interface
- ✅ **Axios** - API requests handling between frontend and JSON-Server
- ✅ **React Router DOM** - Navigation across multiple pages
- ✅ **JSON-Server** - Backend to store and manage user data
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete operations for transactions and budgets
- ✅ User Authentication (Signup/Login)
- ✅ Transaction Management (Income & Expenses)
- ✅ Budget Management with Progress Tracking
- ✅ Financial Analytics & Charts
- ✅ AI-Powered Suggestions
- ✅ Dark Mode Support

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/downloads) (for version control)

## Installation

1. **Clone the repository** (if using Git):
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Axios and JSON-Server** (if not already installed):
   ```bash
   npm install axios
   npm install --save-dev json-server
   ```

## Running the Application

### Step 1: Start JSON-Server

Open a terminal and start the JSON-Server backend:

```bash
npm run server
```

This will start JSON-Server on `http://localhost:3001` and watch the `db.json` file for changes.

**Alternative command:**
```bash
npm run server:start
```

Or directly:
```bash
npx json-server --watch db.json --port 3001
```

### Step 2: Start the React Development Server

Open a **new terminal window** (keep the JSON-Server running) and start the React app:

```bash
npm run dev
```

This will start the development server on `http://localhost:5173`.

### Step 3: Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:5173
- JSON-Server API: http://localhost:3001

## Project Structure

```
expense-tracker/
├── db.json                 # JSON-Server database file
├── src/
│   ├── components/        # React components
│   ├── context/           # React Context (Auth & Finance)
│   ├── pages/             # Page components
│   ├── services/          # API service layer (Axios)
│   ├── utils/             # Utility functions
│   └── constants.js       # App constants
├── package.json
└── README.md
```

## API Structure

The JSON-Server provides the following endpoints:

- **Transactions**: `http://localhost:3001/transactions`
  - GET `/transactions` - Get all transactions
  - POST `/transactions` - Create a transaction
  - PUT `/transactions/:id` - Update a transaction
  - DELETE `/transactions/:id` - Delete a transaction

- **Budgets**: `http://localhost:3001/budgets`
  - GET `/budgets` - Get all budgets
  - POST `/budgets` - Create a budget
  - PUT `/budgets/:id` - Update a budget
  - DELETE `/budgets/:id` - Delete a budget

- **Users**: `http://localhost:3001/users`
  - GET `/users` - Get all users
  - POST `/users` - Create a user
  - PUT `/users/:id` - Update a user
  - DELETE `/users/:id` - Delete a user

## Usage

1. **Sign Up / Login**: Create an account or login with existing credentials
2. **Add Transactions**: Track your income and expenses with categories
3. **Set Budgets**: Create budgets for expense categories
4. **View Dashboard**: See your financial overview and trends
5. **Analyze**: Check charts and analytics in the Summary page
6. **Get AI Suggestions**: Use the AI advisor for budget recommendations

## Available Scripts

- `npm run dev` - Start the React development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run server` - Start JSON-Server (port 3001)
- `npm run server:start` - Alternative command to start JSON-Server

## Technologies Used

- **React.js** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Routing
- **Axios** - HTTP client for API requests
- **JSON-Server** - REST API backend
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization

## Important Notes

⚠️ **Make sure JSON-Server is running before using the application!**

The application requires JSON-Server to be running on port 3001. If you see errors about connection failures, check that:

1. JSON-Server is started with `npm run server`
2. The server is running on port 3001
3. The `db.json` file exists in the root directory

## Troubleshooting

**Error: "Failed to connect to server"**
- Ensure JSON-Server is running: `npm run server`
- Check that port 3001 is not in use by another application

**Error: "Cannot find module 'axios'"**
- Run `npm install axios` to install Axios

**Error: "Cannot find module 'json-server'"**
- Run `npm install --save-dev json-server` to install JSON-Server

## License

This project is open source and available for educational purposes.
