/**
 * Shared pandoc runner.
 *
 * Runs pandoc via execFile with an argv array (NO shell), so metadata and
 * option values are passed as individual arguments and can never be
 * interpreted as shell syntax. This closes the command-injection vector that
 * existed when the command was built as a string and run through exec()
 * (which invokes `/bin/sh -c`) — dangerous because values such as the EPUB
 * title/author/language are extracted from untrusted input HTML.
 */

import { promisify } from 'util';
import { execFile } from 'child_process';

const execFilePromise = promisify(execFile);

/**
 * @param {string} from - pandoc input format (e.g. 'html', 'markdown')
 * @param {string} to - pandoc output format (e.g. 'epub', 'docx', 'pptx')
 * @param {string} inputPath - path to the input file
 * @param {string} outputPath - path to write the output file
 * @param {Object} [options] - { title, author, language, cover, pandocOptions }
 * @returns {Promise<void>}
 */
export const runPandoc = async (from, to, inputPath, outputPath, options = {}) => {
  const { title, author, language, cover, pandocOptions } = options;
  const args = ['-f', from, '-t', to, inputPath, '-o', outputPath];

  if (title) args.push('--metadata', `title=${title}`);
  if (author) args.push('--metadata', `author=${author}`);
  if (language) args.push('--metadata', `language=${language}`);
  if (cover) args.push(`--epub-cover-image=${cover}`);

  if (pandocOptions) {
    const extra = Array.isArray(pandocOptions)
      ? pandocOptions
      : String(pandocOptions).split(/\s+/).filter(Boolean);
    args.push(...extra);
  }

  await execFilePromise('pandoc', args);
};
