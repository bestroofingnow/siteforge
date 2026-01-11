/**
 * Build command - Build website from existing config
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { ConversationEngine } from '../conversation/engine.js';
import type { BusinessInfo } from '@siteforge/shared';

export const buildCommand = new Command('build')
  .description('Build website from existing configuration file')
  .option('-c, --config <file>', 'Configuration file path', 'siteforge.config.json')
  .option('-o, --output <dir>', 'Output directory')
  .option('--dry-run', 'Show plan without generating files')
  .action(async (options) => {
    try {
      const configPath = options.config;

      if (!existsSync(configPath)) {
        console.log(chalk.red(`\nConfiguration file not found: ${configPath}`));
        console.log(chalk.yellow('\nRun `siteforge init` to create a new project interactively.'));
        return;
      }

      console.log(chalk.cyan(`\nLoading configuration from ${configPath}...\n`));

      const configContent = await readFile(configPath, 'utf-8');
      const businessInfo: BusinessInfo = JSON.parse(configContent);

      if (!businessInfo.name || !businessInfo.industry) {
        console.log(chalk.red('\nInvalid configuration file. Missing required fields.'));
        return;
      }

      console.log(chalk.white(`Building website for: ${businessInfo.name}`));
      console.log(chalk.gray(`Industry: ${businessInfo.industry}`));
      console.log(chalk.gray(`Services: ${businessInfo.services?.length || 0}`));
      console.log(chalk.gray(`Cities: ${businessInfo.serviceAreas?.length || 0}\n`));

      if (options.dryRun) {
        console.log(chalk.cyan('[Dry run] Would generate project with this config.\n'));
        return;
      }

      // Check for API keys
      if (!process.env.ANTHROPIC_API_KEY || !process.env.GROQ_API_KEY) {
        console.log(chalk.red('Missing API keys.'));
        console.log(chalk.yellow('\nPlease set your API keys:'));
        console.log(chalk.gray('  export ANTHROPIC_API_KEY=sk-ant-...'));
        console.log(chalk.gray('  export GROQ_API_KEY=gsk_...'));
        return;
      }

      const spinner = ora('Initializing...').start();

      try {
        const engine = new ConversationEngine();

        spinner.text = 'Researching industry context...';
        await engine.research(businessInfo);
        spinner.succeed('Research complete');

        spinner.start('Planning site architecture...');
        await engine.plan(businessInfo);
        spinner.succeed('Architecture planned');

        spinner.start('Generating marketing content...');
        const siteConfig = await engine.generateContent(businessInfo);
        spinner.succeed('Content generated');

        spinner.start('Generating code and components...');
        const outputDir = options.output || `./${businessInfo.name.toLowerCase().replace(/\s+/g, '-')}`;
        await engine.generateCode(siteConfig, outputDir);
        spinner.succeed('Code generated');

        spinner.start('Validating output...');
        await engine.validate(outputDir);
        spinner.succeed('Validation complete');

        console.log(chalk.bold.green('\n✅ Build complete!\n'));

        const stats = engine.getStats();
        console.log(chalk.white(`📁 Output: ${outputDir}`));
        console.log(chalk.white(`📄 Files: ${stats.totalFiles} total`));
        console.log(chalk.white(`💰 Cost: $${stats.totalCost.toFixed(4)}\n`));

      } catch (error) {
        spinner.fail('Build failed');
        console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
      }

    } catch (error) {
      console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
    }
  });
