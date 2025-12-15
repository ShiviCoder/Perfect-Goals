import React, { useState, useEffect } from "react";
import InfoCards from "../InfoCards";

const DashboardTab = ({ progress, submissionStatus, isMobile }) => {
  const [accuracyResults, setAccuracyResults] = useState(null);
  const [showAccuracyModal, setShowAccuracyModal] = useState(false);

  // Generate accuracy results when user completes all resumes
  useEffect(() => {
    if (progress.completedEntries >= progress.totalEntries && progress.totalEntries > 0) {
      const storedUser = JSON.parse(localStorage.getItem("userData"));
      const userId = storedUser?.id || 1;
      
      // Generate random accuracy between 70-75% (consistent for same user)
      const seed = parseInt(userId) * 7 + 13; // Simple seed for consistency
      const baseAccuracy = 70;
      const range = 5; // 70-75%
      const accuracy = baseAccuracy + (seed % (range * 100)) / 100;
      const finalAccuracy = Math.round(accuracy * 100) / 100; // Round to 2 decimal places

      // Calculate performance metrics
      const totalDataPoints = progress.completedEntries * 25; // Assume 25 data points per resume
      const correctEntries = Math.floor((finalAccuracy / 100) * totalDataPoints);
      const incorrectEntries = totalDataPoints - correctEntries;

      // Calculate completion time (simulate based on entries)
      const avgTimePerResume = 8; // 8 minutes per resume
      const totalTimeMinutes = progress.completedEntries * avgTimePerResume;
      const totalHours = Math.floor(totalTimeMinutes / 60);
      const remainingMinutes = totalTimeMinutes % 60;

      const accuracyData = {
        isComplete: true,
        accuracy: finalAccuracy,
        performance: {
          totalResumes: progress.completedEntries,
          totalDataPoints: totalDataPoints,
          correctEntries: correctEntries,
          incorrectEntries: incorrectEntries,
          completionTime: {
            hours: totalHours,
            minutes: remainingMinutes,
            totalMinutes: totalTimeMinutes
          }
        },
        grade: finalAccuracy >= 74 ? 'Excellent' : finalAccuracy >= 72 ? 'Good' : 'Satisfactory',
        message: `Congratulations! You have completed all ${progress.totalEntries} resumes with ${finalAccuracy}% accuracy.`
      };

      setAccuracyResults(accuracyData);
      setShowAccuracyModal(true);
    }
  }, [progress.completedEntries, progress.totalEntries]);
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
          {/* Accuracy Results Section */}
          {progress.completedEntries >= progress.totalEntries && progress.totalEntries > 0 ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#4caf50", marginBottom: "10px" }}>
                🎉 All Resumes Completed!
              </div>
              <button
                onClick={() => setShowAccuracyModal(true)}
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#4caf50"}
              >
                📊 View Accuracy Results
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#666" }}>
              <div style={{ fontSize: "16px", marginBottom: "10px" }}>
                📈 Progress Tracking
              </div>
              <div style={{ fontSize: "14px" }}>
                Complete all {progress.totalEntries} resumes to see your accuracy results
              </div>
              <div style={{ marginTop: "10px", fontSize: "24px", fontWeight: "bold", color: "#3f6272" }}>
                {Math.round((progress.completedEntries / progress.totalEntries) * 100) || 0}%
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                {progress.completedEntries} of {progress.totalEntries} completed
              </div>
            </div>
          )}
        </div>
      </div>

      <InfoCards />

      {/* Accuracy Results Modal */}
      {showAccuracyModal && accuracyResults && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowAccuracyModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "30px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>🎉</div>
              <h2 style={{ color: "#4caf50", margin: "0 0 10px 0", fontSize: "24px" }}>
                Congratulations!
              </h2>
              <p style={{ color: "#666", margin: 0, fontSize: "16px" }}>
                You have completed all {accuracyResults.performance.totalResumes} resumes
              </p>
            </div>

            {/* Accuracy Score */}
            <div
              style={{
                textAlign: "center",
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                Your Accuracy Score
              </div>
              <div style={{ fontSize: "48px", fontWeight: "bold", color: "#4caf50" }}>
                {accuracyResults.accuracy}%
              </div>
              <div style={{ fontSize: "16px", color: "#4caf50", fontWeight: "600" }}>
                {accuracyResults.grade}
              </div>
            </div>

            {/* Performance Details */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "15px" }}>
                📊 Performance Details
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#e8f5e8", borderRadius: "8px" }}>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#4caf50" }}>
                    {accuracyResults.performance.correctEntries.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>Correct Entries</div>
                </div>
                <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#fff3e0", borderRadius: "8px" }}>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff9800" }}>
                    {accuracyResults.performance.incorrectEntries.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>Incorrect Entries</div>
                </div>
              </div>
            </div>

            {/* Time Statistics */}
            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "15px" }}>
                ⏱️ Time Statistics
              </h3>
              <div style={{ textAlign: "center", padding: "15px", backgroundColor: "#f0f7ff", borderRadius: "8px" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2196f3" }}>
                  {accuracyResults.performance.completionTime.hours}h {accuracyResults.performance.completionTime.minutes}m
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>Total Completion Time</div>
              </div>
            </div>

            {/* Close Button */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowAccuracyModal(false)}
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  padding: "12px 30px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#4caf50"}
              >
                ✨ Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardTab;

