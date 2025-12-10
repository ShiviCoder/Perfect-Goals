import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Document, Page } from "react-pdf";

const Registration = ({ onSuccess }) => {
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [alternateNumber, setAlternateNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [generatedUser, setGeneratedUser] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (pdfBlob) URL.revokeObjectURL(pdfBlob);
    };
  }, [pdfBlob]);

  const generateUsername = () => {
    const randomNum1 = Math.floor(10000 + Math.random() * 90000);
    const randomNum2 = Math.floor(1000000 + Math.random() * 9000000);
    return `${randomNum1}PYC${randomNum2}`;
  };
  
  // Generate a unique submission ID to prevent duplicates
  const [submissionId] = useState(() => Date.now() + Math.random());

  const generatePassword = () => {
    const chars = "0123456789";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const createAgreementPDF = async (fullName, address) => {
    const existingPdfBytes = await fetch("/Agreement.pdf").then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.getPages()[1];

    page.drawText(fullName, { x: 80, y: 700, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(address, { x: 80, y: 680, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(fullName, { x: 80, y: 50, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(address, { x: 80, y: 30, size: 12, font, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();

    const base64 = btoa(
      new Uint8Array(pdfBytes).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    return `data:application/pdf;base64,${base64}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("⚠️ Form already submitting, ignoring duplicate submission");
      return;
    }
    
    setIsSubmitting(true);
    console.log("🚀 Starting user registration...");

    const username = generateUsername(fullName);
    const password = generatePassword();

    const userData = {
      fullName,
      contactNumber,
      alternateNumber,
      email,
      dob,
      address,
      username,
      password,
      registrationDate: new Date().toISOString(),
      submissionId, // Add unique submission ID
    };

    try {
      console.log("📤 Sending registration request...", { username, fullName });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log("📥 Registration response:", result);

      if (response.ok) {
        console.log("✅ Registration successful, creating PDF...");
        const pdfDataURL = await createAgreementPDF(fullName, address);
        if (pdfDataURL) {
          localStorage.setItem("agreementPDF", pdfDataURL);
        }
        setGeneratedUser({ fullName, username, password });
        console.log("🎉 User registration completed successfully!");
        
        // Don't auto-close the modal - let admin click OK when ready
        // The onSuccess callback will be called when admin clicks OK button
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      console.log("🔄 Registration process finished, form ready for next submission");
    }
  };

  const handleOk = () => {
    // Call onSuccess callback to close modal and refresh users list
    if (onSuccess) {
      onSuccess();
    }
    // Stay in admin dashboard - don't navigate to login
    // Reset form for next registration
    setGeneratedUser(null);
    setFullName("");
    setContactNumber("");
    setAlternateNumber("");
    setEmail("");
    setDob("");
    setAddress("");
  };

  const styles = {
    body: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#004a8f",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px",
    },
    container: {
      background: "#fff",
      width: "100%",
      maxWidth: "420px",
      padding: "30px 25px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      borderRadius: "8px",
      textAlign: "center",
    },
    logoWrapper: {
      marginBottom: "20px",
    },
    logoImg: {
      borderRadius: "50%",
      width: "70px",
      marginBottom: "10px",
    },
    logoText: {
      fontWeight: 700,
      fontSize: "18px",
      color: "#004a8f",
      marginBottom: "15px",
    },
    inputGroup: {
      display: "flex",
      alignItems: "center",
      border: "1px solid #d0d0d0",
      borderRadius: "4px",
      overflow: "hidden",
      marginBottom: "15px",
      flexWrap: "nowrap",
    },
    inputIcon: {
      backgroundColor: "#ccc",
      padding: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#4a4a4a",
      minWidth: "40px",
    },
    input: {
      border: "none",
      outline: "none",
      padding: "10px 12px",
      fontSize: "14px",
      color: "#4a4a4a",
      flexGrow: 1,
      width: "100%",
    },
    button: {
      marginTop: "10px",
      backgroundColor: "#ffa600",
      border: "none",
      borderRadius: "4px",
      padding: "12px 10px",
      color: "white",
      fontSize: "15px",
      cursor: "pointer",
      fontWeight: 600,
      width: "100%",
      transition: "background 0.3s ease",
    },
    credentialsBox: {
      padding: "20px",
      backgroundColor: "#f4f4f4",
      border: "1px solid #ddd",
      borderRadius: "5px",
      marginBottom: "20px",
      textAlign: "left",
    },
    credItem: {
      margin: "10px 0",
      fontWeight: "600",
      color: "#333",
      fontSize: "14px",
      wordBreak: "break-word",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.logoWrapper}>
          <img
            src="./PG.png"
            alt="Logo"
            style={styles.logoImg}
            onError={(e) => (e.target.style.display = "none")}
          />
          <div style={styles.logoText}>Perfect Your Goals</div>
        </div>

        {!generatedUser ? (
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                placeholder="Full Name"
                required
                style={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>📞</span>
              <input
                type="tel"
                placeholder="Contact Number"
                required
                style={styles.input}
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>📱</span>
              <input
                type="tel"
                placeholder="Alternate Number"
                style={styles.input}
                value={alternateNumber}
                onChange={(e) => setAlternateNumber(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>📧</span>
              <input
                type="email"
                placeholder="Email ID"
                required
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>🎂</span>
              <input
                type="date"
                required
                style={styles.input}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>🏠</span>
              <input
                type="text"
                placeholder="Your Address with Pin Code"
                required
                style={styles.input}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.button,
                backgroundColor: isSubmitting ? "#ccc" : "#ffa600",
                cursor: isSubmitting ? "not-allowed" : "pointer"
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        ) : (
          <div>
            <h3 style={{ color: "#28a745", marginBottom: "20px" }}>🎉 Registration Successful!</h3>
            <div style={{ ...styles.credentialsBox, backgroundColor: "#f8f9fa", border: "2px solid #28a745" }}>
              <div style={{ marginBottom: "15px", textAlign: "center" }}>
                <strong style={{ color: "#004a8f", fontSize: "16px" }}>
                  User: {generatedUser.fullName}
                </strong>
              </div>
              <div style={{ ...styles.credItem, fontSize: "16px", padding: "10px", backgroundColor: "#e9ecef", borderRadius: "5px", marginBottom: "10px" }}>
                <strong>Username:</strong> 
                <span style={{ marginLeft: "10px", fontFamily: "monospace", fontSize: "18px", color: "#007bff" }}>
                  {generatedUser.username}
                </span>
              </div>
              <div style={{ ...styles.credItem, fontSize: "16px", padding: "10px", backgroundColor: "#e9ecef", borderRadius: "5px" }}>
                <strong>Password:</strong> 
                <span style={{ marginLeft: "10px", fontFamily: "monospace", fontSize: "18px", color: "#007bff" }}>
                  {generatedUser.password}
                </span>
              </div>
              <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "5px", fontSize: "14px", color: "#856404" }}>
                <strong>📝 Note:</strong> Please save these credentials. The user will need them to login.
              </div>
            </div>
            <button style={{ ...styles.button, marginTop: "20px", fontSize: "16px", padding: "15px" }} onClick={handleOk}>
              ✅ OK - Add Another User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
