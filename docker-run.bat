@echo off
echo 🐳 AuditTrack VI - Docker Deployment Script
echo.

echo Choose deployment mode:
echo 1. Development (with hot reload)
echo 2. Production (optimized build)
echo 3. Stop all containers
echo 4. View logs
echo 5. Clean up (remove containers and images)
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo 🚀 Starting Development Environment...
    docker-compose up --build -d
    echo.
    echo ✅ Development environment is running!
    echo 🌐 Frontend: http://localhost:3000
    echo 🔧 Backend API: http://localhost:8000
    echo 📚 API Docs: http://localhost:8000/docs
) else if "%choice%"=="2" (
    echo 🚀 Starting Production Environment...
    docker-compose -f docker-compose.prod.yml up --build -d
    echo.
    echo ✅ Production environment is running!
    echo 🌐 Frontend: http://localhost:3000
    echo 🔧 Backend API: http://localhost:8000
    echo 🌐 Nginx Proxy: http://localhost:80
) else if "%choice%"=="3" (
    echo 🛑 Stopping all containers...
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    echo ✅ All containers stopped!
) else if "%choice%"=="4" (
    echo 📋 Container Logs:
    docker-compose logs -f
) else if "%choice%"=="5" (
    echo 🧹 Cleaning up...
    docker-compose down -v --remove-orphans
    docker-compose -f docker-compose.prod.yml down -v --remove-orphans
    docker system prune -f
    echo ✅ Cleanup complete!
) else (
    echo ❌ Invalid choice. Please run the script again.
)

echo.
echo Press any key to continue...
pause >nul