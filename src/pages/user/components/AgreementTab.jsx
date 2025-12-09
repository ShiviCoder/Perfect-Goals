import React from "react";
import { Document, Page } from "react-pdf";

const AgreementTab = ({
  pdfURL,
  numPages,
  onDocumentLoadSuccess,
  signatureFile,
  setSignatureFile,
  addSignatureToPDF,
  handleSignatureUpload,
}) => {
  if (!pdfURL) {
    return <p>Loading pdf...</p>;
  }

  return (
    <section>
      <Document
        file={pdfURL}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error("PDF load error:", error)}
      >
        {Array.from(new Array(numPages || 0), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={800}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>

      <div style={{ marginTop: "20px" }}>
        <h3>Draw your signature below:</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSignatureFile(e.target.files[0])}
        />
      </div>
      <button
        onClick={async () => {
          if (!signatureFile) {
            alert("Please draw your signature first!");
            return;
          }
          await addSignatureToPDF(signatureFile);
          await handleSignatureUpload(signatureFile);
        }}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          background: "#0b2f5a",
          color: "#fff",
          borderRadius: "4px",
        }}
      >
        Save & Download PDF
      </button>
    </section>
  );
};

export default AgreementTab;

