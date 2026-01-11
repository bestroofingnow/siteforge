/**
 * @siteforge/generator
 *
 * Code generation engine for SiteForge
 */

import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import type { SiteConfig, GeneratedFile } from '@siteforge/shared';
import { generateProjectFiles } from './scaffold/project.js';

export interface GenerationResult {
  projectPath: string;
  files: GeneratedFile[];
}

/**
 * Generate a complete Next.js project from site configuration
 */
export async function generateProject(
  siteConfig: SiteConfig,
  outputDir: string
): Promise<GenerationResult> {
  // Generate all files
  const files = generateProjectFiles(siteConfig);

  // Write files to disk
  for (const file of files) {
    const filePath = join(outputDir, file.path);
    const fileDir = dirname(filePath);

    await mkdir(fileDir, { recursive: true });
    await writeFile(filePath, file.content, 'utf-8');
  }

  return {
    projectPath: outputDir,
    files,
  };
}

// Re-export types
export type { GeneratedFile };
