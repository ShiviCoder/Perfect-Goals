import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateAgreement({ name, address, signatureDataUrl }) {
  // 1) load template
  const res = await fetch("/Agreement.pdf");
  const existingPdfBytes = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // 2) embed font
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // 3) pages & sizes
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const lastPage = pages[pages.length - 1];
  const { width: pageW, height: pageH } = firstPage.getSize();

  // 4) sanitize input (simple)
  const safeName = (name || "").replace(/\r?\n/g, " ").trim();
  const safeAddress = (address || "").replace(/\r?\n/g, " ").trim();

  // 5) Draw name/address — adjust these y offsets after testing
  // These x,y are relative to bottom-left origin: y = pageH - <distance from top>
  firstPage.drawText(safeName, {
    x: 120,
    y: pageH - 160,   // BETWEEN: adjust up/down
    size: 12,
    font: helvetica,
    color: rgb(0,0,0),
  });

  firstPage.drawText(`M/s. ${safeName}, residing at – ${safeAddress}`, {
    x: 120,
    y: pageH - 220,   // AND/residing at
    size: 11,
    font: helvetica,
    color: rgb(0,0,0),
  });

  firstPage.drawText(`Mr/Ms. ${safeName}`, {
    x: 120,
    y: pageH - 260,   // Mr/Ms. line
    size: 12,
    font: helvetica,
    color: rgb(0,0,0),
  });

  // (Optional) also place name near Witness area on last page — tweak y accordingly
  lastPage.drawText(`Mr/Ms. ${safeName}`, {
    x: 120,
    y: 160, // approx position near signature/witness area — adjust after preview
    size: 12,
    font: helvetica,
    color: rgb(0,0,0),
  });

  // 6) Embed signature image (if provided)
  if (signatureDataUrl) {
    const sigBytes = await fetch(signatureDataUrl).then(r => r.arrayBuffer());
    const sigImage = await pdfDoc.embedPng(sigBytes);

    // scale: keep signature width <= 40% page width
    const maxSigWidth = pageW * 0.4;
    const sigScale = Math.min(1, maxSigWidth / sigImage.width);
    const sigWidth = sigImage.width * sigScale;
    const sigHeight = sigImage.height * sigScale;

    // draw on last page, above "Freelancer Signature:" line — adjust y
    lastPage.drawImage(sigImage, {
      x: 120,
      y: 120, // tweak this to sit above "Freelancer Signature:" text
      width: sigWidth,
      height: sigHeight,
    });
  }

  // 7) save and return URL
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}
