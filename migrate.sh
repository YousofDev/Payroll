#!/bin/bash

# Migration script for production and test databases
set -e

echo "🚀 Starting database migrations..."

# Function to wait for database to be ready
wait_for_db() {
    local db_url=$1
    local max_attempts=30
    local attempt=1
    
    echo "Waiting for database to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if pg_isready -d "$db_url" > /dev/null 2>&1; then
            echo "✅ Database is ready!"
            break
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts - Database not ready, retrying in 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        echo "❌ Database failed to become ready after $max_attempts attempts"
        exit 1
    fi
}

# Wait for production database
echo "Checking production database connection..."
wait_for_db "$DATABASE_CONNECTION"

# Run production migrations
echo "🔄 Running production database migrations..."
NODE_ENV=prod pnpm run migrate

# Wait for test database
echo "Checking test database connection..."
wait_for_db "$TEST_DATABASE_CONNECTION"

# Run test migrations
echo "🔄 Running test database migrations..."
NODE_ENV=test pnpm run migrate

echo "✅ All migrations completed successfully!"

# Optional: Run database seeding if seeds exist
if [ -f "./src/common/data/seeds.ts" ]; then
    echo "🌱 Running database seeds..."
    NODE_ENV=prod pnpm run seed || echo "⚠️  Seeding failed or not available"
fi

echo "🎉 Database setup completed!"