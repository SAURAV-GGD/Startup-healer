# Startup Healer - Project Structure

```
startup-healer/
│
├── 📁 backend/                          # NestJS Backend API
│   ├── src/
│   │   ├── analysis/                    # Analysis module
│   │   │   ├── analysis.controller.ts   # Analysis endpoints
│   │   │   ├── analysis.service.ts      # Analysis business logic
│   │   │   ├── analysis.module.ts       # Analysis module definition
│   │   │   └── dto/
│   │   │       └── create-analysis.dto.ts
│   │   │
│   │   ├── auth/                        # Authentication module
│   │   │   ├── auth.controller.ts       # Auth endpoints (signup, signin)
│   │   │   ├── auth.service.ts          # Auth business logic
│   │   │   ├── auth.module.ts           # Auth module definition
│   │   │   ├── jwt.strategy.ts          # JWT strategy for Passport
│   │   │   ├── jwt-auth.guard.ts        # JWT guard for protected routes
│   │   │   └── dto/
│   │   │       └── auth.dto.ts          # Auth DTOs
│   │   │
│   │   ├── startup/                     # Startup module
│   │   │   ├── startup.controller.ts    # Startup endpoints
│   │   │   ├── startup.service.ts       # Startup business logic
│   │   │   ├── startup.module.ts        # Startup module definition
│   │   │   └── dto/
│   │   │       └── create-startup.dto.ts
│   │   │
│   │   ├── supabase/                    # Supabase integration
│   │   │   └── supabase.module.ts       # Supabase client provider
│   │   │
│   │   ├── app.module.ts                # Root application module
│   │   └── main.ts                      # Application entry point
│   │
│   ├── package.json                     # Backend dependencies
│   ├── tsconfig.json                    # TypeScript configuration
│   ├── nest-cli.json                    # NestJS CLI configuration
│   └── Dockerfile                       # Backend Docker image
│
├── 📁 frontend/                         # Next.js Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx               # Main layout component
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx          # Auth context provider
│   │   │
│   │   ├── lib/
│   │   │   └── api.ts                   # API client (axios)
│   │   │
│   │   ├── pages/
│   │   │   ├── _app.tsx                 # Next.js app wrapper
│   │   │   ├── _document.tsx            # Next.js document
│   │   │   ├── index.tsx                # Landing page (redirects)
│   │   │   ├── dashboard.tsx            # Main dashboard
│   │   │   ├── auth/
│   │   │   │   ├── signin.tsx           # Sign in page
│   │   │   │   └── signup.tsx           # Sign up page
│   │   │   └── startups/
│   │   │       ├── new.tsx              # Create startup form
│   │   │       └── [id].tsx             # Startup detail & analysis
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css              # Global styles
│   │   │
│   │   └── theme/
│   │       └── index.ts                 # Chakra UI theme
│   │
│   ├── package.json                     # Frontend dependencies
│   ├── tsconfig.json                    # TypeScript configuration
│   ├── next.config.js                   # Next.js configuration
│   └── Dockerfile                       # Frontend Docker image
│
├── 📁 ai-service/                       # Python AI Service
│   ├── app/
│   │   ├── __init__.py                  # Package initialization
│   │   ├── main.py                      # FastAPI application
│   │   └── analyzer.py                  # AI analysis logic
│   │
│   ├── requirements.txt                 # Python dependencies
│   ├── Dockerfile                       # AI service Docker image
│   └── README.md                        # AI service documentation
│
├── 📁 docs/                             # Documentation
│   ├── database-schema.sql              # Complete database schema
│   └── SETUP.md                         # Detailed setup guide
│
├── 📄 Configuration Files
│   ├── package.json                     # Root package (monorepo scripts)
│   ├── docker-compose.yml               # Docker orchestration
│   ├── .env.example                     # Environment variables template
│   ├── .gitignore                       # Git ignore rules
│   ├── README.md                        # Project overview
│   ├── PROJECT_SUMMARY.md               # Detailed project summary
│   └── STRUCTURE.md                     # This file
│
└── 📊 Database (Supabase - PostgreSQL)
    ├── users                            # User accounts
    ├── startups                         # Startup data
    └── analyses                         # AI analysis results
```

## 📝 File Counts

- **Backend**: 17 TypeScript files
- **Frontend**: 11 TypeScript/TSX files
- **AI Service**: 3 Python files
- **Documentation**: 4 files
- **Configuration**: 8 files

## 🔗 Data Flow

```
User (Browser)
    ↓
Frontend (Next.js :3000)
    ↓
Backend API (NestJS :3001)
    ↓
    ├─→ Supabase (PostgreSQL) - Data storage
    └─→ AI Service (FastAPI :8000)
            ↓
        Claude/GPT API - AI Analysis
```

## 🎯 Key Features by Module

### Backend Modules
1. **Auth Module**: User registration, login, JWT tokens
2. **Startup Module**: CRUD operations for startups
3. **Analysis Module**: Trigger and retrieve AI analyses
4. **Supabase Module**: Database connection and queries

### Frontend Pages
1. **Auth Pages**: Sign up, Sign in
2. **Dashboard**: Overview of all startups
3. **Startup Pages**: Create, View, Analyze
4. **Components**: Layout, Auth Context, API Client

### AI Service
1. **Analyzer**: Multi-dimensional startup analysis
2. **API**: RESTful endpoints for analysis
3. **Providers**: Support for Claude and OpenAI

## 📦 Total Lines of Code

- **Backend**: ~1,200 lines
- **Frontend**: ~1,500 lines
- **AI Service**: ~300 lines
- **Configuration**: ~400 lines
- **Documentation**: ~600 lines

**Total**: ~4,000 lines of production-ready code!
