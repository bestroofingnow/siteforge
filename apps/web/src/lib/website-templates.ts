// Website section templates for different industries

export interface SiteConfig {
  businessName: string;
  tagline: string;
  industry: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  services: ServiceItem[];
  primaryColor: string;
  accentColor: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutText: string;
  yearsInBusiness: number;
  trustBadges: TrustBadge[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  ctaHeadline: string;
  ctaSubheadline: string;
}

export interface ServiceItem {
  name: string;
  description: string;
  icon: string;
}

export interface TrustBadge {
  icon: string;
  text: string;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PageConfig {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  isCore: boolean;
  isGenerated: boolean;
}

export const DEFAULT_PAGES: PageConfig[] = [
  { id: 'home', name: 'Homepage', slug: '/', icon: 'home', description: 'Hero, services overview, testimonials, CTA', isCore: true, isGenerated: false },
  { id: 'about', name: 'About Us', slug: '/about', icon: 'users', description: 'Company story, team, values', isCore: true, isGenerated: false },
  { id: 'services', name: 'Services', slug: '/services', icon: 'wrench', description: 'All services with details', isCore: true, isGenerated: false },
  { id: 'contact', name: 'Contact', slug: '/contact', icon: 'mail', description: 'Contact form, map, info', isCore: true, isGenerated: false },
];

export const ADDITIONAL_PAGES: PageConfig[] = [
  { id: 'faq', name: 'FAQ', slug: '/faq', icon: 'help-circle', description: 'Frequently asked questions', isCore: false, isGenerated: false },
  { id: 'reviews', name: 'Reviews', slug: '/reviews', icon: 'star', description: 'Customer testimonials', isCore: false, isGenerated: false },
  { id: 'gallery', name: 'Gallery', slug: '/gallery', icon: 'image', description: 'Project photos', isCore: false, isGenerated: false },
  { id: 'areas', name: 'Service Areas', slug: '/areas', icon: 'map-pin', description: 'Cities and areas served', isCore: false, isGenerated: false },
  { id: 'blog', name: 'Blog', slug: '/blog', icon: 'file-text', description: 'Articles and guides', isCore: false, isGenerated: false },
];

export const INDUSTRY_DEFAULTS: Record<string, Partial<SiteConfig>> = {
  roofing: {
    primaryColor: '#1e3a5f',
    accentColor: '#f59e0b',
    services: [
      { name: 'Roof Replacement', description: 'Complete roof replacement with premium materials and expert installation', icon: 'home' },
      { name: 'Roof Repair', description: 'Fast, reliable repairs for leaks, storm damage, and wear', icon: 'wrench' },
      { name: 'Storm Damage', description: 'Emergency storm damage assessment and insurance claim assistance', icon: 'cloud-lightning' },
      { name: 'Roof Inspection', description: 'Comprehensive inspections to identify issues before they become problems', icon: 'search' },
      { name: 'Gutter Services', description: 'Gutter installation, repair, and cleaning services', icon: 'droplets' },
      { name: 'Commercial Roofing', description: 'Professional roofing solutions for businesses and commercial properties', icon: 'building' },
    ],
    trustBadges: [
      { icon: 'star', text: '5.0 Google Rating' },
      { icon: 'shield', text: 'Licensed & Insured' },
      { icon: 'award', text: 'BBB A+ Rated' },
      { icon: 'clock', text: '24/7 Emergency' },
    ],
    faqs: [
      { question: 'How long does a roof replacement take?', answer: 'Most residential roof replacements take 1-3 days depending on the size and complexity of the roof.' },
      { question: 'Do you offer financing?', answer: 'Yes, we offer flexible financing options with approved credit to make your roofing project affordable.' },
      { question: 'What warranty do you provide?', answer: 'We provide a comprehensive warranty covering both materials and workmanship for your peace of mind.' },
    ],
  },
  landscaping: {
    primaryColor: '#166534',
    accentColor: '#84cc16',
    services: [
      { name: 'Lawn Care', description: 'Regular mowing, fertilization, and lawn health programs', icon: 'leaf' },
      { name: 'Landscape Design', description: 'Custom landscape designs that transform your outdoor space', icon: 'palette' },
      { name: 'Hardscaping', description: 'Patios, walkways, retaining walls, and outdoor living spaces', icon: 'layers' },
      { name: 'Tree Services', description: 'Tree trimming, removal, and stump grinding services', icon: 'tree-pine' },
      { name: 'Irrigation', description: 'Sprinkler system installation, repair, and maintenance', icon: 'droplets' },
      { name: 'Seasonal Cleanup', description: 'Spring and fall cleanup services to keep your property pristine', icon: 'wind' },
    ],
    trustBadges: [
      { icon: 'star', text: '5-Star Reviews' },
      { icon: 'leaf', text: 'Eco-Friendly' },
      { icon: 'award', text: 'Licensed Pro' },
      { icon: 'calendar', text: 'Same Week Service' },
    ],
    faqs: [
      { question: 'How often should I water my lawn?', answer: 'Most lawns need 1-1.5 inches of water per week, either from rain or irrigation.' },
      { question: 'Do you offer maintenance packages?', answer: 'Yes, we offer weekly, bi-weekly, and monthly maintenance packages tailored to your needs.' },
      { question: 'When is the best time to plant?', answer: 'Spring and fall are ideal for most plantings, but we can advise based on specific plants.' },
    ],
  },
  plumbing: {
    primaryColor: '#1d4ed8',
    accentColor: '#06b6d4',
    services: [
      { name: 'Emergency Repairs', description: '24/7 emergency plumbing repairs when you need us most', icon: 'alert-circle' },
      { name: 'Drain Cleaning', description: 'Professional drain cleaning and clog removal services', icon: 'droplets' },
      { name: 'Water Heaters', description: 'Water heater installation, repair, and maintenance', icon: 'flame' },
      { name: 'Pipe Repair', description: 'Pipe repair, replacement, and leak detection services', icon: 'wrench' },
      { name: 'Fixture Installation', description: 'Faucet, toilet, and fixture installation and repair', icon: 'settings' },
      { name: 'Sewer Services', description: 'Sewer line inspection, repair, and replacement', icon: 'construction' },
    ],
    trustBadges: [
      { icon: 'clock', text: '24/7 Service' },
      { icon: 'shield', text: 'Licensed & Bonded' },
      { icon: 'star', text: 'Top Rated' },
      { icon: 'zap', text: 'Fast Response' },
    ],
    faqs: [
      { question: 'Do you offer emergency services?', answer: 'Yes, we provide 24/7 emergency plumbing services for urgent issues.' },
      { question: 'How quickly can you arrive?', answer: 'For emergencies, we typically arrive within 1-2 hours in our service area.' },
      { question: 'Do you provide estimates?', answer: 'Yes, we provide free estimates before starting any work.' },
    ],
  },
  hvac: {
    primaryColor: '#0369a1',
    accentColor: '#f97316',
    services: [
      { name: 'AC Installation', description: 'Professional air conditioning installation and replacement', icon: 'snowflake' },
      { name: 'Heating Systems', description: 'Furnace and heating system installation and repair', icon: 'flame' },
      { name: 'AC Repair', description: 'Fast, reliable air conditioning repair services', icon: 'wrench' },
      { name: 'Maintenance', description: 'Preventive maintenance to keep your systems running efficiently', icon: 'settings' },
      { name: 'Indoor Air Quality', description: 'Air purification, filtration, and humidity control solutions', icon: 'wind' },
      { name: 'Duct Services', description: 'Duct cleaning, sealing, and installation services', icon: 'box' },
    ],
    trustBadges: [
      { icon: 'thermometer', text: 'Certified Techs' },
      { icon: 'shield', text: 'Licensed & Insured' },
      { icon: 'star', text: '5-Star Service' },
      { icon: 'clock', text: 'Same Day Service' },
    ],
    faqs: [
      { question: 'How often should I replace my air filter?', answer: 'We recommend replacing standard filters every 1-3 months, depending on usage and filter type.' },
      { question: 'How long does an AC unit last?', answer: 'With proper maintenance, most AC units last 15-20 years.' },
      { question: 'Do you offer financing?', answer: 'Yes, we offer flexible financing options for major installations.' },
    ],
  },
  cleaning: {
    primaryColor: '#0891b2',
    accentColor: '#a855f7',
    services: [
      { name: 'House Cleaning', description: 'Regular house cleaning services tailored to your needs', icon: 'home' },
      { name: 'Deep Cleaning', description: 'Thorough deep cleaning for a spotless home', icon: 'sparkles' },
      { name: 'Move In/Out', description: 'Comprehensive cleaning for moving transitions', icon: 'truck' },
      { name: 'Office Cleaning', description: 'Professional commercial and office cleaning', icon: 'building' },
      { name: 'Carpet Cleaning', description: 'Deep carpet and upholstery cleaning services', icon: 'layers' },
      { name: 'Window Cleaning', description: 'Interior and exterior window cleaning', icon: 'square' },
    ],
    trustBadges: [
      { icon: 'shield', text: 'Insured & Bonded' },
      { icon: 'leaf', text: 'Eco-Friendly' },
      { icon: 'star', text: '5-Star Reviews' },
      { icon: 'check', text: 'Background Checked' },
    ],
    faqs: [
      { question: 'Do you bring your own supplies?', answer: 'Yes, we bring all necessary cleaning supplies and equipment.' },
      { question: 'Are your cleaners background checked?', answer: 'Yes, all our cleaning professionals undergo thorough background checks.' },
      { question: 'Can I customize my cleaning service?', answer: 'Absolutely! We tailor our services to meet your specific needs.' },
    ],
  },
};

export function generateDefaultConfig(
  businessName: string,
  industry: string,
  city: string,
  state: string
): Partial<SiteConfig> {
  const industryDefaults = INDUSTRY_DEFAULTS[industry] || INDUSTRY_DEFAULTS.roofing;

  return {
    businessName,
    industry,
    city,
    state,
    address: `${city}, ${state}`,
    yearsInBusiness: 10,
    heroHeadline: `${city}'s Trusted ${capitalize(industry)} Experts`,
    heroSubheadline: `Professional ${industry} services with quality craftsmanship and customer satisfaction guaranteed. Serving ${city} and surrounding areas.`,
    aboutText: `${businessName} has been proudly serving ${city} and the surrounding ${state} communities. Our team of experienced professionals is dedicated to delivering exceptional ${industry} services with integrity and quality workmanship.`,
    ctaHeadline: 'Ready to Get Started?',
    ctaSubheadline: `Contact ${businessName} today for a free consultation and estimate.`,
    ...industryDefaults,
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateTestimonials(businessName: string, industry: string, city: string): Testimonial[] {
  const services = INDUSTRY_DEFAULTS[industry]?.services || [];
  const serviceNames = services.map(s => s.name);

  return [
    {
      name: 'Sarah M.',
      location: city,
      rating: 5,
      text: `${businessName} exceeded our expectations! Professional, punctual, and the quality of work was outstanding. Highly recommend!`,
      service: serviceNames[0] || 'Service',
    },
    {
      name: 'Michael R.',
      location: city,
      rating: 5,
      text: `From start to finish, the team at ${businessName} was fantastic. They explained everything clearly and delivered exactly what they promised.`,
      service: serviceNames[1] || 'Service',
    },
    {
      name: 'Jennifer L.',
      location: city,
      rating: 5,
      text: `I've used ${businessName} multiple times now and they never disappoint. Fair pricing, great communication, and excellent results every time.`,
      service: serviceNames[2] || 'Service',
    },
  ];
}
