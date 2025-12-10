# Vercel Frontend Deployment Guide

## Current Status
- ✅ Backend deployed on Render: `https://perfect-goals.onrender.com`
- ✅ Frontend deployed on Vercel: `https://perfect-goals.vercel.app`
- ✅ Code updated to use environment variables

## Required Vercel Environment Variable

To ensure the frontend connects to the correct backend, you need to set the environment variable in Vercel:

### Steps to Set Environment Variable in Vercel:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your `perfect-goals` project

2. **Open Project Settings**
   - Click on your project name
   - Go to "Settings" tab
   - Click on "Environment Variables" in the left sidebar

3. **Add Environment Variable**
   - Click "Add New" button
   - Set the following:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://perfect-goals.onrender.com`
     - **Environment**: Select "Production", "Preview", and "Development"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Click "Redeploy"
   - OR: The latest push to GitHub should trigger automatic redeployment

## Testing the Deployment

After setting the environment variable and redeploying:

1. **Visit**: https://perfect-goals.vercel.app
2. **Test Login**:
   - Original Admin: username: `admin`, password: `admin123`
   - New Admin: username: `AnkitPatel`, password: `ankit@20`
   - Or create a new user account
3. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for API URL logs in console
   - Should show: `https://perfect-goals.onrender.com`

## Troubleshooting

### If login still fails:
1. Check browser console for API URL being used
2. Verify environment variable is set in Vercel
3. Ensure latest deployment includes the environment variable
4. Test backend directly: https://perfect-goals.onrender.com/ping

### If environment variable not working:
1. Make sure variable name is exactly: `VITE_API_URL`
2. Make sure value is exactly: `https://perfect-goals.onrender.com`
3. Redeploy after setting the variable
4. Clear browser cache and try again

## Local Development

For local development, use `.env.local` file in frontend folder:
```
VITE_API_URL=http://localhost:5000
```

This file is already created and ignored by git.

## Production URLs
- **Frontend**: https://perfect-goals.vercel.app
- **Backend**: https://perfect-goals.onrender.com
- **Backend API Test**: https://perfect-goals.onrender.com/ping