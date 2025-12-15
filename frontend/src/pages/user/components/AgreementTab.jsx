import React, { useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import SignatureCanvas from "react-signature-canvas";

const AgreementTab = ({
  pdfURL,
  numPages,
  onDocumentLoadSuccess,
  addSignatureToPDF,
  handleSignatureUpload,
}) => {
  const signatureRef = useRef(null);
  const [signatureData, setSignatureData] = useState(null);
  if (!pdfURL) {
    return <p>Loading pdf...</p>;
  }

  return (
    <section className="agreement-tab-container">
      <div className="agreement-pdf-container">
        <Document
          file={pdfURL}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error("PDF load error:", error)}
        >
          {Array.from(new Array(numPages || 0), (_, index) => {
            // Calculate better responsive width
            const isMobile = window.innerWidth <= 768;
            const sidebarWidth = isMobile ? 0 : 220; // Sidebar width on desktop
            const padding = 40; // Container padding
            const availableWidth = window.innerWidth - sidebarWidth - padding;
            const pdfWidth = Math.min(900, Math.max(400, availableWidth * 0.9)); // Better responsive calculation
            
            return (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={pdfWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            );
          })}
        </Document>
      </div>

      {/* Digital Signature Pad */}
      <div className="signature-section">
        <h3 style={{ 
          color: "#0b2f5a", 
          marginBottom: "15px",
          fontSize: "18px",
          fontWeight: "600"
        }}>
          ✍️ Digital Signature
        </h3>
        
        <p style={{ 
          color: "#666", 
          marginBottom: "15px",
          fontSize: "14px"
        }}>
          Please sign below using your mouse or finger (on touch devices):
        </p>

        {/* Signature Canvas */}
        <div className="signature-canvas-container">
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            canvasProps={{
              width: Math.min(600, Math.max(300, window.innerWidth - 100)), // Better responsive width
              height: 150, // Reduced height from 200 to 150
              className: "signature-canvas"
            }}
            backgroundColor="white"
            onEnd={() => {
              // Save signature data when user finishes drawing
              if (signatureRef.current) {
                const signatureDataURL = signatureRef.current.toDataURL();
                setSignatureData(signatureDataURL);
              }
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              if (signatureRef.current) {
                signatureRef.current.clear();
                setSignatureData(null);
              }
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#5a6268"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#6c757d"}
          >
            🗑️ Clear Signature
          </button>

          <button
            onClick={async () => {
              if (!signatureData || signatureRef.current.isEmpty()) {
                alert("Please draw your signature first!");
                return;
              }

              try {
                // Convert signature to blob for processing
                const canvas = signatureRef.current.getCanvas();
                canvas.toBlob(async (blob) => {
                  if (blob) {
                    // Create a File object from the blob
                    const signatureFile = new File([blob], "signature.png", { type: "image/png" });
                    
                    // Add signature to PDF and upload
                    await addSignatureToPDF(signatureFile);
                    await handleSignatureUpload(signatureFile);
                    
                    alert("✅ Signature added successfully!");
                  }
                }, "image/png");
              } catch (error) {
                console.error("Error processing signature:", error);
                alert("❌ Error processing signature. Please try again.");
              }
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0b2f5a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#083d75"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#0b2f5a"}
          >
            ✅ Save Signature & Update PDF
          </button>
        </div>

        {/* Signature Preview */}
        {signatureData && (
          <div style={{ marginTop: "20px" }}>
            <h4 style={{ color: "#0b2f5a", fontSize: "16px", marginBottom: "10px" }}>
              📋 Signature Preview:
            </h4>
            <div style={{
              border: "1px solid #dee2e6",
              borderRadius: "6px",
              padding: "10px",
              backgroundColor: "white",
              display: "inline-block"
            }}>
              <img 
                src={signatureData} 
                alt="Signature Preview" 
                style={{ 
                  maxWidth: "300px", 
                  maxHeight: "100px",
                  border: "1px solid #e9ecef",
                  borderRadius: "4px"
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AgreementTab;

