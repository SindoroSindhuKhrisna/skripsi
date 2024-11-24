import React from 'react';
import { jsPDF } from 'jspdf';
import { dialog } from '@electron/remote';
import fs from 'fs';
import path from 'path';

const generatePDF = async (cetakNoticeData: any) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set basic document properties
    doc.setFontSize(12);

    // Add title
    doc.setFontSize(16);
    doc.text('Notice Details', 105, 20, { align: 'center' });

    // Reset font size for content
    doc.setFontSize(12);

    // Define starting coordinates
    let y = 40;
    const leftMargin = 20;

    // Function to add a line of text
    const addLine = (label: any, value: any) => {
      doc.text(`${label}: ${value}`, leftMargin, y);
      y += 10;
    };

    // Add all notice data
    addLine('S', cetakNoticeData.s);
    addLine('NP', cetakNoticeData.np);
    addLine('N', cetakNoticeData.n);
    addLine('A', cetakNoticeData.a);
    addLine('J', cetakNoticeData.j);
    addLine('M', cetakNoticeData.m);
    addLine('T', cetakNoticeData.t);
    addLine('W', cetakNoticeData.w);
    addLine('PKB', cetakNoticeData.pkb);
    addLine('PKBD', cetakNoticeData.pkbd);
    addLine('SW', cetakNoticeData.sw);
    addLine('SWD', cetakNoticeData.swd);
    addLine('TOP', cetakNoticeData.top);
    addLine('TOD', cetakNoticeData.tod);
    addLine('TOT', cetakNoticeData.tot);

    // Open save dialog
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save PDF',
      defaultPath: path.join(process.cwd(), 'notice.pdf'),
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    });

    // Write file if a path is selected
    if (filePath) {
      // Convert to binary string
      const pdfOutput = doc.output('arraybuffer');
      
      await fs.promises.writeFile(filePath, Buffer.from(pdfOutput));
      return true;
    }

    return false;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return false;
  }
};

// React component to trigger PDF generation
const CetakNoticeGeneratePDF1 = ({ noticeData }:{ noticeData: any }) => {
  const handleGeneratePDF = async () => {
    const success = await generatePDF(noticeData);
    if (success) {
      alert('PDF generated successfully!');
    } else {
      alert('Failed to generate PDF');
    }
  };

  return (
    <button onClick={handleGeneratePDF}>
      Generate PDF
    </button>
  );
};

// export default CetakNoticeGeneratePDF;

export default async function CetakNoticeGeneratePDF({ noticeData }:{ noticeData: any }) {
    const doc = new jsPDF();

doc.text("Hello world!", 10, 10);
doc.save("a4.pdf");
}