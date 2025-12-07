# 🚀 Production Deployment Guide

## Prerequisites
- GitHub account
- Railway/Render account (for backend + MySQL)
- Vercel account (for frontend)

---

## 📦 Step 1: Prepare Your Code

### Backend Setup
1. Install missing dependencies:
```bash
cd backend
npm install dotenv multer
```

2. Create `.env` file in `backend/` folder:
```env
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=perfectgoal
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend Setup
1. Create `.env` file in root folder:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

---

## 🗄️ Step 2: Deploy MySQL Database

### Option A: Railway (Recommended - Free Tier)
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Provision MySQL"
3. Copy connection details:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
4. Connect to database and import your schema:
```bash
mysql -h MYSQLHOST -u MYSQLUSER -p MYSQLDATABASE < your_schema.sql
```

### Option B: PlanetScale (Free Tier)
1. Go to [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection string
4. Import your schema

---

## 🖥️ Step 3: Deploy Backend (Node.js + Express)

### Railway Deployment
1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `backend`
6. Add environment variables:
   - `DB_HOST` = your MySQL host
   - `DB_USER` = your MySQL user
   - `DB_PASSWORD` = your MySQL password
   - `DB_NAME` = perfectgoal
   - `PORT` = 5000
   - `NODE_ENV` = production
   - `FRONTEND_URL` = (add after frontend deployment)
7. Deploy!
8. Copy your backend URL (e.g., `https://your-app.railway.app`)

### Alternative: Render.com
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Root directory: `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables (same as above)

---

## 🌐 Step 4: Deploy Frontend (React + Vite)

### Vercel Deployment
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Framework: Vite
5. Root directory: `./` (project root)
6. Add environment variable:
   - `VITE_API_URL` = your backend URL from Step 3
7. Deploy!
8. Copy your frontend URL

---

## 🔄 Step 5: Update CORS

1. Go back to Railway/Render backend settings
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy backend

---

## ✅ Step 6: Test Your Production App

1. Visit your Vercel URL
2. Try logging in
3. Test all features
4. Check browser console for errors

---

## 🔧 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check if backend is running: visit `https://your-backend-url/ping`

### Database Connection Failed
- Verify all DB credentials in Railway/Render environment variables
- Check if MySQL service is running
- Test connection from backend logs

### API Calls Failing
- Check if `VITE_API_URL` is set correctly in Vercel
- Verify backend URL is accessible
- Check backend logs for errors

---

## 📝 Environment Variables Summary

### Backend (.env)
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=perfectgoal
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.railway.app
```

---

## 🎉 Done!

Your app is now live and accessible from any device!

**Frontend:** https://your-app.vercel.app
**Backend:** https://your-backend.railway.app
**Database:** Hosted on Railway/PlanetScale

---

## 💡 Tips

- Use Railway's free tier: 500 hours/month
- Vercel free tier: Unlimited deployments
- Keep `.env` files in `.gitignore`
- Use environment variables for all sensitive data
- Monitor your app logs regularly
