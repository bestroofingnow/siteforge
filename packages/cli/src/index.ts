#!/usr/bin/env node

/**
 * SiteForge CLI
 *
 * AI-powered website builder using Claude and Llama 4 Maverick
 */

import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { config } from 'dotenv';

// Load environment variables
config();

import { initCommand } from './commands/init.js';
import { buildCommand } from './commands/build.js';
import { previewCommand } from './commands/preview.js';
import { configCommand } from './commands/config.js';

const VERSION = '1.0.0';

// Display banner
function showBanner() {
  const banner = boxen(
    chalk.bold.cyan('SiteForge') +
      chalk.gray(' v' + VERSION) +
      '\n' +
      chalk.white('AI-Powered Website Builder'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
    }
  );
  console.log(banner);
}

// Create CLI program
const program = new Command();

program
  .name('siteforge')
  .description('AI-powered website builder using Claude and Llama 4 Maverick')
  .version(VERSION)
  .hook('preAction', () => {
    showBanner();
  });

// Register commands
program.addCommand(initCommand);
program.addCommand(buildCommand);
program.addCommand(previewCommand);
program.addCommand(configCommand);

// Default action (no command)
program.action(() => {
  program.help();
});

// Parse and execute
program.parse();
