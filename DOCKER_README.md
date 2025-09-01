# 🐳 AuditTrack VI - Docker Deployment

Complete containerized setup for both frontend (Next.js) and backend (FastAPI).

## 🚀 Quick Start

### Option 1: Use the Script (Recommended)
```bash
# Windows
docker-run.bat

# Mac/Linux
chmod +x docker-run.sh
./docker-run.sh
```

### Option 2: Manual Commands

**Development Environment:**
```bash
docker-compose up --build -d
```

**Production Environment:**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## 📋 What's Included

### 🔧 Backend (FastAPI)
- **Container**: `audittrack-backend`
- **Port**: `8000`
- **Features**: 
  - Auto-reload in development
  - Health checks
  - Proper security (non-root user)
  - Volume mounting for development

### 🌐 Frontend (Next.js)
- **Container**: `audittrack-frontend`  
- **Port**: `3000`
- **Features**:
  - Standalone build for optimal Docker performance
  - Multi-stage build for smaller images
  - Automatic API connection to backend
  - Health checks

### 🔀 Nginx (Production Only)
- **Container**: `audittrack-nginx`
- **Port**: `80`
- **Features**:
  - Reverse proxy for both frontend and backend
  - Static file caching
  - Load balancing ready

## 🌍 Access Your Application

After starting the containers:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Nginx (Production)**: http://localhost:80

## 🛠️ Development Workflow

1. **Start Development Environment**:
   ```bash
   docker-compose up --build -d
   ```

2. **View Logs**:
   ```bash
   docker-compose logs -f
   # Or for specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

3. **Make Changes**:
   - Backend: Changes auto-reload (volume mounted)
   - Frontend: Rebuild container for changes
   ```bash
   docker-compose up --build frontend
   ```

4. **Stop Everything**:
   ```bash
   docker-compose down
   ```

## 🚀 Production Deployment

1. **Start Production Environment**:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

2. **Access via Nginx**:
   - All traffic goes through: http://localhost:80
   - API endpoints: http://localhost:80/api/
   - Frontend: http://localhost:80/

## 🧹 Maintenance Commands

**Stop all containers:**
```bash
docker-compose down
docker-compose -f docker-compose.prod.yml down
```

**Clean up everything:**
```bash
docker-compose down -v --remove-orphans
docker system prune -f
```

**Rebuild specific service:**
```bash
docker-compose up --build backend
```

**Check container status:**
```bash
docker-compose ps
```

## 🔧 Environment Variables

The containers use these environment variables:

### Backend
- `PYTHONPATH=/app`
- `ENV=production` (production only)

### Frontend
- `NEXT_PUBLIC_API_URL=http://localhost:8000` (external access)
- `NODE_ENV=production` (production only)

## 📊 Container Health

Both containers include health checks:
- **Backend**: `GET /health`
- **Frontend**: `GET /`

Check health status:
```bash
docker-compose ps
```

## 🚨 Troubleshooting

**Container won't start:**
```bash
docker-compose logs [service-name]
```

**Port conflicts:**
```bash
# Change ports in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead of 3000
```

**API connection issues:**
- Check that `NEXT_PUBLIC_API_URL` points to correct backend URL
- Verify backend container is healthy: `docker-compose ps`

**Clear everything and restart:**
```bash
docker-compose down -v
docker system prune -f
docker-compose up --build
```

## 🎯 Benefits of This Docker Setup

✅ **Consistent Environment**: Same setup on any machine  
✅ **No More Deployment Issues**: Container runs the same everywhere  
✅ **Easy Scaling**: Ready for production with nginx  
✅ **Simple Development**: One command to run everything  
✅ **Health Monitoring**: Built-in health checks  
✅ **Security**: Non-root users in containers  

---

Your AuditTrack VI application is now fully containerized! 🎉