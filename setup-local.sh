#!/bin/bash

# Local development setup script
set -e

echo "🚀 Setting up Payroll System for local development..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat << EOF > .env
DATABASE_CONNECTION=postgresql://postgres:1234@localhost:5432/payroll
TEST_DATABASE_CONNECTION=postgresql://postgres:1234@localhost:5433/testpayroll
DB_PASSWORD=1234
API_DOMAIN=http://localhost:4000
PUBLIC_API_URL=http://localhost:4000/api/v1
PORT=4000
HOST=localhost
API_VERSION=/api/v1
ACCESS_TOKEN_SECRET=0e757803b007c7a02abde4f923fb360355c906d4cd4a117764a5956df01c5357
ACCESS_TOKEN_EXPIRES_IN=1296000
NODE_ENV=dev
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Create init-db.sql if it doesn't exist
if [ ! -f init-db.sql ]; then
    echo "📝 Creating init-db.sql..."
    cat << EOF > init-db.sql
-- Initialize databases
CREATE DATABASE IF NOT EXISTS payroll;
CREATE DATABASE IF NOT EXISTS testpayroll;
EOF
    echo "✅ init-db.sql created"
fi

# Make migration script executable
chmod +x migrate.sh

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d postgres-prod postgres-test

# Wait for databases
echo "⏳ Waiting for databases to start..."
sleep 15

# Run migrations
echo "🔄 Running migrations..."
docker-compose up migrate

# Start the application
echo "🚀 Starting application..."
docker-compose up -d app

# Wait for application
echo "⏳ Waiting for application to start..."
sleep 10

# Health check
echo "🏥 Performing health check..."
max_attempts=5
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:4000/api/v1 2>/dev/null; then
        echo "✅ Application is running successfully!"
        echo ""
        echo "🎉 Setup completed!"
        echo "📱 Application URL: http://localhost:4000"
        echo "📊 API URL: http://localhost:4000/api/v1"
        echo "🗄️  Production DB: localhost:5432"
        echo "🧪 Test DB: localhost:5433"
        echo ""
        echo "📋 Useful commands:"
        echo "  - View logs: docker-compose logs -f app"
        echo "  - Stop services: docker-compose down"
        echo "  - Restart services: docker-compose restart"
        echo "  - Run migrations: docker-compose up migrate"
        exit 0
    fi
    
    echo "⏳ Attempt $attempt/$max_attempts - waiting for application..."
    sleep 5
    attempt=$((attempt + 1))
done

echo "❌ Application failed to start. Check logs:"
docker-compose logs app
exit 1