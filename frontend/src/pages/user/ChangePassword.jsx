import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigate hook
import '../../styles/ChangePassword.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("⚠️ Please log in first to change your password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/change-password/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const text = await response.text(); 
      console.log("Old Password typed:", oldPassword);
      console.log("New Password typed:", newPassword);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Response is not JSON:", text);
        setMessage("❌ Server error or invalid response.");
        return;
      }

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage(`❌ ${data.message || "Failed to change password"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      {/* ✅ Go Back text link */}
      <p className="go-back-text" onClick={() =>  navigate("/user-dashboard")}>
        ← Go Back to Dashboard
      </p>
    </div>
  );
};

export default ChangePassword;
