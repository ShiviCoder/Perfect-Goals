import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pdfjs } from "react-pdf";
import "pdfjs-dist/legacy/build/pdf.worker.entry"; // just import, no default
import { PDFDocument, rgb } from "pdf-lib";
import "../../styles/responsive.css";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import DashboardTab from "./components/DashboardTab";
import DataEntryTab from "./components/DataEntryTab";
import AgreementTab from "./components/AgreementTab";
import InstructionsTab from "./components/InstructionsTab";
import ProfileTab from "./components/ProfileTab";
import WithdrawalTab from "./components/WithdrawalTab";

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // 1️⃣ Fetch user info from backend
  const storedUser = JSON.parse(localStorage.getItem("userData"));
  const user_id = storedUser?.id;
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
      const res = await fetch(`${apiBase}/api/upload-signature/${storedUser.id}`, {
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
    const res = await fetch(`${apiBase}/api/user/${user_id}`);
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

  // 🔁 Initial call only (removed auto-refresh to prevent PDF reloading)
  fetchUser();

  // Optional: Refresh only when tab becomes visible again
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      fetchUser();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [user_id, navigate]);

// ✅ Fetch progress only when needed (removed auto-refresh to prevent PDF reloading)
useEffect(() => {
  if (!user_id) return;

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${apiBase}/api/progress/${user_id}`);
      if (!res.ok) throw new Error("Failed to fetch progress data");

      const data = await res.json();
      setProgress(data);
    } catch (err) {
      console.error("❌ Error fetching progress:", err);
    }
  };

  // Initial fetch only
  fetchProgress();
  
  // Progress will be updated when user completes data entry via handleEntryComplete
}, [user_id]);

 useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
    menuButton: {
      position: "fixed",
      top: "15px",
      left: "15px",
      fontSize: "22px",
      color: "#fff",
      backgroundColor: "#0b2f5a",
      padding: "8px",
      borderRadius: "6px",
      cursor: "pointer",
      zIndex: 1001,
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
      left: isSidebarOpen ? 0 : "-260px",
      fontWeight: 500,
      boxShadow: "3px 0 8px rgb(0 0 0 / 0.1)",
      zIndex: 1000,
      userSelect: "none",
      transition: "left 0.3s ease",
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
      cursor: "pointer",
    },
    navLinkActive: {
      borderLeft: "4px solid #f7941e",
      backgroundColor: "#134184",
      color: "#fff",
    },
    main: {
      marginLeft: isSidebarOpen ? "220px" : "0",
      width: isSidebarOpen ? "calc(100% - 220px)" : "100%",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      transition: "margin-left 0.3s ease, width 0.3s ease",
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
      textAlign: "center",
    },
    graphsContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "24px",
      margin: "20px auto",
      maxWidth: "1000px",
    },
    graphCard: {
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 8px 16px rgb(25 39 54 / 0.06)",
      padding: "10px 13px",
      flex: "1 1 45%",
      minWidth: "280px",
      minHeight: "260px",
    },
    profileImg: {
      borderRadius: "50%",
      objectFit: "cover",
    },
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // Close sidebar automatically on mobile (using window width)
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleProfileSelect = () => {
    setProfileSubTab(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const handleEntryComplete = async () => {
    try {
      // Just refresh progress (backend already updated it in data-entry endpoint)
      const progressRes = await fetch(`${apiBase}/api/progress/${user_id}`);
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <Sidebar
        styles={styles}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        isSidebarOpen={isSidebarOpen}
        onProfileSelect={handleProfileSelect}
      />

      {typeof window !== 'undefined' && window.innerWidth <= 768 && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}

      {/* Main */}
      <div style={styles.main}>
        <TopNavbar
          styles={styles}
          submissionStatus={submissionStatus}
          user={user}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {activeTab === "dashboard" && (
          <DashboardTab
            progress={progress}
            submissionStatus={submissionStatus}
          />
        )}

        {activeTab === "dataEntry" && (
          <DataEntryTab
            userId={user_id}
            apiBase={apiBase}
            onEntryComplete={handleEntryComplete}
          />
        )}

        {activeTab === "instructions" && (
          <InstructionsTab
            numPages={numPages}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
          />
        )}

        {activeTab === "agreement" && (
          <AgreementTab
            pdfURL={pdfURL}
            numPages={numPages}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            addSignatureToPDF={addSignatureToPDF}
            handleSignatureUpload={handleSignatureUpload}
          />
        )}

        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            profileSubTab={profileSubTab}
            setProfileSubTab={setProfileSubTab}
            setUser={setUser}
            apiBase={apiBase}
            onLogout={handleLogout}
          />
        )}

        {activeTab === "withdrawal" && <WithdrawalTab />}
      </div>
    </div>
  );
};

export default UserDashboard;
