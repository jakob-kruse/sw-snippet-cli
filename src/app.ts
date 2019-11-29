import prompts from 'prompts';
import { amountInfo, info } from './messages';
import Snippet from './models/Snippet';
import { back_value, newType, shouldContinue, shopwarePath } from './prompts';
import { editSnippet, newSnippet, walkSnippet } from './snippet_manager';
import { init, clearCache } from './SnippetCache';
import { resolve } from 'path';
import { ensureDir } from 'fs-extra';

(async () => {
  if (process.argv[2] === 'cache') {
    clearCache();
    info('Cleared Cache');
    return;
  }

  const swPath = resolve(process.argv[2] || (await shopwarePath()));
  if (!swPath) {
    info('Nothing? Ok, See you!');
    return;
  }

  ensureDir(swPath);
  init(swPath);

  // const snippets = await findSnippetsInFolder(snippetFolder);

  // amountInfo('Found', snippets.length, 'Snippets!');

  // await modify(snippets, '');
})();

async function modify(snippets: Snippet[], startPath: string) {
  const { createNew, path } = await walkSnippet(
    snippets[0],
    startPath.split('.'),
  );

  if (createNew) {
    const type = await newType();

    if (type === back_value) {
      await modify(snippets, startPath);
    }

    if (!type) {
      info('Aborted');
      process.exit(0);
    }

    const newPath = await newSnippet(snippets, type, path);
    const _continue = await shouldContinue();

    if (_continue) {
      await modify(snippets, newPath);
    }
    return;
  }

  await editSnippet(snippets, path);
}
