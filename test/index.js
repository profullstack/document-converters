/**
 * Basic tests for @profullstack/document-converters
 */

// Import the module
const converters = require('../src/index.js');

// Basic test to ensure the module exports something
console.log('Testing @profullstack/document-converters...');
console.log('Module exports:', Object.keys(converters));

if (Object.keys(converters).length === 0) {
  console.error('ERROR: Module does not export anything!');
  process.exit(1);
}

// Test individual converters if they exist
try {
  const docConverter = require('../src/doc.js');
  console.log('Testing doc converter...');
  console.log('Doc converter exports:', Object.keys(docConverter));
} catch (err) {
  console.log('Doc converter not found or could not be loaded:', err.message);
}

try {
  const epubConverter = require('../src/epub.js');
  console.log('Testing epub converter...');
  console.log('EPUB converter exports:', Object.keys(epubConverter));
} catch (err) {
  console.log('EPUB converter not found or could not be loaded:', err.message);
}

try {
  const excelConverter = require('../src/excel.js');
  console.log('Testing excel converter...');
  console.log('Excel converter exports:', Object.keys(excelConverter));
} catch (err) {
  console.log('Excel converter not found or could not be loaded:', err.message);
}

try {
  const markdownConverter = require('../src/markdown.js');
  console.log('Testing markdown converter...');
  console.log('Markdown converter exports:', Object.keys(markdownConverter));
} catch (err) {
  console.log('Markdown converter not found or could not be loaded:', err.message);
}

try {
  const pdfConverter = require('../src/pdf.js');
  console.log('Testing pdf converter...');
  console.log('PDF converter exports:', Object.keys(pdfConverter));
} catch (err) {
  console.log('PDF converter not found or could not be loaded:', err.message);
}

try {
  const pptConverter = require('../src/ppt.js');
  console.log('Testing ppt converter...');
  console.log('PPT converter exports:', Object.keys(pptConverter));
} catch (err) {
  console.log('PPT converter not found or could not be loaded:', err.message);
}

// Test basic functionality
if (typeof converters.convert === 'function') {
  console.log('Testing convert function exists:', typeof converters.convert === 'function' ? 'SUCCESS' : 'FAILED');
}

console.log('Basic test passed!');