import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const TopNavbar = ({ styles, submissionStatus, user, isSidebarOpen, onToggleSidebar }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  return (
    <header
      style={{
        ...styles.topNavbar,
        flexWrap: "wrap",
        padding: isMobile ? "10px" : "0 20px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: "15px",
          flexWrap: "nowrap",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 1,
            overflow: "hidden",
          }}
        >
          {isMobile && (
            <button
              onClick={onToggleSidebar}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.3s ease",
                flexShrink: 0,
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          )}
          <span
            style={{
              fontSize: isMobile ? "12px" : "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Submission End Date:{" "}
            <strong style={{ color: "#f7941e" }}>{submissionStatus}</strong>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {!isMobile && (
            <span
              style={{
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              Welcome, {user?.fullName || "User"}!
            </span>
          )}
          <img
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0702fb3a-35e7-4f33-b14d-104e1d8c036d.png"
            alt="User Avatar"
            style={{
              ...styles.profileImg,
              width: isMobile ? "32px" : "36px",
              height: isMobile ? "32px" : "36px",
            }}
            onError={(e) =>
              (e.target.src =
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3547847b-b483-42b6-8cc3-22f0fe67430d.png")
            }
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

