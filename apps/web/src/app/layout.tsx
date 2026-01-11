import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SiteForge - AI Website Builder',
  description: 'Build professional websites in minutes with AI. Search domains, customize your site, and launch instantly.',
  keywords: ['website builder', 'AI', 'domain purchase', 'Vercel', 'Next.js'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
