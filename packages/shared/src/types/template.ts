/**
 * Template types for the templates package
 */

import type { IndustryType, ServiceDefinition, ValueProp } from './business.js';
import type { ColorScheme, ThemeStyle } from './site.js';

/**
 * Industry-specific configuration template
 */
export interface IndustryConfig {
  id: IndustryType;
  name: string;
  displayName: string;

  // Default services for this industry
  defaultServices: ServiceDefinition[];

  // Default value propositions
  defaultValueProps: ValueProp[];

  // FAQ templates with placeholders
  faqTemplates: FAQTemplate[];

  // Recommended color schemes
  colorSchemes: {
    recommended: ColorScheme;
    alternatives: ColorScheme[];
  };

  // Common SEO keywords for this industry
  seoKeywords: string[];

  // Local SEO keyword patterns
  localKeywordPatterns: string[];

  // Schema.org type for this business
  schemaType: string;

  // Default certifications/credentials
  commonCertifications: string[];

  // Emergency service availability
  hasEmergencyService: boolean;

  // Typical price range display
  priceRangeDisplay?: string;
}

export interface FAQTemplate {
  questionTemplate: string;
  answerTemplate: string;
  category: string;
  variables: string[]; // e.g., ['SERVICE', 'CITY', 'PRICE_RANGE']
}

/**
 * Component template definition
 */
export interface ComponentTemplate {
  id: string;
  name: string;
  category: 'hero' | 'services' | 'testimonials' | 'cta' | 'faq' | 'layout' | 'ui';
  variant: string;
  description: string;
  template: string; // Handlebars template
  props: ComponentProp[];
  dependencies: string[]; // Other components or packages
  preview?: string; // Preview image URL
}

export interface ComponentProp {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  default?: unknown;
  description: string;
}

/**
 * Page template definition
 */
export interface PageTemplate {
  id: string;
  name: string;
  route: string; // e.g., '/services/[slug]'
  type: 'static' | 'dynamic';
  template: string;
  defaultSections: string[]; // Component IDs
  metadata: {
    titleTemplate: string;
    descriptionTemplate: string;
  };
}

/**
 * Config file template
 */
export interface ConfigTemplate {
  id: string;
  filename: string;
  template: string;
  description: string;
}

/**
 * Theme/style configuration
 */
export interface ThemeTemplate {
  id: string;
  name: string;
  style: ThemeStyle;
  colors: Record<ColorScheme, ThemeColors>;
  typography: TypographyConfig;
  spacing: SpacingConfig;
}

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  accentDark: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  border: string;
}

export interface TypographyConfig {
  fontFamily: string;
  fontFamilyHeading?: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface SpacingConfig {
  section: {
    sm: string;
    md: string;
    lg: string;
  };
  container: {
    maxWidth: string;
    padding: string;
  };
  gap: {
    sm: string;
    md: string;
    lg: string;
  };
}

/**
 * Complete template registry
 */
export interface TemplateRegistry {
  industries: Record<IndustryType, IndustryConfig>;
  components: Record<string, ComponentTemplate>;
  pages: Record<string, PageTemplate>;
  configs: Record<string, ConfigTemplate>;
  themes: Record<string, ThemeTemplate>;
}
