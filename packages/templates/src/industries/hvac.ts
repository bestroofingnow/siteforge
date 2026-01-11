/**
 * HVAC industry configuration
 */

import type { IndustryConfig } from '@siteforge/shared';

export const hvacConfig: IndustryConfig = {
  id: 'hvac',
  name: 'hvac',
  displayName: 'HVAC',

  defaultServices: [
    {
      name: 'AC Repair',
      slug: 'ac-repair',
      description: 'Expert air conditioning repair to restore your comfort quickly and affordably.',
      features: [
        'All AC brands serviced',
        'Same-day service',
        'Refrigerant recharge',
        'Compressor repair',
        'Thermostat diagnostics',
      ],
      isPrimary: true,
      isEmergency: true,
      keywords: ['ac repair', 'air conditioning repair', 'ac not cooling'],
    },
    {
      name: 'AC Installation',
      slug: 'ac-installation',
      description: 'Professional air conditioning installation with top-rated equipment and expert workmanship.',
      features: [
        'Free in-home estimates',
        'Energy-efficient systems',
        'All major brands',
        'Financing available',
        'Manufacturer warranties',
      ],
      keywords: ['ac installation', 'new ac unit', 'air conditioner installation'],
    },
    {
      name: 'Heating Repair',
      slug: 'heating-repair',
      description: 'Furnace and heat pump repair to keep your home warm when you need it most.',
      features: [
        'Furnace repair',
        'Heat pump service',
        'Pilot light issues',
        'Blower motor repair',
        'Emergency heating service',
      ],
      isEmergency: true,
      keywords: ['heating repair', 'furnace repair', 'heater not working'],
    },
    {
      name: 'HVAC Maintenance',
      slug: 'hvac-maintenance',
      description: 'Preventive maintenance plans to extend equipment life and prevent costly breakdowns.',
      features: [
        'Annual tune-ups',
        'Filter replacement',
        'Coil cleaning',
        'System inspection',
        'Priority scheduling',
      ],
      keywords: ['hvac maintenance', 'ac tune up', 'furnace maintenance'],
    },
    {
      name: 'Indoor Air Quality',
      slug: 'indoor-air-quality',
      description: 'Improve your home\'s air quality with filtration, purification, and humidity control solutions.',
      features: [
        'Air purifiers',
        'UV light systems',
        'Humidifiers/Dehumidifiers',
        'Duct cleaning',
        'Allergy solutions',
      ],
      keywords: ['indoor air quality', 'air purifier', 'air filtration'],
    },
  ],

  defaultValueProps: [
    {
      title: 'Licensed & Insured',
      description: 'NATE-certified technicians with full licensing and insurance.',
      icon: 'Shield',
    },
    {
      title: '24/7 Emergency',
      description: 'Round-the-clock emergency service for heating and cooling emergencies.',
      icon: 'Clock',
    },
    {
      title: 'Financing Available',
      description: 'Flexible financing options for new system installations.',
      icon: 'FileText',
    },
    {
      title: 'Satisfaction Guaranteed',
      description: '100% satisfaction guarantee on all repairs and installations.',
      icon: 'Award',
    },
  ],

  faqTemplates: [
    {
      questionTemplate: 'How much does AC repair cost in {{CITY}}?',
      answerTemplate: 'AC repair costs in {{CITY}} typically range from $150 to $500 depending on the issue. Major repairs like compressor replacement can be higher. We provide upfront pricing before repairs.',
      category: 'pricing',
      variables: ['CITY'],
    },
    {
      questionTemplate: 'How often should I have my HVAC system serviced?',
      answerTemplate: 'We recommend servicing your AC in spring and your heating system in fall. Annual maintenance prevents breakdowns, improves efficiency, and extends equipment life.',
      category: 'maintenance',
      variables: [],
    },
    {
      questionTemplate: 'When should I replace my AC unit?',
      answerTemplate: 'Consider replacement if your AC is 10-15 years old, requires frequent repairs, or has high energy bills. We offer free estimates and can assess your current system\'s condition.',
      category: 'replacement',
      variables: [],
    },
  ],

  colorSchemes: {
    recommended: 'blue',
    alternatives: ['red', 'neutral'],
  },

  seoKeywords: [
    'hvac',
    'ac repair',
    'air conditioning',
    'heating repair',
    'furnace repair',
    'hvac contractor',
    'ac installation',
    'hvac maintenance',
  ],

  localKeywordPatterns: [
    'hvac {{CITY}}',
    '{{CITY}} ac repair',
    'heating repair {{CITY}}',
    'ac service {{CITY}}',
  ],

  schemaType: 'HVACBusiness',

  commonCertifications: [
    'NATE Certified',
    'EPA Certified',
    'Licensed HVAC Contractor',
    'Factory Authorized Dealer',
  ],

  hasEmergencyService: true,
  priceRangeDisplay: '$150 - $10,000+',
};
