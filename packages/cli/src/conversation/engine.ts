/**
 * Conversation Engine - Orchestrates the website generation process
 *
 * Manages the flow from conversation -> research -> content -> code
 */

import { createRouter, type LLMRouter } from '@siteforge/core';
import type {
  BusinessInfo,
  SiteConfig,
  GenerationStats,
  LLMUsage,
  CityConfig,
  ServiceConfig,
  ValuePropConfig,
} from '@siteforge/shared';
import {
  slugify,
  formatPhoneDisplay,
  formatPhoneLink,
  INDUSTRIES,
  COLOR_SCHEMES,
} from '@siteforge/shared';
import { generateProject } from '@siteforge/generator';

interface ResearchResult {
  industryInsights: string[];
  keywords: string[];
  competitorStrategies: string[];
  localSeoTips: string[];
}

interface ContentResult {
  heroCopy: {
    headline: string;
    subheadline: string;
  };
  valueProps: ValuePropConfig[];
  serviceDescriptions: Map<string, { description: string; features: string[] }>;
  aboutContent: string;
  metaDescriptions: Map<string, string>;
}

export class ConversationEngine {
  private router: LLMRouter;
  private startTime: number;
  private stats: {
    totalFiles: number;
    totalCost: number;
    durationMs: number;
    claudeUsage: LLMUsage;
    groqUsage: LLMUsage;
  };

  constructor() {
    this.router = createRouter();
    this.startTime = Date.now();
    this.stats = {
      totalFiles: 0,
      totalCost: 0,
      durationMs: 0,
      claudeUsage: { tokens: { inputTokens: 0, outputTokens: 0, totalTokens: 0 }, cost: 0, latencyMs: 0 },
      groqUsage: { tokens: { inputTokens: 0, outputTokens: 0, totalTokens: 0 }, cost: 0, latencyMs: 0 },
    };
  }

  /**
   * Phase 1: Research industry and market context
   */
  async research(businessInfo: BusinessInfo): Promise<ResearchResult> {
    const claude = this.router.getClaude();

    const prompt = `Analyze the ${businessInfo.industry} industry for a business named "${businessInfo.name}" in ${businessInfo.addresses[0]?.city}, ${businessInfo.addresses[0]?.state}.

Business description: ${businessInfo.description || 'Local service business'}

Services offered: ${businessInfo.services.map(s => s.name).join(', ')}

Provide:
1. 5 key industry insights for their website content
2. 10 target SEO keywords (local focus)
3. 3 competitive advantages to highlight
4. 3 local SEO tips for this market

Return as JSON:
{
  "industryInsights": ["insight1", "insight2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "competitorStrategies": ["strategy1", ...],
  "localSeoTips": ["tip1", ...]
}`;

    try {
      const result = await claude.json<ResearchResult>(prompt, {
        system: 'You are a market research expert specializing in local service businesses. Provide actionable, specific insights.',
      });

      this.updateUsage('claude', claude);
      return result;
    } catch {
      // Return defaults if research fails
      return {
        industryInsights: ['Quality service is paramount', 'Customer reviews drive business', 'Local presence matters'],
        keywords: [`${businessInfo.industry} near me`, `best ${businessInfo.industry}`, `${businessInfo.addresses[0]?.city} ${businessInfo.industry}`],
        competitorStrategies: ['Responsive service', 'Transparent pricing', 'Strong warranties'],
        localSeoTips: ['Optimize Google Business Profile', 'Get local reviews', 'Create city-specific content'],
      };
    }
  }

  /**
   * Phase 2: Plan site architecture
   */
  async plan(businessInfo: BusinessInfo): Promise<void> {
    // Architecture is mostly templated based on industry
    // Claude helps decide on component variants and page structure
    // For now, we use sensible defaults
  }

  /**
   * Phase 3: Generate content with Claude
   */
  async generateContent(businessInfo: BusinessInfo): Promise<SiteConfig> {
    const claude = this.router.getClaude();
    const groq = this.router.getGroq();

    // Generate hero copy with Claude
    const heroCopy = await this.generateHeroCopy(businessInfo, claude);

    // Generate value props with Claude
    const valueProps = await this.generateValueProps(businessInfo, claude);

    // Generate service descriptions with Claude
    const serviceDescriptions = await this.generateServiceDescriptions(businessInfo, claude);

    // Expand cities with Groq
    const cities = await this.expandCities(businessInfo, groq);

    // Build site config
    const siteConfig = this.buildSiteConfig(businessInfo, heroCopy, valueProps, serviceDescriptions, cities);

    return siteConfig;
  }

  /**
   * Generate hero copy
   */
  private async generateHeroCopy(
    businessInfo: BusinessInfo,
    claude: ReturnType<typeof this.router.getClaude>
  ): Promise<{ headline: string; subheadline: string }> {
    const prompt = `Create compelling hero section copy for a ${businessInfo.industry} business:

Business: ${businessInfo.name}
Location: ${businessInfo.addresses[0]?.city}, ${businessInfo.addresses[0]?.state}
Services: ${businessInfo.services.map(s => s.name).join(', ')}
Tone: ${businessInfo.tone}
${businessInfo.yearsInBusiness ? `Years in business: ${businessInfo.yearsInBusiness}` : ''}

Return JSON:
{
  "headline": "Short, powerful headline (6-10 words)",
  "subheadline": "Supporting text explaining value proposition (15-25 words)"
}`;

    try {
      const result = await claude.json<{ headline: string; subheadline: string }>(prompt, {
        system: 'You are an expert copywriter for service businesses. Write conversion-focused copy.',
      });
      this.updateUsage('claude', claude);
      return result;
    } catch {
      return {
        headline: `${businessInfo.addresses[0]?.city}'s Trusted ${INDUSTRIES[businessInfo.industry].name} Experts`,
        subheadline: `Professional ${businessInfo.industry} services for residential and commercial clients. Licensed, insured, and committed to excellence.`,
      };
    }
  }

  /**
   * Generate value propositions
   */
  private async generateValueProps(
    businessInfo: BusinessInfo,
    claude: ReturnType<typeof this.router.getClaude>
  ): Promise<ValuePropConfig[]> {
    if (businessInfo.valueProps.length > 0) {
      return businessInfo.valueProps.map(vp => ({
        title: vp.title,
        description: vp.description || '',
        icon: vp.icon || 'Star',
      }));
    }

    const prompt = `Create 4 value propositions for this ${businessInfo.industry} business:

Business: ${businessInfo.name}
Services: ${businessInfo.services.map(s => s.name).join(', ')}
${businessInfo.yearsInBusiness ? `Years in business: ${businessInfo.yearsInBusiness}` : ''}
${businessInfo.certifications.length ? `Certifications: ${businessInfo.certifications.join(', ')}` : ''}

Return JSON array:
[
  { "title": "Short title", "description": "1-2 sentence description", "icon": "LucideIconName" }
]

Use these Lucide icon names: Shield, Award, Clock, Star, Users, ThumbsUp, Wrench, Phone, Leaf, Heart`;

    try {
      const result = await claude.json<ValuePropConfig[]>(prompt, {
        system: 'You are a marketing strategist. Create compelling value propositions.',
      });
      this.updateUsage('claude', claude);
      return result;
    } catch {
      return [
        { title: 'Licensed & Insured', description: 'Fully licensed and insured for your protection.', icon: 'Shield' },
        { title: 'Free Estimates', description: 'No-obligation quotes for all projects.', icon: 'FileText' },
        { title: 'Quality Guaranteed', description: 'Satisfaction guaranteed on every job.', icon: 'Award' },
        { title: 'Fast Response', description: 'Quick turnaround on all requests.', icon: 'Clock' },
      ];
    }
  }

  /**
   * Generate service descriptions
   */
  private async generateServiceDescriptions(
    businessInfo: BusinessInfo,
    claude: ReturnType<typeof this.router.getClaude>
  ): Promise<Map<string, { description: string; features: string[] }>> {
    const descriptions = new Map<string, { description: string; features: string[] }>();

    for (const service of businessInfo.services) {
      const prompt = `Write a compelling service description for "${service.name}" (${businessInfo.industry} business).

Business: ${businessInfo.name}
Tone: ${businessInfo.tone}

Return JSON:
{
  "description": "2-3 sentence service description",
  "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"]
}`;

      try {
        const result = await claude.json<{ description: string; features: string[] }>(prompt, {
          system: 'You are a service business copywriter. Write benefit-focused descriptions.',
        });
        descriptions.set(service.slug, result);
      } catch {
        descriptions.set(service.slug, {
          description: service.description || `Professional ${service.name.toLowerCase()} services.`,
          features: service.features || ['Expert service', 'Quality materials', 'Timely completion'],
        });
      }
    }

    this.updateUsage('claude', claude);
    return descriptions;
  }

  /**
   * Expand city data with Groq
   */
  private async expandCities(
    businessInfo: BusinessInfo,
    groq: ReturnType<typeof this.router.getGroq>
  ): Promise<CityConfig[]> {
    const cities: CityConfig[] = [];

    for (const area of businessInfo.serviceAreas) {
      const citySlug = slugify(`${area.city}-${area.stateAbbr}`);

      try {
        const prompt = `Generate city page data for ${area.city}, ${area.state} for a ${businessInfo.industry} business.

Return JSON:
{
  "h1": "Main heading for the page",
  "metaTitle": "SEO title (50-60 chars)",
  "metaDescription": "SEO description (150-160 chars)",
  "primaryKeyword": "main keyword to target",
  "nearbyAreas": ["area1", "area2", "area3"],
  "neighborhoods": ["neighborhood1", "neighborhood2", "neighborhood3"]
}`;

        const result = await groq.json<{
          h1: string;
          metaTitle: string;
          metaDescription: string;
          primaryKeyword: string;
          nearbyAreas: string[];
          neighborhoods: string[];
        }>(prompt, {
          system: `You are a local SEO expert. Generate content for ${businessInfo.industry} services.`,
        });

        cities.push({
          name: area.city,
          state: area.state,
          stateAbbr: area.stateAbbr,
          slug: citySlug,
          priority: area.priority,
          county: area.county,
          h1: result.h1,
          metaTitle: result.metaTitle,
          metaDescription: result.metaDescription,
          primaryKeyword: result.primaryKeyword,
          nearbyAreas: result.nearbyAreas,
          neighborhoods: result.neighborhoods,
        });
      } catch {
        cities.push({
          name: area.city,
          state: area.state,
          stateAbbr: area.stateAbbr,
          slug: citySlug,
          priority: area.priority,
          county: area.county,
          h1: `${INDUSTRIES[businessInfo.industry].name} Services in ${area.city}, ${area.stateAbbr}`,
          metaTitle: `${businessInfo.industry} in ${area.city}, ${area.stateAbbr} | ${businessInfo.name}`,
          metaDescription: `Professional ${businessInfo.industry} services in ${area.city}. Call ${businessInfo.name} for free estimates.`,
          primaryKeyword: `${businessInfo.industry} ${area.city}`,
          nearbyAreas: [],
          neighborhoods: area.neighborhoods || [],
        });
      }
    }

    this.updateUsage('groq', groq);
    return cities;
  }

  /**
   * Build complete site configuration
   */
  private buildSiteConfig(
    businessInfo: BusinessInfo,
    heroCopy: { headline: string; subheadline: string },
    valueProps: ValuePropConfig[],
    serviceDescriptions: Map<string, { description: string; features: string[] }>,
    cities: CityConfig[]
  ): SiteConfig {
    const primaryAddress = businessInfo.addresses[0];
    const industryInfo = INDUSTRIES[businessInfo.industry];
    const colorScheme = 'blue'; // Default

    const services: ServiceConfig[] = businessInfo.services.map((service, index) => {
      const desc = serviceDescriptions.get(service.slug);
      return {
        title: service.name,
        shortTitle: service.name.split(' ').slice(0, 2).join(' '),
        slug: service.slug,
        description: desc?.description || service.description || '',
        shortDescription: service.shortDescription || '',
        features: desc?.features || service.features || [],
        benefits: service.benefits || [],
        icon: service.isPrimary ? 'Star' : 'Wrench',
        keywords: service.keywords || [service.name.toLowerCase()],
        metaTitle: `${service.name} | ${businessInfo.name}`,
        metaDescription: `Professional ${service.name.toLowerCase()} services in ${primaryAddress.city}. Call ${businessInfo.name} today.`,
      };
    });

    const primaryReview = businessInfo.reviews[0];

    return {
      name: businessInfo.name,
      legalName: businessInfo.legalName || businessInfo.name,
      domain: businessInfo.website || `${slugify(businessInfo.name)}.com`,
      tagline: businessInfo.tagline || heroCopy.subheadline,
      description: businessInfo.description || heroCopy.subheadline,

      phone: businessInfo.phone,
      phoneDisplay: formatPhoneDisplay(businessInfo.phone),
      phoneLink: formatPhoneLink(businessInfo.phone),
      email: businessInfo.email,
      addresses: businessInfo.addresses.map(addr => ({
        ...addr,
        full: `${addr.street ? addr.street + ', ' : ''}${addr.city}, ${addr.stateAbbr} ${addr.zip}`,
        formatted: `${addr.city}, ${addr.stateAbbr}`,
      })),
      primaryAddress: {
        ...primaryAddress,
        full: `${primaryAddress.street ? primaryAddress.street + ', ' : ''}${primaryAddress.city}, ${primaryAddress.stateAbbr} ${primaryAddress.zip}`,
        formatted: `${primaryAddress.city}, ${primaryAddress.stateAbbr}`,
      },

      hours: {
        weekdays: businessInfo.hours?.weekdays || '8:00 AM - 6:00 PM',
        saturday: businessInfo.hours?.saturday || '9:00 AM - 4:00 PM',
        sunday: businessInfo.hours?.sunday || 'Closed',
        emergency: businessInfo.hours?.emergency ?? false,
      },

      social: businessInfo.social,

      rating: primaryReview ? {
        value: primaryReview.rating,
        count: primaryReview.count,
        source: primaryReview.platform,
        display: `${primaryReview.rating} stars (${primaryReview.count} reviews)`,
      } : {
        value: 5,
        count: 0,
        source: 'google',
        display: '5 stars',
      },

      yearsInBusiness: businessInfo.yearsInBusiness || 1,
      certifications: businessInfo.certifications,
      licenses: businessInfo.licenses,
      insurance: businessInfo.insurance,
      warranties: businessInfo.warranties.map(w => ({
        name: w.name,
        duration: w.duration,
        description: w.description || '',
      })),

      valueProps,
      services,
      cities,
      primaryCity: cities[0],

      industry: businessInfo.industry,
      industryDisplay: industryInfo.name,

      seo: {
        titleTemplate: `%s | ${businessInfo.name}`,
        defaultTitle: `${businessInfo.name} | ${industryInfo.name} in ${primaryAddress.city}`,
        defaultDescription: `Professional ${businessInfo.industry} services in ${primaryAddress.city}, ${primaryAddress.stateAbbr}. Call ${formatPhoneDisplay(businessInfo.phone)} for free estimates.`,
        keywords: [businessInfo.industry, primaryAddress.city, ...services.map(s => s.slug)],
        canonicalBase: `https://${slugify(businessInfo.name)}.com`,
      },

      theme: {
        colorScheme,
        style: businessInfo.tone === 'premium' ? 'modern' : 'professional',
        darkMode: false,
      },
    };
  }

  /**
   * Phase 4: Generate code with templates + Groq
   */
  async generateCode(siteConfig: SiteConfig, outputDir: string): Promise<void> {
    const result = await generateProject(siteConfig, outputDir);
    this.stats.totalFiles = result.files.length;
  }

  /**
   * Phase 5: Validate generated output
   */
  async validate(outputDir: string): Promise<void> {
    // Basic validation - check that key files exist
    // In a full implementation, run TypeScript compilation and linting
  }

  /**
   * Get generation statistics
   */
  getStats(): typeof this.stats {
    this.stats.durationMs = Date.now() - this.startTime;
    return this.stats;
  }

  /**
   * Update usage stats from LLM client
   */
  private updateUsage(provider: 'claude' | 'groq', _client: unknown): void {
    // In a full implementation, track actual token usage from responses
    // For now, use estimates
    if (provider === 'claude') {
      this.stats.claudeUsage.cost += 0.01;
      this.stats.totalCost += 0.01;
    } else {
      this.stats.groqUsage.cost += 0.001;
      this.stats.totalCost += 0.001;
    }
  }
}
