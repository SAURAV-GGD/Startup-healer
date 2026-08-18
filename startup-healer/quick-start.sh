#!/bin/bash

# Startup Healer - Quick Start Script
# This script helps you get started quickly

set -e

echo "🚀 Startup Healer - Quick Start"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found!"
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: You must edit .env and add:"
    echo "   1. Supabase URL and keys"
    echo "   2. JWT secret (any random string)"
    echo "   3. AI API key (Anthropic or OpenAI)"
    echo ""
    read -p "Press Enter after you've edited .env file..."
fi

echo ""
echo "📦 Installing Dependencies..."
echo "=============================="
echo ""

# Install root dependencies
echo "1️⃣  Installing root dependencies..."
npm install

# Install backend dependencies
echo ""
echo "2️⃣  Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo ""
echo "3️⃣  Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Check if Python is installed
if command -v python3 &> /dev/null; then
    echo ""
    echo "4️⃣  Installing AI service dependencies..."
    cd ai-service
    pip3 install -r requirements.txt
    cd ..
else
    echo ""
    echo "⚠️  Python 3 not found. Please install Python 3.11+ and run:"
    echo "   cd ai-service && pip install -r requirements.txt"
fi

echo ""
echo "✅ Installation Complete!"
echo ""
echo "📊 Next Steps:"
echo "=============="
echo ""
echo "1. Set up Supabase:"
echo "   • Go to https://supabase.com"
echo "   • Create a new project"
echo "   • Run the SQL from docs/database-schema.sql"
echo "   • Copy credentials to .env file"
echo ""
echo "2. Start the application:"
echo "   • npm run dev (runs all services)"
echo "   OR run separately:"
echo "   • cd backend && npm run start:dev"
echo "   • cd frontend && npm run dev"
echo "   • cd ai-service && uvicorn app.main:app --reload"
echo ""
echo "3. Access:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend: http://localhost:3001/api"
echo "   • AI Service: http://localhost:8000"
echo ""
echo "📖 For detailed instructions, see docs/SETUP.md"
echo ""
