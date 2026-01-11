/**
 * Plumbing industry configuration
 */

import type { IndustryConfig } from '@siteforge/shared';

export const plumbingConfig: IndustryConfig = {
  id: 'plumbing',
  name: 'plumbing',
  displayName: 'Plumbing',

  defaultServices: [
    {
      name: 'Plumbing Repair',
      slug: 'plumbing-repair',
      description: 'Expert plumbing repairs for leaks, clogs, and all residential plumbing issues.',
      features: [
        'Leak detection and repair',
        'Pipe repair and replacement',
        'Faucet and fixture repair',
        'Toilet repair',
        'Same-day service available',
      ],
      isPrimary: true,
      keywords: ['plumbing repair', 'plumber', 'fix leak'],
    },
    {
      name: 'Drain Cleaning',
      slug: 'drain-cleaning',
      description: 'Professional drain cleaning services to clear clogs and restore proper flow.',
      features: [
        'Hydro jetting',
        'Drain snaking',
        'Video inspection',
        'Root removal',
        'Preventive maintenance',
      ],
      keywords: ['drain cleaning', 'clogged drain', 'sewer cleaning'],
    },
    {
      name: 'Water Heater Services',
      slug: 'water-heater',
      description: 'Water heater installation, repair, and replacement for tank and tankless systems.',
      features: [
        'Tank water heaters',
        'Tankless water heaters',
        'Repair and maintenance',
        'Energy-efficient upgrades',
        'Same-day installation',
      ],
      keywords: ['water heater', 'tankless water heater', 'hot water'],
    },
    {
      name: 'Emergency Plumbing',
      slug: 'emergency-plumbing',
      description: '24/7 emergency plumbing services for urgent issues like burst pipes and major leaks.',
      features: [
        '24/7 availability',
        'Fast response time',
        'Burst pipe repair',
        'Flood cleanup',
        'No overtime charges',
      ],
      isEmergency: true,
      keywords: ['emergency plumber', '24 hour plumber', 'burst pipe'],
    },
    {
      name: 'Bathroom Plumbing',
      slug: 'bathroom-plumbing',
      description: 'Complete bathroom plumbing services from new installations to remodeling.',
      features: [
        'Toilet installation',
        'Shower and tub installation',
        'Vanity plumbing',
        'Bathroom remodeling',
        'ADA-compliant upgrades',
      ],
      keywords: ['bathroom plumber', 'toilet installation', 'shower plumbing'],
    },
  ],

  defaultValueProps: [
    {
      title: 'Licensed & Insured',
      description: 'Fully licensed master plumbers with comprehensive insurance.',
      icon: 'Shield',
    },
    {
      title: '24/7 Emergency',
      description: 'Round-the-clock emergency service with fast response times.',
      icon: 'Clock',
    },
    {
      title: 'Upfront Pricing',
      description: 'Clear, honest pricing before work begins. No hidden fees.',
      icon: 'FileText',
    },
    {
      title: 'Guaranteed Work',
      description: 'All repairs backed by our satisfaction and workmanship guarantee.',
      icon: 'Award',
    },
  ],

  faqTemplates: [
    {
      questionTemplate: 'How much does a plumber cost in {{CITY}}?',
      answerTemplate: 'Plumbing service calls in {{CITY}} typically start around $75-150 for the visit, with repairs ranging based on complexity. We provide upfront pricing before any work begins.',
      category: 'pricing',
      variables: ['CITY'],
    },
    {
      questionTemplate: 'Do you offer 24/7 emergency service?',
      answerTemplate: 'Yes, we provide 24/7 emergency plumbing service in {{CITY}} and surrounding areas. Call us anytime for burst pipes, major leaks, and other urgent plumbing issues.',
      category: 'emergency',
      variables: ['CITY'],
    },
    {
      questionTemplate: 'How long do water heaters last?',
      answerTemplate: 'Traditional tank water heaters typically last 8-12 years, while tankless units can last 15-20 years with proper maintenance. We offer inspections to assess your unit\'s condition.',
      category: 'equipment',
      variables: [],
    },
  ],

  colorSchemes: {
    recommended: 'blue',
    alternatives: ['green', 'neutral'],
  },

  seoKeywords: [
    'plumber',
    'plumbing',
    'plumbing repair',
    'drain cleaning',
    'water heater',
    'emergency plumber',
    'leak repair',
    'clogged drain',
  ],

  localKeywordPatterns: [
    'plumber in {{CITY}}',
    '{{CITY}} plumbing',
    'emergency plumber {{CITY}}',
    'plumbing repair {{CITY}}',
  ],

  schemaType: 'Plumber',

  commonCertifications: [
    'Licensed Master Plumber',
    'Bonded and Insured',
    'BBB Accredited',
  ],

  hasEmergencyService: true,
  priceRangeDisplay: '$75 - $500+',
};
