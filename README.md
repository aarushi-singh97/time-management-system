# ⏰ Time Management System

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

A full-stack **Time Management System** developed to simplify workplace scheduling, task organization, and appointment management. The system provides secure authentication, role-based dashboards, meeting scheduling, leave management, and personal task tracking, making it suitable for organizations and teams.

---

## ✨ Features

- 🔐 Secure User Authentication using JWT
- 👥 Role-Based Access Control
  - Admin
  - Secretary
  - Executive
- 📅 Appointment Management
- 🤝 Meeting Scheduling & Participant Management
- 📝 Personal Task Management
- 🌴 Leave Request Management
- 📊 Dashboard with Activity Overview
- 📧 Email Notification Support
- 🔒 Protected Routes
- 💾 MySQL Database Integration

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Nodemailer

### Database
- MySQL

### Tools
- Git
- GitHub
- VS Code

---

## 📂 Project Structure

```text
time-management-system/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── database/
│   ├── schema.sql
│   ├── sample_data.sql
│   └── migrations/
│
├── docs/
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/aarushi-singh97/time-management-system.git
cd time-management-system
```

### Install Frontend

```bash
cd client
npm install
```

### Install Backend

```bash
cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=time_management_system

JWT_SECRET=your_secret_key

EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## 🗄️ Database Setup 

1. Open MySQL Workbench.
2. Execute:

```
database/schema.sql
```

3. (Optional) Import

```
sample_data.sql
```

to populate demo data.

---

## ▶️ Run the Project

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

---


## 🔑 User Roles

### 👨‍💼 Admin
- Manage users
- Monitor system
- View dashboards

### 👩‍💻 Secretary
- Manage appointments
- Schedule meetings
- Coordinate events

### 👨 Executive
- View schedule
- Manage personal tasks
- Submit leave requests

---

## 📌 Future Enhancements

- Calendar Integration
- Mobile Application
- Push Notifications
- AI-powered Task Suggestions
- Analytics Dashboard
- Dark Mode
- Google Calendar Sync

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Create a Pull Request

---

## 👩‍💻 Author

**Aarushi Singh**

GitHub: https://github.com/aarushi-singh97

---

⭐ If you found this project useful, consider giving it a star.
