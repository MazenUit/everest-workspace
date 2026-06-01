import chalk from 'chalk';

// terminal theme for reviewers (orange prompts, green labels, white values)
export const c = {
  prompt: chalk.hex('#E8A317'),
  label: chalk.green,
  value: chalk.white,
  error: chalk.red,
  hint: chalk.gray,
};
