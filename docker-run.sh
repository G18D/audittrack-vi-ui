#!/bin/bash

echo "🐳 AuditTrack VI - Docker Deployment Script"
echo ""

echo "Choose deployment mode:"
echo "1. Development (with hot reload)"
echo "2. Production (optimized build)"  
echo "3. Stop all containers"
echo "4. View logs"
echo "5. Clean up (remove containers and images)"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Starting Development Environment..."
        docker-compose up --build -d
        echo ""
        echo "✅ Development environment is running!"
        echo "🌐 Frontend: http://localhost:3000"
        echo "🔧 Backend API: http://localhost:8000"
        echo "📚 API Docs: http://localhost:8000/docs"
        ;;
    2)
        echo "🚀 Starting Production Environment..."
        docker-compose -f docker-compose.prod.yml up --build -d
        echo ""
        echo "✅ Production environment is running!"
        echo "🌐 Frontend: http://localhost:3000"
        echo "🔧 Backend API: http://localhost:8000"
        echo "🌐 Nginx Proxy: http://localhost:80"
        ;;
    3)
        echo "🛑 Stopping all containers..."
        docker-compose down
        docker-compose -f docker-compose.prod.yml down
        echo "✅ All containers stopped!"
        ;;
    4)
        echo "📋 Container Logs:"
        docker-compose logs -f
        ;;
    5)
        echo "🧹 Cleaning up..."
        docker-compose down -v --remove-orphans
        docker-compose -f docker-compose.prod.yml down -v --remove-orphans
        docker system prune -f
        echo "✅ Cleanup complete!"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        ;;
esac

echo ""
echo "Press any key to continue..."
read -n 1