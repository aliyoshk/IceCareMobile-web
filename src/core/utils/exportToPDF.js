import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportPDF = (columns, rows, title = 'Exported Data') => {
  const doc = new jsPDF();

  // Add title to the PDF
  doc.text(title, 14, 20);

  // Add the table with columns and rows
  doc.autoTable({
    head: [columns],  // Column headers
    body: rows,       // Data rows
    startY: 30,       // Position where the table starts
  });

  // Export the PDF with the given title
  doc.save(`${title}.pdf`);
};