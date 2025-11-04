import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Document, Page } from "react-pdf"; // for PDF preview
const Registration = () => {
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [alternateNumber, setAlternateNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [generatedUser, setGeneratedUser] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (pdfBlob) URL.revokeObjectURL(pdfBlob);
    }
  }, [pdfBlob])

  // Generate random username
  const generateUsername = () => {

    const randomNum1 = Math.floor(10000 + Math.random() * 90000);   // 5-digit
    const randomNum2 = Math.floor(1000000 + Math.random() * 9000000); // 7-digit
    return `${randomNum1}PYC${randomNum2}`;
  };

  // Generate random password
  const generatePassword = () => {
    const chars =
      "0123456789";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const createAgreementPDF = async (fullName, address) => {
    const existingPdfBytes = await fetch("/Agreement.pdf").then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.getPages()[1];
    const { width, height } = page.getSize();
    console.log("Page size:", page.getSize());

    // Name & Address draw
    page.drawText(fullName, {
      x: 80,
      y: 700,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(address, {
      x: 80,
      y: 680,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(fullName, {
      x: 80,
      y: 50,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(address, {
      x: 80,
      y: 30,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    });

    const pdfBytes = await pdfDoc.save();


    function arrayBufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk);
      }
      return btoa(binary)
    }
    const base64 = arrayBufferToBase64(pdfBytes);
    const dataUrl = `data:application/pdf;base64,${base64}`;

    return dataUrl;
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
      registrationDate: new Date().toISOString()
    };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok) {
        const pdfDataURL = await createAgreementPDF(fullName, address);
        console.log("Generated PDF DataURL:", pdfDataURL?.slice(0, 100));
        if (pdfDataURL) {

          localStorage.setItem("agreementPDF", pdfDataURL);
          console.log("PDF saved to localStorage:", pdfDataURL.slice(0, 50));
        }
        setGeneratedUser({ fullName, username, password });

      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOk = () => {
    navigate(""); // Go to login page
  };

  const styles = {
    body: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#004a8f",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    container: {
      background: "#fff",
      width: "420px",
      padding: "30px 35px 40px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      borderRadius: "6px",
      textAlign: "center",
    },
    logoWrapper: {
      marginBottom: "20px",
    },
    logoImg: {
      borderRadius: "50%",
      width: "80px",
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
    },
    inputIcon: {
      backgroundColor: "#ccc",
      padding: "10px 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#4a4a4a",
    },
    input: {
      border: "none",
      outline: "none",
      padding: "10px 12px",
      fontSize: "14px",
      color: "#4a4a4a",
      flexGrow: 1,
    },
    button: {
      marginTop: "10px",
      backgroundColor: "#ffa600",
      border: "none",
      borderRadius: "4px",
      padding: "12px 10px",
      color: "white",
      fontSize: "14px",
      cursor: "pointer",
      fontWeight: 600,
      width: "100%",
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
                placeholder="DOB"
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
