import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportExcel = async (columns, rows, title = 'Exported Data') => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);

  // Add column headers to the worksheet
  worksheet.columns = columns.map((col) => ({ header: col, key: col }));

  // Add rows to the worksheet
  rows.forEach((row) => {
    worksheet.addRow(row);
  });

  // Adjust column widths (optional, can be removed or customized)
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : '';
      if (cellValue.length > maxLength) {
        maxLength = cellValue.length;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength;
  });

  // Create Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Save the Excel file using FileSaver
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${title}.xlsx`);
};
