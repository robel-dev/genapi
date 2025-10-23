/**
 * Storage abstraction layer for GenAPI
 * Supports both in-memory (dev) and Upstash Redis (production)
 * Phase C: Storage with TTL support
 */

import { Redis } from '@upstash/redis';

export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { ex?: number }): Promise<void>;
  del(key: string): Promise<void>;
}

/**
 * In-Memory Storage Adapter (for development)
 * Implements TTL with setTimeout for expiration
 */
class InMemoryAdapter implements StorageAdapter {
  private store: Map<string, string> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(
    key: string,
    value: string,
    options?: { ex?: number }
  ): Promise<void> {
    // Clear existing timer if any
    const existingTimer = this.timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set the value
    this.store.set(key, value);

    // Set expiration timer if TTL is provided
    if (options?.ex) {
      const timer = setTimeout(() => {
        this.store.delete(key);
        this.timers.delete(key);
        console.log(`[InMemory] Expired key: ${key}`);
      }, options.ex * 1000);

      this.timers.set(key, timer);
    }
  }

  async del(key: string): Promise<void> {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
    this.store.delete(key);
  }

  // Debug helper
  size(): number {
    return this.store.size;
  }

  keys(): string[] {
    return Array.from(this.store.keys());
  }
}

/**
 * Upstash Redis Adapter (for production)
 */
class UpstashAdapter implements StorageAdapter {
  private client: Redis;

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set'
      );
    }

    this.client = new Redis({
      url,
      token,
    });
  }

  async get(key: string): Promise<string | null> {
    const value = await this.client.get<string>(key);
    return value;
  }

  async set(
    key: string,
    value: string,
    options?: { ex?: number }
  ): Promise<void> {
    if (options?.ex) {
      await this.client.setex(key, options.ex, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}

/**
 * Global singleton storage adapter
 * Uses globalThis to persist across Next.js serverless function invocations
 */
const globalForStorage = globalThis as unknown as {
  storageAdapter: StorageAdapter | undefined;
};

/**
 * Factory function to get the appropriate storage adapter
 */
function createStorageAdapter(): StorageAdapter {
  const provider = process.env.STORAGE_PROVIDER || 'memory';

  if (provider === 'upstash' || provider === 'redis') {
    try {
      return new UpstashAdapter();
    } catch (error) {
      console.warn(
        '[Storage] Failed to initialize Upstash, falling back to in-memory:',
        error
      );
      return new InMemoryAdapter();
    }
  }

  // Default to in-memory for development
  console.log('[Storage] Using in-memory storage adapter');
  return new InMemoryAdapter();
}

// Export singleton instance with global persistence
export const store =
  globalForStorage.storageAdapter ?? createStorageAdapter();

if (process.env.NODE_ENV !== 'production') {
  globalForStorage.storageAdapter = store;
}

// Export for testing
export { InMemoryAdapter, UpstashAdapter };

