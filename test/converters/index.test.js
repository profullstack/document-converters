import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import converters, {
  pdfConverter,
  docConverter,
  excelConverter,
  pptConverter,
  epubConverter,
  markdownConverter
} from '../../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('@profullstack/document-converters', () => {
  describe('Package structure', () => {
    it('should have a package.json file', () => {
      const pkgPath = path.join(__dirname, '../../package.json');
      expect(fs.existsSync(pkgPath)).toBe(true);
      
      const pkgContent = fs.readFileSync(pkgPath, 'utf8');
      const pkg = JSON.parse(pkgContent);
      expect(pkg).toBeTypeOf('object');
      expect(pkg.name).toBe('@profullstack/document-converters');
    });
    
    it('should have a src directory', () => {
      const srcDir = path.join(__dirname, '../../src');
      expect(fs.existsSync(srcDir)).toBe(true);
    });
  });

  describe('Main converters object', () => {
    it('should export the main converters object', () => {
      expect(converters).toBeTypeOf('object');
    });

    it('should export all individual converters', () => {
      expect(pdfConverter).toBeTypeOf('object');
      expect(docConverter).toBeTypeOf('object');
      expect(excelConverter).toBeTypeOf('object');
      expect(pptConverter).toBeTypeOf('object');
      expect(epubConverter).toBeTypeOf('object');
      expect(markdownConverter).toBeTypeOf('object');
    });

    it('should have all conversion methods', () => {
      expect(converters.htmlToPdf).toBeTypeOf('function');
      expect(converters.htmlToDoc).toBeTypeOf('function');
      expect(converters.htmlToExcel).toBeTypeOf('function');
      expect(converters.htmlToPpt).toBeTypeOf('function');
      expect(converters.htmlToEpub).toBeTypeOf('function');
      expect(converters.htmlToMarkdown).toBeTypeOf('function');
      expect(converters.markdownToHtml).toBeTypeOf('function');
    });

    it('should expose individual converters for advanced usage', () => {
      expect(converters.pdf).toBe(pdfConverter);
      expect(converters.doc).toBe(docConverter);
      expect(converters.excel).toBe(excelConverter);
      expect(converters.ppt).toBe(pptConverter);
      expect(converters.epub).toBe(epubConverter);
      expect(converters.markdown).toBe(markdownConverter);
    });
  });
});