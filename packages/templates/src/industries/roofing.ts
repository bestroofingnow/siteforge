/**
 * Roofing industry configuration
 */

import type { IndustryConfig } from '@siteforge/shared';

export const roofingConfig: IndustryConfig = {
  id: 'roofing',
  name: 'roofing',
  displayName: 'Roofing',

  defaultServices: [
    {
      name: 'Roof Replacement',
      slug: 'roof-replacement',
      description: 'Complete roof replacement services using premium materials and expert installation techniques.',
      features: [
        'Free roof inspection and estimate',
        'Premium shingle options (GAF, Owens Corning, CertainTeed)',
        'Tear-off and disposal of old roofing',
        'New underlayment and flashing',
        'Manufacturer warranty included',
      ],
      isPrimary: true,
      keywords: ['roof replacement', 'new roof', 'reroof'],
    },
    {
      name: 'Roof Repair',
      slug: 'roof-repair',
      description: 'Expert roof repair services to fix leaks, damage, and wear before they become major problems.',
      features: [
        'Leak detection and repair',
        'Storm damage assessment',
        'Shingle replacement',
        'Flashing repair',
        'Emergency services available',
      ],
      keywords: ['roof repair', 'fix roof leak', 'roof damage'],
    },
    {
      name: 'Storm Damage',
      slug: 'storm-damage',
      description: 'Fast response to storm damage with insurance claim assistance and expert repairs.',
      features: [
        '24/7 emergency response',
        'Free storm damage inspection',
        'Insurance claim assistance',
        'Tarping and temporary repairs',
        'Complete restoration services',
      ],
      isEmergency: true,
      keywords: ['storm damage roof', 'hail damage', 'wind damage roof'],
    },
    {
      name: 'Roof Inspection',
      slug: 'roof-inspection',
      description: 'Comprehensive roof inspections to identify issues before they become costly repairs.',
      features: [
        'Detailed written report',
        'Photo documentation',
        'Drone inspection available',
        'Pre-purchase inspections',
        'Maintenance recommendations',
      ],
      keywords: ['roof inspection', 'roof assessment', 'roof condition'],
    },
    {
      name: 'Gutter Services',
      slug: 'gutter-services',
      description: 'Complete gutter installation, repair, and cleaning to protect your home from water damage.',
      features: [
        'Seamless gutter installation',
        'Gutter guard installation',
        'Gutter repair and cleaning',
        'Downspout installation',
        'Multiple color options',
      ],
      keywords: ['gutter installation', 'gutter repair', 'seamless gutters'],
    },
  ],

  defaultValueProps: [
    {
      title: 'Licensed & Insured',
      description: 'Fully licensed roofing contractor with comprehensive liability and workers comp insurance.',
      icon: 'Shield',
    },
    {
      title: 'Free Estimates',
      description: 'No-obligation roof inspections and detailed written estimates for all projects.',
      icon: 'FileText',
    },
    {
      title: 'Warranty Protection',
      description: 'Manufacturer warranties plus our workmanship guarantee for your peace of mind.',
      icon: 'Award',
    },
    {
      title: 'Fast Response',
      description: '24/7 emergency services for storm damage and urgent roof repairs.',
      icon: 'Clock',
    },
  ],

  faqTemplates: [
    {
      questionTemplate: 'How much does a new roof cost in {{CITY}}?',
      answerTemplate: 'The cost of a new roof in {{CITY}} typically ranges from $8,000 to $25,000 depending on the size of your home, materials chosen, and complexity of the installation. We offer free estimates to provide accurate pricing for your specific needs.',
      category: 'pricing',
      variables: ['CITY'],
    },
    {
      questionTemplate: 'How long does a roof replacement take?',
      answerTemplate: 'Most residential roof replacements are completed in 1-3 days, depending on the size of your home and weather conditions. We work efficiently to minimize disruption to your daily routine.',
      category: 'process',
      variables: [],
    },
    {
      questionTemplate: 'Do you help with insurance claims for storm damage?',
      answerTemplate: 'Yes, we provide complete insurance claim assistance. We document all damage, meet with adjusters, and ensure you receive fair compensation for your roof repairs or replacement.',
      category: 'insurance',
      variables: [],
    },
    {
      questionTemplate: 'What roofing materials do you recommend?',
      answerTemplate: 'We recommend GAF, Owens Corning, and CertainTeed shingles for their durability and warranty coverage. We\'ll help you choose the best option based on your budget, aesthetic preferences, and local climate considerations.',
      category: 'materials',
      variables: [],
    },
    {
      questionTemplate: 'How do I know if I need a new roof?',
      answerTemplate: 'Signs you may need a new roof include missing or curling shingles, granules in gutters, leaks or water stains, visible daylight in the attic, and a roof over 20 years old. We offer free inspections to assess your roof\'s condition.',
      category: 'general',
      variables: [],
    },
  ],

  colorSchemes: {
    recommended: 'blue',
    alternatives: ['red', 'neutral'],
  },

  seoKeywords: [
    'roofing contractor',
    'roof replacement',
    'roof repair',
    'roofer',
    'new roof',
    'shingle roof',
    'storm damage repair',
    'roof inspection',
    'gutter installation',
    'roofing company',
  ],

  localKeywordPatterns: [
    '{{SERVICE}} {{CITY}}',
    '{{CITY}} {{SERVICE}}',
    'best roofer in {{CITY}}',
    '{{CITY}} roofing contractor',
    'roof repair near {{CITY}}',
  ],

  schemaType: 'RoofingContractor',

  commonCertifications: [
    'GAF Certified Contractor',
    'Owens Corning Preferred Contractor',
    'CertainTeed SELECT ShingleMaster',
    'BBB Accredited Business',
    'NRCA Member',
  ],

  hasEmergencyService: true,
  priceRangeDisplay: '$8,000 - $25,000',
};
