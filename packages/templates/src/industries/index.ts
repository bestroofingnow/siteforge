/**
 * Industry configurations
 */

import type { IndustryConfig } from '@siteforge/shared';
import { roofingConfig } from './roofing.js';
import { landscapingConfig } from './landscaping.js';
import { plumbingConfig } from './plumbing.js';
import { hvacConfig } from './hvac.js';

export const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  roofing: roofingConfig,
  landscaping: landscapingConfig,
  plumbing: plumbingConfig,
  hvac: hvacConfig,
};

export function getIndustryConfig(industry: string): IndustryConfig | undefined {
  return INDUSTRY_CONFIGS[industry];
}

export { roofingConfig, landscapingConfig, plumbingConfig, hvacConfig };
