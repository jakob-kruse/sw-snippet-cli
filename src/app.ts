#!/usr/bin/env node
import { dirname } from 'path';
import { info } from './messages';
import Snippet from './models/Snippet';
import {
  back_value,
  newType,
  promptShouldContinue,
  promptSnippetAutoComplete,
} from './prompts';
import { clearCache, getSnippetFiles, initCache } from './SnippetCache';
import {
  editSnippet,
  findSnippetsInFolder,
  newSnippet,
  walkSnippet,
} from './snippet_manager';

(async () => {
  if (process.argv[2] === 'cache') {
    clearCache();
    info('Cleared Cache');
    return;
  }

  await initCache(process.argv[2]);

  const snippetFiles = getSnippetFiles();

  const selectedSnippetPath = await promptSnippetAutoComplete(snippetFiles);

  const snippetDir = dirname(
    snippetFiles.find(snippet => (snippet.fullPath = selectedSnippetPath))
      .fullPath,
  );

  await modify(await findSnippetsInFolder(snippetDir));
})();

async function modify(snippets: Snippet[], startPath: string[] = []) {
  const { createNew, path } = await walkSnippet(snippets[0], startPath);

  if (createNew) {
    const type = await newType();

    if (type === back_value) {
      await modify(snippets, startPath);
    }

    if (!type) {
      info('Aborted while walking snippet');
      process.exit(0);
    }

    const newPath = await newSnippet(snippets, type, path);
    const _continue = await promptShouldContinue();

    if (_continue) {
      await modify(snippets, newPath);
    }
    return;
  }

  await editSnippet(snippets, path);
}
