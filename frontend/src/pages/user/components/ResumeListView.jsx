import React, { useState, useEffect } from "react";
import "../../../styles/responsive.css";

const ResumeListView = ({ userId, apiBase, onStartWork }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittedResumes, setSubmittedResumes] = useState([]);

  useEffect(() => {
    fetchResumes();
    fetchSubmissionStatus();
  }, []);

  const fetchSubmissionStatus = async () => {
    try {
      const response = await fetch(`${apiBase}/api/resume-status/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSubmittedResumes(data.submittedResumes || []);
      }
    } catch (error) {
      console.error("Error fetching submission status:", error);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await fetch(`${apiBase}/api/resumes`);
      if (response.ok) {
        const data = await response.json();
        const resumeList = data.resumes.map((r) => ({
          id: r.id,
          status: "Not Submitted",
        }));
        setResumes(resumeList);
      } else {
        // Fallback: generate resume list
        const resumeList = Array.from({ length: 500 }, (_, i) => ({
          id: i + 1,
          status: "Not Submitted",
        }));
        setResumes(resumeList);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      // Fallback
      const resumeList = Array.from({ length: 500 }, (_, i) => ({
        id: i + 1,
        status: "Not Submitted",
      }));
      setResumes(resumeList);
    } finally {
      setLoading(false);
    }
  };

  // Check if resume is submitted
  const isSubmitted = (resumeId) => submittedResumes.includes(resumeId);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "24px", marginBottom: "10px" }}>⏳</div>
        <p>Loading resumes...</p>
      </div>
    );
  }

  return (
    <div className="resume-list-container" style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div className="container">
        <h2 className="heading-responsive" style={{ color: "#0b2f5a", marginBottom: "20px", fontWeight: "bold" }}>
          📋 Resume Data Entry Tasks
        </h2>
        
        {/* Warning Message */}
        <div className="resume-list-instruction">
          <span style={{ fontSize: "24px", marginRight: "12px" }}>⚠️</span>
          <strong>Important:</strong> Please fill these forms according to the given resume, otherwise your accuracy will be reduced.
        </div>

        <p className="text-responsive" style={{ marginBottom: "20px", color: "#666" }}>
          Total Resumes: <strong>{resumes.length}</strong>
        </p>

        {/* Table */}
        <div className="resume-table-container">
          <table className="resume-table">
            <thead>
              <tr style={{ backgroundColor: "#d32f2f", color: "white" }}>
                <th style={{ padding: "15px", textAlign: "left", fontSize: "16px", fontWeight: "600", borderRight: "1px solid rgba(255,255,255,0.2)" }}>
                  S.no
                </th>
                <th style={{ padding: "15px", textAlign: "left", fontSize: "16px", fontWeight: "600", borderRight: "1px solid rgba(255,255,255,0.2)" }}>
                  Resume Status
                </th>
                <th style={{ padding: "15px", textAlign: "center", fontSize: "16px", fontWeight: "600" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume, index) => (
                <tr
                  key={resume.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <td style={{ padding: "15px", fontSize: "14px", color: "#333", borderRight: "1px solid #e0e0e0" }}>
                    {resume.id}
                  </td>
                  <td style={{ padding: "15px", fontSize: "14px", color: isSubmitted(resume.id) ? "#4caf50" : "#666", fontWeight: isSubmitted(resume.id) ? "600" : "normal", borderRight: "1px solid #e0e0e0" }}>
                    {isSubmitted(resume.id) ? "✅ Submitted" : "Not Submitted"}
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    {isSubmitted(resume.id) ? (
                      <span style={{ color: "#4caf50", fontWeight: "600" }}>Completed</span>
                    ) : (
                      <button
                        onClick={() => onStartWork(resume.id - 1)} // Pass index (0-based)
                        style={{
                          backgroundColor: "#d32f2f",
                          color: "white",
                          border: "none",
                          padding: "8px 20px",
                          borderRadius: "4px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#b71c1c")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                      >
                        Go To Work &gt;&gt;
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResumeListView;
