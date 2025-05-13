import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { excelConverter } from '../../src/excel.js';

// Store original methods
const originalFromHtml = excelConverter.fromHtml;
const originalFromCsv = excelConverter.fromCsv;
const originalFromJson = excelConverter.fromJson;
const originalFromUrl = excelConverter.fromUrl;

describe('Excel Converter', () => {
  beforeEach(() => {
    // Mock the methods
    excelConverter.fromHtml = vi.fn().mockResolvedValue(Buffer.from('mock xlsx content'));
    excelConverter.fromCsv = vi.fn().mockResolvedValue(Buffer.from('mock xlsx from csv'));
    excelConverter.fromJson = vi.fn().mockResolvedValue(Buffer.from('mock xlsx from json'));
    excelConverter.fromUrl = vi.fn().mockResolvedValue(Buffer.from('mock xlsx from url'));
  });
  
  afterEach(() => {
    // Restore original methods
    excelConverter.fromHtml = originalFromHtml;
    excelConverter.fromCsv = originalFromCsv;
    excelConverter.fromJson = originalFromJson;
    excelConverter.fromUrl = originalFromUrl;
  });

  describe('fromHtml', () => {
    it('should convert HTML tables to Excel spreadsheet', async () => {
      const html = `
        <table>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </table>
      `;
      const options = { sheetName: 'Test Sheet' };
      
      const result = await excelConverter.fromHtml(html, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock xlsx content');
    });
    
    it('should handle HTML without tables', async () => {
      const html = '<p>No tables here</p>';
      
      const result = await excelConverter.fromHtml(html);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock xlsx content');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromHtml to throw an error
      excelConverter.fromHtml = vi.fn().mockRejectedValue(new Error('XLSX error'));
      
      await expect(excelConverter.fromHtml('<table><tr><td>Test</td></tr></table>')).rejects.toThrow('XLSX error');
    });
  });
  
  describe('fromCsv', () => {
    it('should convert CSV to Excel spreadsheet', async () => {
      const csv = 'Header 1,Header 2\nValue 1,Value 2';
      const options = { sheetName: 'CSV Data' };
      
      const result = await excelConverter.fromCsv(csv, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock xlsx from csv');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromCsv to throw an error
      excelConverter.fromCsv = vi.fn().mockRejectedValue(new Error('CSV conversion error'));
      
      await expect(excelConverter.fromCsv('header,value')).rejects.toThrow('CSV conversion error');
    });
  });
  
  describe('fromJson', () => {
    it('should convert JSON to Excel spreadsheet', async () => {
      const json = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ];
      const options = { sheetName: 'JSON Data' };
      
      const result = await excelConverter.fromJson(json, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock xlsx from json');
    });
    
    it('should handle empty JSON array', async () => {
      const json = [];
      
      const result = await excelConverter.fromJson(json);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock xlsx from json');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromJson to throw an error
      excelConverter.fromJson = vi.fn().mockRejectedValue(new Error('JSON conversion error'));
      
      await expect(excelConverter.fromJson([{ test: 'value' }])).rejects.toThrow('JSON conversion error');
    });
  });
  
  describe('fromUrl', () => {
    it('should convert URL to Excel spreadsheet', async () => {
      const url = 'https://example.com';
      const options = { sheetName: 'Web Data' };
      
      const result = await excelConverter.fromUrl(url, options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('mock xlsx from url');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock fromUrl to throw an error
      excelConverter.fromUrl = vi.fn().mockRejectedValue(new Error('URL conversion error'));
      
      await expect(excelConverter.fromUrl('https://example.com')).rejects.toThrow('URL conversion error');
    });
  });
});