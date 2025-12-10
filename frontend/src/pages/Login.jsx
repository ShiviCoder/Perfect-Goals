import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/responsive.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use environment variable for backend URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      console.log('🔍 Environment API URL:', import.meta.env.VITE_API_URL);
      console.log('🔍 Final API URL:', apiUrl);
      console.log('🔍 Login URL:', `${apiUrl}/login`);
      
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const user = data.user;

        // ✅ Save login info
        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("userId", user.id);

        alert(data.message || "✅ Login successful!");
        console.log("Login response:", data);

        // ✅ Role-based navigation
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert(data.message || "❌ Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Could not connect to the server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    body: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #004a8f, #0066cc)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "clamp(10px, 5vw, 20px)",
    },
    container: {
      background: "#fff",
      width: "100%",
      maxWidth: "400px",
      padding: "clamp(20px, 5vw, 30px) clamp(15px, 4vw, 25px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      borderRadius: "10px",
      textAlign: "center",
    },
    heading: {
      fontSize: "clamp(22px, 5vw, 26px)",
      color: "#004a8f",
      marginBottom: "clamp(15px, 4vw, 25px)",
      fontWeight: "700",
    },
    inputGroup: {
      marginBottom: "15px",
      textAlign: "left",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "6px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "clamp(10px, 2.5vw, 12px)",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "clamp(14px, 2.5vw, 16px)",
      outline: "none",
      transition: "border-color 0.3s ease",
      boxSizing: "border-box",
    },
    button: {
      marginTop: "clamp(8px, 2vw, 10px)",
      backgroundColor: "#ffa600",
      border: "none",
      borderRadius: "6px",
      padding: "clamp(10px, 2.5vw, 12px) clamp(8px, 2vw, 10px)",
      color: "white",
      fontSize: "clamp(14px, 3vw, 16px)",
      cursor: "pointer",
      fontWeight: 600,
      width: "100%",
      transition: "background-color 0.3s ease",
    },
    footer: {
      marginTop: "20px",
      fontSize: "14px",
      color: "#555",
    },
    link: {
      color: "#004a8f",
      fontWeight: 600,
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: loading ? "#ffa600cc" : "#ffa600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
