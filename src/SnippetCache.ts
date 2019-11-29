import { ensureDir, pathExists, readJSON, remove, writeJson } from 'fs-extra';
import { homedir } from 'os';
import { basename, join, resolve } from 'path';
import { async } from 'walkdir';
import cacheEmpty, { SnippetCache } from './Cache';
import { amountInfo, info } from './messages';
import { createSnipetFile, SnippetFile } from './models/Snippet';
import { promptShopwarePath } from './prompts';
import { SNIPPET_REGEX } from './snippet_manager';

export const cachePath = join(homedir(), '.config', 'snippet-cli.json');
let cache: SnippetCache;
export let shopwarePath: string;

async function findSnippets(shopwarePath: string): Promise<SnippetFile[]> {
  await ensureDir(shopwarePath);

  const paths = (await async(shopwarePath))
    .filter(path => SNIPPET_REGEX.test(basename(path)))
    .map(path => createSnipetFile(path));
  return paths;
}

export async function initCache(swPath?: string) {
  let snippets: SnippetFile[];

  if (!(await pathExists(cachePath))) {
    await writeJson(cachePath, cacheEmpty, {
      spaces: 2,
    });
    cache = cacheEmpty;

    if (!swPath) {
      shopwarePath = resolve(await promptShopwarePath());
      cache.shopwarePath = shopwarePath;
      if (!shopwarePath) {
        info('Nothing? Ok, See you!');
        process.exit(0);
        return;
      }
    } else {
      shopwarePath = swPath;
    }
    info('Gathering snippet files. This might take a while!');

    snippets = await findSnippets(shopwarePath);
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

export function getSnippetFiles(): SnippetFile[] {
  return cache.paths;
}
