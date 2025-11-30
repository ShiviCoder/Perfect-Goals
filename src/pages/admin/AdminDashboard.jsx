import React, { useState, useEffect } from "react";
import Registration from "./Registration";
import { FaBars, FaTimes } from "react-icons/fa";
const TasksModule = () => <div>Create / Assign / Track resume typing tasks here.</div>;
const PaymentsModule = () => <div>Track user earnings, approve/reject payments.</div>;
const NotificationsModule = ({ users }) => (
  <div>
    <h3>Registered Users Notifications</h3>
    {users.length === 0 ? (
      <p>No users registered yet.</p>
    ) : (
      <ul style={{ listStyleType: "none", padding: 0, marginTop: "20px" }}>
        {users.map((u) => (
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

const UsersModule = ({ users, handleRemove }) => {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div>
      {/* Add User Button */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Users Management</h2>
        <button
          onClick={() => setShowRegistration(true)}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px"
          }}
        >
          + Add New User
        </button>
      </div>

      {/* Registration Form Modal */}
      {showRegistration && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3>Register New User</h3>
              <button
                onClick={() => setShowRegistration(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#666"
                }}
              >
                ×
              </button>
            </div>
            <Registration onSuccess={() => {
              setShowRegistration(false);
              // You might want to refresh the users list here
              window.location.reload(); // or call a refresh function
            }} />
          </div>
        </div>
      )}

      {/* Users Table */}
      <div style={{ overflowX: "auto" }}>
        {users.length === 0 ? (
          <p>No users registered yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", minWidth: "700px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                {["Name", "Username", "Email", "Contact", "Address", "DOB", "Signature", "Action"].map((h) => (
                  <th key={h} style={{ border: "1px solid #ddd", padding: "10px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
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
                        width: "100px",
                        height: "50px",
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
    </div>
  );
};

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
    <div style={{ overflowX: "auto" }}>
      <h3>Extend Submission Dates</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", minWidth: "700px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              {["Full Name", "Username", "Registration Date", "Submission End Date", "Select New Date", "Action"].map(
                (h) => (
                  <th key={h} style={{ border: "1px solid #ddd", padding: "10px" }}>
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
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
                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
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
  const [menuOpen, setMenuOpen] = useState(false);

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
      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert("User removed successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to remove user");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Menu Icon (mobile) */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "#004a8f",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        style={{
          width: menuOpen ? "220px" : "0",
          backgroundColor: "#004a8f",
          color: "#fff",
          padding: menuOpen ? "30px 15px" : "0",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          overflow: "hidden",
          transition: "0.3s ease",
          position: "fixed",
          height: "100%",
          zIndex: 999,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Admin Panel</h2>
        {["users", "tasks", "payments", "notifications", "extend"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setMenuOpen(false);
            }}
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

      {/* Main Content */}
      <main
        style={{
          flexGrow: 1,
          padding: "30px",
          overflowY: "auto",
          backgroundColor: "#f0f2f5",
          marginLeft: menuOpen ? "220px" : "0",
          transition: "0.3s ease",
        }}
      >
        {activeTab === "users" && <UsersModule users={users} handleRemove={handleRemove} />}
        {activeTab === "tasks" && <TasksModule />}
        {activeTab === "payments" && <PaymentsModule />}
        {activeTab === "notifications" && <NotificationsModule users={users} />}
        {activeTab === "extend" && <ExtendDateModule users={users} refreshUsers={fetchUsers} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
