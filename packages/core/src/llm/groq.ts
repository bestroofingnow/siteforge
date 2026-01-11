/**
 * Groq client for Llama 4 Maverick
 * Used for cost-efficient expansion and boilerplate generation
 */

import Groq from 'groq-sdk';
import {
  type LLMMessage,
  type LLMResponse,
  type LLMUsage,
  type TokenUsage,
  TOKEN_PRICING,
  DEFAULT_LLM_CONFIG,
} from '@siteforge/shared';

export interface GroqConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GroqChatParams {
  system: string;
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
  jsonMode?: boolean;
  taskId?: string;
}

export interface GroqResponse {
  content: string;
  usage: LLMUsage;
  finishReason: string;
  model: string;
}

/**
 * Groq client wrapper for Llama models
 */
export class GroqClient {
  private client: Groq;
  private model: string;
  private defaultMaxTokens: number;
  private defaultTemperature: number;

  constructor(config: GroqConfig) {
    this.client = new Groq({ apiKey: config.apiKey });
    this.model = config.model || DEFAULT_LLM_CONFIG.groq.model;
    this.defaultMaxTokens = config.maxTokens || DEFAULT_LLM_CONFIG.groq.maxTokens;
    this.defaultTemperature = config.temperature || DEFAULT_LLM_CONFIG.groq.temperature;
  }

  /**
   * Send a chat message to Groq
   */
  async chat(params: GroqChatParams): Promise<GroqResponse> {
    const startTime = Date.now();

    const messages = [
      { role: 'system' as const, content: params.system },
      ...params.messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: params.maxTokens || this.defaultMaxTokens,
      temperature: params.temperature ?? this.defaultTemperature,
      messages,
      response_format: params.jsonMode ? { type: 'json_object' } : undefined,
    });

    const latencyMs = Date.now() - startTime;
    const usage = response.usage;

    const tokens: TokenUsage = {
      inputTokens: usage?.prompt_tokens || 0,
      outputTokens: usage?.completion_tokens || 0,
      totalTokens: usage?.total_tokens || 0,
    };

    const cost = this.calculateCost(tokens);
    const content = response.choices[0]?.message?.content || '';

    return {
      content,
      usage: {
        tokens,
        cost,
        latencyMs,
      },
      finishReason: response.choices[0]?.finish_reason || 'unknown',
      model: this.model,
    };
  }

  /**
   * Stream a chat response from Groq
   */
  async stream(
    params: GroqChatParams & {
      onToken?: (token: string) => void;
      onComplete?: (response: GroqResponse) => void;
    }
  ): Promise<GroqResponse> {
    const startTime = Date.now();
    let fullContent = '';

    const messages = [
      { role: 'system' as const, content: params.system },
      ...params.messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const stream = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: params.maxTokens || this.defaultMaxTokens,
      temperature: params.temperature ?? this.defaultTemperature,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || '';
      if (token) {
        fullContent += token;
        params.onToken?.(token);
      }
    }

    const latencyMs = Date.now() - startTime;

    // Estimate tokens for streaming (Groq doesn't provide usage in streaming)
    const estimatedInputTokens = Math.ceil(
      messages.reduce((acc, m) => acc + (m.content?.toString().length || 0), 0) / 4
    );
    const estimatedOutputTokens = Math.ceil(fullContent.length / 4);

    const tokens: TokenUsage = {
      inputTokens: estimatedInputTokens,
      outputTokens: estimatedOutputTokens,
      totalTokens: estimatedInputTokens + estimatedOutputTokens,
    };

    const response: GroqResponse = {
      content: fullContent,
      usage: {
        tokens,
        cost: this.calculateCost(tokens),
        latencyMs,
      },
      finishReason: 'stop',
      model: this.model,
    };

    params.onComplete?.(response);
    return response;
  }

  /**
   * Simple single-turn completion
   */
  async complete(
    prompt: string,
    options?: {
      system?: string;
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<string> {
    const response = await this.chat({
      system: options?.system || 'You are a helpful assistant.',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: options?.maxTokens,
      temperature: options?.temperature,
    });
    return response.content;
  }

  /**
   * JSON-mode completion
   */
  async json<T>(
    prompt: string,
    options?: {
      system?: string;
      maxTokens?: number;
    }
  ): Promise<T> {
    const response = await this.chat({
      system:
        (options?.system || 'You are a helpful assistant.') +
        '\n\nYou must respond with valid JSON only.',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: options?.maxTokens,
      temperature: 0.1, // Very low for structured output
      jsonMode: true,
    });

    try {
      return JSON.parse(response.content) as T;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate code from template
   */
  async generateCode(
    template: string,
    context: Record<string, unknown>,
    options?: {
      language?: string;
      maxTokens?: number;
    }
  ): Promise<string> {
    const language = options?.language || 'typescript';

    const system = `You are an expert ${language} developer. Generate clean, production-ready code based on the template and context provided. Output only the code, no explanations.`;

    const prompt = `Template:
\`\`\`${language}
${template}
\`\`\`

Context (replace placeholders with these values):
${JSON.stringify(context, null, 2)}

Generate the complete code with all placeholders replaced:`;

    const response = await this.chat({
      system,
      messages: [{ role: 'user', content: prompt }],
      maxTokens: options?.maxTokens || 4096,
      temperature: 0.2,
    });

    // Clean up code fences if present
    let code = response.content.trim();
    if (code.startsWith('```')) {
      const lines = code.split('\n');
      lines.shift(); // Remove opening fence
      if (lines[lines.length - 1] === '```') {
        lines.pop(); // Remove closing fence
      }
      code = lines.join('\n');
    }

    return code;
  }

  /**
   * Expand data from patterns
   */
  async expand<T>(
    pattern: T,
    count: number,
    context?: string
  ): Promise<T[]> {
    const system = `You are a data generation expert. Given a pattern/example, generate ${count} similar items following the same structure. Return a JSON array.`;

    const prompt = `Pattern:
${JSON.stringify(pattern, null, 2)}

${context ? `Context: ${context}\n\n` : ''}Generate ${count} unique items following this pattern. Return a JSON array:`;

    const response = await this.chat({
      system,
      messages: [{ role: 'user', content: prompt }],
      jsonMode: true,
      temperature: 0.5,
    });

    const result = JSON.parse(response.content);
    return Array.isArray(result) ? result : [result];
  }

  /**
   * Convert Groq response to standard LLMResponse format
   */
  toStandardResponse<T>(
    response: GroqResponse,
    taskId: string,
    data?: T
  ): LLMResponse<T> {
    return {
      success: true,
      data,
      usage: response.usage,
      provider: 'groq',
      model: response.model,
      taskId,
    };
  }

  /**
   * Calculate cost based on token usage
   */
  private calculateCost(tokens: TokenUsage): number {
    const inputCost = tokens.inputTokens * TOKEN_PRICING.groq.input;
    const outputCost = tokens.outputTokens * TOKEN_PRICING.groq.output;
    return inputCost + outputCost;
  }

  /**
   * Get current model
   */
  getModel(): string {
    return this.model;
  }

  /**
   * Update model
   */
  setModel(model: string): void {
    this.model = model;
  }
}

/**
 * Create Groq client from environment variables
 */
export function createGroqClient(apiKey?: string): GroqClient {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error('GROQ_API_KEY is required');
  }

  return new GroqClient({
    apiKey: key,
    model: process.env.GROQ_MODEL,
  });
}
