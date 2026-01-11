/**
 * Claude client for intelligent tasks
 * Uses Anthropic SDK for communication with Claude API
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  type LLMMessage,
  type LLMResponse,
  type LLMUsage,
  type TokenUsage,
  TOKEN_PRICING,
  DEFAULT_LLM_CONFIG,
} from '@siteforge/shared';

export interface ClaudeConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeChatParams {
  system: string;
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
  taskId?: string;
}

export interface ClaudeStreamParams extends ClaudeChatParams {
  onToken?: (token: string) => void;
  onComplete?: (response: ClaudeResponse) => void;
}

export interface ClaudeResponse {
  content: string;
  usage: LLMUsage;
  stopReason: string;
  model: string;
}

/**
 * Claude client wrapper for Anthropic API
 */
export class ClaudeClient {
  private client: Anthropic;
  private model: string;
  private defaultMaxTokens: number;
  private defaultTemperature: number;

  constructor(config: ClaudeConfig) {
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.model = config.model || DEFAULT_LLM_CONFIG.claude.model;
    this.defaultMaxTokens = config.maxTokens || DEFAULT_LLM_CONFIG.claude.maxTokens;
    this.defaultTemperature = config.temperature || DEFAULT_LLM_CONFIG.claude.temperature;
  }

  /**
   * Send a chat message to Claude
   */
  async chat(params: ClaudeChatParams): Promise<ClaudeResponse> {
    const startTime = Date.now();

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: params.maxTokens || this.defaultMaxTokens,
      temperature: params.temperature ?? this.defaultTemperature,
      system: params.system,
      messages: params.messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    });

    const latencyMs = Date.now() - startTime;
    const tokens: TokenUsage = {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
    };

    const cost = this.calculateCost(tokens);

    const content =
      response.content[0].type === 'text' ? response.content[0].text : '';

    return {
      content,
      usage: {
        tokens,
        cost,
        latencyMs,
      },
      stopReason: response.stop_reason || 'unknown',
      model: this.model,
    };
  }

  /**
   * Stream a chat response from Claude
   */
  async stream(params: ClaudeStreamParams): Promise<ClaudeResponse> {
    const startTime = Date.now();
    let fullContent = '';
    let inputTokens = 0;
    let outputTokens = 0;

    const stream = await this.client.messages.stream({
      model: this.model,
      max_tokens: params.maxTokens || this.defaultMaxTokens,
      temperature: params.temperature ?? this.defaultTemperature,
      system: params.system,
      messages: params.messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        const token = event.delta.text;
        fullContent += token;
        params.onToken?.(token);
      } else if (event.type === 'message_delta' && event.usage) {
        outputTokens = event.usage.output_tokens;
      } else if (event.type === 'message_start' && event.message.usage) {
        inputTokens = event.message.usage.input_tokens;
      }
    }

    const latencyMs = Date.now() - startTime;
    const tokens: TokenUsage = {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
    };

    const response: ClaudeResponse = {
      content: fullContent,
      usage: {
        tokens,
        cost: this.calculateCost(tokens),
        latencyMs,
      },
      stopReason: 'end_turn',
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
   * JSON-mode completion (instruct to return JSON)
   */
  async json<T>(
    prompt: string,
    options?: {
      system?: string;
      maxTokens?: number;
    }
  ): Promise<T> {
    const systemPrompt =
      (options?.system || '') +
      '\n\nIMPORTANT: You must respond with valid JSON only. No markdown, no explanation, just the JSON object.';

    const response = await this.chat({
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      maxTokens: options?.maxTokens,
      temperature: 0.3, // Lower temperature for structured output
    });

    try {
      // Try to extract JSON from the response
      let jsonStr = response.content.trim();

      // Remove markdown code blocks if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }

      return JSON.parse(jsonStr.trim()) as T;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Convert Claude response to standard LLMResponse format
   */
  toStandardResponse<T>(
    response: ClaudeResponse,
    taskId: string,
    data?: T
  ): LLMResponse<T> {
    return {
      success: true,
      data,
      usage: response.usage,
      provider: 'claude',
      model: response.model,
      taskId,
    };
  }

  /**
   * Calculate cost based on token usage
   */
  private calculateCost(tokens: TokenUsage): number {
    const inputCost = tokens.inputTokens * TOKEN_PRICING.claude.input;
    const outputCost = tokens.outputTokens * TOKEN_PRICING.claude.output;
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
 * Create Claude client from environment variables
 */
export function createClaudeClient(apiKey?: string): ClaudeClient {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error('ANTHROPIC_API_KEY is required');
  }

  return new ClaudeClient({
    apiKey: key,
    model: process.env.CLAUDE_MODEL,
  });
}
