/**
 * Shared constants for SiteForge
 */

import type { IndustryType } from '../types/business.js';

/**
 * Industry display names and metadata
 */
export const INDUSTRIES: Record<IndustryType, { name: string; icon: string; schemaType: string }> = {
  roofing: { name: 'Roofing', icon: 'Home', schemaType: 'RoofingContractor' },
  landscaping: { name: 'Landscaping', icon: 'Trees', schemaType: 'LandscapingBusiness' },
  plumbing: { name: 'Plumbing', icon: 'Droplets', schemaType: 'Plumber' },
  hvac: { name: 'HVAC', icon: 'Thermometer', schemaType: 'HVACBusiness' },
  electrical: { name: 'Electrical', icon: 'Zap', schemaType: 'Electrician' },
  painting: { name: 'Painting', icon: 'Paintbrush', schemaType: 'HousePainter' },
  'general-contractor': { name: 'General Contractor', icon: 'Hammer', schemaType: 'GeneralContractor' },
  'pressure-washing': { name: 'Pressure Washing', icon: 'Sparkles', schemaType: 'LocalBusiness' },
  'tree-service': { name: 'Tree Service', icon: 'TreeDeciduous', schemaType: 'LocalBusiness' },
  fencing: { name: 'Fencing', icon: 'Fence', schemaType: 'LocalBusiness' },
  concrete: { name: 'Concrete', icon: 'Square', schemaType: 'LocalBusiness' },
  flooring: { name: 'Flooring', icon: 'LayoutGrid', schemaType: 'LocalBusiness' },
  'window-cleaning': { name: 'Window Cleaning', icon: 'SquareStack', schemaType: 'LocalBusiness' },
  'pest-control': { name: 'Pest Control', icon: 'Bug', schemaType: 'LocalBusiness' },
  'garage-door': { name: 'Garage Door', icon: 'DoorOpen', schemaType: 'LocalBusiness' },
  locksmith: { name: 'Locksmith', icon: 'Key', schemaType: 'Locksmith' },
  'pool-service': { name: 'Pool Service', icon: 'Waves', schemaType: 'LocalBusiness' },
  gutters: { name: 'Gutters', icon: 'Gauge', schemaType: 'LocalBusiness' },
  siding: { name: 'Siding', icon: 'Building', schemaType: 'LocalBusiness' },
  solar: { name: 'Solar', icon: 'Sun', schemaType: 'LocalBusiness' },
};

/**
 * All supported industries as array
 */
export const INDUSTRY_LIST = Object.keys(INDUSTRIES) as IndustryType[];

/**
 * Default Lucide icons for common sections
 */
export const DEFAULT_ICONS = {
  phone: 'Phone',
  email: 'Mail',
  location: 'MapPin',
  hours: 'Clock',
  rating: 'Star',
  check: 'Check',
  arrow: 'ArrowRight',
  quote: 'Quote',
  calendar: 'Calendar',
  shield: 'Shield',
  award: 'Award',
  users: 'Users',
  tool: 'Wrench',
  heart: 'Heart',
  thumbsUp: 'ThumbsUp',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'Youtube',
  linkedin: 'Linkedin',
} as const;

/**
 * Color scheme definitions (Tailwind-compatible)
 */
export const COLOR_SCHEMES = {
  blue: {
    primary: '#1A43AA',
    primaryDark: '#142F7A',
    primaryLight: '#2E5BC9',
    secondary: '#475569',
    accent: '#C62F2F',
    accentDark: '#A52525',
  },
  green: {
    primary: '#166534',
    primaryDark: '#14532d',
    primaryLight: '#22c55e',
    secondary: '#475569',
    accent: '#C62F2F',
    accentDark: '#A52525',
  },
  amber: {
    primary: '#b45309',
    primaryDark: '#92400e',
    primaryLight: '#f59e0b',
    secondary: '#475569',
    accent: '#1A43AA',
    accentDark: '#142F7A',
  },
  red: {
    primary: '#b91c1c',
    primaryDark: '#991b1b',
    primaryLight: '#ef4444',
    secondary: '#475569',
    accent: '#1A43AA',
    accentDark: '#142F7A',
  },
  neutral: {
    primary: '#1e293b',
    primaryDark: '#0f172a',
    primaryLight: '#334155',
    secondary: '#475569',
    accent: '#C62F2F',
    accentDark: '#A52525',
  },
} as const;

/**
 * Default button variants (Tailwind classes)
 */
export const BUTTON_VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-dark shadow-sm',
  secondary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-primary hover:bg-primary/10',
  link: 'text-primary underline-offset-4 hover:underline',
} as const;

/**
 * Default section padding classes
 */
export const SECTION_PADDING = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-20',
  lg: 'py-20 md:py-28',
} as const;

/**
 * Container max-width classes
 */
export const CONTAINER_WIDTHS = {
  sm: 'max-w-4xl',
  md: 'max-w-6xl',
  lg: 'max-w-7xl',
  full: 'max-w-full',
} as const;

/**
 * Common trust badges text
 */
export const TRUST_BADGES = [
  'Licensed & Insured',
  'Free Estimates',
  'Satisfaction Guaranteed',
  'Family Owned',
  'Locally Operated',
  '24/7 Emergency Service',
  'Financing Available',
  'Senior Discount',
  'Military Discount',
  'Veteran Owned',
] as const;

/**
 * Meta description length limits
 */
export const SEO_LIMITS = {
  titleMinLength: 30,
  titleMaxLength: 60,
  descriptionMinLength: 120,
  descriptionMaxLength: 160,
} as const;

/**
 * Default file names for generated projects
 */
export const DEFAULT_FILENAMES = {
  siteConfig: 'lib/constants.ts',
  cities: 'lib/cities.ts',
  services: 'lib/services.ts',
  faqs: 'lib/faqs.ts',
  team: 'lib/team.ts',
  images: 'lib/images.ts',
  utils: 'lib/utils.ts',
} as const;

/**
 * Next.js default dependencies
 */
export const NEXTJS_DEPENDENCIES = {
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
} as const;
