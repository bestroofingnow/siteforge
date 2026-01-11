/**
 * Generate configuration files
 */

import type { SiteConfig, GeneratedFile } from '@siteforge/shared';

export function generateConfigFiles(siteConfig: SiteConfig): GeneratedFile[] {
  return [
    generatePackageJson(siteConfig),
    generateTsConfig(),
    generateNextConfig(siteConfig),
    generatePostCssConfig(),
    generateEslintConfig(),
    generateGitignore(),
  ];
}

function generatePackageJson(siteConfig: SiteConfig): GeneratedFile {
  const packageJson = {
    name: siteConfig.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      next: '^15.3.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'lucide-react': '^0.460.0',
      clsx: '^2.1.0',
      'framer-motion': '^12.0.0',
    },
    devDependencies: {
      typescript: '^5.5.0',
      '@types/node': '^20.0.0',
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      '@tailwindcss/postcss': '^4.0.0',
      tailwindcss: '^4.0.0',
      postcss: '^8.0.0',
      eslint: '^9.0.0',
      'eslint-config-next': '^15.0.0',
    },
  };

  return {
    path: 'package.json',
    content: JSON.stringify(packageJson, null, 2),
    type: 'config',
    generator: 'template',
    size: 0,
  };
}

function generateTsConfig(): GeneratedFile {
  const tsconfig = {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: {
        '@/*': ['./src/*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  };

  return {
    path: 'tsconfig.json',
    content: JSON.stringify(tsconfig, null, 2),
    type: 'config',
    generator: 'template',
    size: 0,
  };
}

function generateNextConfig(siteConfig: SiteConfig): GeneratedFile {
  const content = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
`;

  return {
    path: 'next.config.ts',
    content,
    type: 'config',
    generator: 'template',
    size: 0,
  };
}

function generatePostCssConfig(): GeneratedFile {
  const content = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`;

  return {
    path: 'postcss.config.mjs',
    content,
    type: 'config',
    generator: 'template',
    size: 0,
  };
}

function generateEslintConfig(): GeneratedFile {
  const content = `import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
`;

  return {
    path: 'eslint.config.mjs',
    content,
    type: 'config',
    generator: 'template',
    size: 0,
  };
}

function generateGitignore(): GeneratedFile {
  const content = `# Dependencies
node_modules/
.pnp/
.pnp.js

# Build
.next/
out/
dist/

# Testing
coverage/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# TypeScript
*.tsbuildinfo
next-env.d.ts
`;

  return {
    path: '.gitignore',
    content,
    type: 'config',
    generator: 'template',
    size: 0,
  };
}
