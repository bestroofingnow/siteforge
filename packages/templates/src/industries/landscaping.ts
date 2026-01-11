/**
 * Landscaping industry configuration
 */

import type { IndustryConfig } from '@siteforge/shared';

export const landscapingConfig: IndustryConfig = {
  id: 'landscaping',
  name: 'landscaping',
  displayName: 'Landscaping',

  defaultServices: [
    {
      name: 'Landscape Design',
      slug: 'landscape-design',
      description: 'Custom landscape designs tailored to your property, lifestyle, and vision.',
      features: [
        'Professional site assessment',
        '3D design visualization',
        'Plant selection guidance',
        'Hardscape integration',
        'Irrigation planning',
      ],
      isPrimary: true,
      keywords: ['landscape design', 'garden design', 'landscape architect'],
    },
    {
      name: 'Lawn Care & Maintenance',
      slug: 'lawn-care',
      description: 'Comprehensive lawn care services to keep your yard healthy, green, and beautiful year-round.',
      features: [
        'Weekly mowing service',
        'Fertilization programs',
        'Weed control',
        'Aeration and overseeding',
        'Seasonal cleanup',
      ],
      keywords: ['lawn care', 'lawn maintenance', 'grass cutting', 'yard maintenance'],
    },
    {
      name: 'Hardscaping',
      slug: 'hardscaping',
      description: 'Beautiful patios, walkways, retaining walls, and outdoor living spaces built to last.',
      features: [
        'Patio installation',
        'Walkway construction',
        'Retaining walls',
        'Outdoor kitchens',
        'Fire pits and fireplaces',
      ],
      keywords: ['hardscaping', 'patio installation', 'walkways', 'retaining walls'],
    },
    {
      name: 'Planting & Gardens',
      slug: 'planting',
      description: 'Expert planting services including trees, shrubs, flowers, and garden bed installation.',
      features: [
        'Tree and shrub planting',
        'Flower bed design',
        'Mulching services',
        'Native plant specialists',
        'Seasonal color programs',
      ],
      keywords: ['tree planting', 'garden installation', 'flower beds'],
    },
    {
      name: 'Irrigation Systems',
      slug: 'irrigation',
      description: 'Professional irrigation system installation, repair, and maintenance for efficient watering.',
      features: [
        'Sprinkler system installation',
        'Drip irrigation',
        'Smart controller setup',
        'System repair and maintenance',
        'Water efficiency audits',
      ],
      keywords: ['irrigation installation', 'sprinkler system', 'lawn sprinklers'],
    },
    {
      name: 'Outdoor Lighting',
      slug: 'outdoor-lighting',
      description: 'Landscape lighting design and installation to enhance your property\'s beauty and security.',
      features: [
        'Path and accent lighting',
        'Architectural lighting',
        'Security lighting',
        'LED upgrades',
        'Smart lighting controls',
      ],
      keywords: ['landscape lighting', 'outdoor lighting', 'garden lights'],
    },
  ],

  defaultValueProps: [
    {
      title: 'Licensed & Insured',
      description: 'Fully licensed landscaping contractor with comprehensive insurance coverage.',
      icon: 'Shield',
    },
    {
      title: 'Free Consultations',
      description: 'Complimentary on-site consultations and detailed project proposals.',
      icon: 'FileText',
    },
    {
      title: 'Eco-Friendly',
      description: 'Sustainable practices and native plant expertise for environmentally conscious landscapes.',
      icon: 'Leaf',
    },
    {
      title: 'Quality Guaranteed',
      description: 'Plant replacement warranty and satisfaction guarantee on all installations.',
      icon: 'Award',
    },
  ],

  faqTemplates: [
    {
      questionTemplate: 'How much does landscaping cost in {{CITY}}?',
      answerTemplate: 'Landscaping costs in {{CITY}} vary widely based on project scope. Basic lawn care starts around $150/month, while full landscape designs range from $5,000 to $50,000+. We provide free consultations to give you accurate pricing.',
      category: 'pricing',
      variables: ['CITY'],
    },
    {
      questionTemplate: 'What is the best time to landscape?',
      answerTemplate: 'Spring and fall are ideal for most landscaping projects in our region. However, we offer services year-round and can advise on the best timing for your specific project goals.',
      category: 'timing',
      variables: [],
    },
    {
      questionTemplate: 'Do you offer maintenance plans?',
      answerTemplate: 'Yes, we offer weekly, bi-weekly, and monthly maintenance plans that can be customized to your property\'s needs. Plans include mowing, trimming, weeding, and seasonal services.',
      category: 'services',
      variables: [],
    },
    {
      questionTemplate: 'What plants work best in {{CITY}}?',
      answerTemplate: 'We specialize in plants suited to the {{CITY}} climate, including native species that thrive with minimal maintenance. During your consultation, we\'ll recommend plants based on your site conditions and preferences.',
      category: 'plants',
      variables: ['CITY'],
    },
    {
      questionTemplate: 'Do you provide warranties on plants?',
      answerTemplate: 'Yes, we offer a one-year replacement warranty on all trees and shrubs we install. Proper care instructions are provided, and our maintenance plans help ensure plant health.',
      category: 'warranty',
      variables: [],
    },
  ],

  colorSchemes: {
    recommended: 'green',
    alternatives: ['amber', 'blue'],
  },

  seoKeywords: [
    'landscaping',
    'landscaper',
    'lawn care',
    'landscape design',
    'hardscaping',
    'landscape company',
    'yard maintenance',
    'outdoor living',
    'garden design',
    'irrigation',
  ],

  localKeywordPatterns: [
    '{{SERVICE}} {{CITY}}',
    '{{CITY}} landscaper',
    'best landscaping in {{CITY}}',
    '{{CITY}} lawn care',
    'landscaping near {{CITY}}',
  ],

  schemaType: 'LandscapingBusiness',

  commonCertifications: [
    'Licensed Landscape Contractor',
    'Certified Irrigation Contractor',
    'ISA Certified Arborist',
    'NALP Certified',
    'EPA WaterSense Partner',
  ],

  hasEmergencyService: false,
  priceRangeDisplay: '$5,000 - $50,000+',
};
