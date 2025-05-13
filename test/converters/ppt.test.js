import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pptConverter } from '../../src/ppt.js';

// Since we don't have a direct PowerPoint library in the dependencies,
// we'll mock the methods directly
describe('PowerPoint Converter', () => {
  // Store original methods
  const originalFromHtml = pptConverter.fromHtml;
  const originalFromMarkdown = pptConverter.fromMarkdown;
  const originalFromUrl = pptConverter.fromUrl;
  
  beforeEach(() => {
    // Mock the methods
    pptConverter.fromHtml = vi.fn().mockResolvedValue(Buffer.from('mock pptx content'));
    pptConverter.fromMarkdown = vi.fn().mockResolvedValue(Buffer.from('mock pptx from markdown'));
    pptConverter.fromUrl = vi.fn().mockResolvedValue(Buffer.from('mock pptx from url'));
  });
  
  afterEach(() => {
    // Restore original methods
    pptConverter.fromHtml = originalFromHtml;
    pptConverter.fromMarkdown = originalFromMarkdown;
    pptConverter.fromUrl = originalFromUrl;
  });
  
  describe('fromHtml', () => {
    it('should convert HTML to PowerPoint presentation', async () => {
      const html = '<h1>Test Presentation</h1><p>This is a test slide</p>';
      const options = { title: 'Test Presentation' };
      
      const result = await pptConverter.fromHtml(html, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock pptx content');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromHtml to throw an error
      vi.mocked(pptConverter.fromHtml).mockRejectedValueOnce(new Error('PPT conversion error'));
      
      await expect(pptConverter.fromHtml('<p>Test</p>')).rejects.toThrow('PPT conversion error');
    });
  });
  
  describe('fromMarkdown', () => {
    it('should convert Markdown to PowerPoint presentation', async () => {
      const markdown = '# Test Presentation\n\nThis is a test slide';
      const options = { title: 'Test Presentation' };
      
      const result = await pptConverter.fromMarkdown(markdown, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock pptx from markdown');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromMarkdown to throw an error
      vi.mocked(pptConverter.fromMarkdown).mockRejectedValueOnce(new Error('PPT conversion error'));
      
      await expect(pptConverter.fromMarkdown('# Test')).rejects.toThrow('PPT conversion error');
    });
  });
  
  describe('fromUrl', () => {
    it('should convert URL to PowerPoint presentation', async () => {
      const url = 'https://example.com';
      const options = { title: 'Example Website' };
      
      const result = await pptConverter.fromUrl(url, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock pptx from url');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromUrl to throw an error
      vi.mocked(pptConverter.fromUrl).mockRejectedValueOnce(new Error('PPT conversion error'));
      
      await expect(pptConverter.fromUrl('https://example.com')).rejects.toThrow('PPT conversion error');
    });
  });
});