import React, { useState, useEffect } from "react";
import Registration from "./Registration";

const TasksModule = () => <div>Create / Assign / Track resume typing tasks here.</div>;
const PaymentsModule = () => <div>Track user earnings, approve/reject payments.</div>;
const NotificationsModule = ({ users }) => (
  <div>
    <h3>Registered Users Notifications</h3>
    {users.length === 0 ? (
      <p>No users registered yet.</p>
    ) : (
      <ul style={{ listStyleType: "none", padding: 0, marginTop: "20px" }}>
        {users.map(u => (
          <li
            key={u.id}
            style={{
              backgroundColor: "#fff",
              marginBottom: "10px",
              padding: "12px 16px",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              fontSize: "15px",
            }}
          >
            ✅ <strong>{u.fullName || u.username}</strong> registered on{" "}
            <strong>{new Date(u.registrationDate || u.registration_date).toLocaleString()}</strong>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const UsersModule = ({ users, handleRemove }) => (
  <div>
    {users.length === 0 ? (
      <p>No users registered yet.</p>
    ) : (
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Username</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Contact</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Address</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>DOB</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Signature</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{u.fullName}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{u.username}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{u.email}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{u.contactNumber}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{u.address}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{u.dob}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                <img
                  src={`http://localhost:5000/api/user-signature/${u.id}`}
                  alt="Signature"
                  style={{
                    width: "120px",
                    height: "60px",
                    objectFit: "contain",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                  }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                <button
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemove(u.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

const ExtendDateModule = ({ users, refreshUsers }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleExtend = async (userId) => {
    if (!selectedDate) {
      alert("⚠️ Please select a date first!");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/admin/extend-submission/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEndDate: selectedDate }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        refreshUsers();
      } else {
        alert("❌ Failed to extend date");
      }
    } catch (err) {
      console.error("Error extending date:", err);
      alert("❌ Server error");
    }
  };

  return (
    <div>
      <h3>Extend Submission Dates</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Full Name</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Username</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Registration Date</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Submission End Date</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Select New Date</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{u.fullName}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{u.username}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {new Date(u.registration_date).toLocaleDateString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {u.submission_end_date
                    ? new Date(u.submission_end_date).toLocaleDateString()
                    : "End submission date"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <button
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleExtend(u.id)}
                  >
                    Extend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [showRegistration, setShowRegistration] = useState(false);

  const fetchUsers = () => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(prev => prev.filter(user => user.id !== id));
      alert("User removed successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to remove user");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <aside
        style={{
          width: "220px",
          backgroundColor: "#004a8f",
          color: "#fff",
          padding: "30px 15px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Admin Panel</h2>
        {["users", "tasks", "payments", "notifications", "extend"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === tab ? "#ffa600" : "transparent",
              color: activeTab === tab ? "#004a8f" : "#fff",
              fontWeight: "600",
              textAlign: "left",
            }}
          >
            {tab === "extend" ? "Extend Date" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </aside>

      <main style={{ flexGrow: 1, padding: "30px", overflowY: "auto", backgroundColor: "#f0f2f5" }}>
        {activeTab === "users" && (
          <div>
            <h2>Registered Users</h2>
            {showRegistration && (
              <Registration
                onRegisterSuccess={(newUser) => {
                  setUsers([...users, newUser]);
                  setShowRegistration(false);
                }}
              />
            )}
            <UsersModule users={users} handleRemove={handleRemove} />
          </div>
        )}
        {activeTab === "tasks" && <TasksModule />}
        {activeTab === "payments" && <PaymentsModule />}
        {activeTab === "notifications" && <NotificationsModule users={users} />}
        {activeTab === "extend" && <ExtendDateModule users={users} refreshUsers={fetchUsers} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
