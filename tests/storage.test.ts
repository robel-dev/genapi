/**
 * Tests for storage abstraction layer
 * Phase C: Testing in-memory adapter with TTL
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryAdapter } from '../lib/store';

describe('InMemoryAdapter', () => {
  let adapter: InMemoryAdapter;

  beforeEach(() => {
    adapter = new InMemoryAdapter();
  });

  it('should store and retrieve a value', async () => {
    await adapter.set('test-key', 'test-value');
    const value = await adapter.get('test-key');
    expect(value).toBe('test-value');
  });

  it('should return null for non-existent key', async () => {
    const value = await adapter.get('non-existent');
    expect(value).toBeNull();
  });

  it('should delete a value', async () => {
    await adapter.set('test-key', 'test-value');
    await adapter.del('test-key');
    const value = await adapter.get('test-key');
    expect(value).toBeNull();
  });

  it('should expire a value after TTL', async () => {
    await adapter.set('expire-key', 'expire-value', { ex: 1 }); // 1 second TTL
    
    // Should exist immediately
    let value = await adapter.get('expire-key');
    expect(value).toBe('expire-value');
    
    // Wait for expiration (1.5 seconds to be safe)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Should be expired
    value = await adapter.get('expire-key');
    expect(value).toBeNull();
  });

  it('should update TTL when setting same key again', async () => {
    await adapter.set('update-key', 'value1', { ex: 10 });
    await adapter.set('update-key', 'value2', { ex: 1 });
    
    // Should have new value
    const value = await adapter.get('update-key');
    expect(value).toBe('value2');
    
    // Should expire with new TTL (1 second)
    await new Promise(resolve => setTimeout(resolve, 1500));
    const expiredValue = await adapter.get('update-key');
    expect(expiredValue).toBeNull();
  });

  it('should store JSON data', async () => {
    const data = { name: 'Test', value: 123 };
    await adapter.set('json-key', JSON.stringify(data));
    const retrieved = await adapter.get('json-key');
    expect(JSON.parse(retrieved!)).toEqual(data);
  });
});

