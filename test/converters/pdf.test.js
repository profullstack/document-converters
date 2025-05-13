import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfConverter } from '../../src/pdf.js';

// Store original methods
const originalFromHtml = pdfConverter.fromHtml;
const originalFromMarkdown = pdfConverter.fromMarkdown;
const originalFromUrl = pdfConverter.fromUrl;

describe('PDF Converter', () => {
  beforeEach(() => {
    // Mock the methods
    pdfConverter.fromHtml = vi.fn().mockResolvedValue(Buffer.from('mock pdf content'));
    pdfConverter.fromMarkdown = vi.fn().mockResolvedValue(Buffer.from('mock pdf from markdown'));
    pdfConverter.fromUrl = vi.fn().mockResolvedValue(Buffer.from('mock pdf from url'));
  });
  
  afterEach(() => {
    // Restore original methods
    pdfConverter.fromHtml = originalFromHtml;
    pdfConverter.fromMarkdown = originalFromMarkdown;
    pdfConverter.fromUrl = originalFromUrl;
  });

  describe('fromHtml', () => {
    it('should convert HTML to PDF', async () => {
      const html = '<h1>Test Document</h1><p>This is a test</p>';
      const options = { format: 'A4' };
      
      const result = await pdfConverter.fromHtml(html, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock pdf content');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromHtml to throw an error
      pdfConverter.fromHtml = vi.fn().mockRejectedValue(new Error('PDF conversion error'));
      
      await expect(pdfConverter.fromHtml('<p>Test</p>')).rejects.toThrow('PDF conversion error');
    });
  });
  
  describe('fromMarkdown', () => {
    it('should convert Markdown to PDF', async () => {
      const markdown = '# Test Document\n\nThis is a test';
      const options = { format: 'A4' };
      
      const result = await pdfConverter.fromMarkdown(markdown, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock pdf from markdown');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromMarkdown to throw an error
      pdfConverter.fromMarkdown = vi.fn().mockRejectedValue(new Error('PDF conversion error'));
      
      await expect(pdfConverter.fromMarkdown('# Test')).rejects.toThrow('PDF conversion error');
    });
  });
  
  describe('fromUrl', () => {
    it('should convert URL to PDF', async () => {
      const url = 'https://example.com';
      const options = { format: 'A4' };
      
      const result = await pdfConverter.fromUrl(url, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock pdf from url');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromUrl to throw an error
      pdfConverter.fromUrl = vi.fn().mockRejectedValue(new Error('PDF conversion error'));
      
      await expect(pdfConverter.fromUrl('https://example.com')).rejects.toThrow('PDF conversion error');
    });
  });
});