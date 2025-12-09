import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create resumes directory if it doesn't exist
const resumesDir = path.join(__dirname, 'resumes');
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

// Simple PDF header (minimal valid PDF)
const createSimplePDF = (resumeNumber) => {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 120
>>
stream
BT
/F1 24 Tf
100 700 Td
(Sample Resume ${resumeNumber}) Tj
0 -30 Td
(Name: John Doe ${resumeNumber}) Tj
0 -30 Td
(Email: john${resumeNumber}@example.com) Tj
0 -30 Td
(Phone: +1-555-${String(resumeNumber).padStart(4, '0')}) Tj
0 -30 Td
(Experience: ${Math.floor(Math.random() * 10) + 1} years) Tj
0 -30 Td
(Skills: JavaScript, React, Node.js) Tj
0 -30 Td
(Education: Bachelor's Degree) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000317 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
487
%%EOF`;
};

// Generate 500 sample resumes
console.log('🚀 Generating 500 sample resume PDFs...');
console.log(`📁 Output directory: ${resumesDir}`);

for (let i = 1; i <= 500; i++) {
  const pdfContent = createSimplePDF(i);
  const filePath = path.join(resumesDir, `resume_${i}.pdf`);
  fs.writeFileSync(filePath, pdfContent);
  
  if (i % 50 === 0) {
    console.log(`✅ Generated ${i}/500 resumes...`);
  }
}

console.log('🎉 Done! All 500 sample resumes created successfully!');
console.log(`📂 Location: ${resumesDir}`);
