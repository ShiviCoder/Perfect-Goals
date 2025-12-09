# Resumes Folder

## 📁 Where to Place Resume PDFs

Place all 500 resume PDF files in this folder (`backend/resumes/`).

## 📝 Naming Convention

**Important:** Name your resume files exactly as follows:
- `resume_1.pdf`
- `resume_2.pdf`
- `resume_3.pdf`
- ...
- `resume_500.pdf`

## ✅ Steps to Add Resumes

1. Copy all 500 resume PDF files into this `backend/resumes/` folder
2. Rename them to follow the pattern: `resume_{number}.pdf` (e.g., `resume_1.pdf`, `resume_2.pdf`, etc.)
3. Ensure all files are valid PDFs
4. Restart your backend server

## 🔍 Verification

After adding resumes, you can verify by:
- Checking that files exist: `ls resumes/` (Linux/Mac) or `dir resumes` (Windows)
- Testing the API endpoint: `http://localhost:5000/api/resumes/1/pdf`

## 📌 Notes

- The backend will automatically serve these PDFs through the `/api/resumes/:resumeId/pdf` endpoint
- If a resume is missing, the API will return a 404 error
- Make sure file names match exactly (case-sensitive)

