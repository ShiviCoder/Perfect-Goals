import React from "react";
import InfoCards from "../InfoCards";

const DashboardTab = ({ progress, submissionStatus, isMobile }) => {
  return (
    <section
      style={{
        padding: isMobile ? "10px" : "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#3f6272",
          color: "white",
          padding: isMobile ? "8px" : "12px 18px",
          borderRadius: "8px",
          textAlign: "center",
          fontSize: isMobile ? "13px" : "16px",
        }}
      >
        Submission End Date: <strong>{submissionStatus}</strong>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: "15px",
        }}
      >
        {[
          { label: "Total Entry", value: progress.totalEntries },
          { label: "Pending Entry", value: progress.pendingEntries },
          { label: "Completed Entry", value: progress.completedEntries },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : "30%",
              background: "#f7f9fa",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: isMobile ? "13px" : "15px",
                color: "#555",
              }}
            >
              {item.label}
            </label>
            <div
              style={{
                fontSize: isMobile ? "20px" : "26px",
                fontWeight: "bold",
                color: "#3f6272",
                marginTop: "5px",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: isMobile ? "100%" : "48%",
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ marginBottom: "5px", color: "#444c56", fontWeight: 600 }}>
            Total Entry
          </div>

          <div
            style={{
              background: "#eee",
              height: "28px",
              borderRadius: "4px",
              marginBottom: "22px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#3f6272",
                borderRadius: "4px 0 0 4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "12px",
                color: "white",
                fontWeight: 700,
              }}
            >
              {progress.totalEntries}
            </div>
          </div>

          <div style={{ marginBottom: "8px", color: "#678e9f" }}>
            Completed Entry
          </div>
          <div
            style={{
              background: "#eee",
              height: "28px",
              borderRadius: "4px",
              marginBottom: "22px",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                width: `${progress.totalEntries ? (progress.completedEntries / progress.totalEntries) * 100 : 0}%`,
                height: "100%",
                backgroundColor: "#3f6272",
                borderRadius: "4px 0 0 4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "12px",
                color: "white",
                fontWeight: 700,
                transition: "width 0.5s ease",
              }}
            >
              {progress.completedEntries}
            </div>
            <div
              style={{
                flex: 1,
                background: "#ddd",
                borderRadius: "0 4px 4px 0",
              }}
            />
          </div>

          <div style={{ marginBottom: "5px", color: "#444c56" }}>
            Pending Entry
          </div>
          <div
            style={{
              background: "#eee",
              height: "28px",
              borderRadius: "4px",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                width: `${progress.totalEntries ? (progress.pendingEntries / progress.totalEntries) * 100 : 0}%`,
                height: "100%",
                backgroundColor: "#3f6272",
                borderRadius: "4px 0 0 4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "12px",
                color: "white",
                fontWeight: 700,
                transition: "width 0.5s ease",
              }}
            >
              {progress.pendingEntries}
            </div>
            <div
              style={{
                flex: 1,
                background: "#ddd",
                borderRadius: "0 4px 4px 0",
              }}
            />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: isMobile ? "100%" : "48%",
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Placeholder for additional charts or stats */}
        </div>
      </div>

      <InfoCards />
    </section>
  );
};

export default DashboardTab;

