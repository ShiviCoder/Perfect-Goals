import os
import requests
from pathlib import Path

# Create resumes directory
resumes_dir = Path("resumes")
resumes_dir.mkdir(exist_ok=True)

print("📥 Downloading sample resumes from public sources...")

# Sample resume URLs (you can add more)
sample_urls = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    # Add more public resume URLs here
]

# For testing, we'll create simple text-based PDFs
# You can replace this with actual resume downloads

print("✅ Creating sample resumes...")
for i in range(1, 501):
    filename = f"resume_{i}.pdf"
    filepath = resumes_dir / filename
    
    # Create a simple PDF (you can replace with actual downloads)
    with open(filepath, 'wb') as f:
        # Minimal valid PDF
        pdf_content = f"""%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj
4 0 obj<</Length 44>>stream
BT /F1 12 Tf 100 700 Td (Resume {i}) Tj ET
endstream endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000052 00000 n
0000000101 00000 n
0000000189 00000 n
trailer<</Size 5/Root 1 0 R>>
startxref
283
%%EOF"""
        f.write(pdf_content.encode())
    
    if i % 50 == 0:
        print(f"✅ Created {i}/500 resumes...")

print("🎉 Done! All 500 resumes created!")
print(f"📂 Location: {resumes_dir.absolute()}")
