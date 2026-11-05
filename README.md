# Student Management System (React + Node.js)

A beginner-friendly full-stack student management web application.

## Features
- Dashboard with total students, active students, inactive students and average GPA.
- View student details in a table.
- Search by student name, ID, email or department.
- Filter students by Active / Inactive status.
- Add, edit and delete student records.
- Node.js + Express REST API.
- Student data is saved in `server/data/students.json`, so it remains after restarting the server.
- Responsive layout for laptop and mobile screens.

## Requirements
- Node.js 18.11 or newer
- npm

## Run the project
1. Extract the ZIP file.
2. Open the `student-management-system` folder in VS Code.
3. Open the terminal in that folder.
4. Install all dependencies:

   ```bash
   npm install
   ```

5. Start the React app and Node.js server:

   ```bash
   npm run dev
   ```

6. Open this address in your browser:

   `http://localhost:5173`

The React frontend runs on port `5173`. The Express backend runs on port `5000`.

## Useful commands

```bash
npm install       # Install dependencies
npm run dev       # Start frontend and backend together
npm run build     # Build the React frontend
npm start         # Start only the Node.js API server
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check whether the API is running |
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

## Main folder structure

```text
student-management-system/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── server/
│   ├── data/
│   │   └── students.json
│   ├── package.json
│   └── server.js
├── package.json
└── README.md
```

## Note
This practice project uses a JSON file as its storage instead of MongoDB or MySQL. The sample student names and contact details are fictional. Keep the terminal running while using the website.
