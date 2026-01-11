/**
 * Site configuration types - generated from BusinessInfo
 */

export interface FormattedAddress {
  street?: string;
  city: string;
  state: string;
  stateAbbr: string;
  zip: string;
  full: string;
  formatted: string;
}

export interface SocialConfig {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  yelp?: string;
  google?: string;
}

export interface RatingConfig {
  value: number;
  count: number;
  source: string;
  display: string;
}

export interface ValuePropConfig {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceConfig {
  title: string;
  shortTitle: string;
  slug: string;
  description: string;
  shortDescription: string;
  features: string[];
  benefits: string[];
  heroImage?: string;
  icon: string;
  keywords: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface CityConfig {
  name: string;
  state: string;
  stateAbbr: string;
  slug: string;
  priority: 'high' | 'medium' | 'low';
  county?: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  nearbyAreas: string[];
  neighborhoods: string[];
  localContent?: {
    intro: string;
    areaInfo: string;
  };
}

export interface HoursConfig {
  weekdays: string;
  saturday: string;
  sunday: string;
  emergency: boolean;
}

export interface SEOConfig {
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  ogImage?: string;
  canonicalBase: string;
}

export type ColorScheme = 'blue' | 'green' | 'amber' | 'red' | 'neutral' | 'custom';
export type ThemeStyle = 'professional' | 'modern' | 'bold';

export interface ThemeConfig {
  colorScheme: ColorScheme;
  customColors?: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    accentDark: string;
  };
  style: ThemeStyle;
  darkMode: boolean;
}

/**
 * Complete site configuration (maps to lib/constants.ts SITE_CONFIG pattern)
 */
export interface SiteConfig {
  // Meta
  name: string;
  legalName: string;
  domain: string;
  tagline: string;
  description: string;

  // Contact
  phone: string;
  phoneDisplay: string;
  phoneLink: string;
  email: string;
  addresses: FormattedAddress[];
  primaryAddress: FormattedAddress;

  // Hours
  hours: HoursConfig;

  // Social
  social: SocialConfig;

  // Rating (aggregated for display)
  rating: RatingConfig;

  // Credentials
  yearsInBusiness: number;
  certifications: string[];
  licenses: string[];
  insurance: string[];
  warranties: {
    name: string;
    duration: string;
    description: string;
  }[];

  // Value Props
  valueProps: ValuePropConfig[];

  // Services
  services: ServiceConfig[];

  // Service Areas / Cities
  cities: CityConfig[];
  primaryCity: CityConfig;

  // Industry
  industry: string;
  industryDisplay: string;

  // SEO
  seo: SEOConfig;

  // Theme
  theme: ThemeConfig;

  // Misc
  googleMapsApiKey?: string;
  analyticsId?: string;
  tagManagerId?: string;
}

/**
 * Minimal config for quick reference
 */
export interface QuickSiteConfig {
  name: string;
  phone: string;
  email: string;
  primaryCity: string;
  industry: string;
}
