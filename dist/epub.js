/**
 * EPUB Converter Module
 * 
 * A simple API for converting HTML content to EPUB e-books
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
 * Convert HTML to EPUB using pandoc
 * @private
 * @param {string} html - HTML content to convert
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} EPUB file as a buffer
 */
const convertWithPandoc = async (html, options = {}) => {
  // Create temporary files for input and output
  const tempDir = os.tmpdir();
  const inputId = uuidv4();
  const outputId = uuidv4();
  const inputPath = path.join(tempDir, `${inputId}.html`);
  const outputPath = path.join(tempDir, `${outputId}.epub`);
  
  try {
    // Extract metadata from options
    const { title, author, language, cover } = options;
    
    // Write HTML to temporary file
    await fs.promises.writeFile(inputPath, html, 'utf8');
    
    // Build pandoc command with options
    let command = `pandoc -f html -t epub "${inputPath}" -o "${outputPath}"`;
    
    // Add metadata if provided
    if (title) {
      command += ` --metadata title="${title}"`;
    }
    
    if (author) {
      command += ` --metadata author="${author}"`;
    }
    
    if (language) {
      command += ` --metadata language="${language}"`;
    }
    
    // Add cover image if provided
    if (cover) {
      command += ` --epub-cover-image="${cover}"`;
    }
    
    // Add any additional pandoc options
    if (options.pandocOptions) {
      command += ` ${options.pandocOptions}`;
    }
    
    // Execute pandoc command
    await execPromise(command);
    
    // Read the generated EPUB file
    const epubBuffer = await fs.promises.readFile(outputPath);
    
    return epubBuffer;
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
 * Extract metadata from HTML
 * @private
 * @param {string} html - HTML content to extract metadata from
 * @returns {Object} Metadata object
 */
const extractMetadataFromHtml = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const metadata = {};
  
  // Extract title
  metadata.title = document.querySelector('title')?.textContent || 'Untitled';
  
  // Extract author from meta tags
  const authorMeta = document.querySelector('meta[name="author"]');
  if (authorMeta) {
    metadata.author = authorMeta.getAttribute('content');
  }
  
  // Extract language
  const htmlElement = document.querySelector('html');
  if (htmlElement && htmlElement.hasAttribute('lang')) {
    metadata.language = htmlElement.getAttribute('lang');
  }
  
  return metadata;
};

/**
 * EPUB Converter API
 */
export const epubConverter = {
  /**
   * Convert HTML content to EPUB e-book
   * @param {string} html - HTML content to convert
   * @param {Object} options - Conversion options
   * @param {string} options.title - Book title
   * @param {string} options.author - Book author
   * @param {string} options.language - Book language (e.g., 'en')
   * @param {string} options.cover - Path to cover image
   * @param {string} options.pandocOptions - Additional pandoc command line options
   * @returns {Promise<Buffer>} - EPUB file as a buffer
   */
  fromHtml: async (html, options = {}) => {
    try {
      // Check if pandoc is available
      const pandocAvailable = await isPandocAvailable();
      
      if (!pandocAvailable) {
        throw new Error('Pandoc is required for EPUB conversion but not found. Please install pandoc.');
      }
      
      // Extract metadata from HTML if not provided in options
      const htmlMetadata = extractMetadataFromHtml(html);
      
      // Merge extracted metadata with provided options
      const mergedOptions = {
        ...htmlMetadata,
        ...options
      };
      
      // Use pandoc for conversion
      return await convertWithPandoc(html, mergedOptions);
    } catch (error) {
      throw new Error(`Failed to convert HTML to EPUB: ${error.message}`);
    }
  },
  
  /**
   * Convert a URL to EPUB e-book
   * @param {string} url - URL to convert
   * @param {Object} options - Conversion options
   * @returns {Promise<Buffer>} - EPUB file as a buffer
   */
  fromUrl: async (url, options = {}) => {
    try {
      // Fetch the URL content
      const response = await fetch(url);
      const html = await response.text();
      
      // Convert the HTML to EPUB
      return await epubConverter.fromHtml(html, options);
    } catch (error) {
      throw new Error(`Failed to convert URL to EPUB: ${error.message}`);
    }
  },
  
  /**
   * Convert Markdown to EPUB e-book
   * @param {string} markdown - Markdown content to convert
   * @param {Object} options - Conversion options
   * @returns {Promise<Buffer>} - EPUB file as a buffer
   */
  fromMarkdown: async (markdown, options = {}) => {
    try {
      // Check if pandoc is available
      const pandocAvailable = await isPandocAvailable();
      
      if (!pandocAvailable) {
        throw new Error('Pandoc is required for EPUB conversion but not found. Please install pandoc.');
      }
      
      // Create temporary files for input and output
      const tempDir = os.tmpdir();
      const inputId = uuidv4();
      const outputId = uuidv4();
      const inputPath = path.join(tempDir, `${inputId}.md`);
      const outputPath = path.join(tempDir, `${outputId}.epub`);
      
      try {
        // Extract metadata from options
        const { title, author, language, cover } = options;
        
        // Write markdown to temporary file
        await fs.promises.writeFile(inputPath, markdown, 'utf8');
        
        // Build pandoc command with options
        let command = `pandoc -f markdown -t epub "${inputPath}" -o "${outputPath}"`;
        
        // Add metadata if provided
        if (title) {
          command += ` --metadata title="${title}"`;
        }
        
        if (author) {
          command += ` --metadata author="${author}"`;
        }
        
        if (language) {
          command += ` --metadata language="${language}"`;
        }
        
        // Add cover image if provided
        if (cover) {
          command += ` --epub-cover-image="${cover}"`;
        }
        
        // Add any additional pandoc options
        if (options.pandocOptions) {
          command += ` ${options.pandocOptions}`;
        }
        
        // Execute pandoc command
        await execPromise(command);
        
        // Read the generated EPUB file
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
      throw new Error(`Failed to convert Markdown to EPUB: ${error.message}`);
    }
  }
};

export default epubConverter;