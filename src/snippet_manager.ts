import deep from 'deep-get-set';
import { readdir, readJSON, writeJson } from 'fs-extra';
import { join } from 'path';
import { criticalError, info } from './messages';
import Snippet, { createSnipetFile } from './models/Snippet';
import {
  back_value,
  new_value,
  promptAddSnippet,
  promptChooseSubLevel,
  promptEditSnippetValue,
  promptNewSnippetValue,
} from './prompts';

export const SNIPPET_REGEX = /[a-z]+-[A-Z]+.json/;

export async function readSnippet(filePath: string): Promise<Snippet> {
  let jsonObject: any;
  try {
    jsonObject = await readJSON(filePath, { encoding: 'utf8' });
  } catch (err) {
    criticalError('Invalid snippet file, ignoring it', filePath);
    return null;
  }

  return {
    content: jsonObject,
    contentString: JSON.stringify(jsonObject),
    file: createSnipetFile(filePath),
  };
}

export async function findSnippetsInFolder(folder: string): Promise<Snippet[]> {
  let files: string[];
  try {
    files = await readdir(folder);
  } catch (err) {
    info('Couldnt find that folder, sorry!');
    process.exit(0);
  }

  const snippets = [];

  for await (const fileName of files) {
    const isSnippet = SNIPPET_REGEX.test(fileName);

    if (isSnippet) {
      const snippet = await readSnippet(join(folder, fileName));
      if (snippet) {
        snippets.push(snippet);
      }
    }
  }

  return snippets;
}

interface WalkResult {
  createNew: boolean;
  path: string[];
}

export async function walkSnippet(
  snippet: Snippet,
  path: string[],
): Promise<WalkResult> {
  const root = snippet.content;
  let level = deep(root, path);

  while (typeof level !== 'string') {
    const next = await promptChooseSubLevel(level, path.length !== 0);

    if (next === back_value) {
      path.pop();
    } else {
      path.push(next);
    }

    if (next === new_value) {
      path.pop();
      return {
        createNew: true,
        path: path,
      };
    }

    level = deep(root, path);
  }

  return {
    createNew: false,
    path: path,
  };
}

export async function setDeepValue(
  snippetPath: string,
  content: object,
  path: string[],
  newValue: string | object,
) {
  deep(content, path, newValue);

  try {
    await writeJson(snippetPath, content, {
      spaces: '\t',
    });
  } catch (err) {
    criticalError('Could not write to file', snippetPath);
    process.exit(1);
  }
}

export async function editSnippet(snippets: Snippet[], path: string[]) {
  for await (let snippet of snippets) {
    const snippetName = snippet.file.name;

    // Just re-read it in case it changed
    snippet = await readSnippet(snippet.file.fullPath);

    const newValue = await promptEditSnippetValue(
      snippetName,
      deep(snippet.content, path),
    );

    if (!newValue) {
      info('Aborted while editing');
      break;
    }

    await setDeepValue(snippet.file.fullPath, snippet.content, path, newValue);
  }
}

export async function newSnippet(
  snippets: Snippet[],
  type: string,
  path: string[],
) {
  const name = await promptAddSnippet(type);

  if (path) {
    path.push(name);
  } else {
    path = [name];
  }

  for await (let snippet of snippets) {
    if (type === 'collection') {
      setDeepValue(snippet.file.fullPath, snippet.content, path, {});
    } else {
      const newValue = await promptNewSnippetValue(snippet.file.name);

      setDeepValue(snippet.file.fullPath, snippet.content, path, newValue);
    }
  }

  return path;
}
