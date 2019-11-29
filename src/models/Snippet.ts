import { basename, dirname, sep } from 'path';
import { shopwarePath } from '../SnippetCache';

export default interface Snippet {
  content: object;
  contentString: string;
  file: SnippetFile;
}

export interface SnippetFile {
  fullPath: string;
  basename: string;
  name: string;
  trimmedSWPath: string;
}

export function createSnipetFile(fullPath: string): SnippetFile {
  const splitPath = fullPath.split(sep);
  let snippetName = splitPath[splitPath.length - 3];

  return {
    fullPath,
    basename: basename(fullPath),
    name: snippetName,
    trimmedSWPath: dirname(fullPath.replace(shopwarePath, '...')),
  };
}
