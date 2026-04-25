#!/bin/bash
# Quick Start Script for Gaming Marketplace

set -e

echo "🎮 Gaming Marketplace - Quick Start"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo "❌ Maven not found. Please install Maven first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites found${NC}"
echo ""

# Start Database
echo -e "${BLUE}Starting PostgreSQL...${NC}"
docker-compose up -d
echo -e "${GREEN}✓ PostgreSQL started${NC}"
echo ""

# Wait for database to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Initialize Database
echo -e "${BLUE}Initializing database schema...${NC}"
psql -h localhost -U postgres -d mydb -f backend/pp-marketplace/src/main/resources/schema.sql 2>/dev/null || echo "Database might already be initialized"
echo -e "${GREEN}✓ Database schema ready${NC}"
echo ""

# Build and start Backend
echo -e "${BLUE}Building and starting Backend...${NC}"
cd backend/pp-marketplace
mvn clean install -q
echo -e "${GREEN}✓ Backend built${NC}"

# Start backend in background
echo "Starting Spring Boot server on port 8080..."
mvn spring-boot:run &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo ""

# Wait for backend to be ready
sleep 10
echo "Testing backend..."
if curl -s http://localhost:8080/api/games > /dev/null; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
else
    echo "⚠ Backend might still be starting..."
fi
echo ""

# Setup and start Frontend
echo -e "${BLUE}Setting up Frontend...${NC}"
cd ../../frontend/pp-marketplace-fe
npm install -q
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

echo -e "${BLUE}Starting Frontend development server...${NC}"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo ""

# Display info
echo "=================================="
echo -e "${GREEN}✓ All systems started successfully!${NC}"
echo "=================================="
echo ""
echo "📍 Frontend URL: http://localhost:5173"
echo "📍 Backend API: http://localhost:8080/api"
echo "📍 Database: localhost:5432 (postgres/postgres)"
echo ""
echo "🔐 Default Credentials:"
echo "   Email: admin@marketplace.com"
echo "   (Password in schema.sql - BCrypt hash)"
echo ""
echo "To stop all services, run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  docker-compose down"
echo ""
echo "View logs with:"
echo "  kill %1  # Kill frontend"
echo "  kill %2  # Kill backend"
echo "=================================="
