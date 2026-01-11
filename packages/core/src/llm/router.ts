/**
 * LLM Router - Routes tasks to appropriate LLM provider
 *
 * Claude: Research, creative writing, strategic decisions, quality review
 * Groq/Llama: Expansion, boilerplate, structured generation
 */

import {
  type LLMTask,
  type LLMTaskType,
  type LLMProvider,
  type LLMResponse,
  type CostEstimate,
  type TaskRoutingDecision,
  TOKEN_PRICING,
  generateId,
} from '@siteforge/shared';
import { ClaudeClient, createClaudeClient } from './claude.js';
import { GroqClient, createGroqClient } from './groq.js';

/**
 * Task routing configuration
 */
const TASK_ROUTING: Record<LLMTaskType, LLMProvider> = {
  // Claude tasks (intelligent, creative, strategic)
  'research:industry': 'claude',
  'research:competitors': 'claude',
  'research:local-seo': 'claude',
  'research:keywords': 'claude',
  'content:hero-copy': 'claude',
  'content:service-descriptions': 'claude',
  'content:value-props': 'claude',
  'content:about-page': 'claude',
  'content:meta-descriptions': 'claude',
  'content:blog-posts': 'claude',
  'architecture:page-structure': 'claude',
  'architecture:component-selection': 'claude',
  'architecture:sitemap': 'claude',
  'review:quality-check': 'claude',
  'review:seo-audit': 'claude',
  'review:accessibility': 'claude',
  'conversation:interview': 'claude',
  'conversation:clarify': 'claude',

  // Groq/Llama tasks (expansion, boilerplate, structured)
  'expand:cities': 'groq',
  'expand:neighborhoods': 'groq',
  'expand:faqs': 'groq',
  'expand:service-features': 'groq',
  'expand:testimonials': 'groq',
  'generate:component-code': 'groq',
  'generate:page-code': 'groq',
  'generate:schema-markup': 'groq',
  'generate:data-files': 'groq',
  'transform:template': 'groq',
  'transform:content-interpolation': 'groq',
};

/**
 * Estimated token usage per task type
 */
const ESTIMATED_TOKENS: Record<LLMTaskType, { input: number; output: number }> = {
  // Claude tasks
  'research:industry': { input: 1500, output: 2000 },
  'research:competitors': { input: 1200, output: 1500 },
  'research:local-seo': { input: 1000, output: 1500 },
  'research:keywords': { input: 800, output: 1000 },
  'content:hero-copy': { input: 1000, output: 500 },
  'content:service-descriptions': { input: 600, output: 500 }, // per service
  'content:value-props': { input: 800, output: 400 },
  'content:about-page': { input: 1200, output: 1000 },
  'content:meta-descriptions': { input: 400, output: 200 }, // per page
  'content:blog-posts': { input: 1500, output: 2000 },
  'architecture:page-structure': { input: 1500, output: 1000 },
  'architecture:component-selection': { input: 1200, output: 800 },
  'architecture:sitemap': { input: 800, output: 600 },
  'review:quality-check': { input: 2000, output: 800 },
  'review:seo-audit': { input: 1500, output: 1000 },
  'review:accessibility': { input: 1200, output: 800 },
  'conversation:interview': { input: 800, output: 200 }, // per turn
  'conversation:clarify': { input: 500, output: 200 },

  // Groq tasks
  'expand:cities': { input: 500, output: 1000 }, // per batch
  'expand:neighborhoods': { input: 400, output: 800 },
  'expand:faqs': { input: 600, output: 1500 },
  'expand:service-features': { input: 400, output: 800 },
  'expand:testimonials': { input: 500, output: 1000 },
  'generate:component-code': { input: 800, output: 1500 }, // per component
  'generate:page-code': { input: 1000, output: 2000 }, // per page
  'generate:schema-markup': { input: 600, output: 800 },
  'generate:data-files': { input: 500, output: 1200 },
  'transform:template': { input: 800, output: 1200 },
  'transform:content-interpolation': { input: 400, output: 600 },
};

export interface RouterConfig {
  claudeApiKey?: string;
  groqApiKey?: string;
}

/**
 * LLM Router class for task distribution
 */
export class LLMRouter {
  private claude: ClaudeClient;
  private groq: GroqClient;
  private taskHistory: Map<string, LLMResponse<unknown>> = new Map();

  constructor(config?: RouterConfig) {
    this.claude = createClaudeClient(config?.claudeApiKey);
    this.groq = createGroqClient(config?.groqApiKey);
  }

  /**
   * Get the appropriate provider for a task type
   */
  getProvider(taskType: LLMTaskType): LLMProvider {
    return TASK_ROUTING[taskType];
  }

  /**
   * Get routing decision with reasoning
   */
  getRoutingDecision(taskType: LLMTaskType): TaskRoutingDecision {
    const provider = TASK_ROUTING[taskType];
    const tokens = ESTIMATED_TOKENS[taskType];
    const pricing = TOKEN_PRICING[provider];

    const estimatedCost =
      tokens.input * pricing.input + tokens.output * pricing.output;

    const reasons: Record<LLMProvider, string> = {
      claude: 'Requires creative thinking, strategic decisions, or quality assessment',
      groq: 'Structured generation, data expansion, or template transformation',
    };

    return {
      taskType,
      provider,
      reason: reasons[provider],
      estimatedInputTokens: tokens.input,
      estimatedOutputTokens: tokens.output,
      estimatedCost,
    };
  }

  /**
   * Execute a task using the appropriate provider
   */
  async execute<T>(task: LLMTask): Promise<LLMResponse<T>> {
    const provider = TASK_ROUTING[task.type];

    // Check dependencies
    if (task.dependencies?.length) {
      for (const depId of task.dependencies) {
        if (!this.taskHistory.has(depId)) {
          throw new Error(`Dependency task ${depId} has not completed`);
        }
      }
    }

    let response: LLMResponse<T>;

    if (provider === 'claude') {
      response = await this.executeClaudeTask<T>(task);
    } else {
      response = await this.executeGroqTask<T>(task);
    }

    // Store in history
    this.taskHistory.set(task.id, response as LLMResponse<unknown>);

    return response;
  }

  /**
   * Execute a Claude task
   */
  private async executeClaudeTask<T>(task: LLMTask): Promise<LLMResponse<T>> {
    const { system, prompt } = this.buildPrompt(task);

    const claudeResponse = await this.claude.chat({
      system,
      messages: [{ role: 'user', content: prompt }],
      taskId: task.id,
    });

    // Parse response based on task type
    let data: T | undefined;
    try {
      if (this.shouldParseAsJson(task.type)) {
        data = JSON.parse(claudeResponse.content) as T;
      } else {
        data = claudeResponse.content as unknown as T;
      }
    } catch {
      data = claudeResponse.content as unknown as T;
    }

    return this.claude.toStandardResponse(claudeResponse, task.id, data);
  }

  /**
   * Execute a Groq task
   */
  private async executeGroqTask<T>(task: LLMTask): Promise<LLMResponse<T>> {
    const { system, prompt } = this.buildPrompt(task);
    const useJsonMode = this.shouldParseAsJson(task.type);

    const groqResponse = await this.groq.chat({
      system,
      messages: [{ role: 'user', content: prompt }],
      jsonMode: useJsonMode,
      taskId: task.id,
    });

    let data: T | undefined;
    try {
      if (useJsonMode) {
        data = JSON.parse(groqResponse.content) as T;
      } else {
        data = groqResponse.content as unknown as T;
      }
    } catch {
      data = groqResponse.content as unknown as T;
    }

    return this.groq.toStandardResponse(groqResponse, task.id, data);
  }

  /**
   * Build system prompt and user prompt for a task
   */
  private buildPrompt(task: LLMTask): { system: string; prompt: string } {
    // This would be expanded with task-specific prompts
    const input = task.input as Record<string, unknown>;

    const baseSystem = this.getSystemPromptForTask(task.type);
    const system = input.systemPrompt
      ? `${baseSystem}\n\n${input.systemPrompt}`
      : baseSystem;

    const prompt = (input.prompt as string) || JSON.stringify(input);

    return { system, prompt };
  }

  /**
   * Get system prompt for task type
   */
  private getSystemPromptForTask(taskType: LLMTaskType): string {
    const prompts: Partial<Record<LLMTaskType, string>> = {
      'research:industry':
        'You are a market research expert specializing in local service businesses. Provide detailed, actionable insights.',
      'content:hero-copy':
        'You are an expert copywriter specializing in conversion-focused headlines and CTAs for service businesses.',
      'content:service-descriptions':
        'You are a marketing copywriter creating compelling service descriptions that highlight benefits and build trust.',
      'expand:cities':
        'You are a local SEO expert generating city-specific content data. Return valid JSON arrays.',
      'expand:faqs':
        'You are a content strategist creating helpful FAQ content. Return valid JSON arrays.',
      'generate:component-code':
        'You are an expert React/Next.js developer. Generate clean, production-ready TypeScript code.',
    };

    return prompts[taskType] || 'You are a helpful assistant.';
  }

  /**
   * Determine if task output should be parsed as JSON
   */
  private shouldParseAsJson(taskType: LLMTaskType): boolean {
    const jsonTasks: LLMTaskType[] = [
      'expand:cities',
      'expand:neighborhoods',
      'expand:faqs',
      'expand:service-features',
      'expand:testimonials',
      'generate:schema-markup',
      'generate:data-files',
      'architecture:page-structure',
      'architecture:component-selection',
      'architecture:sitemap',
      'research:keywords',
    ];
    return jsonTasks.includes(taskType);
  }

  /**
   * Estimate cost for a set of tasks
   */
  estimateCost(taskTypes: LLMTaskType[]): CostEstimate {
    let claudeInputTokens = 0;
    let claudeOutputTokens = 0;
    let groqInputTokens = 0;
    let groqOutputTokens = 0;

    for (const taskType of taskTypes) {
      const provider = TASK_ROUTING[taskType];
      const tokens = ESTIMATED_TOKENS[taskType];

      if (provider === 'claude') {
        claudeInputTokens += tokens.input;
        claudeOutputTokens += tokens.output;
      } else {
        groqInputTokens += tokens.input;
        groqOutputTokens += tokens.output;
      }
    }

    const claudeCost =
      claudeInputTokens * TOKEN_PRICING.claude.input +
      claudeOutputTokens * TOKEN_PRICING.claude.output;

    const groqCost =
      groqInputTokens * TOKEN_PRICING.groq.input +
      groqOutputTokens * TOKEN_PRICING.groq.output;

    // Calculate what it would cost if all tasks went to Claude
    const allClaudeCost =
      (claudeInputTokens + groqInputTokens) * TOKEN_PRICING.claude.input +
      (claudeOutputTokens + groqOutputTokens) * TOKEN_PRICING.claude.output;

    const totalCost = claudeCost + groqCost;
    const savings = allClaudeCost - totalCost;
    const savingsPercent = allClaudeCost > 0 ? (savings / allClaudeCost) * 100 : 0;

    return {
      claudeTokens: claudeInputTokens + claudeOutputTokens,
      claudeCost,
      groqTokens: groqInputTokens + groqOutputTokens,
      groqCost,
      totalCost,
      savings,
      savingsPercent,
    };
  }

  /**
   * Create a task object
   */
  createTask(
    type: LLMTaskType,
    input: unknown,
    options?: {
      priority?: 'high' | 'normal' | 'low';
      dependencies?: string[];
      metadata?: Record<string, unknown>;
    }
  ): LLMTask {
    return {
      id: generateId('task'),
      type,
      provider: TASK_ROUTING[type],
      priority: options?.priority || 'normal',
      input,
      dependencies: options?.dependencies,
      metadata: options?.metadata,
    };
  }

  /**
   * Get task result from history
   */
  getTaskResult<T>(taskId: string): LLMResponse<T> | undefined {
    return this.taskHistory.get(taskId) as LLMResponse<T> | undefined;
  }

  /**
   * Clear task history
   */
  clearHistory(): void {
    this.taskHistory.clear();
  }

  /**
   * Get Claude client for direct access
   */
  getClaude(): ClaudeClient {
    return this.claude;
  }

  /**
   * Get Groq client for direct access
   */
  getGroq(): GroqClient {
    return this.groq;
  }
}

/**
 * Create LLM router from environment variables
 */
export function createRouter(config?: RouterConfig): LLMRouter {
  return new LLMRouter(config);
}
