import React, { useState, useEffect } from "react";
import Registration from "./Registration";
import { FaBars, FaTimes } from "react-icons/fa";
const TasksModule = () => {
  const [usersProgress, setUsersProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsersProgress();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchUsersProgress, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsersProgress = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('Fetching users progress from:', `${apiUrl}/api/admin/users-progress`);
      
      const res = await fetch(`${apiUrl}/api/admin/users-progress`);
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Users progress data:', data);
        setUsersProgress(data);
        setError(null);
      } else {
        console.error('Failed to fetch users progress:', res.status, res.statusText);
        const errorText = await res.text();
        console.error('Error response:', errorText);
        setError(`Failed to fetch data: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching users progress:", err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading tasks data...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ color: "#d32f2f", marginBottom: "10px" }}>❌ Error loading data</div>
        <p style={{ color: "#666" }}>{error}</p>
        <button
          onClick={fetchUsersProgress}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#004a8f",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>📊 User Tasks Progress</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Track how many tasks each user has completed
      </p>

      {usersProgress.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "8px" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>📋</div>
          <p style={{ color: "#666", fontSize: "16px" }}>No users found.</p>
          <p style={{ color: "#999", fontSize: "14px", marginTop: "10px" }}>
            Users will appear here once they register.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <thead>
              <tr style={{ backgroundColor: "#004a8f", color: "white" }}>
                <th style={{ padding: "15px", textAlign: "left", borderRight: "1px solid rgba(255,255,255,0.2)" }}>User Name</th>
                <th style={{ padding: "15px", textAlign: "left", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Username</th>
                <th style={{ padding: "15px", textAlign: "left", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Email</th>
                <th style={{ padding: "15px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Total Tasks</th>
                <th style={{ padding: "15px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Completed</th>
                <th style={{ padding: "15px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Pending</th>
                <th style={{ padding: "15px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Progress</th>
                <th style={{ padding: "15px", textAlign: "center" }}>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {usersProgress.map((user, index) => {
                const pending = (user.total_entries || 0) - (user.completed_entries || 0);
                const percentage = Number(user.completion_percentage) || 0;
                const isComplete = user.completed_entries >= user.total_entries;
                const deadline = user.submission_end_date ? new Date(user.submission_end_date).toLocaleDateString() : "N/A";
                const isOverdue = user.submission_end_date && new Date() > new Date(user.submission_end_date);

                return (
                  <tr
                    key={user.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <td style={{ padding: "15px", borderRight: "1px solid #e0e0e0" }}>
                      <strong>{user.fullName}</strong>
                    </td>
                    <td style={{ padding: "15px", borderRight: "1px solid #e0e0e0" }}>
                      {user.username}
                    </td>
                    <td style={{ padding: "15px", borderRight: "1px solid #e0e0e0" }}>
                      {user.email}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", borderRight: "1px solid #e0e0e0" }}>
                      <strong>{user.total_entries || 0}</strong>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", borderRight: "1px solid #e0e0e0" }}>
                      <span style={{ color: "#4caf50", fontWeight: "600" }}>
                        {user.completed_entries || 0}
                      </span>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", borderRight: "1px solid #e0e0e0" }}>
                      <span style={{ color: pending > 0 ? "#ff9800" : "#4caf50", fontWeight: "600" }}>
                        {pending}
                      </span>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", borderRight: "1px solid #e0e0e0" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                        <div style={{
                          width: "100%",
                          maxWidth: "150px",
                          height: "20px",
                          backgroundColor: "#e0e0e0",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: "100%",
                            backgroundColor: isComplete ? "#4caf50" : percentage > 50 ? "#2196f3" : "#ff9800",
                            transition: "width 0.3s ease",
                          }}></div>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#666" }}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <span style={{
                        color: isOverdue ? "#d32f2f" : "#666",
                        fontWeight: isOverdue ? "600" : "normal",
                      }}>
                        {deadline}
                        {isOverdue && <span style={{ display: "block", fontSize: "11px", color: "#d32f2f" }}>⚠️ Overdue</span>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary Stats */}
          <div style={{
            marginTop: "30px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#004a8f" }}>
                {usersProgress.length}
              </div>
              <div style={{ color: "#666", marginTop: "5px" }}>Total Users</div>
            </div>

            <div style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#4caf50" }}>
                {usersProgress.reduce((sum, u) => sum + (u.completed_entries || 0), 0)}
              </div>
              <div style={{ color: "#666", marginTop: "5px" }}>Total Completed Tasks</div>
            </div>

            <div style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ff9800" }}>
                {usersProgress.reduce((sum, u) => sum + ((u.total_entries || 0) - (u.completed_entries || 0)), 0)}
              </div>
              <div style={{ color: "#666", marginTop: "5px" }}>Total Pending Tasks</div>
            </div>

            <div style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#2196f3" }}>
                {usersProgress.filter(u => u.completed_entries >= u.total_entries).length}
              </div>
              <div style={{ color: "#666", marginTop: "5px" }}>Users Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
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
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user-signature/${u.id}`}
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

const ExtendDateModule = ({ refreshUsers }) => {
  const [usersProgress, setUsersProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState({});

  useEffect(() => {
    fetchUsersProgress();
  }, []);

  const fetchUsersProgress = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users-progress`);
      if (res.ok) {
        const data = await res.json();
        setUsersProgress(data);
      }
    } catch (err) {
      console.error("Error fetching users progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async (userId) => {
    const newDate = selectedDates[userId];
    if (!newDate) {
      alert("⚠️ Please select a date first!");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/extend-submission/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEndDate: newDate }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchUsersProgress();
        if (refreshUsers) refreshUsers();
        // Clear the selected date for this user
        setSelectedDates(prev => ({ ...prev, [userId]: "" }));
      } else {
        alert("❌ Failed to extend date: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error extending date:", err);
      alert("❌ Server error");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading users...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>📅 Extend Submission Dates</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Extend the deadline for users who need more time to complete their tasks
      </p>

      {usersProgress.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <thead>
              <tr style={{ backgroundColor: "#004a8f", color: "white" }}>
                <th style={{ padding: "15px", textAlign: "left", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Full Name</th>
                <th style={{ padding: "15px", textAlign: "left", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Username</th>
                <th style={{ padding: "15px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Progress</th>
                <th style={{ padding: "15px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Registration Date</th>
                <th style={{ padding: "15px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Current Deadline</th>
                <th style={{ padding: "15px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)" }}>New Deadline</th>
                <th style={{ padding: "15px", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersProgress.map((u, index) => {
                const isOverdue = u.submission_end_date && new Date() > new Date(u.submission_end_date);
                const currentDeadline = u.submission_end_date ? new Date(u.submission_end_date).toLocaleDateString() : "Not Set";
                
                return (
                  <tr
                    key={u.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <td style={{ padding: "15px", borderRight: "1px solid #e0e0e0" }}>
                      <strong>{u.fullName}</strong>
                    </td>
                    <td style={{ padding: "15px", borderRight: "1px solid #e0e0e0" }}>
                      {u.username}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", borderRight: "1px solid #e0e0e0" }}>
                      <span style={{ color: u.completed_entries >= u.total_entries ? "#4caf50" : "#ff9800", fontWeight: "600" }}>
                        {u.completed_entries || 0} / {u.total_entries || 500}
                      </span>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", borderRight: "1px solid #e0e0e0" }}>
                      {u.registration_date ? new Date(u.registration_date).toLocaleDateString() : "N/A"}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", borderRight: "1px solid #e0e0e0" }}>
                      <span style={{
                        color: isOverdue ? "#d32f2f" : "#666",
                        fontWeight: isOverdue ? "600" : "normal",
                      }}>
                        {currentDeadline}
                        {isOverdue && <span style={{ display: "block", fontSize: "11px", color: "#d32f2f" }}>⚠️ Overdue</span>}
                      </span>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", borderRight: "1px solid #e0e0e0" }}>
                      <input
                        type="date"
                        value={selectedDates[u.id] || ""}
                        onChange={(e) => setSelectedDates(prev => ({ ...prev, [u.id]: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        style={{ 
                          padding: "8px", 
                          borderRadius: "4px", 
                          border: "1px solid #ccc",
                          fontSize: "14px",
                          width: "150px"
                        }}
                      />
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                        onClick={() => handleExtend(u.id)}
                      >
                        Extend
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchUsers = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`)
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${id}`, { method: "DELETE" });
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
        {activeTab === "extend" && <ExtendDateModule refreshUsers={fetchUsers} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
