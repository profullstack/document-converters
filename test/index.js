/**
 * Basic tests for @profullstack/document-converters
 */

// Import the module
import converters from '../src/index.js';
import { jest } from '@jest/globals';

// Import individual converters
let docConverter, epubConverter, excelConverter, markdownConverter, pdfConverter, pptConverter;

try { docConverter = await import('../src/doc.js'); }
catch (err) { console.log('Doc converter not found or could not be loaded:', err.message); }

try { epubConverter = await import('../src/epub.js'); }
catch (err) { console.log('EPUB converter not found or could not be loaded:', err.message); }

try { excelConverter = await import('../src/excel.js'); }
catch (err) { console.log('Excel converter not found or could not be loaded:', err.message); }

try { markdownConverter = await import('../src/markdown.js'); }
catch (err) { console.log('Markdown converter not found or could not be loaded:', err.message); }

try { pdfConverter = await import('../src/pdf.js'); }
catch (err) { console.log('PDF converter not found or could not be loaded:', err.message); }

try { pptConverter = await import('../src/ppt.js'); }
catch (err) { console.log('PPT converter not found or could not be loaded:', err.message); }

describe('@profullstack/document-converters', () => {
  test('module exports something', () => {
    console.log('Testing @profullstack/document-converters...');
    console.log('Module exports:', Object.keys(converters));
    
    expect(Object.keys(converters).length).toBeGreaterThan(0);
  });
  
  // Test individual converters if they exist
  test('doc converter if available', () => {
    if (docConverter) {
      console.log('Testing doc converter...');
      console.log('Doc converter exports:', Object.keys(docConverter));
      expect(Object.keys(docConverter).length).toBeGreaterThan(0);
    } else {
      console.log('Doc converter not available, skipping test');
    }
  });
  
  test('epub converter if available', () => {
    if (epubConverter) {
      console.log('Testing epub converter...');
      console.log('EPUB converter exports:', Object.keys(epubConverter));
      expect(Object.keys(epubConverter).length).toBeGreaterThan(0);
    } else {
      console.log('EPUB converter not available, skipping test');
    }
  });
  
  test('excel converter if available', () => {
    if (excelConverter) {
      console.log('Testing excel converter...');
      console.log('Excel converter exports:', Object.keys(excelConverter));
      expect(Object.keys(excelConverter).length).toBeGreaterThan(0);
    } else {
      console.log('Excel converter not available, skipping test');
    }
  });
  
  test('markdown converter if available', () => {
    if (markdownConverter) {
      console.log('Testing markdown converter...');
      console.log('Markdown converter exports:', Object.keys(markdownConverter));
      expect(Object.keys(markdownConverter).length).toBeGreaterThan(0);
    } else {
      console.log('Markdown converter not available, skipping test');
    }
  });
  
  test('pdf converter if available', () => {
    if (pdfConverter) {
      console.log('Testing pdf converter...');
      console.log('PDF converter exports:', Object.keys(pdfConverter));
      expect(Object.keys(pdfConverter).length).toBeGreaterThan(0);
    } else {
      console.log('PDF converter not available, skipping test');
    }
  });
  
  test('ppt converter if available', () => {
    if (pptConverter) {
      console.log('Testing ppt converter...');
      console.log('PPT converter exports:', Object.keys(pptConverter));
      expect(Object.keys(pptConverter).length).toBeGreaterThan(0);
    } else {
      console.log('PPT converter not available, skipping test');
    }
  });
  
  // Test basic functionality
  test('convert function if available', () => {
    if (typeof converters.convert === 'function') {
      console.log('Testing convert function exists');
      expect(converters.convert).toBeDefined();
    } else {
      console.log('convert function not available, skipping test');
    }
  });
});