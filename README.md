# Startup Healer - Client Management Portal

A comprehensive 3-portal client management system built to handle clients, employees, tasks, attendance, and business operations seamlessly.

## 📋 Project Structure

The project uses a monorepo structure with a separated frontend and backend:

```
startup-healer/
├── frontend/          # Next.js + React + Chakra UI
├── backend/           # NestJS API
├── docs/              # Documentation and Database Schemas
└── package.json       # Root scripts
```

## 🚀 Features

The system features three distinct portals with role-based access control:

1. **Admin Portal**:
   - Comprehensive dashboard with statistics.
   - Client Management (CRUD).
   - Employee Management (CRUD, Performance tracking).
   - Task Assignment & Tracking.
   - Leave Request Management (Approve/Reject).
   - Attendance Overview.
   - Salary Slip Uploads.

2. **Employee/BDA Portal**:
   - Dashboard with Today's Tasks, Targets, and EOD Form.
   - Attendance (Check-in/Check-out).
   - Task Status Updates.
   - Leave Request Submission.
   - Salary Slip Viewing.

3. **Client Portal**:
   - Dashboard with Service Applications.
   - Status Tracking & Admin Remarks.
   - Document Uploads.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Library**: React 18
- **Language**: TypeScript
- **Styling**: Chakra UI (Brand Colors: #1CA3D6, #5FAF46, #2E9E8E)
- **API Client**: Axios

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Database Connection**: @supabase/supabase-js

### Database
- **Provider**: Supabase
- **Type**: PostgreSQL (9-table relational schema)
- **Storage**: Supabase Storage Buckets for files

## 📦 Local Development Setup

### Prerequisites
- Node.js 18+
- Supabase account & project

### 1. Clone the Repository

```bash
cd "startup-healer"
```

### 2. Set Up Environment Variables

Create `.env` file in the **backend** directory (`backend/.env`):

```bash
PORT=3001
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_local_secret_key
JWT_EXPIRATION=7d

# Get these from your Supabase Dashboard -> Project Settings -> API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
```

Create `.env` file in the **frontend** directory (`frontend/.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Set Up Supabase Database

1. Open your Supabase project.
2. Go to the **SQL Editor**.
3. Copy and paste the contents of `docs/database-schema.sql` and run it.
4. Go to **Storage** and create two private buckets: `salary-slips` and `client-documents`.

*(Note: The SQL script automatically creates a default Admin user with email `admin@startuphealerr.com` and password `admin123`)*

### 4. Install Dependencies

```bash
npm run install:all
```
*(Or install individually in `frontend` and `backend` directories using `npm install`)*

### 5. Run the Application

Run both frontend and backend concurrently from the root:

```bash
npm run dev
```

Alternatively, run them in separate terminal tabs:

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 Access the Application

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)

Login with the default admin account:
- Email: `admin@startuphealerr.com`
- Password: `admin123`

## 🚢 Deployment

See `DEPLOYMENT_CHECKLIST.md` for a comprehensive guide on deploying the Database to Supabase, Backend to Railway/Render, and Frontend to Vercel.

## 📄 License

MIT

## 👨‍💻 Developed For

Startup Healer - Client Management Module rebuild.
