import { SnippetFile } from './models/Snippet';

export default {
  lastUpdate: new Date().toString(),
  shopwarePath: '',
  paths: [],
};

export interface SnippetCache {
  lastUpdate: string;
  shopwarePath: string;
  paths: SnippetFile[];
}
