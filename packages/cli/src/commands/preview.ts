/**
 * Preview command - Preview generated site
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export const previewCommand = new Command('preview')
  .description('Preview generated website')
  .argument('[dir]', 'Project directory', '.')
  .option('-p, --port <number>', 'Port to run on', '3000')
  .action(async (dir, options) => {
    try {
      const projectDir = dir;
      const packageJsonPath = join(projectDir, 'package.json');

      if (!existsSync(packageJsonPath)) {
        console.log(chalk.red(`\nNo Next.js project found in ${projectDir}`));
        console.log(chalk.yellow('\nMake sure you\'re in the generated project directory.'));
        return;
      }

      const nodeModulesPath = join(projectDir, 'node_modules');
      if (!existsSync(nodeModulesPath)) {
        console.log(chalk.yellow('\nDependencies not installed. Running npm install...\n'));

        const install = spawn('npm', ['install'], {
          cwd: projectDir,
          stdio: 'inherit',
          shell: true,
        });

        await new Promise<void>((resolve, reject) => {
          install.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`npm install failed with code ${code}`));
            }
          });
        });

        console.log(chalk.green('\nDependencies installed.\n'));
      }

      console.log(chalk.cyan(`\nStarting development server on port ${options.port}...\n`));

      const dev = spawn('npm', ['run', 'dev', '--', '-p', options.port], {
        cwd: projectDir,
        stdio: 'inherit',
        shell: true,
      });

      dev.on('error', (error) => {
        console.error(chalk.red('\nFailed to start dev server:'), error.message);
      });

      // Handle Ctrl+C
      process.on('SIGINT', () => {
        dev.kill('SIGINT');
        process.exit(0);
      });

    } catch (error) {
      console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
    }
  });
