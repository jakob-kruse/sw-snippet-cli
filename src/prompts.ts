import chalk from 'chalk';
import { ensureDir } from 'fs-extra';
import { uniqBy } from 'lodash';
import prompts from 'prompts';
import { isArray } from 'util';
import { info } from './messages';
import { SnippetFile } from './models/Snippet';

export const back_value = '__back__';
export const new_value = '__new__';

export function formatPath(path: string[] | string) {
  if (!isArray(path)) {
    path = path.split('.');
  }

  return (
    chalk.whiteBright('/ ') +
    path.map(value => chalk.whiteBright(value)).join(chalk.greenBright(' / '))
  );
}

export async function promptShopwarePath() {
  const { path } = await prompts({
    type: 'text',
    name: 'path',
    message: 'Shopware path',
  });

  await ensureDir(path);
  return path;
}

export async function choiceWrapper(message: string, choices: Choice[]) {
  const { result } = await prompts({
    type: 'select',
    name: 'result',
    message: message,
    choices: choices,
  });

  return result;
}

interface Choice {
  title: string;
  value: string;
}

function mapChoices(
  choices: string[],
  titleTransform?: Function,
  appendBack: boolean = false,
  appendNew: boolean = true,
): Choice[] {
  if (!titleTransform) {
    titleTransform = (title: string) => title;
  }

  const mapped = choices.map(choice => {
    return {
      title: titleTransform(choice),
      value: choice,
    };
  });

  if (appendNew) {
    mapped.push({
      title: 'New',
      value: new_value,
    });
  }

  if (appendBack) {
    mapped.push({
      title: 'Back',
      value: back_value,
    });
  }

  return mapped;
}

export async function promptChooseSubLevel(
  currentLevel: object | string,
  canGoBack: boolean,
): Promise<string> {
  if (!currentLevel) {
    info('Aborted while choosing sublevel');
    process.exit(0);
  }
  const { next } = await prompts({
    type: 'select',
    name: 'next',
    message: '',
    choices: mapChoices(
      Object.keys(currentLevel),
      (title: string) =>
        `${typeof currentLevel[title] !== 'string' ? '▼' : '▶'} - ${title}`,
      canGoBack,
    ),
  });

  return next;
}

export async function promptEditSnippetValue(
  snippetName: string,
  previousValue: string,
) {
  const { newValue } = await prompts({
    type: 'text',
    name: 'newValue',
    message: `${snippetName} was "${previousValue}"`,
    validate: value => !!value,
  });
  return newValue;
}

export function newType() {
  return choiceWrapper(
    'Type',
    mapChoices(['Collection', 'Item'], (title: string) => title, true, false),
  );
}

export async function promptAddSnippet(type: string) {
  const { newName } = await prompts([
    {
      type: 'text',
      name: 'newName',
      message: `New name of the ${type === 'item' ? 'Item' : 'Collection'}`,
      validate: value => !!value,
    },
  ]);

  return newName;
}

export async function promptNewSnippetValue(name: string) {
  const { value } = await prompts([
    {
      type: 'text',
      name: 'value',
      message: `${name}: New Value of the snippet`,
      validate: value => !!value,
    },
  ]);

  return value;
}

export async function promptShouldContinue() {
  const { shouldContinue } = await prompts({
    type: 'confirm',
    name: 'shouldContinue',
    message: 'Continue?',
    initial: true,
  });
  return shouldContinue;
}

export async function promptSnippetAutoComplete(snippets: SnippetFile[]) {
  const suggestByIncludes = (input: string, choices: Choice[]) => {
    return Promise.resolve(choices.filter(i => i.title.includes(input)));
  };

  const coices = uniqBy(
    snippets.map(snippet => ({
      title: snippet.trimmedSWPath,
      value: snippet.fullPath,
    })),
    'title',
  );

  const { snippetName } = await prompts({
    type: 'autocomplete',
    name: 'snippetName',
    message: 'Pick a snippet',
    choices: coices,
    suggest: suggestByIncludes,
  });

  return snippetName;
}
