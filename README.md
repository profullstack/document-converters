# @profullstack/document-converters

A simple, unified API for converting between various document formats.

## Features

- Convert HTML to PDF
- Convert HTML to Word documents (.docx)
- Convert HTML to Excel spreadsheets (.xlsx)
- Convert HTML to PowerPoint presentations (.pptx)
- Convert HTML to EPUB e-books
- Convert between HTML and Markdown
- Simple, promise-based API
- Fallback mechanisms for different environments
- Comprehensive options for fine-tuning conversions

## Installation

```bash
npm install @profullstack/document-converters
```

## Basic Usage

```javascript
import converters from '@profullstack/document-converters';

// Convert HTML to PDF
const pdfBuffer = await converters.htmlToPdf('<h1>Hello World</h1>');

// Convert HTML to Word document
const docBuffer = await converters.htmlToDoc('<h1>Hello World</h1>');

// Convert HTML to Markdown
const markdown = await converters.htmlToMarkdown('<h1>Hello World</h1>');

// Convert Markdown to HTML
const html = await converters.markdownToHtml('# Hello World');
```

## API Reference

### Main Converter Object

The main export is a converter object with methods for all supported conversions:

```javascript
import converters from '@profullstack/document-converters';
```

#### HTML to PDF

```javascript
const pdfBuffer = await converters.htmlToPdf(html, options);
```

- `html`: HTML content to convert
- `options`: PDF generation options (see Puppeteer PDF options)
  - `format`: Paper format (default: 'A4')
  - `printBackground`: Whether to print background (default: true)
  - `margin`: Page margins (default: 1cm on all sides)

#### HTML to Word

```javascript
const docBuffer = await converters.htmlToDoc(html, options);
```

- `html`: HTML content to convert
- `options`: Word document generation options
  - `forcePandoc`: Force using pandoc even if docx is available
  - `forceDocx`: Force using docx library even if pandoc is available
  - `pandocOptions`: Additional pandoc command line options

#### HTML to Excel

```javascript
const excelBuffer = await converters.htmlToExcel(html, options);
```

- `html`: HTML content to convert (should contain table elements)
- `options`: Excel generation options

#### HTML to PowerPoint

```javascript
const pptBuffer = await converters.htmlToPpt(html, options);
```

- `html`: HTML content to convert
- `options`: PowerPoint generation options

#### HTML to EPUB

```javascript
const epubBuffer = await converters.htmlToEpub(html, options);
```

- `html`: HTML content to convert
- `options`: EPUB generation options

#### HTML to Markdown

```javascript
const markdown = await converters.htmlToMarkdown(html, options);
```

- `html`: HTML content to convert
- `options`: Markdown generation options

#### Markdown to HTML

```javascript
const html = await converters.markdownToHtml(markdown, options);
```

- `markdown`: Markdown content to convert
- `options`: HTML generation options

### Individual Converters

For more advanced usage, you can access the individual converters directly:

```javascript
import { pdfConverter, docConverter } from '@profullstack/document-converters';

// Or access them from the main object
const { pdf, doc, excel, ppt, epub, markdown } = converters;
```

#### PDF Converter

```javascript
// Convert HTML to PDF
const pdfBuffer = await pdfConverter.fromHtml(html, options);

// Convert URL to PDF
const pdfFromUrl = await pdfConverter.fromUrl('https://example.com', options);

// Convert multiple HTML pages to a single PDF
const multiPagePdf = await pdfConverter.fromMultipleHtml([html1, html2], options);
```

#### Word Document Converter

```javascript
// Convert HTML to Word document
const docBuffer = await docConverter.fromHtml(html, options);

// Convert URL to Word document
const docFromUrl = await docConverter.fromUrl('https://example.com', options);

// Convert Markdown to Word document
const docFromMarkdown = await docConverter.fromMarkdown(markdown, options);
```

## Examples

See the [examples](./examples) directory for complete usage examples.

## Requirements

- Node.js 14.x or higher
- For PDF conversion: Puppeteer (included as a dependency)
- For Word document conversion: Either pandoc installed on the system or the docx library (included as a dependency)

## License

MIT