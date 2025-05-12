/**
 * Markdown Converter Module
 * 
 * A simple API for converting between HTML and Markdown
 */

import { marked } from 'marked';
import { JSDOM } from 'jsdom';

/**
 * Convert HTML to Markdown
 * @private
 * @param {string} html - HTML content to convert
 * @param {Object} options - Conversion options
 * @returns {string} Markdown content
 */
const htmlToMarkdown = (html, options = {}) => {
  // This is a simplified implementation
  // In a real-world scenario, you would use a more robust HTML to Markdown converter
  // like turndown or node-html-markdown
  
  const dom = new JSDOM(html);
  const document = dom.window.document;
  let markdown = '';
  
  // Process headings
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    const level = parseInt(heading.tagName.substring(1));
    const hashes = '#'.repeat(level);
    markdown += `${hashes} ${heading.textContent.trim()}\n\n`;
  });
  
  // Process paragraphs
  document.querySelectorAll('p').forEach(p => {
    markdown += `${p.textContent.trim()}\n\n`;
  });
  
  // Process lists
  document.querySelectorAll('ul').forEach(ul => {
    ul.querySelectorAll('li').forEach(li => {
      markdown += `- ${li.textContent.trim()}\n`;
    });
    markdown += '\n';
  });
  
  document.querySelectorAll('ol').forEach(ol => {
    let index = 1;
    ol.querySelectorAll('li').forEach(li => {
      markdown += `${index}. ${li.textContent.trim()}\n`;
      index++;
    });
    markdown += '\n';
  });
  
  // Process tables
  document.querySelectorAll('table').forEach(table => {
    // Table header
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
    if (headers.length > 0) {
      markdown += `| ${headers.join(' | ')} |\n`;
      markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;
    }
    
    // Table rows
    table.querySelectorAll('tr').forEach(tr => {
      const cells = Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
      if (cells.length > 0) {
        markdown += `| ${cells.join(' | ')} |\n`;
      }
    });
    
    markdown += '\n';
  });
  
  return markdown.trim();
};

/**
 * Markdown Converter API
 */
export const markdownConverter = {
  /**
   * Convert HTML to Markdown
   * @param {string} html - HTML content to convert
   * @param {Object} options - Conversion options
   * @returns {Promise<string>} - Markdown content
   */
  fromHtml: async (html, options = {}) => {
    try {
      return htmlToMarkdown(html, options);
    } catch (error) {
      throw new Error(`Failed to convert HTML to Markdown: ${error.message}`);
    }
  },
  
  /**
   * Convert Markdown to HTML
   * @param {string} markdown - Markdown content to convert
   * @param {Object} options - Conversion options
   * @returns {Promise<string>} - HTML content
   */
  toHtml: async (markdown, options = {}) => {
    try {
      // Configure marked options
      const markedOptions = {
        gfm: true, // GitHub Flavored Markdown
        breaks: true, // Convert line breaks to <br>
        ...options.marked
      };
      
      // Set marked options
      marked.setOptions(markedOptions);
      
      // Convert markdown to HTML
      return marked(markdown);
    } catch (error) {
      throw new Error(`Failed to convert Markdown to HTML: ${error.message}`);
    }
  }
};

export default markdownConverter;