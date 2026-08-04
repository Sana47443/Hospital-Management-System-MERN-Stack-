# Hospital Management Application (MERN)

A complete hospital operations application built with MongoDB, Express, React, and Node.js.

## Features

- JWT authentication with Admin, Receptionist, and Doctor roles
- Patient management
- Doctor management
- Appointment scheduling and status updates
- Conflict detection for overlapping doctor appointments
- Dashboard metrics and upcoming appointments
- Search, filters, pagination, validation, and centralized error handling
- Seed script for demo accounts and records
- Docker Compose setup for MongoDB, API, and production frontend

## Demo accounts after seeding

- Admin: `admin@hospital.local` / `Admin123!`
- Receptionist: `reception@hospital.local` / `Reception123!`
- Doctor: `doctor@hospital.local` / `Doctor123!`

Change these passwords before production use.

## Option 1: Run with Docker

```bash
docker compose up --build
```

Then open `http://localhost:8080`.

To seed demo data:

```bash
docker compose exec server npm run seed
```

## Option 2: Run locally

Requirements: Node.js 20+, npm, and MongoDB.

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
npm install
npm run install:all
npm run dev
```

Seed demo data:

```bash
npm run seed --prefix server
```

Frontend: `http://localhost:5173`  
API: `http://localhost:5000/api`

## Production checklist

- Replace `JWT_SECRET` with a long random value.
- Restrict `CLIENT_ORIGIN` to your deployed frontend URL.
- Use a managed MongoDB deployment with authentication and backups.
- Put the API behind HTTPS and a reverse proxy.
- Replace demo users and passwords.
- Configure logging, monitoring, backups, and secret management.
- Review healthcare/privacy requirements before storing real patient information. This sample is not a certified HIPAA-compliant system.
