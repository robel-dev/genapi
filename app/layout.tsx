import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GenAPI - Ephemeral AI Mock API',
  description: 'Generate temporary REST APIs from natural language prompts',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

