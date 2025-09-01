@echo off
echo 🚀 AuditTrack VI Backend Deployment Script
echo.

echo Step 1: Checking if Railway CLI is installed...
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI not found. Installing...
    npm install -g @railway/cli
    echo ✅ Railway CLI installed
) else (
    echo ✅ Railway CLI found
)

echo.
echo Step 2: Login to Railway (browser will open)...
railway login

echo.
echo Step 3: Navigate to API directory...
cd api

echo.
echo Step 4: Initialize Railway project...
railway init

echo.
echo Step 5: Deploy to Railway...
railway up

echo.
echo 🎉 Deployment complete!
echo.
echo Next steps:
echo 1. Copy the Railway URL from the output above
echo 2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
echo 3. Set NEXT_PUBLIC_API_URL to your Railway URL
echo 4. Redeploy your frontend
echo.
echo Example Railway URL: https://your-app-production.up.railway.app
pause