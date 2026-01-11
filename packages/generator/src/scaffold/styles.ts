/**
 * Generate style files
 */

import type { SiteConfig, GeneratedFile } from '@siteforge/shared';
import { COLOR_SCHEMES } from '@siteforge/shared';

export function generateStyleFiles(siteConfig: SiteConfig): GeneratedFile[] {
  return [generateGlobalsCss(siteConfig)];
}

function generateGlobalsCss(siteConfig: SiteConfig): GeneratedFile {
  const colorScheme = siteConfig.theme.colorScheme;
  const colors = (colorScheme !== 'custom' && colorScheme in COLOR_SCHEMES)
    ? COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES]
    : COLOR_SCHEMES.blue;

  const content = `@import "tailwindcss";

:root {
  /* Primary colors */
  --color-primary: ${colors.primary};
  --color-primary-dark: ${colors.primaryDark};
  --color-primary-light: ${colors.primaryLight};

  /* Secondary colors */
  --color-secondary: ${colors.secondary};

  /* Accent colors */
  --color-accent: ${colors.accent};
  --color-accent-dark: ${colors.accentDark};

  /* Neutral colors */
  --color-dark: #1e293b;
  --color-gray: #475569;
  --color-light: #f8fafc;
  --color-white: #ffffff;

  /* Background */
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-card: #f8fafc;
  --color-card-foreground: #1e293b;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-border: #e2e8f0;
}

@theme inline {
  --color-primary: var(--color-primary);
  --color-primary-dark: var(--color-primary-dark);
  --color-primary-light: var(--color-primary-light);
  --color-secondary: var(--color-secondary);
  --color-accent: var(--color-accent);
  --color-accent-dark: var(--color-accent-dark);
  --color-dark: var(--color-dark);
  --color-gray: var(--color-gray);
  --color-light: var(--color-light);
  --color-background: var(--color-background);
  --color-foreground: var(--color-foreground);
  --color-card: var(--color-card);
  --color-card-foreground: var(--color-card-foreground);
  --color-muted: var(--color-muted);
  --color-muted-foreground: var(--color-muted-foreground);
  --color-border: var(--color-border);

  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

body {
  color: var(--color-foreground);
  background: var(--color-background);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Button base styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--color-accent);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-accent-dark);
}

.btn-secondary {
  background-color: var(--color-primary);
  color: white;
}

.btn-secondary:hover {
  background-color: var(--color-primary-dark);
}

.btn-outline {
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
}

.btn-outline:hover {
  background-color: var(--color-primary);
  color: white;
}

/* Section spacing */
.section {
  padding: 4rem 1rem;
}

@media (min-width: 768px) {
  .section {
    padding: 5rem 2rem;
  }
}

@media (min-width: 1024px) {
  .section {
    padding: 7rem 2rem;
  }
}

/* Container */
.container {
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-out forwards;
}
`;

  return {
    path: 'src/app/globals.css',
    content,
    type: 'style',
    generator: 'template',
    size: 0,
  };
}
