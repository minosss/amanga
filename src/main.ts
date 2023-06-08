import type { AmOptions } from './types.js';
import chalk from 'chalk';
import providers from './provider.js';

export async function am(url: string, options?: AmOptions) {
  console.log(`● Loading ${url}`);

  for (const provider of providers) {
    if (provider?.validate(url)) {
      console.log(`${chalk.greenBright('❤︎')} Using ${provider.name}`);
      try {
        await provider.download(url, {
          ...options,
        });
        console.log(`${chalk.greenBright('✔')} All done`);
      } catch (error: any) {
        console.log(
          `${chalk.redBright('✖')} Something went wrong, please try again later.`,
        );
        console.log(`${error.message}`);
      }
      return;
    }
  }

  console.log(`${chalk.redBright('✖')} Can't download ${url}`);
  console.log(
    '  Make sure pass valid url, or submit a new feature request at https://github.com/minosss/amanga/issues',
  );
}
