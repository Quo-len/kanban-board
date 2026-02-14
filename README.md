# Kanban Board

A full-stack Kanban board application built with React, TypeScript, Express.js, and PostgreSQL.

## Tech Stack

### Frontend

- **React 19** with TypeScript (hooks only, no classes)
- **Redux Toolkit** for state management
- **Material-UI** for components
- **@dnd-kit** for drag-and-drop functionality
- **Axios** for API calls
- **ESLint & Prettier** for code quality

### Backend

- **Express.js** with TypeScript
- **Sequelize ORM** with PostgreSQL
- **Zod** for validation
- **ESLint & Prettier** for code quality

## Features

- ✅ Create/update/delete boards (anonymous, no authentication)
- ✅ Each board contains 3 default columns: **To Do**, **In Progress**, **Done**
- ✅ Load board by unique ID
- ✅ Add/update/delete cards (title and description)
- ✅ Drag & drop cards between columns and reorder within columns
- ✅ Automatic position rebalancing for optimal performance
- ✅ Dockerfiles for both frontend and backend

## Prerequisites

- Node.js 20+
- PostgreSQL database (local or Supabase)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd kanban-board
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file using this format:

```env
NODE_ENV=development
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
FRONTEND_URL=http://localhost:3000
```

For Supabase, use the pooler connection string format:

```env
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

Run migrations:

```bash
npm run migrate
```

Start the backend:

```bash
npm run dev
```

Backend runs at http://localhost:4000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
# Note: avoid a trailing slash in the URL
echo "REACT_APP_API_URL=http://localhost:4000/api" > .env

# Start the frontend
npm start
```

Frontend runs at http://localhost:3000

## Docker Setup

### Backend

```bash
cd backend
docker build -t kanban-backend .
docker run -p 4000:4000 --env-file .env kanban-backend
```

### Frontend

```bash
cd frontend
docker build -t kanban-frontend .
docker run -p 3000:80 kanban-frontend
```

## Scripts

### Backend

- `npm run dev` - Start development server with nodemon
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration

### Frontend

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Project Structure

```
kanban-board/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Express middlewares
│   │   ├── utils/          # Utility functions
│   │   ├── db.ts           # Database connection
│   │   └── index.ts        # Entry point
│   ├── migrations/         # Database migrations
│   ├── config/             # Sequelize config
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/          # Redux store & slices
│   │   ├── api/            # API client
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Root component
│   └── Dockerfile
```

## API Endpoints

### Boards

- `GET /api/boards/:id` - Get board by ID
- `POST /api/boards` - Create board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Cards

- `POST /api/cards` - Create card
- `PUT /api/cards/:id` - Update card
- `PATCH /api/cards/:id/move` - Move card to another column/position
- `DELETE /api/cards/:id` - Delete card

## Database Schema

### boards

- `id` (UUID) - Primary key
- `name` (String) - Board name

### columns

- `id` (UUID) - Primary key
- `boardId` (UUID) - Foreign key to boards
- `title` (String) - Column title
- `position` (Integer) - Column order

### cards

- `id` (UUID) - Primary key
- `columnId` (UUID) - Foreign key to columns
- `title` (String) - Card title
- `description` (String) - Card description (optional)
- `position` (Double) - Card order (fractional for DnD)
