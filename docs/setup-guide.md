# Time Management System Setup Guide

## 1. Install dependencies

Open two terminals.

```bash
cd client
npm install
```

```bash
cd server
npm install
```

## 2. Create the database

Run `database/schema.sql` in MySQL Workbench or the MySQL command line. It creates the `time_management_system` database and its starting tables.

## 3. Configure the backend

Copy `server/.env.example` to `server/.env`. Replace the MySQL and email values with your own values. Never commit `.env` because it contains secrets.

## 4. Start the project

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in the other terminal:

```bash
cd client
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`. Check `http://localhost:5000/api/health` to confirm the API is running.

## Folder purpose

- `server/src/config`: MySQL and email configuration.
- `server/src/controllers`: request-handling functions.
- `server/src/middleware`: reusable Express request logic.
- `server/src/models`: database query functions.
- `server/src/routes`: API URL definitions.
- `server/src/utils`: small helper functions such as JWT creation.
