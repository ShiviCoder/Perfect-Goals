import React from "react";

const ProfileTab = ({
  user,
  profileSubTab,
  setProfileSubTab,
  setUser,
  apiBase,
  onLogout,
}) => {
  return (
    <section style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        <button
          onClick={() => setProfileSubTab("overview")}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor:
              profileSubTab === "overview" ? "#0b2f5a" : "#f0f0f0",
            color: profileSubTab === "overview" ? "white" : "#333",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setProfileSubTab("editProfile")}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor:
              profileSubTab === "editProfile" ? "#0b2f5a" : "#f0f0f0",
            color: profileSubTab === "editProfile" ? "white" : "#333",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Edit Profile
        </button>
        <button
          onClick={() => setProfileSubTab("logout")}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor:
              profileSubTab === "logout" ? "#0b2f5a" : "#f0f0f0",
            color: profileSubTab === "logout" ? "white" : "#333",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </div>

      {(!profileSubTab || profileSubTab === "overview") && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f1f4f8",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgb(0 0 0 / 10%)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "12px",
              color: "#0b2f5a",
            }}
          >
            Profile Overview
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.6",
              color: "#333",
              marginBottom: "20px",
            }}
          >
            Welcome, {user?.fullName}!
          </p>

          <div style={{ display: "grid", gap: "10px" }}>
            <div>
              <strong>Full Name:</strong> {user?.fullName}
            </div>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
            <div>
              <strong>Contact:</strong> {user?.contactNumber}
            </div>
            <div>
              <strong>Address:</strong> {user?.address}
            </div>
            {user?.accountNumber && (
              <div>
                <strong>Account Number:</strong> {user.accountNumber}
              </div>
            )}
            {user?.bankName && (
              <div>
                <strong>Bank Name:</strong> {user.bankName}
              </div>
            )}
            {user?.branchName && (
              <div>
                <strong>Branch Name:</strong> {user.branchName}
              </div>
            )}
            {user?.ifscCode && (
              <div>
                <strong>IFSC Code:</strong> {user.ifscCode}
              </div>
            )}
          </div>
        </div>
      )}

      {profileSubTab === "editProfile" && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f1f4f8",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgb(0 0 0 / 10%)",
            maxWidth: "500px",
          }}
        >
          <h2 style={{ marginBottom: "16px", color: "#0b2f5a" }}>
            Edit Profile
          </h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const updatedData = {
                accountNumber: e.target.accountNumber.value,
                bankName: e.target.bankName.value,
                branchName: e.target.branchName.value,
                ifscCode: e.target.ifscCode.value,
              };
              try {
                const response = await fetch(
                  `${apiBase}/api/user/${user.id}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedData),
                  }
                );
                if (!response.ok) throw new Error("Update failed");
                const data = await response.json();
                setUser(data.user);
                alert("Profile updated successfully!");
                setProfileSubTab("overview");
              } catch (err) {
                console.error(err);
                alert("Failed to update profile");
              }
            }}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: 600, marginBottom: "4px" }}>
                Full Name:
              </label>
              <input
                type="text"
                name="fullName"
                defaultValue={user?.fullName}
                readOnly
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "#e0e0e0",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: 600, marginBottom: "4px" }}>
                Email:
              </label>
              <input
                type="email"
                name="email"
                defaultValue={user?.email}
                readOnly
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "#e0e0e0",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: 600, marginBottom: "4px" }}>
                Account Number:
              </label>
              <input
                type="text"
                name="accountNumber"
                defaultValue={user?.accountNumber || ""}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: 600, marginBottom: "4px" }}>
                Bank Name:
              </label>
              <input
                type="text"
                name="bankName"
                defaultValue={user?.bankName || ""}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: 600, marginBottom: "4px" }}>
                Branch Name:
              </label>
              <input
                type="text"
                name="branchName"
                defaultValue={user?.branchName || ""}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: 600, marginBottom: "4px" }}>
                IFSC Code:
              </label>
              <input
                type="text"
                name="ifscCode"
                defaultValue={user?.ifscCode || ""}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "10px 16px",
                backgroundColor: "#0b2f5a",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {profileSubTab === "logout" && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f1f4f8",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgb(0 0 0 / 10%)",
            maxWidth: "400px",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <p style={{ margin: "4px 0", fontWeight: 600, color: "#0b2f5a" }}>
              Name: {user?.fullName || "User"}
            </p>
            <p style={{ margin: "4px 0", fontWeight: 500, color: "#222" }}>
              Email: {user?.email || "user@example.com"}
            </p>
          </div>

          <p style={{ marginBottom: "16px", color: "#222" }}>
            Are you sure you want to logout?
          </p>

          <button
            onClick={onLogout}
            style={{
              padding: "10px 16px",
              backgroundColor: "#f7941e",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Confirm Logout
          </button>
        </div>
      )}
    </section>
  );
};

export default ProfileTab;

