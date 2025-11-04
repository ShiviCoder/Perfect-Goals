import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function previewPositions(positions = []) {
  // positions = [{ page:0, x, y, w, h, label }]
  const res = await fetch("/Agreement.pdf");
  const existingPdfBytes = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  positions.forEach(pos => {
    const page = pdfDoc.getPages()[pos.page || 0];
    page.drawRectangle({
      x: pos.x,
      y: pos.y,
      width: pos.w || 150,
      height: pos.h || 20,
      color: rgb(1, 0, 0),
      borderColor: rgb(0,0,0),
      borderWidth: 0.5,
      opacity: 0.25,
    });
    page.drawText(pos.label || "marker", {
      x: pos.x + 2,
      y: pos.y + (pos.h ? pos.h - 12 : 6),
      size: 9,
      font,
      color: rgb(0,0,0),
    });
  });

  const bytes = await pdfDoc.save();
  return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
}
