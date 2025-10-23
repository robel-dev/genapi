/**
 * Tests for LLM integration
 * Phase D: Testing JSON extraction and model configuration
 */

import { describe, it, expect } from 'vitest';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from '../lib/llm';

describe('LLM Configuration', () => {
  it('should have available models defined', () => {
    expect(AVAILABLE_MODELS).toBeDefined();
    expect(Object.keys(AVAILABLE_MODELS).length).toBeGreaterThan(0);
  });

  it('should have default model set', () => {
    expect(DEFAULT_MODEL).toBe('openai/gpt-4o-mini');
  });

  it('should have model info for all models', () => {
    Object.entries(AVAILABLE_MODELS).forEach(([id, info]) => {
      expect(info.name).toBeDefined();
      expect(info.provider).toBeDefined();
      expect(info.cost).toBeDefined();
      expect(info.speed).toBeDefined();
      expect(info.quality).toBeDefined();
      expect(info.description).toBeDefined();
    });
  });

  it('should include expected models', () => {
    const modelIds = Object.keys(AVAILABLE_MODELS);
    expect(modelIds).toContain('openai/gpt-4o-mini');
    expect(modelIds).toContain('anthropic/claude-3.5-sonnet');
    expect(modelIds).toContain('google/gemini-pro-1.5');
    expect(modelIds).toContain('meta-llama/llama-3.1-8b-instruct');
  });
});

// Note: We don't test actual API calls here as they require:
// 1. OpenRouter API key
// 2. Network access
// 3. Can be expensive
// 
// Real API tests should be done manually or in a separate
// integration test suite with proper API key management

