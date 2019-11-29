import chalk from 'chalk';
import { EOL } from 'os';

export function criticalError(message: string, value: string) {
  paddedWithNewLines(`${chalk.red(message)}: ${chalk.redBright(value)}`);
}

export function info(message: string, value?: string) {
  if (!value) {
    console.log(chalk.greenBright(message));
    return;
  }

  console.log(`${chalk.white(message)}: ${chalk.greenBright(value)}`);
}

export function amountInfo(
  before: string,
  amount: number | string,
  after: string,
) {
  console.log(
    `${chalk.white(before)} ${chalk.greenBright(amount)} ${chalk.white(
      after,
    )} `,
  );
}

export function newline(amount: number = 1) {
  for (let i = 0; i <= amount; i++) {
    console.log('');
  }
}

export function paddedWithNewLines(
  content: string,
  top: number = 1,
  bottom: number = 1,
) {
  newline(top);
  console.log(content);
  newline(bottom);
}
