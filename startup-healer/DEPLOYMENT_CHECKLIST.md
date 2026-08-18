# 🚀 Startup Healer - Deployment Checklist

This project uses a modern 3-tier architecture: **Frontend** (Next.js), **Backend** (NestJS), and **Database** (Supabase/PostgreSQL).

## 🛠 Pre-Deployment Preparation

### ✅ Development Testing
- [ ] All 3 portals work locally (Admin, Employee, Client)
- [ ] Authentication and role-based access control works
- [ ] CRUD operations work for Clients, Employees, Tasks, Leaves, Attendance
- [ ] File uploads (Salary Slips, Service Documents) work locally
- [ ] Mobile responsive design is intact

### ✅ Environment Configuration
You will need the following environment variables ready:

#### Frontend (`frontend/.env.production`)
```env
NEXT_PUBLIC_API_URL=https://your-production-backend-url.com
```

#### Backend (`backend/.env`)
```env
PORT=3001
CORS_ORIGIN=https://your-production-frontend-url.com
JWT_SECRET=your_super_secure_jwt_secret_key_change_me
JWT_EXPIRATION=7d

# Supabase Credentials (from your Supabase Dashboard)
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

---

## 1️⃣ Database Deployment (Supabase)

Your database is hosted on **Supabase** (PostgreSQL).

1. **Create a Supabase Project**: If you haven't already, go to [supabase.com](https://supabase.com) and create a new project.
2. **Run the Schema**: 
   - Go to the **SQL Editor** in your Supabase dashboard.
   - Copy the contents of `docs/database-schema.sql` and run it. This will create all 9 tables (employees, clients, tasks, etc.), set up triggers, and insert the default admin user.
3. **Create Storage Buckets**:
   - Go to **Storage** in the Supabase dashboard.
   - Create two **private** buckets: `salary-slips` and `client-documents`.
4. **Get Credentials**: Go to **Project Settings -> API** to get your `URL`, `anon` key, and `service_role` secret.

---

## 2️⃣ Backend Deployment (Railway or Render)

The backend is a Node.js (NestJS) application. We recommend **Railway** or **Render** for easy deployment.

### Option A: Railway (Recommended, easiest)

1. **Sign up/Login** at [railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. Railway will auto-detect the root. Since it's a monorepo, go to the service settings:
   - **Root Directory**: Set this to `/backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`
5. **Add Environment Variables**: Go to the **Variables** tab and add all the Backend variables listed in the configuration section above.
6. Railway will automatically build and deploy your app.
7. Go to the **Settings** tab to generate a public Domain (e.g., `startup-healer-production.up.railway.app`). Note this URL for the frontend.

### Option B: Render

1. **Sign up/Login** at [render.com](https://render.com/).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
5. **Add Environment Variables** as listed above.
6. Deploy! Render will give you a URL like `your-app.onrender.com`.

---

## 3️⃣ Frontend Deployment (Vercel)

The frontend is a Next.js application, making **Vercel** the perfect hosting platform.

1. **Sign up/Login** at [vercel.com](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: Next.js (Vercel should auto-detect this)
   - **Root Directory**: Click "Edit" and select `frontend`
5. **Environment Variables**: Add `NEXT_PUBLIC_API_URL` and point it to the Backend URL you got from Railway/Render (e.g., `https://startup-healer-production.up.railway.app`).
6. Click **Deploy**.
7. Vercel will build and deploy your frontend, providing a URL like `https://startup-healer.vercel.app`.

---

## 🚀 Post-Deployment Steps

### ✅ Verify Functionality
- [ ] Open the Vercel frontend URL.
- [ ] Log in as Admin (`admin@startuphealerr.com` / `admin123`).
- [ ] Create a test Employee and test Client.
- [ ] Try logging in as the new Employee and Client to verify their portals work.

### ✅ Security
- [ ] Ensure your `JWT_SECRET` in the backend is a strong, random string.
- [ ] Change the default Admin password immediately after logging in.
- [ ] Verify that `CORS_ORIGIN` on the backend is strictly set to your Vercel frontend URL.

---

## 💰 Cost Estimate (Monthly)

- **Database (Supabase)**: Free Tier (500MB database, 1GB storage)
- **Backend (Railway)**: ~$5/month (depending on usage) OR **Render**: Free Tier (spins down after inactivity)
- **Frontend (Vercel)**: Free Tier (Hobby plan)
- **Total**: ~$0 to $5 / month.
