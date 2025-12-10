import React, { useState, useEffect } from "react";
import '../../../styles/responsive.css';
import ComprehensiveDataEntryForm from "./ComprehensiveDataEntryForm";
import ResumeListView from "./ResumeListView";

// Using simple iframe approach - no pdfjs worker needed

const DataEntryTab = ({ userId, apiBase, onEntryComplete }) => {
  const [viewMode, setViewMode] = useState("list"); // "list" or "work"
  const [resumes, setResumes] = useState([]);
  const [currentResumeIndex, setCurrentResumeIndex] = useState(0);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  // Removed numPages - using iframe approach
  // Removed PDF error handling states - always show iframe
  
  // Removed PDF options - using simple iframe approach
  
  const handleStartWork = (resumeIndex) => {
    setCurrentResumeIndex(resumeIndex);
    setViewMode("work");
  };
  
  const handleBackToList = () => {
    setViewMode("list");
    resetFormData();
  };
  
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
    passport: "",
    hobbies: "",
    languagesKnown: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
    email: "",
    
    // Education - SSC
    sscResult: "",
    sscBoard: "",
    sscPassingYear: "",
    sscDiploma: "",
    
    // Education - HSC
    hscResult: "",
    hscBoard: "",
    hscPassingYear: "",
    hscDiploma: "",
    
    // Education - Graduation
    graduationDegree: "",
    graduationYear: "",
    graduationResult: "",
    graduationUniversity: "",
    
    // Education - Post Graduation
    postGraduationDegree: "",
    postGraduationYear: "",
    postGraduationResult: "",
    postGraduationUniversity: "",
    
    // Higher Education
    higherEducation: "",
    
    // Employment Details
    totalExperienceYears: "",
    totalExperienceMonths: "",
    totalCompaniesWorked: "",
    lastCurrentEmployer: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch resumes from backend
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch(`${apiBase}/api/resumes`);
        if (response.ok) {
          const data = await response.json();
          const resumeIds = data.resumes.map((r) => r.id);
          setResumes(resumeIds);
        } else {
          // Fallback: generate 10 resume IDs for testing
          const resumeIds = Array.from({ length: 10 }, (_, i) => i + 1);
          setResumes(resumeIds);
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
        // Fallback: generate 10 resume IDs for testing
        const resumeIds = Array.from({ length: 10 }, (_, i) => i + 1);
        setResumes(resumeIds);
      }
    };
    fetchResumes();
  }, [apiBase]);

  // Load current resume PDF
  useEffect(() => {
    if (resumes.length > 0 && currentResumeIndex < resumes.length) {
      const resumeId = resumes[currentResumeIndex];
      // Fetch PDF from backend
      const pdfUrl = `${apiBase}/api/resumes/${resumeId}/pdf`;
      console.log(`📄 Loading resume ${resumeId} (Index: ${currentResumeIndex}) from: ${pdfUrl}`);
      setCurrentPdfUrl(pdfUrl);
      // Reset states when changing resume
      setNumPages(null);
      setPdfLoadError(false);
      // Keep iframe as default for stability
      // setUseIframeFallback(false);
    } else {
      console.log(`⚠️ Cannot load resume. Resumes length: ${resumes.length}, Current index: ${currentResumeIndex}`);
    }
  }, [currentResumeIndex, resumes, apiBase]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "NA", // Auto-fill "NA" if empty
    }));
  };

  const resetFormData = () => {
    setFormData({
      firstName: "", middleName: "", lastName: "", dob: "", gender: "", nationality: "",
      maritalStatus: "", passport: "", hobbies: "", languagesKnown: "", address: "",
      landmark: "", city: "", state: "", pincode: "", mobile: "", email: "",
      sscResult: "", sscBoard: "", sscPassingYear: "", sscDiploma: "",
      hscResult: "", hscBoard: "", hscPassingYear: "", hscDiploma: "",
      graduationDegree: "", graduationYear: "", graduationResult: "", graduationUniversity: "",
      postGraduationDegree: "", postGraduationYear: "", postGraduationResult: "", postGraduationUniversity: "",
      higherEducation: "", totalExperienceYears: "", totalExperienceMonths: "",
      totalCompaniesWorked: "", lastCurrentEmployer: "",
    });
  };

  const handleNextResume = () => {
    if (currentResumeIndex < resumes.length - 1) {
      const nextIndex = currentResumeIndex + 1;
      console.log(`Moving to resume ${nextIndex + 1}`);
      setCurrentResumeIndex(nextIndex);
      resetFormData();
    } else {
      alert("You're already on the last resume!");
    }
  };

  const handlePreviousResume = () => {
    if (currentResumeIndex > 0) {
      setCurrentResumeIndex(currentResumeIndex - 1);
      resetFormData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields before submission
      const requiredFields = ['firstName', 'lastName', 'mobile', 'email'];
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === "");
      
      if (missingFields.length > 0) {
        alert(`❌ Please fill in all required fields:\n${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      // Prepare data - replace empty fields with "NA" (except required fields)
      const submissionData = {
        resumeId: resumes[currentResumeIndex],
        userId: userId,
        ...Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [
            key,
            value.trim() === "" ? "NA" : value.trim(),
          ])
        ),
      };

      console.log("📤 Submitting data:", submissionData);

      // Submit to backend
      const response = await fetch(`${apiBase}/api/data-entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.details || "Failed to submit data");
      }

      alert("✅ Data entry submitted successfully!");

      // Refresh progress (backend already updated it in data-entry endpoint)
      if (onEntryComplete) {
        await onEntryComplete();
      }

      // Go back to list view to see updated status
      handleBackToList();
    } catch (error) {
      console.error("Error submitting data:", error);
      console.error("Error details:", error.message);
      alert(`❌ Failed to submit data: ${error.message}\n\nPlease check:\n1. Backend server is running\n2. Database table 'data_entries' exists\n3. All required fields are filled`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed onDocumentLoadSuccess - using iframe approach

  // Show list view or work view based on mode
  if (viewMode === "list") {
    return <ResumeListView userId={userId} apiBase={apiBase} onStartWork={handleStartWork} key={viewMode} />;
  }

  return (
    <>
      {/* Back to List Button */}
      <div style={{ padding: "10px 20px", backgroundColor: "#f5f5f5", borderBottom: "2px solid #e0e0e0" }}>
        <button
          onClick={handleBackToList}
          style={{
            backgroundColor: "#0b2f5a",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ← Back to Resume List
        </button>
      </div>

      <section
        className="data-entry-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "10px",
          minHeight: "calc(100vh - 180px)",
          overflow: "visible",
        }}
      >
        {/* Resume Viewer Section */}
      <div
        className="resume-viewer-section"
        style={{
          flex: "0 0 auto",
          width: "100%",
          height: "500px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        {/* Resume Header */}
        <div
          style={{
            padding: "15px",
            backgroundColor: "#0b2f5a",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
              Resume {currentResumeIndex + 1} of {resumes.length}
            </h3>
            <p className="mobile-only" style={{ margin: "5px 0 0 0", fontSize: "12px", opacity: 0.9, backgroundColor: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px" }}>
              📱 View resume above, fill form below
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handlePreviousResume}
              disabled={currentResumeIndex === 0}
              style={{
                padding: "6px 12px",
                backgroundColor: currentResumeIndex === 0 ? "#ccc" : "#f7941e",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: currentResumeIndex === 0 ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
            >
              Previous
            </button>
            <button
              onClick={handleNextResume}
              disabled={currentResumeIndex === resumes.length - 1}
              style={{
                padding: "6px 12px",
                backgroundColor:
                  currentResumeIndex === resumes.length - 1
                    ? "#ccc"
                    : "#f7941e",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor:
                  currentResumeIndex === resumes.length - 1
                    ? "not-allowed"
                    : "pointer",
                fontSize: "14px",
              }}
            >
              Next
            </button>
          </div>
        </div>

        {/* Resume Viewer */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {/* Always show resume using iframe - no buttons, no error messages */}
          <iframe
            src={currentPdfUrl || `${apiBase}/api/resumes/${currentResumeIndex + 1}/pdf`}
            style={{
              width: "100%",
              height: "100%",
              minHeight: "400px",
              border: "none",
              borderRadius: "4px",
            }}
            title={`Resume ${currentResumeIndex + 1}`}
            onLoad={() => {
              console.log(`✅ Resume ${currentResumeIndex + 1} loaded successfully`);
            }}
            onError={() => {
              console.log(`⚠️ Resume ${currentResumeIndex + 1} failed to load, but iframe is still displayed`);
            }}
          />
        </div>
      </div>

      {/* Data Entry Form Section */}
      <div
        className="form-section"
        style={{
          flex: "1",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Form Header */}
        <div
          style={{
            padding: "15px",
            backgroundColor: "#0b2f5a",
            color: "white",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
            Comprehensive Data Entry Form
          </h3>
          <p
            style={{
              margin: "5px 0 0 0",
              fontSize: "12px",
              opacity: 0.9,
            }}
          >
            Enter "NA" if field is not present in resume
          </p>
        </div>

        {/* Comprehensive Form Component */}
        <ComprehensiveDataEntryForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </section>
    </>
  );
};

export default DataEntryTab;
