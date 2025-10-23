import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            GenAPI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Ephemeral AI Mock API Generator
          </p>
          <p className="text-base text-gray-500 dark:text-gray-500 max-w-xl mx-auto">
            Transform natural language prompts into live, temporary REST APIs instantly.
            Perfect for prototyping, testing, and rapid development.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/generate"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Generate API
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            View Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🚀 Instant APIs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Describe your data in plain English and get a live endpoint in seconds
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">⏱️ Temporary</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Endpoints auto-expire after 24 hours (configurable) - no cleanup needed
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🤖 AI-Powered</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              LLM generates realistic, structured JSON matching your requirements
            </p>
          </div>
        </div>

        <div className="pt-8 text-center text-sm text-gray-500">
          <p>Built with Next.js, OpenRouter, and Upstash Redis</p>
        </div>
      </div>
    </main>
  );
}

