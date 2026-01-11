/**
 * LLM types for task routing between Claude and Groq
 */

export type LLMProvider = 'claude' | 'groq';

/**
 * Task types that determine which LLM handles them
 *
 * Claude handles: research, creative writing, strategic decisions
 * Groq/Llama handles: expansion, boilerplate, structured generation
 */
export type LLMTaskType =
  // Claude tasks (intelligent, creative, strategic)
  | 'research:industry'
  | 'research:competitors'
  | 'research:local-seo'
  | 'research:keywords'
  | 'content:hero-copy'
  | 'content:service-descriptions'
  | 'content:value-props'
  | 'content:about-page'
  | 'content:meta-descriptions'
  | 'content:blog-posts'
  | 'architecture:page-structure'
  | 'architecture:component-selection'
  | 'architecture:sitemap'
  | 'review:quality-check'
  | 'review:seo-audit'
  | 'review:accessibility'
  | 'conversation:interview'
  | 'conversation:clarify'
  // Groq/Llama tasks (expansion, boilerplate, structured)
  | 'expand:cities'
  | 'expand:neighborhoods'
  | 'expand:faqs'
  | 'expand:service-features'
  | 'expand:testimonials'
  | 'generate:component-code'
  | 'generate:page-code'
  | 'generate:schema-markup'
  | 'generate:data-files'
  | 'transform:template'
  | 'transform:content-interpolation';

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMTask {
  id: string;
  type: LLMTaskType;
  provider: LLMProvider;
  priority: 'high' | 'normal' | 'low';
  input: unknown;
  dependencies?: string[]; // Task IDs that must complete first
  metadata?: Record<string, unknown>;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface LLMUsage {
  tokens: TokenUsage;
  cost: number; // USD
  latencyMs: number;
}

export interface LLMResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  usage: LLMUsage;
  provider: LLMProvider;
  model: string;
  taskId: string;
}

export interface CostEstimate {
  claudeTokens: number;
  claudeCost: number;
  groqTokens: number;
  groqCost: number;
  totalCost: number;
  savings: number; // vs all-Claude
  savingsPercent: number;
}

export interface TaskRoutingDecision {
  taskType: LLMTaskType;
  provider: LLMProvider;
  reason: string;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCost: number;
}

/**
 * Configuration for LLM clients
 */
export interface LLMConfig {
  claude: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  groq: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
}

/**
 * Default LLM configuration
 */
export const DEFAULT_LLM_CONFIG: Omit<LLMConfig, 'claude' | 'groq'> & {
  claude: Omit<LLMConfig['claude'], 'apiKey'>;
  groq: Omit<LLMConfig['groq'], 'apiKey'>;
} = {
  claude: {
    model: 'claude-sonnet-4-20250514',
    maxTokens: 4096,
    temperature: 0.7,
  },
  groq: {
    model: 'llama-3.3-70b-versatile',
    maxTokens: 8192,
    temperature: 0.3,
  },
};

/**
 * Token pricing (USD per token)
 */
export const TOKEN_PRICING = {
  claude: {
    input: 0.000003,   // $3 per 1M tokens
    output: 0.000015,  // $15 per 1M tokens
  },
  groq: {
    input: 0.00000005,  // $0.05 per 1M tokens
    output: 0.00000008, // $0.08 per 1M tokens
  },
} as const;
