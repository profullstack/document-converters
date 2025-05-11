/**
 * Basic usage examples for @profullstack/document-converters
 */

import converters from '../src/index.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Sample HTML content
const sampleHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Sample Document</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2cm; }
    h1 { color: #2c3e50; }
    p { line-height: 1.5; }
    .highlight { background-color: #f1c40f; padding: 5px; }
  </style>
</head>
<body>
  <h1>Sample Document</h1>
  <p>This is a sample document that demonstrates the conversion capabilities of the @profullstack/document-converters package.</p>
  
  <h2>Features</h2>
  <ul>
    <li>Convert HTML to PDF</li>
    <li>Convert HTML to Word documents</li>
    <li>Convert HTML to Excel spreadsheets</li>
    <li>Convert HTML to PowerPoint presentations</li>
    <li>Convert HTML to EPUB e-books</li>
    <li>Convert between HTML and Markdown</li>
  </ul>
  
  <p>Here's some text with <span class="highlight">highlighted content</span> to show styling.</p>
  
  <h2>Table Example</h2>
  <table border="1" cellpadding="5">
    <tr>
      <th>Format</th>
      <th>File Extension</th>
      <th>Use Case</th>
    </tr>
    <tr>
      <td>PDF</td>
      <td>.pdf</td>
      <td>Documents that need to maintain consistent formatting</td>
    </tr>
    <tr>
      <td>Word</td>
      <td>.docx</td>
      <td>Editable documents</td>
    </tr>
    <tr>
      <td>Excel</td>
      <td>.xlsx</td>
      <td>Data and spreadsheets</td>
    </tr>
    <tr>
      <td>PowerPoint</td>
      <td>.pptx</td>
      <td>Presentations</td>
    </tr>
    <tr>
      <td>EPUB</td>
      <td>.epub</td>
      <td>E-books</td>
    </tr>
    <tr>
      <td>Markdown</td>
      <td>.md</td>
      <td>Simple text formatting</td>
    </tr>
  </table>
</body>
</html>
`;

// Sample Markdown content
const sampleMarkdown = `
# Sample Document

This is a sample document that demonstrates the conversion capabilities of the @profullstack/document-converters package.

## Features

- Convert HTML to PDF
- Convert HTML to Word documents
- Convert HTML to Excel spreadsheets
- Convert HTML to PowerPoint presentations
- Convert HTML to EPUB e-books
- Convert between HTML and Markdown

Here's some text with **highlighted content** to show styling.

## Table Example

| Format | File Extension | Use Case |
|--------|---------------|----------|
| PDF | .pdf | Documents that need to maintain consistent formatting |
| Word | .docx | Editable documents |
| Excel | .xlsx | Data and spreadsheets |
| PowerPoint | .pptx | Presentations |
| EPUB | .epub | E-books |
| Markdown | .md | Simple text formatting |
`;

/**
 * Run the examples
 */
async function runExamples() {
  try {
    console.log('Running document conversion examples...');
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'output');
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    // Example 1: Convert HTML to PDF
    console.log('Converting HTML to PDF...');
    const pdfBuffer = await converters.htmlToPdf(sampleHtml);
    await fs.writeFile(path.join(outputDir, 'example.pdf'), pdfBuffer);
    console.log('PDF created successfully!');
    
    // Example 2: Convert HTML to Word document
    console.log('Converting HTML to Word document...');
    const docBuffer = await converters.htmlToDoc(sampleHtml);
    await fs.writeFile(path.join(outputDir, 'example.docx'), docBuffer);
    console.log('Word document created successfully!');
    
    // Example 3: Convert HTML to Markdown
    console.log('Converting HTML to Markdown...');
    const markdown = await converters.htmlToMarkdown(sampleHtml);
    await fs.writeFile(path.join(outputDir, 'example.md'), markdown);
    console.log('Markdown created successfully!');
    
    // Example 4: Convert Markdown to HTML
    console.log('Converting Markdown to HTML...');
    const html = await converters.markdownToHtml(sampleMarkdown);
    await fs.writeFile(path.join(outputDir, 'example-from-markdown.html'), html);
    console.log('HTML created successfully!');
    
    // Example 5: Convert Markdown to Word document (via HTML)
    console.log('Converting Markdown to Word document...');
    const htmlFromMarkdown = await converters.markdownToHtml(sampleMarkdown);
    const docFromMarkdownBuffer = await converters.htmlToDoc(htmlFromMarkdown);
    await fs.writeFile(path.join(outputDir, 'example-from-markdown.docx'), docFromMarkdownBuffer);
    console.log('Word document from Markdown created successfully!');
    
    // Example 6: Using the PDF converter directly for more options
    console.log('Using PDF converter with custom options...');
    const customPdfBuffer = await converters.pdf.fromHtml(sampleHtml, {
      format: 'Letter',
      landscape: true,
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      }
    });
    await fs.writeFile(path.join(outputDir, 'example-custom.pdf'), customPdfBuffer);
    console.log('Custom PDF created successfully!');
    
    console.log('\nAll examples completed successfully!');
    console.log(`Output files are in: ${outputDir}`);
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run the examples
runExamples();