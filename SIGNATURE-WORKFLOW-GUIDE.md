# 🔐 Signature Workflow - Complete Working Flow

## Overview
This document explains the complete signature workflow from user registration to data entry access, including all backend endpoints, database interactions, and frontend components involved.

---

## 📋 Database Schema

### UserRegistrations Table
```sql
CREATE TABLE userregistrations (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    address TEXT,
    mobile VARCHAR(20),
    email VARCHAR(255),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submission_end_date TIMESTAMP,
    signature BYTEA,                    -- Stores signature image as binary
    signature_status VARCHAR(20) DEFAULT 'not_signed',  -- 'not_signed', 'pending', 'approved', 'rejected'
    signature_uploaded_at TIMESTAMP,
    signature_approved_at TIMESTAMP
);
```

---

## 🔄 Complete Workflow Steps

### Step 1: User Registration
**Location**: Admin Dashboard → Registration Tab
**Process**:
1. Admin creates new user account
2. User gets login credentials
3. Database creates user with `signature_status = 'not_signed'`

### Step 2: User Login
**Location**: Login Page (`/login`)
**Process**:
1. User enters credentials
2. Backend validates and returns user data
3. User redirected to User Dashboard

### Step 3: User Views Agreement
**Location**: User Dashboard → Show Agreement Tab
**Components**: `AgreementTab.jsx`
**Process**:
1. **PDF Loading**:
   ```javascript
   // Check for signed PDF first
   const savedSignedPDF = localStorage.getItem(`agreementPDF_${userId}`);
   if (savedSignedPDF) {
     // Load signed version
   } else {
     // Load original PDF + add user details
   }
   ```
2. **Status Check**:
   ```javascript
   // Check if already signed
   const isAlreadySigned = !!localStorage.getItem(`agreementPDF_${userId}`);
   ```

### Step 4: User Signs Agreement
**Location**: Agreement Tab → Digital Signature Section
**Process**:
1. **User draws signature** on canvas
2. **User clicks "Save Signature"**
3. **Frontend processes signature**:
   ```javascript
   // Convert canvas to blob
   canvas.toBlob(async (blob) => {
     const signatureFile = new File([blob], "signature.png", { type: "image/png" });
     
     // Add to PDF
     await addSignatureToPDF(signatureFile);
     
     // Upload to backend
     await handleSignatureUpload(signatureFile);
   });
   ```

### Step 5: Backend Signature Storage
**Endpoint**: `POST /api/upload-signature/:user_id`
**Process**:
```javascript
app.post("/api/upload-signature/:user_id", upload.single("signature"), async (req, res) => {
  const userId = req.params.user_id;
  const file = req.file;

  // Update database
  const query = `
    UPDATE userregistrations 
    SET signature = $1, 
        signature_status = 'pending', 
        signature_uploaded_at = CURRENT_TIMESTAMP 
    WHERE id = $2
  `;
  await db.query(query, [file.buffer, userId]);
  
  res.json({ message: "✅ Signature uploaded! Waiting for admin approval." });
});
```

### Step 6: PDF Persistence
**Location**: `UserDashboard.jsx` → `addSignatureToPDF()`
**Process**:
```javascript
// Save signed PDF to localStorage for persistence
const reader = new FileReader();
reader.onload = function() {
  const base64PDF = reader.result;
  localStorage.setItem(`agreementPDF_${userId}`, base64PDF);
};
reader.readAsDataURL(signedPdfBlob);
```

### Step 7: Admin Views Signatures
**Location**: Admin Dashboard → Users Tab
**Components**: `AdminDashboard.jsx`
**Process**:
1. **Load signature status for all users**:
   ```javascript
   // For each user, fetch signature status
   const signatureRes = await fetch(`${apiUrl}/api/signature-status/${user.id}`);
   const signatureData = await signatureRes.json();
   ```

2. **Display signature status**:
   - ❌ Not Signed
   - ⏳ Pending Approval
   - ✅ Approved
   - 🚫 Rejected

### Step 8: Admin Approves/Rejects Signature
**Location**: Admin Dashboard → Users Tab → Signature Column
**Process**:
1. **Admin clicks Approve/Reject button**
2. **Frontend calls backend**:
   ```javascript
   const response = await fetch(`${apiUrl}/api/admin/signature-approval/${userId}`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ action: 'approve' }) // or 'reject'
   });
   ```

3. **Backend updates database**:
   ```javascript
   app.post("/api/admin/signature-approval/:user_id", async (req, res) => {
     const { action } = req.body;
     
     if (action === 'approve') {
       query = `
         UPDATE userregistrations 
         SET signature_status = 'approved', 
             signature_approved_at = CURRENT_TIMESTAMP 
         WHERE id = $1
       `;
     } else {
       query = `
         UPDATE userregistrations 
         SET signature_status = 'rejected', 
             signature_approved_at = NULL 
         WHERE id = $1
       `;
     }
     
     await db.query(query, [userId]);
   });
   ```

### Step 9: User Accesses Data Entry
**Location**: User Dashboard → Data Entry Tab
**Components**: `DataEntryTab.jsx`
**Process**:
1. **Check signature status**:
   ```javascript
   const response = await fetch(`${apiBase}/api/signature-status/${userId}`);
   const signatureData = await response.json();
   setSignatureStatus(signatureData);
   ```

2. **Access control logic**:
   ```javascript
   if (!signatureStatus?.can_access_data_entry) {
     // Show signature requirement message
     return <SignatureRequiredMessage />;
   }
   
   // Show resume list for data entry
   return <ResumeListView />;
   ```

---

## 🔗 Backend API Endpoints

### 1. Upload Signature
```
POST /api/upload-signature/:user_id
Content-Type: multipart/form-data
Body: signature file

Response: { success: true, message: "Signature uploaded successfully" }
```

### 2. Check Signature Status
```
GET /api/signature-status/:user_id

Response: {
  signature_status: "pending|approved|rejected|not_signed",
  signature_uploaded_at: "2025-01-01T10:00:00Z",
  signature_approved_at: "2025-01-01T11:00:00Z",
  can_access_data_entry: true|false
}
```

### 3. Admin Signature Approval
```
POST /api/admin/signature-approval/:user_id
Content-Type: application/json
Body: { action: "approve" | "reject" }

Response: { success: true, message: "Signature approved successfully" }
```

### 4. Get User Signature Image
```
GET /api/user-signature/:user_id
Content-Type: image/png

Response: Binary signature image data
```

---

## 🎯 Frontend Components Flow

### AgreementTab.jsx
- **Purpose**: Display PDF and signature pad
- **Key Features**:
  - Load signed PDF from localStorage if exists
  - Digital signature canvas
  - Save signature to PDF and backend
  - Show signature status indicator

### DataEntryTab.jsx
- **Purpose**: Control access to resume data entry
- **Key Features**:
  - Check signature approval status
  - Block access until approved
  - Show appropriate messages based on status

### AdminDashboard.jsx
- **Purpose**: Manage user signatures
- **Key Features**:
  - Display all users' signature status
  - Approve/reject signatures
  - Real-time status updates

---

## 📱 User Experience Flow

### For Users:
1. **Login** → User Dashboard
2. **Go to Agreement Tab** → View PDF
3. **Sign Agreement** → Draw signature and save
4. **Wait for Approval** → See "Pending" status
5. **Access Data Entry** → After admin approval

### For Admins:
1. **Login** → Admin Dashboard
2. **Go to Users Tab** → See all users
3. **Review Signatures** → See signature status
4. **Approve/Reject** → Click buttons to approve
5. **Monitor Progress** → Track user access

---

## 🔧 Technical Implementation Details

### Signature Storage
- **Format**: PNG image stored as BYTEA in PostgreSQL
- **Size**: Optimized for web display
- **Persistence**: Both database (for admin) and localStorage (for user)

### Status Management
- **Database**: Single source of truth
- **Real-time**: API calls for status checks
- **Caching**: Minimal caching for performance

### Security
- **Authentication**: Required for all endpoints
- **Authorization**: Admin-only approval endpoints
- **Validation**: File type and size validation

---

## 🚀 Deployment Considerations

### Environment Variables
```
VITE_API_URL=https://perfect-goals.onrender.com
DATABASE_URL=postgresql://...
```

### Database Migration
```sql
-- Ensure signature columns exist
ALTER TABLE userregistrations ADD COLUMN IF NOT EXISTS signature BYTEA;
ALTER TABLE userregistrations ADD COLUMN IF NOT EXISTS signature_status VARCHAR(20) DEFAULT 'not_signed';
ALTER TABLE userregistrations ADD COLUMN IF NOT EXISTS signature_uploaded_at TIMESTAMP;
ALTER TABLE userregistrations ADD COLUMN IF NOT EXISTS signature_approved_at TIMESTAMP;
```

---

## ✅ Testing Checklist

### User Flow Testing
- [ ] User can view agreement PDF
- [ ] User can sign agreement
- [ ] Signature persists after page reload
- [ ] User blocked from data entry before approval
- [ ] User can access data entry after approval

### Admin Flow Testing
- [ ] Admin can see all user signature statuses
- [ ] Admin can approve signatures
- [ ] Admin can reject signatures
- [ ] Status updates reflect immediately
- [ ] Signature images display correctly

### Edge Cases
- [ ] Multiple signature attempts
- [ ] Network failures during upload
- [ ] Page refresh during signing
- [ ] Admin approval/rejection race conditions

---

## 🔍 Troubleshooting

### Common Issues
1. **"No signature provided"**: Check if signature upload endpoint is working
2. **Access denied**: Verify signature status is 'approved' in database
3. **PDF not loading**: Check localStorage and PDF generation
4. **Admin can't see signatures**: Verify API endpoints and database queries

### Debug Commands
```sql
-- Check user signature status
SELECT id, username, signature_status, signature_uploaded_at, signature_approved_at 
FROM userregistrations WHERE id = [USER_ID];

-- Reset signature status
UPDATE userregistrations 
SET signature_status = 'not_signed', signature = NULL, signature_uploaded_at = NULL 
WHERE id = [USER_ID];
```

---

This workflow ensures a complete, secure, and user-friendly signature approval process with proper database persistence and admin control.