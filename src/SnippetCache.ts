import { ensureDir, pathExists, readJSON, remove, writeJson } from 'fs-extra';
import { homedir } from 'os';
import { basename, join } from 'path';
import { async } from 'walkdir';
import cacheEmpty, { SnippetCache } from './Cache';
import { amountInfo, info } from './messages';
import { createSnipetFile, SnippetFile } from './models/Snippet';
import { SNIPPET_REGEX } from './snippet_manager';

export const cachePath = join(homedir(), '.config', 'snippet-cli.json');
let cache: SnippetCache;

async function findSnippets(shopwareDir: string): Promise<SnippetFile[]> {
  await ensureDir(shopwareDir);

  const paths = await async(shopwareDir);
  return paths
    .filter(path => SNIPPET_REGEX.test(basename(path)))
    .map(createSnipetFile);
}

export async function init(shopwareDir: string) {
  let snippets: SnippetFile[];

  if (!(await pathExists(cachePath))) {
    info('Gathering snippet files. This might take a while!');
    await writeJson(cachePath, cacheEmpty, {
      spaces: 2,
    });
    cache = cacheEmpty;
    snippets = await findSnippets(shopwareDir);
    cache.paths = snippets;
    await writeJson(cachePath, cache);
    amountInfo('Found', snippets.length, 'Snippet Files and cached them');
  } else {
    cache = await readJSON(cachePath);
    snippets = cache.paths;
    amountInfo('Found', snippets.length, 'Snippet Files in the cache');
  }
}

export async function clearCache() {
  try {
    await remove(cachePath);
  } catch (_) {
    // If there is no cache, it doesnt matter
  }
}
