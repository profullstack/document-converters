/**
 * PowerPoint Converter Module
 * 
 * A simple API for converting HTML content to PowerPoint presentations
 */

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

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
 * Convert HTML to PowerPoint using pandoc
 * @private
 * @param {string} html - HTML content to convert
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} PowerPoint presentation as a buffer
 */
const convertWithPandoc = async (html, options = {}) => {
  // Create temporary files for input and output
  const tempDir = os.tmpdir();
  const inputId = uuidv4();
  const outputId = uuidv4();
  const inputPath = path.join(tempDir, `${inputId}.html`);
  const outputPath = path.join(tempDir, `${outputId}.pptx`);
  
  try {
    // Write HTML to temporary file
    await fs.promises.writeFile(inputPath, html, 'utf8');
    
    // Build pandoc command with options
    let command = `pandoc -f html -t pptx "${inputPath}" -o "${outputPath}"`;
    
    // Add any additional pandoc options
    if (options.pandocOptions) {
      command += ` ${options.pandocOptions}`;
    }
    
    // Execute pandoc command
    await execPromise(command);
    
    // Read the generated PPTX file
    const pptBuffer = await fs.promises.readFile(outputPath);
    
    return pptBuffer;
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
 * Extract slides from HTML
 * @private
 * @param {string} html - HTML content to extract slides from
 * @returns {Array<Object>} Array of slide objects
 */
const extractSlidesFromHtml = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const slides = [];
  
  // Look for slide dividers in the HTML
  // This implementation assumes slides are separated by h1 or div.slide elements
  
  // First try to find explicit slide divs
  const slideElements = document.querySelectorAll('div.slide, section.slide');
  
  if (slideElements.length > 0) {
    // Process explicit slide elements
    slideElements.forEach(slideElement => {
      const title = slideElement.querySelector('h1, h2')?.textContent || 'Slide';
      const content = slideElement.innerHTML;
      
      slides.push({
        title,
        content
      });
    });
  } else {
    // If no explicit slides, try to split by h1 elements
    const h1Elements = document.querySelectorAll('h1');
    
    if (h1Elements.length > 0) {
      h1Elements.forEach((h1, index) => {
        const title = h1.textContent;
        let content = '';
        
        // Get all elements between this h1 and the next h1
        let currentElement = h1.nextElementSibling;
        while (currentElement && currentElement.tagName !== 'H1') {
          content += currentElement.outerHTML;
          currentElement = currentElement.nextElementSibling;
        }
        
        slides.push({
          title,
          content: `<h1>${title}</h1>${content}`
        });
      });
    } else {
      // If no h1 elements, create a single slide with all content
      const title = document.querySelector('title')?.textContent || 'Presentation';
      slides.push({
        title,
        content: document.body.innerHTML
      });
    }
  }
  
  return slides;
};

/**
 * PowerPoint Converter API
 */
export const pptConverter = {
  /**
   * Convert HTML content to PowerPoint presentation
   * @param {string} html - HTML content to convert
   * @param {Object} options - Conversion options
   * @param {boolean} options.forcePandoc - Force using pandoc even if not recommended
   * @param {string} options.pandocOptions - Additional pandoc command line options
   * @returns {Promise<Buffer>} - PowerPoint presentation as a buffer
   */
  fromHtml: async (html, options = {}) => {
    try {
      // Check if pandoc is available
      const pandocAvailable = await isPandocAvailable();
      
      if (!pandocAvailable) {
        throw new Error('Pandoc is required for PowerPoint conversion but not found. Please install pandoc.');
      }
      
      // Extract slides from HTML
      const slides = extractSlidesFromHtml(html);
      
      if (slides.length === 0) {
        throw new Error('No slides could be extracted from the HTML content');
      }
      
      // Use pandoc for conversion
      return await convertWithPandoc(html, options);
    } catch (error) {
      throw new Error(`Failed to convert HTML to PowerPoint: ${error.message}`);
    }
  },
  
  /**
   * Convert a URL to PowerPoint presentation
   * @param {string} url - URL to convert
   * @param {Object} options - Conversion options
   * @returns {Promise<Buffer>} - PowerPoint presentation as a buffer
   */
  fromUrl: async (url, options = {}) => {
    try {
      // Fetch the URL content
      const response = await fetch(url);
      const html = await response.text();
      
      // Convert the HTML to PowerPoint
      return await pptConverter.fromHtml(html, options);
    } catch (error) {
      throw new Error(`Failed to convert URL to PowerPoint: ${error.message}`);
    }
  },
  
  /**
   * Convert Markdown to PowerPoint presentation
   * @param {string} markdown - Markdown content to convert
   * @param {Object} options - Conversion options
   * @returns {Promise<Buffer>} - PowerPoint presentation as a buffer
   */
  fromMarkdown: async (markdown, options = {}) => {
    try {
      // Check if pandoc is available
      const pandocAvailable = await isPandocAvailable();
      
      if (!pandocAvailable) {
        throw new Error('Pandoc is required for PowerPoint conversion but not found. Please install pandoc.');
      }
      
      // Create temporary files for input and output
      const tempDir = os.tmpdir();
      const inputId = uuidv4();
      const outputId = uuidv4();
      const inputPath = path.join(tempDir, `${inputId}.md`);
      const outputPath = path.join(tempDir, `${outputId}.pptx`);
      
      try {
        // Write markdown to temporary file
        await fs.promises.writeFile(inputPath, markdown, 'utf8');
        
        // Build pandoc command with options
        let command = `pandoc -f markdown -t pptx "${inputPath}" -o "${outputPath}"`;
        
        // Add any additional pandoc options
        if (options.pandocOptions) {
          command += ` ${options.pandocOptions}`;
        }
        
        // Execute pandoc command
        await execPromise(command);
        
        // Read the generated PPTX file
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
    } catch (error) {
      throw new Error(`Failed to convert Markdown to PowerPoint: ${error.message}`);
    }
  }
};

export default pptConverter;