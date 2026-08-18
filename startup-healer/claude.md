# 🧠 Startup Healer — Project Context (Read This First)

> **Purpose**: This file captures the full context of the Startup Healer project for any AI assistant or developer picking up this work. Read this before making any changes.

---

## 📌 What Is This Project?

**Startup Healer** is a **Client Management Module** — a multi-portal web application for a business services company. It has **3 separate portals** (Admin, Employee/BDA, Client) all sharing one database.

> ⚠️ This is NOT an "AI startup analyzer." A previous session built the wrong application. The correct requirements come from the PDF: `Startup Healer Assigned Task for Developer.pdf` in the project root.

---

## 🎯 Task Requirements (From PDF)

### Portal 1: Admin Portal
- **Login Page** — Email, Password, validation + error messages
- **Dashboard** — Summary cards: Total Clients / Active / Pending / Completed / Total Employees / Tasks Due Today / Tasks Overdue
- **Client Management** — Client list/table, Add/Edit/Delete, Search, Status filter, assign client to BDA/Employee
- **Client Fields** — Name, Company Name, Email, Phone, Service(s), Status (per service), Date, Assigned Employee
- **Employee & Task Management** — Add/Edit/Remove Employee (Name, Email, Role); assign daily/weekly tasks (title, description, related client, due date); set targets ("Onboard 10 new clients this month"); performance dashboard per employee (tasks completed vs assigned, target vs achieved, EOD history)
- **Auto-Generated Logins** — When Admin adds Client or Employee, system auto-generates their portal credentials
- **Leave Management** — Admin reviews and approves/rejects leave requests
- **Attendance Overview** — View attendance for all employees (individual + team summary)
- **Salary Slip Upload** — Upload/generate salary slips per Employee + Month

### Portal 2: Employee/BDA Portal
- **Login Page** — Email/Employee ID, Password
- **Dashboard**:
  - Today's Tasks — title, description, related client (clickable), due date, status (Not Started / In Progress / Completed / Blocked)
  - My Targets — current period, target number, achieved so far, progress bar
  - My Assigned Clients — quick status view
  - EOD Update — end-of-day form: what was completed, status per task, blockers/notes (visible to Admin)
- **Task History** — Calendar/list view of past tasks and on-time completion
- **Salary Slip** — View and download monthly salary slips as PDF
- **Leave Request** — Raise request (Leave Type: Sick/Casual/Paid, From Date, To Date, Reason); track status (Pending/Approved/Rejected)
- **Attendance** — Mark daily attendance (Check-In/Check-Out), view history/calendar (Present/Absent/On Leave/Holiday). Approved leaves auto-show as "On Leave"

### Portal 3: Client Portal
- **Login Page** — Email/Client ID, Password (Forgot password can be placeholder)
- **Dashboard** — Profile, all service applications with Service Name, Status, Date Applied, Last Updated, Admin/BDA remark field
- **Document Upload/Download** — Upload required documents per service; download final certificate when Approved/Completed
- **Notifications** — In-portal alert on status change ("recent updates" panel)
- **Status Update Flow** — Only Admin/assigned Employee can change status; updates reflect from shared database

---

## 🗄️ Required Data Model (9 Tables)

```
Client          — id, name, company_name, email, phone, password (auto-generated), assigned_employee_id, created_at, updated_at
Employee        — id, name, email, password (auto-generated), role (admin/bda), created_at, updated_at
ServiceApplication — id, client_id (FK→Client), service_name, status, type, date_applied, last_updated, admin_remark
Task            — id, employee_id (FK→Employee), client_id (FK→Client, nullable), title, description, due_date, status (not_started/in_progress/completed/blocked)
Target          — id, employee_id (FK→Employee), period, target_value, achieved_value, description
EODUpdate       — id, employee_id (FK→Employee), date (unique per employee), summary, task_statuses (JSONB), blockers
SalarySlip      — id, employee_id (FK→Employee), month, year, file_url (PDF reference)
LeaveRequest    — id, employee_id (FK→Employee), leave_type (sick/casual/paid), from_date, to_date, reason, status (pending/approved/rejected)
Attendance      — id, employee_id (FK→Employee), date (unique per employee), status (present/absent/on_leave/holiday), check_in, check_out
```

### Relationships
- One Employee → many Clients (assigned)
- One Client → many ServiceApplications
- One Employee → many Tasks, EODUpdates, SalarySlips, LeaveRequests, Attendance records
- One Task → optionally linked to one Client

---

## 🎨 Brand & UI Requirements

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Startup Blue | `#1CA3D6` | Primary accent |
| Healer Green | `#5FAF46` | Primary accent |
| Deep Teal | `#2E9E8E` | Primary accent |
| Navy Text | `#1F2937` | Headings, body text |
| Background | `#F7FAFC` | Page backgrounds |

### Signature Gradient
```css
background: linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%);
```
Use sparingly — primary CTAs (Login, Add Client, Submit), navbar/sidebar accent, dashboard banners.

### Status Tags (pill-shaped, color-coded)
- ✅ Approved / Completed — Green
- ⏳ Pending / Under Review — Yellow/Amber
- ❌ Rejected / Blocked — Red
- 🔄 In Progress — Blue

### Design Style
- Clean, modern, card-based
- 8-12px border radius, soft shadows, generous white space
- Clear typography hierarchy (Navy for headings)
- Rounded buttons (gradient primary, outline secondary)
- StartupHealer logo on navbar/sidebar of every portal
- All 3 portals use same color system, components, spacing

---

## 🛠️ Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js 14 + TypeScript | Pages Router (already set up) |
| UI Library | Chakra UI | Already configured |
| State | React Query + Context | Already configured |
| HTTP Client | Axios | Already configured |
| Backend | NestJS + TypeScript | Already set up with validation |
| Database | Supabase (PostgreSQL) | Connected, credentials in .env |
| Auth | JWT (Passport) + bcrypt | Already set up, needs role support |
| File Storage | Supabase Storage | For salary slips & documents |
| Deployment | Vercel (FE) + Railway (BE) | Planned |

---

## 📁 Project Structure (Target)

```
startup-healer/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── common/          # Shared: Layout, Sidebar, Navbar, StatusBadge, etc.
│       │   ├── admin/           # Admin-specific components
│       │   ├── employee/        # Employee-specific components
│       │   └── client/          # Client-specific components
│       ├── pages/
│       │   ├── admin/           # Admin portal pages
│       │   ├── employee/        # Employee portal pages
│       │   ├── client/          # Client portal pages
│       │   └── auth/            # Login pages (admin/employee/client)
│       ├── contexts/            # AuthContext (with roles)
│       ├── lib/                 # API client, utils
│       ├── theme/               # Chakra theme (brand colors)
│       └── styles/              # Global CSS
├── backend/
│   └── src/
│       ├── auth/                # Auth module (role-based: admin/employee/client)
│       ├── client/              # Client CRUD module
│       ├── employee/            # Employee CRUD module
│       ├── task/                # Task management module
│       ├── target/              # Target management module
│       ├── eod-update/          # EOD update module
│       ├── service-application/ # Service application module
│       ├── salary-slip/         # Salary slip module
│       ├── leave-request/       # Leave request module
│       ├── attendance/          # Attendance module
│       ├── supabase/            # Supabase client provider
│       └── guards/              # Role-based guards
├── docs/
│   └── database-schema.sql     # Full 9-table schema
├── .env                        # Environment variables (configured)
├── docker-compose.yml
└── package.json                # Monorepo root
```

---

## 🔐 Authentication Design

### Three Separate Login Flows
1. `/auth/admin` → Admin login → redirects to `/admin/dashboard`
2. `/auth/employee` → Employee login → redirects to `/employee/dashboard`
3. `/auth/client` → Client login → redirects to `/client/dashboard`

### Role-Based Access
- JWT token includes `role` field (admin/employee/client) and `sub` (user ID)
- Backend guards check role before allowing access to endpoints
- Frontend route guards redirect unauthorized users
- Admin can access everything; Employee sees own data + assigned clients; Client sees only own data

### Auto-Generated Credentials
- When Admin adds Employee or Client, system generates a temporary password
- Password is shown once to Admin (or sent via email placeholder)
- User can change password on first login (stretch goal)

---

## ✅ Current Status

### What's Working
- ✅ Supabase project connected (project: `nqrxwbnnjailpenkozqo`)
- ✅ Environment variables configured in `.env`
- ✅ Root npm packages installed (concurrently)
- ✅ NestJS project structure exists
- ✅ Next.js project structure exists
- ✅ Node v22.22.2, Python 3.14.5

### What's NOT Working
- ❌ Backend `node_modules` not installed (`cd backend && npm install` needed)
- ❌ Frontend `node_modules` not installed (`cd frontend && npm install` needed)
- ❌ AI service not needed (wrong feature, can be removed)
- ❌ Database has wrong schema (3 tables instead of 9)
- ❌ All application code implements wrong features

### What Needs to Be Done
1. **Database**: Drop old tables, create new 9-table schema with proper relationships
2. **Backend**: Rewrite all modules for client management (auth with roles, CRUD for all entities)
3. **Frontend**: Rewrite all pages for 3 portals with correct brand colors
4. **Auth**: Add role-based authentication (admin/employee/client)
5. **File uploads**: Implement Supabase Storage for salary slips and documents

---

## 📝 Validation Rules (From PDF)
- Email must be valid format
- Name and Company Name cannot be blank
- Phone number must be validated (10-digit, numeric)
- All required fields enforced on both frontend and backend

---

## ⚠️ Important Notes
1. The task PDF mentions "No AI tools for frontend development" — this will be checked during interview walkthrough
2. The interview will ask: "Frontend se database tak data kaise jayega?" — candidate must explain the full flow
3. Admin/Employee/Client auth must stay strictly separate (role-based access, route guards)
4. All 3 portals must feel like one consistent product (same brand, components, spacing)

---

## 🔑 Environment Variables (.env)
```
SUPABASE_URL=https://nqrxwbnnjailpenkozqo.supabase.co
SUPABASE_ANON_KEY=eyJhbGci... (configured)
SUPABASE_SERVICE_KEY=eyJhbGci... (configured)
JWT_SECRET=6oTK0YKx... (configured)
JWT_EXPIRATION=7d
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://nqrxwbnnjailpenkozqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (configured)
CORS_ORIGIN=http://localhost:3000
BACKEND_PORT=3001
```

---

*Last updated: 2026-08-18*
