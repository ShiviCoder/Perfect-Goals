@echo off
echo Starting Perfect Your Goals - Local Development
echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm start"
timeout /t 3
echo.
echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
