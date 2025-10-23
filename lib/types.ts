/**
 * Type definitions for GenAPI
 */

export interface MockData {
  token: string;
  prompt: string;
  payload: any;
  created_at: string;
  expires_at: string;
  path: string;
  private: boolean;
  cors: string;
  secret?: string;
}

export interface GenerateRequest {
  prompt: string;
  ttl_seconds?: number;
  path?: string;
  items?: number;
  private?: boolean;
  cors?: string;
}

export interface GenerateResponse {
  url: string;
  token: string;
  expires_at: string;
  preview: any;
  secret?: string;
}

