/**
 * Business information types - collected during conversation
 */

export type IndustryType =
  | 'roofing'
  | 'landscaping'
  | 'plumbing'
  | 'hvac'
  | 'electrical'
  | 'painting'
  | 'general-contractor'
  | 'pressure-washing'
  | 'tree-service'
  | 'fencing'
  | 'concrete'
  | 'flooring'
  | 'window-cleaning'
  | 'pest-control'
  | 'garage-door'
  | 'locksmith'
  | 'pool-service'
  | 'gutters'
  | 'siding'
  | 'solar';

export type TonePreference =
  | 'professional'
  | 'friendly'
  | 'premium'
  | 'family-owned'
  | 'technical';

export interface Address {
  street?: string;
  city: string;
  state: string;
  stateAbbr: string;
  zip: string;
  type: 'primary' | 'secondary' | 'satellite';
  serviceRadius?: number; // miles
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  yelp?: string;
  google?: string;
  nextdoor?: string;
}

export interface PriceRange {
  min?: number;
  max?: number;
  unit?: 'project' | 'hour' | 'sqft' | 'linear-ft';
  display?: string;
}

export interface ServiceDefinition {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  features?: string[];
  benefits?: string[];
  priceRange?: PriceRange;
  isEmergency?: boolean;
  isPrimary?: boolean;
  keywords?: string[];
}

export interface ServiceArea {
  city: string;
  state: string;
  stateAbbr: string;
  county?: string;
  priority: 'high' | 'medium' | 'low';
  population?: number;
  neighborhoods?: string[];
  slug?: string;
}

export interface WarrantyInfo {
  name: string;
  duration: string;
  description?: string;
}

export interface ValueProp {
  title: string;
  description?: string;
  icon?: string;
}

export interface ReviewSource {
  platform: 'google' | 'yelp' | 'facebook' | 'bbb' | 'angi' | 'homeadvisor' | 'other';
  rating: number;
  count: number;
  url?: string;
}

export interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
}

export interface BusinessHours {
  weekdays: string;
  saturday: string;
  sunday: string;
  emergency?: boolean;
}

/**
 * Complete business information collected from conversation
 */
export interface BusinessInfo {
  // Basic Info
  name: string;
  legalName?: string;
  tagline?: string;
  description?: string;
  industry: IndustryType;
  yearsInBusiness?: number;
  foundedYear?: number;

  // Contact
  phone: string;
  email: string;
  website?: string;
  addresses: Address[];
  hours?: BusinessHours;

  // Online Presence
  social: SocialLinks;
  googleBusinessProfile?: string;

  // Services
  services: ServiceDefinition[];
  serviceAreas: ServiceArea[];
  primaryServiceArea?: string;

  // Differentiators
  certifications: string[];
  licenses: string[];
  insurance: string[];
  warranties: WarrantyInfo[];
  valueProps: ValueProp[];

  // Reviews & Social Proof
  reviews: ReviewSource[];
  awards: string[];
  teamSize?: number;
  projectsCompleted?: number;

  // Branding
  brandColors?: BrandColors;
  existingLogo?: string;
  tone: TonePreference;

  // Extra Info
  uniqueSellingPoints?: string[];
  targetAudience?: string[];
  competitiveAdvantages?: string[];
}

/**
 * Partial business info during conversation (progressive collection)
 */
export type PartialBusinessInfo = Partial<BusinessInfo> & {
  name: string;
  industry: IndustryType;
};
