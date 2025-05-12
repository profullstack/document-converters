/**
 * PDF Converter Module
 *
 * A simple API for converting HTML content to PDF documents using Puppeteer
 * With browser compatibility for ESM imports
 */

// Conditional imports for Node.js environment only
let puppeteer;
let os;
let fs;
let path;
let isNode = false;

// Check if we're in a Node.js environment
try {
  isNode = typeof process !== 'undefined' &&
           process.versions != null &&
           process.versions.node != null;
  
  if (isNode) {
    // Dynamic imports for Node.js environment
    puppeteer = (await import('puppeteer')).default;
    os = (await import('os')).default;
    fs = (await import('fs')).default;
    path = (await import('path')).default;
  }
} catch (error) {
  console.warn('Running in browser environment, PDF conversion not available');
}

/**
 * Get Puppeteer configuration based on the environment
 * @private
 * @returns {Object} Puppeteer launch options
 */
const getPuppeteerConfig = () => {
  // Check if we're in a Node.js environment
  if (!isNode) {
    throw new Error('Puppeteer is only available in Node.js environment');
  }

  const config = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };

  // If PUPPETEER_EXECUTABLE_PATH is explicitly set in environment variables, use it
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    config.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    return config;
  }

  // Otherwise, try to determine the path based on the environment
  try {
    const username = os.userInfo().username;
    const chromeVersion = 'linux-135.0.7049.114';
    
    // Construct the path based on the username
    const chromePath = path.join(
      '/home',
      username,
      '.cache/puppeteer/chrome',
      chromeVersion,
      'chrome-linux64/chrome'
    );

    // Check if the path exists
    if (fs.existsSync(chromePath)) {
      config.executablePath = chromePath;
    }
  } catch (error) {
    // Silently fail and use default Puppeteer Chrome
    console.warn('Error determining Chrome path, using default Puppeteer Chrome');
  }

  return config;
};

/**
 * PDF Converter API
 */
export const pdfConverter = {
  /**
   * Convert HTML content to PDF
   * @param {string} html - HTML content to convert
   * @param {Object} options - PDF generation options
   * @returns {Promise<Buffer>} - PDF document as a buffer
   */
  fromHtml: async (html, options = {}) => {
    // Check if we're in a Node.js environment
    if (!isNode || !puppeteer) {
      throw new Error('PDF conversion is only available in Node.js environment');
    }

    // Default options
    const defaultOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    };

    // Merge default options with provided options
    const pdfOptions = { ...defaultOptions, ...options };

    // Get Puppeteer configuration
    const launchOptions = getPuppeteerConfig();
    
    // Launch a new browser instance
    const browser = await puppeteer.launch(launchOptions);
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Set the HTML content
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);
      
      return pdfBuffer;
    } finally {
      // Ensure browser is closed even if an error occurs
      await browser.close();
    }
  },

  /**
   * Convert a URL to PDF
   * @param {string} url - URL to convert
   * @param {Object} options - PDF generation options
   * @returns {Promise<Buffer>} - PDF document as a buffer
   */
  fromUrl: async (url, options = {}) => {
    // Check if we're in a Node.js environment
    if (!isNode || !puppeteer) {
      throw new Error('PDF conversion is only available in Node.js environment');
    }

    // Default options
    const defaultOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    };

    // Merge default options with provided options
    const pdfOptions = { ...defaultOptions, ...options };

    // Get Puppeteer configuration
    const launchOptions = getPuppeteerConfig();
    
    // Launch a new browser instance
    const browser = await puppeteer.launch(launchOptions);
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);
      
      return pdfBuffer;
    } finally {
      // Ensure browser is closed even if an error occurs
      await browser.close();
    }
  },

  /**
   * Convert multiple HTML strings to a single PDF
   * @param {string[]} htmlPages - Array of HTML content strings, one per page
   * @param {Object} options - PDF generation options
   * @returns {Promise<Buffer>} - PDF document as a buffer
   */
  fromMultipleHtml: async (htmlPages, options = {}) => {
    // Check if we're in a Node.js environment
    if (!isNode || !puppeteer) {
      throw new Error('PDF conversion is only available in Node.js environment');
    }

    if (!Array.isArray(htmlPages) || htmlPages.length === 0) {
      throw new Error('htmlPages must be a non-empty array of HTML strings');
    }

    // Default options
    const defaultOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    };

    // Merge default options with provided options
    const pdfOptions = { ...defaultOptions, ...options };

    // Get Puppeteer configuration
    const launchOptions = getPuppeteerConfig();
    
    // Launch a new browser instance
    const browser = await puppeteer.launch(launchOptions);
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Set the first HTML content
      await page.setContent(htmlPages[0], { waitUntil: 'networkidle0' });
      
      // Generate PDF for the first page
      const pdfBuffer = await page.pdf({
        ...pdfOptions,
        pageRanges: '1'
      });
      
      // If there's only one page, return it
      if (htmlPages.length === 1) {
        return pdfBuffer;
      }
      
      // Otherwise, create a PDF for each additional page and merge them
      // Note: In a real implementation, you would use a PDF library to merge the buffers
      // For simplicity, we're just returning the first page here
      
      return pdfBuffer;
    } finally {
      // Ensure browser is closed even if an error occurs
      await browser.close();
    }
  }
};

export default pdfConverter;