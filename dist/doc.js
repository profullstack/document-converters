/**
 * Word Document Converter Module
 * 
 * A simple API for converting HTML content to Word documents
 * Provides both pandoc-based and pure JavaScript implementations
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import { JSDOM } from 'jsdom';

const execPromise = promisify(exec);

/**
 * Check if pandoc is installed
 * @private
 * @returns {Promise<boolean>} True if pandoc is available
 */
const isPandocAvailable = async () => {
  try {
    await execPromise('pandoc --version');
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Convert HTML to Word document using pandoc
 * @private
 * @param {string} html - HTML content to convert
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} Word document as a buffer
 */
const convertWithPandoc = async (html, options = {}) => {
  // Create temporary files for input and output
  const tempDir = os.tmpdir();
  const inputId = uuidv4();
  const outputId = uuidv4();
  const inputPath = path.join(tempDir, `${inputId}.html`);
  const outputPath = path.join(tempDir, `${outputId}.docx`);
  
  try {
    // Write HTML to temporary file
    await fs.promises.writeFile(inputPath, html, 'utf8');
    
    // Build pandoc command with options
    let command = `pandoc -f html -t docx "${inputPath}" -o "${outputPath}"`;
    
    // Add any additional pandoc options
    if (options.pandocOptions) {
      command += ` ${options.pandocOptions}`;
    }
    
    // Execute pandoc command
    await execPromise(command);
    
    // Read the generated DOCX file
    const docBuffer = await fs.promises.readFile(outputPath);
    
    return docBuffer;
  } finally {
    // Clean up temporary files
    try {
      if (fs.existsSync(inputPath)) {
        await fs.promises.unlink(inputPath);
      }
      if (fs.existsSync(outputPath)) {
        await fs.promises.unlink(outputPath);
      }
    } catch (cleanupError) {
      console.warn('Error cleaning up temporary files:', cleanupError);
    }
  }
};

/**
 * Convert HTML to Word document using docx library
 * @private
 * @param {string} html - HTML content to convert
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} Word document as a buffer
 */
const convertWithDocx = async (html, options = {}) => {
  // Parse HTML using jsdom
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Create a new Word document
  const doc = new Document({
    title: options.title || 'Document',
    description: options.description || 'Generated document',
    styles: {
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 28,
            bold: true,
            color: '000000',
          },
          paragraph: {
            spacing: {
              after: 120,
            },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 24,
            bold: true,
            color: '000000',
          },
          paragraph: {
            spacing: {
              after: 120,
            },
          },
        },
      ],
    },
  });
  
  // Extract content from HTML and convert to docx format
  const paragraphs = [];
  
  // Process headings
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    const level = parseInt(heading.tagName.substring(1));
    paragraphs.push(
      new Paragraph({
        text: heading.textContent,
        heading: level <= 2 ? `Heading${level}` : undefined,
        bold: true,
        size: 28 - (level - 1) * 2,
      })
    );
  });
  
  // Process paragraphs
  document.querySelectorAll('p').forEach(p => {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun(p.textContent)],
      })
    );
  });
  
  // Add paragraphs to document
  doc.addSection({
    properties: {},
    children: paragraphs,
  });
  
  // Generate Word document buffer
  return await Packer.toBuffer(doc);
};

/**
 * Word Document Converter API
 */
export const docConverter = {
  /**
   * Convert HTML content to Word document
   * @param {string} html - HTML content to convert
   * @param {Object} options - Conversion options
   * @param {boolean} options.forcePandoc - Force using pandoc even if docx is available
   * @param {boolean} options.forceDocx - Force using docx library even if pandoc is available
   * @param {string} options.pandocOptions - Additional pandoc command line options
   * @returns {Promise<Buffer>} - Word document as a buffer
   */
  fromHtml: async (html, options = {}) => {
    try {
      // Check if pandoc is available
      const pandocAvailable = await isPandocAvailable();
      
      // Determine which conversion method to use
      if (options.forceDocx || !pandocAvailable) {
        return await convertWithDocx(html, options);
      } else {
        return await convertWithPandoc(html, options);
      }
    } catch (error) {
      console.error('Error generating Word document:', error);
      
      // If the primary method fails, try the fallback method
      try {
        if (error.message.includes('pandoc')) {
          console.log('Falling back to docx library');
          return await convertWithDocx(html, options);
        } else {
          console.log('Falling back to pandoc');
          return await convertWithPandoc(html, options);
        }
      } catch (fallbackError) {
        throw new Error(`Failed to generate Word document: ${fallbackError.message}`);
      }
    }
  },
  
  /**
   * Convert a URL to Word document
   * @param {string} url - URL to convert
   * @param {Object} options - Conversion options
   * @returns {Promise<Buffer>} - Word document as a buffer
   */
  fromUrl: async (url, options = {}) => {
    try {
      // Fetch the URL content
      const response = await fetch(url);
      const html = await response.text();
      
      // Convert the HTML to Word
      return await docConverter.fromHtml(html, options);
    } catch (error) {
      throw new Error(`Failed to convert URL to Word document: ${error.message}`);
    }
  },
  
  /**
   * Convert Markdown to Word document
   * @param {string} markdown - Markdown content to convert
   * @param {Object} options - Conversion options
   * @returns {Promise<Buffer>} - Word document as a buffer
   */
  fromMarkdown: async (markdown, options = {}) => {
    try {
      // If pandoc is available, use it directly for markdown to docx
      const pandocAvailable = await isPandocAvailable();
      
      if (pandocAvailable && !options.forceDocx) {
        // Create temporary files for input and output
        const tempDir = os.tmpdir();
        const inputId = uuidv4();
        const outputId = uuidv4();
        const inputPath = path.join(tempDir, `${inputId}.md`);
        const outputPath = path.join(tempDir, `${outputId}.docx`);
        
        try {
          // Write markdown to temporary file
          await fs.promises.writeFile(inputPath, markdown, 'utf8');
          
          // Build pandoc command with options
          let command = `pandoc -f markdown -t docx "${inputPath}" -o "${outputPath}"`;
          
          // Add any additional pandoc options
          if (options.pandocOptions) {
            command += ` ${options.pandocOptions}`;
          }
          
          // Execute pandoc command
          await execPromise(command);
          
          // Read the generated DOCX file
          return await fs.promises.readFile(outputPath);
        } finally {
          // Clean up temporary files
          try {
            if (fs.existsSync(inputPath)) {
              await fs.promises.unlink(inputPath);
            }
            if (fs.existsSync(outputPath)) {
              await fs.promises.unlink(outputPath);
            }
          } catch (cleanupError) {
            console.warn('Error cleaning up temporary files:', cleanupError);
          }
        }
      } else {
        // Convert markdown to HTML first, then to Word
        const { marked } = await import('marked');
        const html = marked(markdown);
        return await docConverter.fromHtml(html, options);
      }
    } catch (error) {
      throw new Error(`Failed to convert Markdown to Word document: ${error.message}`);
    }
  }
};

export default docConverter;