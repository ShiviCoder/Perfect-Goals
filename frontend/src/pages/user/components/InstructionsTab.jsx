import React from "react";
import { Document, Page } from "react-pdf";

const InstructionsTab = ({ numPages, onDocumentLoadSuccess }) => {
  return (
    <div
      style={{
        maxHeight: "90vh", // Increased height to 90% of viewport height
        overflowY: "auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
      }}
    >
      <div style={{ marginBottom: "10px", textAlign: "left" }}>
        <a
          href="/INSTRUCTIONS.pdf"
          download="INSTRUCTIONS.pdf"
          style={{
            padding: "6px 12px",
            backgroundColor: "#0b2f5a",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Download PDF
        </a>
      </div>

      <Document
        file="/INSTRUCTIONS.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error("PDF load error:", error);
        }}
        options={{
          workerSrc:
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js",
        }}
      >
        {Array.from(new Array(numPages || 0), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={Math.min(window.innerWidth - 40, 900)} // Increased width and made responsive
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
};

export default InstructionsTab;

