'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ModelInfo {
  name: string;
  provider: string;
  cost: string;
  speed: string;
  quality: string;
  description: string;
}

interface Models {
  [key: string]: ModelInfo;
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [items, setItems] = useState('10');
  const [ttl, setTtl] = useState('86400');
  const [path, setPath] = useState('');
  const [model, setModel] = useState('openai/gpt-4o-mini');
  const [models, setModels] = useState<Models>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Load available models
  useEffect(() => {
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => setModels(data.models))
      .catch((err) => console.error('Failed to load models:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          items: parseInt(items) || 10,
          ttl_seconds: parseInt(ttl) || 86400,
          path: path || undefined,
          model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generate API
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create a temporary REST API from a natural language prompt
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            ← Back
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-6">
            {/* Prompt */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Prompt <span className="text-red-500">*</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create 20 football players with name, team, goals, assists, nationality, age"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                rows={3}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Describe the JSON data you want to generate
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                AI Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
              >
                {Object.entries(models).map(([id, info]) => (
                  <option key={id} value={id}>
                    {info.name} - {info.cost} ({info.quality} quality, {info.speed})
                  </option>
                ))}
              </select>
              {models[model] && (
                <p className="text-sm text-gray-500 mt-1">
                  {models[model].description}
                </p>
              )}
            </div>

            {/* Grid for smaller inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Items */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Number of Items
                </label>
                <input
                  type="number"
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>

              {/* TTL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  TTL (seconds)
                </label>
                <select
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                >
                  <option value="3600">1 hour</option>
                  <option value="86400">24 hours (default)</option>
                  <option value="259200">3 days</option>
                  <option value="604800">7 days</option>
                </select>
              </div>

              {/* Path */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Custom Path (optional)
                </label>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="e.g., players"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !prompt}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Generate API'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Error: {error}
            </p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* URL */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
                ✅ API Generated Successfully!
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Your API URL:
                  </p>
                  <div className="flex gap-2">
                    <code className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm break-all">
                      {result.url}
                    </code>
                    <button
                      onClick={() => copyToClipboard(result.url)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Token:
                    </span>{' '}
                    <code className="text-gray-900 dark:text-gray-100">
                      {result.token}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Model:
                    </span>{' '}
                    <code className="text-gray-900 dark:text-gray-100">
                      {result.model}
                    </code>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Expires:
                    </span>{' '}
                    <code className="text-gray-900 dark:text-gray-100">
                      {new Date(result.expires_at).toLocaleString()}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Data Preview</h3>
              <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(result.preview, null, 2)}
              </pre>
            </div>

            {/* Usage Example */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Usage Example</h3>
              <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                {`// JavaScript/TypeScript
const data = await fetch('${result.url}')
  .then(res => res.json());

console.log(data);

// cURL
curl ${result.url}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

