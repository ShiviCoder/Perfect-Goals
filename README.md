# Perfect Your Goals - Resume Data Entry Application

A comprehensive web application for resume data entry and management with admin dashboard.

## 📁 Project Structure

```
perfect-your-goals/
├── backend/                 # Node.js + Express API
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── .env               # Backend environment variables
│   └── resumes/           # PDF files storage (500 sample PDFs)
├── frontend/               # React + Vite application
│   ├── src/               # React source code
│   │   ├── pages/         # Login, Dashboard, Admin pages
│   │   └── components/    # Reusable components
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   ├── .env              # Frontend environment variables
│   └── vite.config.js    # Vite configuration
├── PRODUCTION-DEPLOYMENT.md # Deployment guide
└── start-local.bat        # Local development script
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Git

### Local Development

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd perfect-your-goals
```

2. **Setup Backend:**
```bash
cd backend
npm install
# Create .env file with your MySQL credentials
npm start
```

3. **Setup Frontend:**
```bash
cd ../frontend
npm install
npm run dev
```

4. **Or use the batch script:**
```bash
# Double-click start-local.bat (Windows)
# This starts both backend and frontend automatically
```

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:5173/admin-login

## 🔧 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=perfectgoal
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 📊 Features

### User Features
- ✅ User registration and login
- ✅ Resume data entry with comprehensive form (40+ fields)
- ✅ PDF viewer for resume viewing
- ✅ Progress tracking (completed/pending tasks)
- ✅ Profile management with bank details
- ✅ Submission deadline tracking

### Admin Features
- ✅ User management (add/remove users)
- ✅ Task progress monitoring
- ✅ Submission deadline extension
- ✅ Real-time progress dashboard
- ✅ User notifications

### Technical Features
- ✅ MySQL database with comprehensive schema
- ✅ File upload (signatures, resumes)
- ✅ CORS configured for production
- ✅ Environment-based configuration
- ✅ Error handling and validation

## 🗄️ Database Schema

- **admins** - Admin user accounts
- **userregistrations** - User accounts with bank details
- **user_progress** - Task progress and deadlines
- **data_entries** - Comprehensive resume data (40+ fields)

## 🚀 Production Deployment

See [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md) for detailed deployment instructions.

**Recommended Stack:**
- **Backend:** Render.com (free tier)
- **Frontend:** Vercel (free tier)
- **Database:** PlanetScale or Railway MySQL (free tier)

## 🛠️ Development Commands

### Backend
```bash
cd backend
npm start          # Start server
npm run dev        # Start with nodemon (if configured)
```

### Frontend
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📝 API Endpoints

### Authentication
- `POST /login` - User/Admin login
- `POST /register` - User registration

### User Management
- `GET /api/user/:id` - Get user details
- `PUT /api/user/:id` - Update user profile
- `POST /api/change-password/:id` - Change password

### Data Entry
- `POST /api/data-entry` - Submit resume data
- `GET /api/resume-status/:user_id` - Get submission status
- `GET /api/progress/:user_id` - Get user progress

### Admin
- `GET /api/users` - Get all users
- `GET /api/admin/users-progress` - Get users with progress
- `PUT /api/admin/extend-submission/:user_id` - Extend deadline

### Files
- `GET /api/resumes/:id/pdf` - Get resume PDF
- `POST /api/upload-signature/:user_id` - Upload signature

## 🔒 Security Features

- Password-based authentication
- CORS protection
- Environment variable configuration
- SQL injection prevention
- File upload validation

## 📱 Responsive Design

- Mobile-friendly interface
- Adaptive layouts for tablets and desktops
- Touch-friendly controls

## 🎯 Production Ready

- Environment-based configuration
- Error handling and logging
- Database connection pooling
- Optimized build process
- SEO-friendly routing

---

## 📞 Support

For deployment help, see [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md)

## 📄 License

This project is licensed under the MIT License.