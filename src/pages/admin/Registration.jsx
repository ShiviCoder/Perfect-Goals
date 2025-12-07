import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Document, Page } from "react-pdf";

const Registration = () => {
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [alternateNumber, setAlternateNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [generatedUser, setGeneratedUser] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

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
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        const pdfDataURL = await createAgreementPDF(fullName, address);
        if (pdfDataURL) {
          localStorage.setItem("agreementPDF", pdfDataURL);
        }
        setGeneratedUser({ fullName, username, password });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleOk = () => {
    navigate("/login");
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

            <button type="submit" style={styles.button}>
              Register
            </button>
          </form>
        ) : (
          <div>
            <h3>🎉 Registration Successful!</h3>
            <div style={styles.credentialsBox}>
              <div style={styles.credItem}>
                <strong>Username:</strong> {generatedUser.username}
              </div>
              <div style={styles.credItem}>
                <strong>Password:</strong> {generatedUser.password}
              </div>
            </div>
            <button style={styles.button} onClick={handleOk}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
