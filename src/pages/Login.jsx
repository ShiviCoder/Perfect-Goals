import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

   try {
      const res = await fetch("http://localhost:5000/login", {
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
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#004a8f",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    container: {
      background: "#fff",
      width: "400px",
      padding: "30px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      borderRadius: "6px",
      textAlign: "center",
    },
    inputGroup: {
      marginBottom: "15px",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "14px",
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
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "14px",
      marginBottom: "15px",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
