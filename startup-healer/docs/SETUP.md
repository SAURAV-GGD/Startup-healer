# Startup Healer - Setup Guide

## 🚀 Quick Start Guide

### Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this secure!)
4. Go to **SQL Editor** and run the schema from `docs/database-schema.sql`

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Database (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here

# Backend
BACKEND_PORT=3001
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRATION=7d

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# AI Service
AI_SERVICE_URL=http://localhost:8000
ANTHROPIC_API_KEY=your_anthropic_key_here
# OR
OPENAI_API_KEY=your_openai_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Install Dependencies

#### Root
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

#### AI Service
```bash
cd ai-service
pip install -r requirements.txt
```

### Step 4: Run the Application

#### Option A: All at Once (from root)
```bash
npm run dev
```

#### Option B: Individually

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
uvicorn app.main:app --reload --port 8000
```

### Step 5: Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **AI Service**: http://localhost:8000/docs (API documentation)

## 🧪 Testing the Application

1. **Sign Up**: Create a new account at http://localhost:3000/auth/signup
2. **Add Startup**: Click "Add Startup" and fill in the form
3. **Run Analysis**: Click "Run Analysis" on your startup detail page
4. **View Results**: Explore the different tabs (Problems, Recommendations, etc.)

## 🐳 Docker Setup (Alternative)

If you prefer using Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🔧 Troubleshooting

### Issue: Backend won't start
- Check if port 3001 is available
- Verify Supabase credentials in `.env`
- Check if all dependencies are installed: `cd backend && npm install`

### Issue: Frontend won't connect to backend
- Verify `NEXT_PUBLIC_API_URL` in `.env`
- Check if backend is running on port 3001
- Check browser console for CORS errors

### Issue: AI analysis fails
- Verify you have either `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` set
- Check if AI service is running on port 8000
- Check backend logs for error messages

### Issue: Database connection fails
- Verify Supabase URL and keys in `.env`
- Check if database tables are created (run schema again)
- Check Supabase dashboard for project status

## 📊 Database Management

### View Data
Go to your Supabase project → **Table Editor** to view:
- Users
- Startups
- Analyses

### Reset Database
If you need to reset the database:
1. Go to Supabase SQL Editor
2. Drop all tables:
```sql
DROP TABLE IF EXISTS analyses CASCADE;
DROP TABLE IF EXISTS startups CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```
3. Run the schema again from `docs/database-schema.sql`

## 🔐 Security Notes

- **Never commit `.env` file** to version control
- Change `JWT_SECRET` to a strong random string
- In production, use environment variables provided by your hosting platform
- Keep `SUPABASE_SERVICE_KEY` secure (never expose in frontend)

## 📱 Mobile Testing

The frontend is responsive. Test on mobile by:
1. Find your local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
2. Update `.env`: `CORS_ORIGIN=http://YOUR_IP:3000`
3. Access from mobile: `http://YOUR_IP:3000`

## 🚢 Deployment

See `DEPLOYMENT.md` for production deployment instructions.

## 💡 Tips

- Use the browser's dev tools to inspect API calls
- Check terminal logs for detailed error messages
- The AI analysis may take 10-30 seconds depending on the startup data
- Start with the "Idea" stage if you're just testing

---

Need help? Check the main README.md or create an issue!
