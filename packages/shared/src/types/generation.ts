/**
 * Generation pipeline types
 */

import type { BusinessInfo } from './business.js';
import type { SiteConfig } from './site.js';
import type { LLMTask, LLMUsage } from './llm.js';

export type PipelineStatus =
  | 'pending'
  | 'conversation'
  | 'researching'
  | 'planning'
  | 'generating-content'
  | 'generating-code'
  | 'reviewing'
  | 'complete'
  | 'error';

export interface PipelineStage {
  name: string;
  description: string;
  status: 'pending' | 'running' | 'complete' | 'error' | 'skipped';
  tasks: LLMTask[];
  startTime?: Date;
  endTime?: Date;
  error?: string;
  progress?: number; // 0-100
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'page' | 'layout' | 'data' | 'config' | 'style' | 'asset' | 'api';
  generator: 'claude' | 'groq' | 'template' | 'static';
  size: number; // bytes
}

export interface GenerationStats {
  totalFiles: number;
  totalLines: number;
  totalBytes: number;
  filesByType: Record<GeneratedFile['type'], number>;
  claudeUsage: LLMUsage;
  groqUsage: LLMUsage;
  totalCost: number;
  durationMs: number;
}

export interface GeneratedOutput {
  projectPath: string;
  projectName: string;
  files: GeneratedFile[];
  statistics: GenerationStats;
}

export interface GenerationPipeline {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: PipelineStatus;
  businessInfo: BusinessInfo;
  siteConfig?: SiteConfig;
  stages: PipelineStage[];
  output?: GeneratedOutput;
  error?: string;
}

/**
 * Pipeline stage definitions
 */
export const PIPELINE_STAGES: { name: string; description: string }[] = [
  { name: 'conversation', description: 'Gathering business information' },
  { name: 'research', description: 'Researching industry and market' },
  { name: 'planning', description: 'Planning site architecture' },
  { name: 'content', description: 'Generating marketing content' },
  { name: 'expansion', description: 'Expanding data (cities, FAQs)' },
  { name: 'code', description: 'Generating code and components' },
  { name: 'review', description: 'Quality review and validation' },
];

/**
 * Template interpolation context
 */
export interface TemplateContext {
  site: SiteConfig;
  business: BusinessInfo;
  page?: {
    title: string;
    description: string;
    slug: string;
    type: string;
  };
  service?: {
    name: string;
    slug: string;
    description: string;
  };
  city?: {
    name: string;
    state: string;
    slug: string;
  };
}

/**
 * Component selection decision
 */
export interface ComponentSelection {
  section: string;
  component: string;
  variant: string;
  reason: string;
  props: Record<string, unknown>;
}

/**
 * Page structure definition
 */
export interface PageStructure {
  route: string;
  title: string;
  type: 'static' | 'dynamic';
  dynamicParam?: string;
  sections: ComponentSelection[];
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

/**
 * Site architecture plan
 */
export interface SiteArchitecture {
  pages: PageStructure[];
  components: string[];
  dataFiles: string[];
  theme: {
    colorScheme: string;
    style: string;
  };
}
