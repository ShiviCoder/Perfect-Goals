import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import PGLogo from "../../assets/PG.png";
import InfoCards from "./InfoCards";
import { Document, Page, pdfjs } from 'react-pdf';
import 'pdfjs-dist/legacy/build/pdf.worker.entry'; // just import, no default
import SignaturePad from "../../components/SignaturePad";
import { PDFDocument, rgb } from "pdf-lib";

// Tell pdfjs to use the worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.entry',
  import.meta.url
).toString();
const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({
    totalEntries: 0,
    completedEntries: 0,
    pendingEntries: 0,
  });
  const [submissionStatus, setSubmissionStatus] = useState("");
  const navigate = useNavigate();
  const [pdfURL, setPdfURL] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileSubTab, setProfileSubTab] = useState(null); // sub nav
  const [signatureFile, setSignatureFile] = useState(null);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // 1️⃣ Fetch user info from backend
  const storedUser = JSON.parse(localStorage.getItem("userData"));
  const user_id = storedUser?.id;

  function base64ToUint8Array(base64) {
    const raw = atob(base64); // decode base64
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }


  const addUserDetailsToPDF = async (pdfBytes, user) => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[1]; // 1st page me likhna
    const secondPage = pages[2];
    const { width, height } = firstPage.getSize();
    console.log(height)
    firstPage.drawText(`${user.fullName}`, {
      x: 80,
      y: height - 100,
      size: 14,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(`${user.address}`, {
      x: 80,
      y: height - 120,
      size: 14,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(`${user.fullName}`, {
      x: 80,
      y: height - 720,
      size: 14,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(`${user.address}`, {
      x: 80,
      y: height - 740,
      size: 14,
      color: rgb(0, 0, 0),
    });

    const modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
  };

  useEffect(() => {
    const loadAndModifyPDF = async () => {
      try {
        const response = await fetch("/Agreement.pdf");
        const arrayBuffer = await response.arrayBuffer();

        const modifiedPdfBytes = await addUserDetailsToPDF(arrayBuffer, storedUser);
        const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfURL(url);
      } catch (err) {
        console.error("PDF loading failed:", err);
      }
    };

    if (storedUser) {
      loadAndModifyPDF();
    }
  }, []);

  const addSignatureToPDF = async (file) => {
    try {
      if (!pdfURL) return;

      // ✅ Fetch the blob URL and convert it into ArrayBuffer
      const response = await fetch(pdfURL);
      const pdfBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[14]; // 15th page (index 14)

      // ✅ Read the uploaded signature image
      const arrayBuffer = await file.arrayBuffer();
      const pngImage = await pdfDoc.embedPng(arrayBuffer);

      // ✅ Draw the image on the page
      page.drawImage(pngImage, {
        x: 80,
        y: 600,
        width: 150,
        height: 100,
      });


      // ✅ Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfURL(url);
      alert("PDF updated successfully!");
    } catch (err) {
      console.error("PDF update failed:", err);
    }
  };

  const handleSignatureUpload = async (file) => {
    const formData = new FormData();
    formData.append("signature", file);

    try {
      const res = await fetch(`http://localhost:5000/api/upload-signature/${storedUser.id}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    const pdfData = localStorage.getItem("agreementPDF");
    if (pdfData?.startsWith("data:application/pdf;base64,")) {

      setPdfURL(pdfData);
    } else {
      console.warn("No pdf Found or invalid format")
    }
  }, []);
 useEffect(() => {
  if (!user_id) return;
 })

 useEffect(() => {
  if (!user_id) return;
  

 const fetchUser = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/user/${user_id}`);
    if (!res.ok) throw new Error("Failed to fetch user data");

    const data = await res.json();
    console.log("📦 Full user data from backend:", data); // <-- ADD THIS LINE

    if (!data.user) throw new Error("User data missing");

    setUser(data.user);

    // ✅ Determine submission end date dynamically
    const registrationDate = new Date(
      data.user.registration_date || data.user.registrationDate
    );

    console.log("🗓 Registration Date:", registrationDate);
    console.log("📅 Submission End Date (from backend):", data.user.submission_end_date);

    let endDate;

    if (data.user.submission_end_date) {
      endDate = new Date(data.user.submission_end_date);
    } else {
      endDate = new Date(registrationDate);
      endDate.setDate(registrationDate.getDate() + 8);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    console.log("✅ Final computed End Date:", endDate);

    setSubmissionStatus(today > endDate ? "Time Out ❌" : endDate.toISOString().split("T")[0]);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    navigate("/login");
  }
};

  // 🔁 Initial call + Auto refresh every 10 seconds
  fetchUser();
  const intervalId = setInterval(fetchUser, 10000);

  return () => clearInterval(intervalId);
}, [user_id, navigate]);

// ✅ Fetch progress every 3 seconds
useEffect(() => {
  if (!user_id) return;

  const fetchProgress = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/progress/${user_id}`);
      if (!res.ok) throw new Error("Failed to fetch progress data");

      const data = await res.json();
      setProgress(data);
    } catch (err) {
      console.error("❌ Error fetching progress:", err);
    }
  };

  fetchProgress();
  const intervalId = setInterval(fetchProgress, 3000);
  return () => clearInterval(intervalId);
}, [user_id]);
  // ✅ Centralized styles
  const styles = {
    dashboard: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "#f1f4f8",
      color: "#111",
      fontSize: "14px",
    },
    sidebar: {
      backgroundColor: "#0b2f5a",
      width: "220px",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      color: "#dde8fc",
      position: "fixed",
      top: 0,
      left: 0,
      fontWeight: 500,
      boxShadow: "3px 0 8px rgb(0 0 0 / 0.1)",
      zIndex: 1000,
      userSelect: "none",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "16px 20px",
      borderBottom: "1px solid #11345a88",
    },
    logoImg: { width: "50px", height: "50px", borderRadius: "50%" },
    logoText: { fontSize: "1rem", fontWeight: 700, color: "white" },
    nav: {
      marginTop: "8px",
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      paddingLeft: "4px",
    },
    navLink: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 20px",
      color: "#c5d1f9",
      fontWeight: 500,
      textDecoration: "none",
      borderLeft: "4px solid transparent",
    },
    navLinkActive: {
      borderLeft: "4px solid #f7941e",
      backgroundColor: "#134184",
      color: "#fff",
    },
    main: {
      marginLeft: "220px",
      width: "calc(100% - 220px)",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    topNavbar: {
      backgroundColor: "#0d2d59",
      color: "white",
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      fontSize: "14px",
      boxShadow: "0 2px 4px rgb(0 0 0 / 0.1)",
    },
    profileImg: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      border: "2px solid #f7941e",
      objectFit: "cover",
    },
    announcement: {
      backgroundColor: "#f7941e",
      color: "white",
      fontWeight: 600,
      padding: "12px 20px",
      borderRadius: "4px",
      fontSize: "1rem",
      letterSpacing: "0.03em",
      boxShadow: "0 2px 4px rgb(0 0 0 / 0.06)",
      margin: "10px 0",
    },
    entrySummary: {
      display: "flex",
      justifyContent: "space-around",
      padding: "10px 0",
      borderTop: "1px solid #ddd",
      borderBottom: "1px solid #ddd",
      boxShadow: "0 2px 4px rgb(0 0 0 / 0.03)",
      gap: "24px",
      maxWidth: "1000px",
      margin: "0 auto 20px auto",
      borderRadius: "4px",
    },
    entryBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: "1 1 33.33%",
      padding: "0 12px",
    },
    entryLabel: {
      fontWeight: 700,
      textTransform: "uppercase",
      fontSize: "0.875rem",
      marginBottom: "8px",
      letterSpacing: "0.05em",
      color: "#222",
    },
    entryNumber: { fontSize: "30px", fontWeight: 900, color: "#111" },
    graphsContainer: {
      display: "flex",
      gap: "24px",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    graphCard: {
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 8px 16px rgb(25 39 54 / 0.06)",
      padding: "10px 13px",
      flex: 1,
      margin: "20px",
      minHeight: "260px",
      position: "relative",
    },
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <img src={PGLogo} alt="Logo" style={styles.logoImg} />
          <div style={styles.logoText}>Perfect Your Goals</div>
        </div>
        <nav style={styles.nav}>
          <div
            style={{ ...styles.navLink, ...(activeTab === "dashboard" ? styles.navLinkActive : {}) }}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </div>
          <div
            style={{ ...styles.navLink, ...(activeTab === "dataEntry" ? styles.navLinkActive : {}) }}
            onClick={() => setActiveTab("dataEntry")}
          >
            Data Entry
          </div>
          <div
            style={{ ...styles.navLink, ...(activeTab === "agreement" ? styles.navLinkActive : {}) }}
            onClick={() => setActiveTab("agreement")}
          >
            Show Agreement
          </div>
          <div
            style={{ ...styles.navLink, ...(activeTab === "instructions" ? styles.navLinkActive : {}) }}
            onClick={() => setActiveTab("instructions")}
          >
            Instructions
          </div>
          <div
            style={{ ...styles.navLink, ...(activeTab === "withdrawal" ? styles.navLinkActive : {}) }}
            onClick={() => setActiveTab("withdrawal")}
          >
            Withdrawal
          </div>

          {/* My Profile */}
          <div
            style={{ ...styles.navLink, ...(activeTab === "profile" ? styles.navLinkActive : {}) }}
            onClick={() => {
              setActiveTab("profile");
              setProfileSubTab(null); // just show overview by default
            }}
          >
            My Profile
          </div>

          {activeTab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  ...styles.navLink,
                  marginLeft: "12px", // indent for sub-tab
                  ...(profileSubTab === "editProfile" ? styles.navLinkActive : {}),
                }}
                onClick={() => setProfileSubTab("editProfile")}
              >
                Edit Profile
              </div>
              <div
                style={{
                  ...styles.navLink,
                  marginLeft: "12px", // indent for sub-tab
                  ...(profileSubTab === "logout" ? styles.navLinkActive : {}),
                }}
                onClick={() => setProfileSubTab("logout")}
              >
                Logout
              </div>
            </div>
          )}

        </nav>

      </aside>

      {/* Main */}
      <div style={styles.main}>
        <header style={styles.topNavbar}>
          <div>Submission End Date: <strong>{submissionStatus}</strong></div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <span>Welcome, {user?.fullName || "User"}!</span>
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0702fb3a-35e7-4f33-b14d-104e1d8c036d.png"
              alt="User Avatar"
              style={styles.profileImg}
              onError={(e) =>
              (e.target.src =
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3547847b-b483-42b6-8cc3-22f0fe67430d.png")
              }
            />
          </div>
        </header>

        {activeTab === "instructions" && (
          <div
            style={{
              maxHeight: "600px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
            }}

          >
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
              <a
                href="/INSTRUCTIONS.pdf"
                download="INSTRUCTIONS.pdf"
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#0b2f5a",
                  color: "#fff",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Download PDF
              </a>
            </div>

            <Document
              file="/INSTRUCTIONS.pdf"
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => {
                console.error("PDF load error:", error); // log silently
              }}
              options={{ workerSrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js' }} // fallback worker
            >
              {Array.from(new Array(numPages || 0), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={800}
                  renderTextLayer={false}       // disable text layer
                  renderAnnotationLayer={false} // disable annotations
                />
              ))}
            </Document>

          </div>
        )}



        {activeTab === "dashboard" && (
          <section>
            <div style={styles.announcement}>
              Submission End Date: {submissionStatus}
            </div>
            <div style={styles.entrySummary}>
              <div style={styles.entryBox}>
                <label style={styles.entryLabel}>Total Entry</label>
                <div style={styles.entryNumber}>{progress.totalEntries}</div>
              </div>
              <div style={styles.entryBox}>
                <label style={styles.entryLabel}>Pending Entry</label>
                <div style={styles.entryNumber}>{progress.pendingEntries}</div>
              </div>
              <div style={styles.entryBox}>
                <label style={styles.entryLabel}>Completed Entry</label>
                <div style={styles.entryNumber}>{progress.completedEntries}</div>
              </div>
            </div>

            {/* Graphs */}
            <div style={styles.graphsContainer}>
              <div style={styles.graphCard}>
                <div style={{ marginBottom: "5px", color: "#444c56" }}>Total Entry</div>
                <div style={{ background: "#eee", height: "28px", borderRadius: "4px", marginBottom: "22px", position: "relative" }}>
                  <div style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#3f6272",
                    borderRadius: "4px 0 0 4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "12px",
                    color: "white",
                    fontWeight: 700
                  }}>
                    {progress.totalEntries}
                  </div>
                </div>

                <div style={{ marginBottom: "8px", color: "#678e9f" }}>Completed Entry</div>
                <div style={{
                  background: "#eee",
                  height: "28px",
                  borderRadius: "4px",
                  marginBottom: "22px",
                  overflow: "hidden",
                  display: "flex"
                }}>
                  <div style={{
                    width: `${(progress.completedEntries / progress.totalEntries) * 100}%`,
                    height: "100%",
                    backgroundColor: "#3f6272",
                    borderRadius: "4px 0 0 4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "12px",
                    color: "white",
                    fontWeight: 700,
                    transition: "width 0.5s ease"
                  }}>
                    {progress.completedEntries}
                  </div>
                  <div style={{
                    flex: 1,
                    background: "#ddd",
                    borderRadius: "0 4px 4px 0",
                  }} />
                </div>

                {/* Pending Entry */}
                <div style={{ marginBottom: "5px", color: "#444c56" }}>Pending Entry</div>
                <div style={{
                  background: "#eee",
                  height: "28px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  display: "flex"
                }}>
                  <div style={{
                    width: `${(progress.pendingEntries / progress.totalEntries) * 100}%`,
                    height: "100%",
                    backgroundColor: "#3f6272",
                    borderRadius: "4px 0 0 4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "12px",
                    color: "white",
                    fontWeight: 700,
                    transition: "width 0.5s ease"
                  }}>
                    {progress.pendingEntries}
                  </div>
                  <div style={{
                    flex: 1,
                    background: "#ddd",
                    borderRadius: "0 4px 4px 0",
                  }} />
                </div>
              </div>
              <div style={styles.graphCard}>{/* Graph 2 */}</div>
            </div>

            <InfoCards />
          </section>
        )}

        {activeTab === "dataEntry" && (
          <section>
            <h2>Data Entry Content</h2>
            {/* Add your data entry UI here */}
          </section>
        )}


        {activeTab === "agreement" && (
          <section>
            {pdfURL ? (
              <>
                <Document
                  file={pdfURL}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) => console.error("PDF load error:", error)}
                >
                  {Array.from(new Array(numPages || 0), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={800}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))}
                </Document>

                <div style={{ marginTop: "20px" }}>
                  <h3>Draw your signature below:</h3>
                  <input type="file" accept="image/*"
                    onChange={(e) => setSignatureFile(e.target.files[0])}
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!signatureFile) {
                      alert("Please draw your signature first!");
                      return;
                    }
                    await addSignatureToPDF(signatureFile);
                    await handleSignatureUpload(signatureFile);
                  }}
                  style={{ marginTop: "10px", padding: "8px 16px", background: "#0b2f5a", color: "#fff", borderRadius: "4px" }}
                >
                  Save & Download PDF
                </button>
              </>

            ) : (
              <p>Loading pdf...</p>
            )}
          </section>
        )}
        {activeTab === "profile" && (
          <section style={{ padding: "20px" }}>
            {!profileSubTab && (
              <div
                style={styles.profileContainer}
              >
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "12px", color: "#0b2f5a" }}>
                  Profile Overview
                </h2>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#333" }}>
                  Welcome, {user?.fullName}!
                </p>
              </div>
            )}

            {profileSubTab === "editProfile" && (
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#f1f4f8",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgb(0 0 0 / 10%)",
                  maxWidth: "500px",
                  marginTop: "10px",
                }}
              >
                <h2 style={{ marginBottom: "16px", color: "#0b2f5a" }}>Edit Profile</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const updatedData = {
                      accountNumber: e.target.accountNumber.value,
                      bankName: e.target.bankName.value,
                      branchName: e.target.branchName.value,
                      ifscCode: e.target.ifscCode.value,
                    };
                    try {
                      const response = await fetch(`http://localhost:5000/api/user/${user.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedData),
                      });
                      if (!response.ok) throw new Error("Update failed");
                      const data = await response.json();
                      setUser(data.user); // update local state
                      alert("Profile updated successfully!");
                    } catch (err) {
                      console.error(err);
                      alert("Failed to update profile");
                    }
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                >
                  {/* Full Name (read-only) */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontWeight: 600, marginBottom: "4px" }}>Full Name:</label>
                    <input
                      type="text"
                      name="fullName"
                      defaultValue={user?.fullName}
                      readOnly
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        backgroundColor: "#e0e0e0",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontWeight: 600, marginBottom: "4px" }}>Email:</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={user?.email}
                      readOnly
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        backgroundColor: "#e0e0e0",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* Account Number */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontWeight: 600, marginBottom: "4px" }}>Account Number:</label>
                    <input
                      type="text"
                      name="accountNumber"
                      defaultValue={user?.accountNumber || ""}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* Bank Name */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontWeight: 600, marginBottom: "4px" }}>Bank Name:</label>
                    <input
                      type="text"
                      name="bankName"
                      defaultValue={user?.bankName || ""}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* Branch Name */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontWeight: 600, marginBottom: "4px" }}>Branch Name:</label>
                    <input
                      type="text"
                      name="branchName"
                      defaultValue={user?.branchName || ""}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* IFSC Code */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontWeight: 600, marginBottom: "4px" }}>IFSC Code:</label>
                    <input
                      type="text"
                      name="ifscCode"
                      defaultValue={user?.ifscCode || ""}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#0b2f5a",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      marginTop: "8px",
                    }}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}


            {profileSubTab === "logout" && (
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#f1f4f8",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgb(0 0 0 / 10%)",
                  maxWidth: "400px",
                  marginTop: "10px",
                }}
              >

                {/* User info */}
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "4px 0", fontWeight: 600, color: "#0b2f5a" }}>
                    Name: {user?.fullName || "User"}
                  </p>
                  <p style={{ margin: "4px 0", fontWeight: 500, color: "#222" }}>
                    Email: {user?.email || "user@example.com"}
                  </p>
                </div>

                <p style={{ marginBottom: "16px", color: "#222" }}>
                  Are you sure you want to logout?
                </p>

                <button
                  onClick={() => {
                    localStorage.removeItem("userData");
                    navigate("/login");
                  }}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#f7941e",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Confirm Logout
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "withdrawal" && (
          <section
            style={{
              padding: "20px",
              backgroundColor: "#f9fafc",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              maxWidth: "500px",
              margin: "20px auto",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#0b2f5a", marginBottom: "16px" }}>Withdrawal Request</h2>

            <p style={{ marginBottom: "16px", color: "#333" }}>
              Enter your UPI ID below to simulate a withdrawal request.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const upi = e.target.upi.value.trim();
                if (!upi) {
                  alert("Please enter your UPI ID!");
                  return;
                }

                const randomAmount = (Math.random() * (500 - 50) + 50).toFixed(2);
                alert(
                  `Withdrawal request of ₹${randomAmount} received for UPI ID: ${upi}\n\nNote: This is a demo — no actual transaction will be made.`
                );
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                name="upi"
                placeholder="Enter your UPI ID (e.g., name@upi)"
                style={{
                  padding: "10px",
                  width: "100%",
                  maxWidth: "300px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#0b2f5a",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: "4px",
                  padding: "10px 16px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Withdraw Now
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
