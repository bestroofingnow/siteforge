/**
 * Config command - Manage API keys and settings
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { input, password } from '@inquirer/prompts';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CONFIG_DIR = join(homedir(), '.siteforge');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

interface SiteforgeConfig {
  anthropicApiKey?: string;
  groqApiKey?: string;
  defaultIndustry?: string;
  defaultOutputDir?: string;
}

async function loadConfig(): Promise<SiteforgeConfig> {
  if (!existsSync(CONFIG_FILE)) {
    return {};
  }
  const content = await readFile(CONFIG_FILE, 'utf-8');
  return JSON.parse(content);
}

async function saveConfig(config: SiteforgeConfig): Promise<void> {
  const { mkdir } = await import('fs/promises');
  await mkdir(CONFIG_DIR, { recursive: true });
  await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export const configCommand = new Command('config')
  .description('Manage SiteForge configuration')
  .option('--show', 'Show current configuration')
  .option('--set-anthropic-key', 'Set Anthropic API key')
  .option('--set-groq-key', 'Set Groq API key')
  .option('--reset', 'Reset all configuration')
  .action(async (options) => {
    try {
      if (options.show) {
        const config = await loadConfig();

        console.log(chalk.cyan('\nCurrent Configuration:\n'));

        if (Object.keys(config).length === 0) {
          console.log(chalk.gray('  No configuration saved yet.\n'));
          console.log(chalk.yellow('  Using environment variables:'));
          console.log(chalk.gray(`    ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? '****' + process.env.ANTHROPIC_API_KEY.slice(-4) : 'not set'}`));
          console.log(chalk.gray(`    GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '****' + process.env.GROQ_API_KEY.slice(-4) : 'not set'}\n`));
        } else {
          if (config.anthropicApiKey) {
            console.log(chalk.gray(`  Anthropic API Key: ****${config.anthropicApiKey.slice(-4)}`));
          }
          if (config.groqApiKey) {
            console.log(chalk.gray(`  Groq API Key: ****${config.groqApiKey.slice(-4)}`));
          }
          if (config.defaultIndustry) {
            console.log(chalk.gray(`  Default Industry: ${config.defaultIndustry}`));
          }
          if (config.defaultOutputDir) {
            console.log(chalk.gray(`  Default Output Dir: ${config.defaultOutputDir}`));
          }
          console.log();
        }
        return;
      }

      if (options.setAnthropicKey) {
        const key = await password({
          message: 'Enter your Anthropic API key:',
          mask: '*',
        });

        if (!key.startsWith('sk-ant-')) {
          console.log(chalk.yellow('\nWarning: API key should start with "sk-ant-"'));
        }

        const config = await loadConfig();
        config.anthropicApiKey = key;
        await saveConfig(config);

        console.log(chalk.green('\nAnthropic API key saved.\n'));
        return;
      }

      if (options.setGroqKey) {
        const key = await password({
          message: 'Enter your Groq API key:',
          mask: '*',
        });

        if (!key.startsWith('gsk_')) {
          console.log(chalk.yellow('\nWarning: API key should start with "gsk_"'));
        }

        const config = await loadConfig();
        config.groqApiKey = key;
        await saveConfig(config);

        console.log(chalk.green('\nGroq API key saved.\n'));
        return;
      }

      if (options.reset) {
        const { unlink } = await import('fs/promises');
        if (existsSync(CONFIG_FILE)) {
          await unlink(CONFIG_FILE);
          console.log(chalk.green('\nConfiguration reset.\n'));
        } else {
          console.log(chalk.gray('\nNo configuration to reset.\n'));
        }
        return;
      }

      // Interactive mode
      console.log(chalk.cyan('\nSiteForge Configuration\n'));

      const config = await loadConfig();

      const anthropicKey = await password({
        message: 'Anthropic API key (leave empty to skip):',
        mask: '*',
      });

      if (anthropicKey) {
        config.anthropicApiKey = anthropicKey;
      }

      const groqKey = await password({
        message: 'Groq API key (leave empty to skip):',
        mask: '*',
      });

      if (groqKey) {
        config.groqApiKey = groqKey;
      }

      await saveConfig(config);

      console.log(chalk.green('\nConfiguration saved to ~/.siteforge/config.json\n'));

    } catch (error) {
      if (error instanceof Error && error.message.includes('User force closed')) {
        console.log(chalk.yellow('\n\nConfiguration cancelled.\n'));
      } else {
        console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
      }
    }
  });
