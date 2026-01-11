/**
 * Project scaffolding - generates all project files
 */

import type { SiteConfig, GeneratedFile } from '@siteforge/shared';
import { generateConfigFiles } from './configs.js';
import { generateDataFiles } from './data.js';
import { generateComponentFiles } from './components.js';
import { generatePageFiles } from './pages.js';
import { generateStyleFiles } from './styles.js';

/**
 * Generate all project files
 */
export function generateProjectFiles(siteConfig: SiteConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // Config files (package.json, tsconfig, next.config, etc.)
  files.push(...generateConfigFiles(siteConfig));

  // Data files (lib/constants.ts, lib/cities.ts, etc.)
  files.push(...generateDataFiles(siteConfig));

  // Style files (globals.css, tailwind config)
  files.push(...generateStyleFiles(siteConfig));

  // Component files (Hero, Services, FAQ, etc.)
  files.push(...generateComponentFiles(siteConfig));

  // Page files (app/page.tsx, app/services/[slug]/page.tsx, etc.)
  files.push(...generatePageFiles(siteConfig));

  return files;
}
