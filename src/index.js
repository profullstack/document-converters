/**
 * @profullstack/document-converters
 * 
 * A simple, unified API for converting between various document formats
 */

import { pdfConverter } from './pdf.js';
import { docConverter } from './doc.js';
import { excelConverter } from './excel.js';
import { pptConverter } from './ppt.js';
import { epubConverter } from './epub.js';
import { markdownConverter } from './markdown.js';

/**
 * Main converter object that provides access to all document converters
 */
const converters = {
  /**
   * Convert HTML to PDF
   * @param {string} html - HTML content to convert
   * @param {Object} options - PDF generation options
   * @returns {Promise<Buffer>} - PDF document as a buffer
   */
  htmlToPdf: (html, options = {}) => pdfConverter.fromHtml(html, options),
  
  /**
   * Convert HTML to Word document
   * @param {string} html - HTML content to convert
   * @param {Object} options - Word document generation options
   * @returns {Promise<Buffer>} - Word document as a buffer
   */
  htmlToDoc: (html, options = {}) => docConverter.fromHtml(html, options),
  
  /**
   * Convert HTML to Excel spreadsheet
   * @param {string} html - HTML content to convert (should contain table elements)
   * @param {Object} options - Excel generation options
   * @returns {Promise<Buffer>} - Excel document as a buffer
   */
  htmlToExcel: (html, options = {}) => excelConverter.fromHtml(html, options),
  
  /**
   * Convert HTML to PowerPoint presentation
   * @param {string} html - HTML content to convert
   * @param {Object} options - PowerPoint generation options
   * @returns {Promise<Buffer>} - PowerPoint document as a buffer
   */
  htmlToPpt: (html, options = {}) => pptConverter.fromHtml(html, options),
  
  /**
   * Convert HTML to EPUB e-book
   * @param {string} html - HTML content to convert
   * @param {Object} options - EPUB generation options
   * @returns {Promise<Buffer>} - EPUB document as a buffer
   */
  htmlToEpub: (html, options = {}) => epubConverter.fromHtml(html, options),
  
  /**
   * Convert HTML to Markdown
   * @param {string} html - HTML content to convert
   * @param {Object} options - Markdown generation options
   * @returns {Promise<string>} - Markdown content as a string
   */
  htmlToMarkdown: (html, options = {}) => markdownConverter.fromHtml(html, options),
  
  /**
   * Convert Markdown to HTML
   * @param {string} markdown - Markdown content to convert
   * @param {Object} options - HTML generation options
   * @returns {Promise<string>} - HTML content as a string
   */
  markdownToHtml: (markdown, options = {}) => markdownConverter.toHtml(markdown, options),
  
  // Individual converters for more advanced usage
  pdf: pdfConverter,
  doc: docConverter,
  excel: excelConverter,
  ppt: pptConverter,
  epub: epubConverter,
  markdown: markdownConverter
};

export default converters;
export {
  pdfConverter,
  docConverter,
  excelConverter,
  pptConverter,
  epubConverter,
  markdownConverter
};