/**
 * Excel Converter Module
 * 
 * A simple API for converting HTML tables to Excel spreadsheets
 */

import { JSDOM } from 'jsdom';
import * as XLSX from 'xlsx';

/**
 * Extract table data from HTML
 * @private
 * @param {string} html - HTML content containing tables
 * @returns {Array<Array<Array<string>>>} Array of tables, each containing rows of cells
 */
const extractTablesFromHtml = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const tables = [];
  
  // Process each table in the HTML
  document.querySelectorAll('table').forEach(table => {
    const tableData = [];
    
    // Process table rows
    table.querySelectorAll('tr').forEach(row => {
      const rowData = [];
      
      // Process cells (both th and td)
      row.querySelectorAll('th, td').forEach(cell => {
        rowData.push(cell.textContent.trim());
      });
      
      if (rowData.length > 0) {
        tableData.push(rowData);
      }
    });
    
    if (tableData.length > 0) {
      tables.push(tableData);
    }
  });
  
  return tables;
};

/**
 * Excel Converter API
 */
export const excelConverter = {
  /**
   * Convert HTML tables to Excel spreadsheet
   * @param {string} html - HTML content containing tables
   * @param {Object} options - Conversion options
   * @param {string} options.sheetPrefix - Prefix for sheet names (default: 'Table')
   * @param {boolean} options.includeStyles - Whether to include basic styling (default: true)
   * @returns {Promise<Buffer>} - Excel file as a buffer
   */
  fromHtml: async (html, options = {}) => {
    try {
      // Default options
      const defaultOptions = {
        sheetPrefix: 'Table',
        includeStyles: true
      };
      
      // Merge options
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Extract tables from HTML
      const tables = extractTablesFromHtml(html);
      
      if (tables.length === 0) {
        throw new Error('No tables found in the HTML content');
      }
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Add each table as a worksheet
      tables.forEach((tableData, index) => {
        // Create worksheet from table data
        const worksheet = XLSX.utils.aoa_to_sheet(tableData);
        
        // Add basic styling if enabled
        if (mergedOptions.includeStyles) {
          // Add header row styling
          const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
          for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
            if (!worksheet[cellRef]) continue;
            
            worksheet[cellRef].s = {
              font: { bold: true },
              fill: { fgColor: { rgb: 'EFEFEF' } }
            };
          }
        }
        
        // Add the worksheet to the workbook
        const sheetName = `${mergedOptions.sheetPrefix} ${index + 1}`;
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });
      
      // Generate Excel file as buffer
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      return excelBuffer;
    } catch (error) {
      throw new Error(`Failed to convert HTML to Excel: ${error.message}`);
    }
  },
  
  /**
   * Convert a URL to Excel spreadsheet
   * @param {string} url - URL to fetch and convert
   * @param {Object} options - Conversion options
   * @returns {Promise<Buffer>} - Excel file as a buffer
   */
  fromUrl: async (url, options = {}) => {
    try {
      // Fetch the URL content
      const response = await fetch(url);
      const html = await response.text();
      
      // Convert the HTML to Excel
      return await excelConverter.fromHtml(html, options);
    } catch (error) {
      throw new Error(`Failed to convert URL to Excel: ${error.message}`);
    }
  },
  
  /**
   * Convert JSON data to Excel spreadsheet
   * @param {Array|Object} data - JSON data to convert
   * @param {Object} options - Conversion options
   * @param {string} options.sheetName - Name for the worksheet (default: 'Data')
   * @returns {Promise<Buffer>} - Excel file as a buffer
   */
  fromJson: async (data, options = {}) => {
    try {
      // Default options
      const defaultOptions = {
        sheetName: 'Data'
      };
      
      // Merge options
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Convert data to worksheet
      let worksheet;
      
      if (Array.isArray(data)) {
        if (data.length === 0) {
          throw new Error('Empty array provided');
        }
        
        if (typeof data[0] === 'object' && data[0] !== null) {
          // Array of objects
          worksheet = XLSX.utils.json_to_sheet(data);
        } else {
          // Simple array
          worksheet = XLSX.utils.aoa_to_sheet([
            ['Value'], // Header
            ...data.map(item => [item]) // Data rows
          ]);
        }
      } else if (typeof data === 'object' && data !== null) {
        // Single object
        worksheet = XLSX.utils.json_to_sheet([data]);
      } else {
        throw new Error('Invalid data format. Expected array or object.');
      }
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, mergedOptions.sheetName);
      
      // Generate Excel file as buffer
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      return excelBuffer;
    } catch (error) {
      throw new Error(`Failed to convert JSON to Excel: ${error.message}`);
    }
  }
};

export default excelConverter;