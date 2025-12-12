import React, { useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../../../styles/responsive.css';
import ComprehensiveDataEntryForm from "./ComprehensiveDataEntryForm";
import ResumeListView from "./ResumeListView";

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.entry',
  import.meta.url
).toString();

const DataEntryTab = ({ userId, apiBase, onEntryComplete }) => {
  const [viewMode, setViewMode] = useState("list"); // "list" or "work"
  const [resumes, setResumes] = useState([]);
  const [currentResumeIndex, setCurrentResumeIndex] = useState(0);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(true); // Use iframe by default for stability
  const [signatureStatus, setSignatureStatus] = useState(null);
  const [isCheckingSignature, setIsCheckingSignature] = useState(true);
  
  // Memoize PDF options to prevent unnecessary reloads
  const pdfOptions = useMemo(() => ({
    cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/",
  }), []);
  
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

  // Check signature status first
  useEffect(() => {
    const checkSignatureStatus = async () => {
      if (!userId) return;
      
      try {
        setIsCheckingSignature(true);
        const response = await fetch(`${apiBase}/api/signature-status/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setSignatureStatus(data);
        } else if (response.status === 404) {
          // Use existing user endpoint to check signature
          try {
            const userResponse = await fetch(`${apiBase}/api/user/${userId}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              const hasSignature = userData.user && userData.user.signature;
              
              if (hasSignature) {
                // User has signature, allow access (assume approved for now)
                setSignatureStatus({ 
                  signature_status: 'approved', 
                  can_access_data_entry: true,
                  signature_uploaded_at: new Date().toISOString()
                });
              } else {
                // No signature, require signing
                setSignatureStatus({ 
                  signature_status: 'not_signed', 
                  can_access_data_entry: false 
                });
              }
            } else {
              setSignatureStatus({ signature_status: 'not_signed', can_access_data_entry: false });
            }
          } catch (err) {
            console.error("Error checking user signature:", err);
            setSignatureStatus({ signature_status: 'not_signed', can_access_data_entry: false });
          }
        } else {
          console.error("Failed to fetch signature status");
          setSignatureStatus({ signature_status: 'not_signed', can_access_data_entry: false });
        }
      } catch (error) {
        console.error("Error checking signature status:", error);
        setSignatureStatus({ signature_status: 'not_signed', can_access_data_entry: false });
      } finally {
        setIsCheckingSignature(false);
      }
    };

    checkSignatureStatus();
  }, [userId, apiBase]);

  // Fetch resumes from backend (only if signature is approved)
  useEffect(() => {
    if (!signatureStatus?.can_access_data_entry) return;
    
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
  }, [apiBase, signatureStatus]);

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
      setUseIframeFallback(true);
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



  // Check signature status first
  if (isCheckingSignature) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{ fontSize: "24px" }}>⏳</div>
        <p style={{ color: "#666", fontSize: "16px" }}>Checking signature status...</p>
      </div>
    );
  }

  // Show signature required message if not approved
  if (!signatureStatus?.can_access_data_entry) {
    const getStatusMessage = () => {
      switch (signatureStatus?.signature_status) {
        case 'not_signed':
          return {
            icon: "✍️",
            title: "Signature Required",
            message: "Please sign the agreement first to access data entry.",
            action: "Go to Agreement tab to sign"
          };
        case 'pending':
          return {
            icon: "⏳",
            title: "Signature Under Review",
            message: "Your signature is being reviewed by admin.",
            action: "Please wait for admin approval"
          };
        case 'rejected':
          return {
            icon: "❌",
            title: "Signature Rejected",
            message: "Your signature was rejected by admin.",
            action: "Please sign the agreement again"
          };
        default:
          return {
            icon: "⚠️",
            title: "Access Denied",
            message: "Unable to access data entry at this time.",
            action: "Please contact support"
          };
      }
    };

    const status = getStatusMessage();

    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "500px",
        padding: "40px"
      }}>
        <div style={{
          textAlign: "center",
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "2px solid #f7941e",
          maxWidth: "500px"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>{status.icon}</div>
          <h2 style={{ 
            color: "#0b2f5a", 
            marginBottom: "15px",
            fontSize: "24px",
            fontWeight: "600"
          }}>
            {status.title}
          </h2>
          <p style={{ 
            color: "#666", 
            fontSize: "16px", 
            lineHeight: "1.6",
            marginBottom: "20px"
          }}>
            {status.message}
          </p>
          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}>
            <p style={{ 
              color: "#0b2f5a", 
              fontSize: "14px", 
              fontWeight: "500",
              margin: 0
            }}>
              📋 {status.action}
            </p>
          </div>
          
          {signatureStatus?.signature_uploaded_at && (
            <div style={{ marginTop: "20px", fontSize: "12px", color: "#999" }}>
              Signature uploaded: {new Date(signatureStatus.signature_uploaded_at).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show list view or work view based on mode (only if signature is approved)
  if (viewMode === "list") {
    console.log("📋 Rendering ResumeListView...");
    try {
      return <ResumeListView userId={userId} apiBase={apiBase} onStartWork={handleStartWork} key={viewMode} />;
    } catch (error) {
      console.error("❌ Error rendering ResumeListView:", error);
      return <div>Error loading resume list. Please refresh the page.</div>;
    }
  }

  console.log("🔧 Rendering work view...", { currentResumeIndex, currentPdfUrl });
  
  try {
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
          height: "400px", // Reduced height to ensure form is visible
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
          {currentPdfUrl ? (
            useIframeFallback ? (
              // Fallback: Use iframe to display PDF
              <iframe
                src={currentPdfUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "400px",
                  border: "none",
                  borderRadius: "4px",
                }}
                title={`Resume ${currentResumeIndex + 1}`}
                onError={() => {
                  console.error("Iframe failed to load PDF");
                  setPdfLoadError(true);
                }}
              />
            ) : (
              <Document
                key={`pdf-${currentResumeIndex}`}
                file={currentPdfUrl}
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                  setPdfLoadError(false);
                }}
                onLoadError={(error) => {
                  console.error("PDF load error:", error);
                  console.error("Failed URL:", currentPdfUrl);
                  console.error("Error details:", error.message);
                  setPdfLoadError(true);
                  // Try iframe fallback after a short delay
                  setTimeout(() => {
                    setUseIframeFallback(true);
                  }, 1000);
                }}
                loading={
                  <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                    <div style={{ fontSize: "24px", marginBottom: "10px" }}>⏳</div>
                    Loading PDF...
                  </div>
                }
                options={pdfOptions}
              >
                {numPages ? (
                  Array.from(new Array(numPages), (_, index) => (
                    <Page
                      key={`page_${currentResumeIndex}_${index + 1}`}
                      pageNumber={index + 1}
                      width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 40, 600) : 600}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      onLoadError={(error) => {
                        console.error(`Error loading page ${index + 1}:`, error);
                      }}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                    <div style={{ fontSize: "24px", marginBottom: "10px" }}>⏳</div>
                    Loading pages...
                  </div>
                )}
              </Document>
            )
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#666",
                textAlign: "center",
                padding: "40px",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "20px",
                }}
              >
                📄
              </div>
              <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                Resume {currentResumeIndex + 1}
              </h3>
              {pdfLoadError ? (
                <div>
                  <p style={{ margin: "0 0 15px 0", color: "#d32f2f", lineHeight: "1.6" }}>
                    <strong>Failed to load PDF</strong>
                  </p>
                  <div style={{ marginBottom: "15px" }}>
                    <button
                      onClick={() => {
                        setUseIframeFallback(true);
                        setPdfLoadError(false);
                      }}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#0b2f5a",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    >
                      Try Alternative Viewer
                    </button>
                    <a
                      href={currentPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#f7941e",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                        display: "inline-block",
                      }}
                    >
                      Open in New Tab
                    </a>
                  </div>
                  <p style={{ margin: 0, color: "#666", fontSize: "12px", lineHeight: "1.6" }}>
                    Make sure:
                    <br />• Backend server is running on {apiBase}
                    <br />• File exists: <code>backend/resumes/resume_{currentResumeIndex + 1}.pdf</code>
                    <br />• Check browser console (F12) for detailed errors
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0, color: "#666", lineHeight: "1.6" }}>
                  <strong>Resume PDF not found</strong>
                  <br />
                  <br />
                  Please add <code style={{ backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: "3px" }}>
                    resume_{currentResumeIndex + 1}.pdf
                  </code> to the <code style={{ backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: "3px" }}>
                    backend/resumes/
                  </code> folder.
                  <br />
                  <br />
                  <small style={{ color: "#999" }}>
                    See backend/resumes/README.md for instructions
                  </small>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Data Entry Form Section */}
      <div
        className="form-section"
        style={{
          flex: "1",
          width: "100%",
          minHeight: "600px", // Ensure minimum height for form visibility
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "visible", // Changed from hidden to visible
          border: "2px solid #f7941e", // Debug border to make form visible
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
        {console.log("🔧 Rendering ComprehensiveDataEntryForm with formData:", formData)}
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
  } catch (error) {
    console.error("❌ Error rendering DataEntryTab work view:", error);
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Something went wrong</h3>
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }
};

export default DataEntryTab;
