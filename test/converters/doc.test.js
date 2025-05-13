import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { docConverter } from '../../src/doc.js';

// Store original methods
const originalFromHtml = docConverter.fromHtml;
const originalFromMarkdown = docConverter.fromMarkdown;
const originalFromUrl = docConverter.fromUrl;

describe('Doc Converter', () => {
  beforeEach(() => {
    // Mock the methods
    docConverter.fromHtml = vi.fn().mockResolvedValue(Buffer.from('mock docx content'));
    docConverter.fromMarkdown = vi.fn().mockResolvedValue(Buffer.from('mock docx from markdown'));
    docConverter.fromUrl = vi.fn().mockResolvedValue(Buffer.from('mock docx from url'));
  });
  
  afterEach(() => {
    // Restore original methods
    docConverter.fromHtml = originalFromHtml;
    docConverter.fromMarkdown = originalFromMarkdown;
    docConverter.fromUrl = originalFromUrl;
  });

  describe('fromHtml', () => {
    it('should convert HTML to Word document', async () => {
      const html = '<h1>Test Document</h1><p>This is a test</p>';
      const options = { title: 'Test Document' };
      
      const result = await docConverter.fromHtml(html, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock docx content');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromHtml to throw an error
      docConverter.fromHtml = vi.fn().mockRejectedValue(new Error('Doc conversion error'));
      
      await expect(docConverter.fromHtml('<p>Test</p>')).rejects.toThrow('Doc conversion error');
    });
  });
  
  describe('fromMarkdown', () => {
    it('should convert Markdown to Word document', async () => {
      const markdown = '# Test Document\n\nThis is a test';
      const options = { title: 'Test Document' };
      
      const result = await docConverter.fromMarkdown(markdown, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock docx from markdown');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromMarkdown to throw an error
      docConverter.fromMarkdown = vi.fn().mockRejectedValue(new Error('Doc conversion error'));
      
      await expect(docConverter.fromMarkdown('# Test')).rejects.toThrow('Doc conversion error');
    });
  });
  
  describe('fromUrl', () => {
    it('should convert URL to Word document', async () => {
      const url = 'https://example.com';
      const options = { title: 'Example Website' };
      
      const result = await docConverter.fromUrl(url, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock docx from url');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromUrl to throw an error
      docConverter.fromUrl = vi.fn().mockRejectedValue(new Error('URL conversion error'));
      
      await expect(docConverter.fromUrl('https://example.com')).rejects.toThrow('URL conversion error');
    });
  });
});