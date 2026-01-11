import { NextRequest, NextResponse } from 'next/server';
import { INDUSTRY_DEFAULTS, generateDefaultConfig, generateTestimonials } from '@/lib/website-templates';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SiteConfig {
  businessName?: string;
  tagline?: string;
  industry?: string;
  services?: Array<{ name: string; description: string; icon: string }>;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  primaryColor?: string;
  accentColor?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  aboutText?: string;
  yearsInBusiness?: number;
  trustBadges?: Array<{ icon: string; text: string }>;
  testimonials?: Array<{ name: string; text: string; rating: number }>;
  faqs?: Array<{ question: string; answer: string }>;
  ctaHeadline?: string;
  ctaSubheadline?: string;
}

const SYSTEM_PROMPT = `You are SiteForge AI, a friendly website builder assistant helping users create professional business websites.

CONVERSATION FLOW:
1. First, ask about their business name, industry, and location
2. Then ask about their services
3. Finally ask for contact info (phone/email)
4. Once you have enough info, generate the complete website

GUIDELINES:
- Be warm, conversational, and encouraging
- Ask 1-2 questions at a time
- Generate professional, SEO-optimized content when ready
- For industries, use: roofing, landscaping, plumbing, hvac, electrical, cleaning, construction, painting, flooring, pest

You MUST respond with ONLY valid JSON - no markdown, no code blocks, no extra text. Just the raw JSON object:

{"message":"Your friendly response here","siteConfig":{},"stage":"gathering","suggestions":["opt1","opt2"]}

siteConfig fields (only include what you're setting):
- businessName, industry, city, state, phone, email
- primaryColor (hex like #1e3a5f), accentColor (hex)
- heroHeadline, heroSubheadline, tagline, aboutText
- services: [{"name":"Service Name","description":"Description","icon":"shield"}]
- trustBadges: [{"icon":"star","text":"5-Star Rated"}]
- testimonials: [{"name":"John D.","text":"Great service!","rating":5}]
- ctaHeadline, ctaSubheadline

stage: "gathering" while collecting info, "complete" when website is ready
suggestions: 2-4 quick reply options for the user`;

export async function POST(request: NextRequest) {
  try {
    const { messages, currentSiteConfig }: { messages: Message[]; currentSiteConfig: SiteConfig } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Demo mode with intelligent simulation
      return NextResponse.json(simulateResponse(messages, currentSiteConfig));
    }

    // Real API call
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          {
            role: 'user',
            content: `Current site config: ${JSON.stringify(currentSiteConfig)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.content[0].text;

    // Clean up the response - remove markdown code blocks if present
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.slice(7);
    } else if (content.startsWith('```')) {
      content = content.slice(3);
    }
    if (content.endsWith('```')) {
      content = content.slice(0, -3);
    }
    content = content.trim();

    // Try to extract JSON if there's extra text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }

    try {
      const parsed = JSON.parse(content);
      // Ensure message exists
      if (!parsed.message) {
        parsed.message = "I'm working on your website. What would you like to do next?";
      }
      return NextResponse.json(parsed);
    } catch {
      // If JSON parsing fails, use the content as the message
      return NextResponse.json({
        message: content.replace(/[{}"\[\]]/g, '').trim() || "I'm here to help! Tell me about your business.",
        siteConfig: {},
        stage: 'gathering',
        suggestions: [],
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

function simulateResponse(messages: Message[], currentConfig: SiteConfig) {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  const userMessageCount = messages.filter((m) => m.role === 'user').length;

  // Extract information from user message
  const extractedInfo = extractInfo(lastMessage, currentConfig);

  // Determine conversation stage
  const hasBusinessName = currentConfig.businessName || extractedInfo.businessName;
  const hasIndustry = currentConfig.industry || extractedInfo.industry;
  const hasServices = currentConfig.services?.length || extractedInfo.extractedServices?.length;
  const hasContact = currentConfig.phone || extractedInfo.phone;

  // Stage 1: Get business basics
  if (!hasBusinessName || !hasIndustry) {
    const businessName = extractedInfo.businessName;
    const industry = extractedInfo.industry;
    const city = extractedInfo.city;

    if (businessName && industry) {
      const defaults = INDUSTRY_DEFAULTS[industry] || INDUSTRY_DEFAULTS.roofing;
      return {
        message: `Great! ${businessName} sounds like a fantastic ${industry} business${city ? ` in ${city}` : ''}! I'm already building your website.

What services do you offer? I can suggest some common ones for ${industry} businesses, or you can tell me your specific offerings.`,
        siteConfig: {
          businessName,
          industry,
          city: city || undefined,
          state: extractedInfo.state || undefined,
          primaryColor: defaults.primaryColor,
          accentColor: defaults.accentColor,
          trustBadges: defaults.trustBadges,
        },
        stage: 'gathering',
        suggestions: defaults.services?.slice(0, 3).map(s => s.name) || [],
      };
    }

    return {
      message: userMessageCount === 1
        ? "Welcome to SiteForge! I'll help you build a professional website in just a few minutes.\n\nLet's start - what's your business name, what industry are you in, and where are you located?"
        : "I need a bit more info. What's your business name and what type of business is it? (e.g., 'Apex Roofing in Charlotte' or 'Green Valley Landscaping in Austin')",
      siteConfig: {},
      stage: 'gathering',
      suggestions: [
        "I run Apex Roofing in Charlotte, NC",
        "Green Valley Landscaping in Austin, TX",
        "Premier Plumbing Services in Denver",
      ],
    };
  }

  // Stage 2: Get services
  if (!hasServices) {
    const services = extractedInfo.extractedServices;
    if (services?.length) {
      return {
        message: `Perfect! I've added those services. Now let's add your contact details.\n\nWhat's your business phone number and email address?`,
        siteConfig: {
          services: services.map(s => ({
            name: s,
            description: generateServiceDescription(s, currentConfig.industry || ''),
            icon: 'shield',
          })),
        },
        stage: 'gathering',
        suggestions: [
          "(704) 555-1234, info@example.com",
          "Just phone: (555) 123-4567",
          "Email: contact@mybusiness.com",
        ],
      };
    }

    const industryDefaults = INDUSTRY_DEFAULTS[currentConfig.industry || 'roofing'];
    return {
      message: `What services does ${currentConfig.businessName} offer?\n\nHere are some common services for ${currentConfig.industry} businesses - feel free to use these or tell me your own:`,
      siteConfig: {},
      stage: 'gathering',
      suggestions: industryDefaults?.services?.slice(0, 4).map(s => s.name) || ['Service 1', 'Service 2'],
    };
  }

  // Stage 3: Get contact info
  if (!hasContact) {
    const { phone, email } = extractedInfo;
    if (phone || email) {
      // Generate the complete website!
      const fullConfig = generateCompleteWebsite(currentConfig, { phone, email });
      return {
        message: `Excellent! Your website is ready! 🎉

I've generated a complete professional website for ${currentConfig.businessName} with:
✓ Homepage with hero section and trust badges
✓ About page with your company story
✓ Services page with all your offerings
✓ Contact page with form and info

Take a look at the preview and let me know if you'd like to make any changes. When you're happy with it, click "Deploy to Vercel" to go live!`,
        siteConfig: fullConfig,
        stage: 'complete',
        suggestions: [
          "Change the colors",
          "Update the headline",
          "Add more services",
          "Deploy now!",
        ],
      };
    }

    return {
      message: `Almost done! What's the best way for customers to reach ${currentConfig.businessName}?\n\nPlease share your phone number and/or email address.`,
      siteConfig: {},
      stage: 'gathering',
      suggestions: [
        "(555) 123-4567",
        "info@mybusiness.com",
        "Both: (555) 123-4567, hello@business.com",
      ],
    };
  }

  // Handle modification requests
  if (lastMessage.includes('color') || lastMessage.includes('blue') || lastMessage.includes('green') || lastMessage.includes('red')) {
    const newColor = extractColor(lastMessage);
    if (newColor) {
      return {
        message: `Done! I've updated the color scheme. How does that look?`,
        siteConfig: { primaryColor: newColor },
        stage: 'complete',
        suggestions: ["Looks great!", "Try a different color", "Deploy now!"],
      };
    }
  }

  if (lastMessage.includes('headline') || lastMessage.includes('title')) {
    return {
      message: `What would you like the main headline to say? This appears at the top of your homepage.`,
      siteConfig: {},
      stage: 'complete',
      suggestions: [
        `${currentConfig.city}'s #1 ${capitalize(currentConfig.industry || '')} Company`,
        `Trusted ${capitalize(currentConfig.industry || '')} Experts`,
        "Quality Service, Guaranteed Results",
      ],
    };
  }

  if (lastMessage.includes('deploy') || lastMessage.includes('ready') || lastMessage.includes('live') || lastMessage.includes('looks good')) {
    return {
      message: `Perfect! Click the "Deploy to Vercel" button in the header to publish your site. It'll be live in about 30 seconds!

After deployment, you can:
• Connect a custom domain
• Make additional changes anytime
• Add more pages like FAQ, Gallery, or Blog`,
      siteConfig: {},
      stage: 'complete',
      suggestions: [],
    };
  }

  // Default response for complete stage
  return {
    message: `Your website is looking great! Is there anything you'd like to change?\n\nYou can:\n• Adjust colors or styling\n• Update headlines and text\n• Add more services\n• Deploy when ready!`,
    siteConfig: {},
    stage: 'complete',
    suggestions: ["Change colors", "Update text", "Add services", "Deploy now!"],
  };
}

interface ExtractedInfo {
  businessName?: string;
  industry?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  extractedServices?: string[];
}

function extractInfo(text: string, currentConfig: SiteConfig): ExtractedInfo {
  const result: ExtractedInfo = {};

  // Extract business name
  const namePatterns = [
    /(?:called|named|is|run|own)\s+["']?([A-Z][A-Za-z0-9\s&']+?)["']?(?:\s+in|\s+from|,|\.|\s+and|\s+we)/i,
    /^([A-Z][A-Za-z0-9\s&']+?)\s+(?:in|from|is)/i,
    /my\s+(?:business|company)\s+(?:is\s+)?["']?([A-Z][A-Za-z0-9\s&']+?)["']?/i,
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match?.[1] && match[1].length > 2 && match[1].length < 40) {
      result.businessName = match[1].trim();
      break;
    }
  }

  // Extract industry
  const industries: Record<string, string[]> = {
    roofing: ['roof', 'roofing', 'shingle', 'gutter', 'roofer'],
    landscaping: ['landscape', 'landscaping', 'lawn', 'garden', 'yard'],
    plumbing: ['plumb', 'plumbing', 'pipe', 'drain', 'plumber'],
    hvac: ['hvac', 'heating', 'cooling', 'air condition', 'ac ', 'furnace'],
    electrical: ['electric', 'electrical', 'wiring', 'electrician'],
    cleaning: ['clean', 'cleaning', 'maid', 'janitorial', 'housekeep'],
    construction: ['construct', 'building', 'contractor', 'remodel', 'renovation'],
    painting: ['paint', 'painting', 'painter'],
    flooring: ['floor', 'flooring', 'carpet', 'tile', 'hardwood'],
    pest: ['pest', 'exterminator', 'bug', 'termite'],
  };

  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(kw => text.toLowerCase().includes(kw))) {
      result.industry = industry;
      break;
    }
  }

  // Extract city and state
  const locationMatch = text.match(/in\s+([A-Za-z\s]+),?\s*([A-Z]{2})?/i);
  if (locationMatch) {
    result.city = locationMatch[1].trim();
    if (locationMatch[2]) result.state = locationMatch[2];
  }

  // Extract services
  const serviceIndicators = ['offer', 'provide', 'do', 'services', 'specialize'];
  if (serviceIndicators.some(ind => text.toLowerCase().includes(ind)) || currentConfig.businessName) {
    const parts = text.split(/,|\band\b|\n|;/).map(s => s.trim()).filter(s => {
      const lower = s.toLowerCase();
      return s.length > 3 &&
        s.length < 50 &&
        !lower.includes('my business') &&
        !lower.includes('we offer') &&
        !lower.includes('email') &&
        !lower.includes('phone') &&
        !lower.includes('@');
    });
    if (parts.length > 0) {
      result.extractedServices = parts.map(s => capitalize(s.replace(/^(we\s+)?(offer|provide|do)\s+/i, '')));
    }
  }

  // Extract contact info
  const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) result.phone = phoneMatch[0];

  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) result.email = emailMatch[0];

  return result;
}

function generateCompleteWebsite(currentConfig: SiteConfig, contactInfo: { phone?: string; email?: string }): SiteConfig {
  const industry = currentConfig.industry || 'roofing';
  const defaults = INDUSTRY_DEFAULTS[industry] || INDUSTRY_DEFAULTS.roofing;
  const city = currentConfig.city || 'Your City';
  const businessName = currentConfig.businessName || 'Your Business';

  return {
    ...currentConfig,
    phone: contactInfo.phone || currentConfig.phone,
    email: contactInfo.email || currentConfig.email,
    address: `${city}${currentConfig.state ? `, ${currentConfig.state}` : ''}`,
    heroHeadline: `${city}'s Trusted ${capitalize(industry)} Experts`,
    heroSubheadline: `Professional ${industry} services with quality craftsmanship and customer satisfaction guaranteed. Serving ${city} and surrounding areas with integrity and expertise.`,
    tagline: `Quality ${capitalize(industry)} Solutions`,
    aboutText: `${businessName} has been proudly serving ${city} and the surrounding communities with professional ${industry} services. Our team of experienced professionals is dedicated to delivering exceptional results with integrity, quality workmanship, and outstanding customer service. We treat every project as if it were our own home, ensuring complete satisfaction with every job.`,
    yearsInBusiness: 10,
    testimonials: [
      {
        name: 'Sarah M.',
        text: `${businessName} exceeded our expectations! Professional, punctual, and the quality of work was outstanding. Highly recommend!`,
        rating: 5,
      },
      {
        name: 'Michael R.',
        text: `From start to finish, the team at ${businessName} was fantastic. They explained everything clearly and delivered exactly what they promised.`,
        rating: 5,
      },
      {
        name: 'Jennifer L.',
        text: `I've used ${businessName} multiple times now and they never disappoint. Fair pricing, great communication, and excellent results every time.`,
        rating: 5,
      },
    ],
    ctaHeadline: 'Ready to Get Started?',
    ctaSubheadline: `Contact ${businessName} today for a free consultation and estimate.`,
    faqs: defaults.faqs,
    services: currentConfig.services || defaults.services,
    trustBadges: defaults.trustBadges || currentConfig.trustBadges,
  };
}

function generateServiceDescription(serviceName: string, industry: string): string {
  const templates = [
    `Professional ${serviceName.toLowerCase()} services tailored to your needs`,
    `Expert ${serviceName.toLowerCase()} with quality materials and workmanship`,
    `Reliable ${serviceName.toLowerCase()} solutions for residential and commercial clients`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function extractColor(text: string): string | null {
  const colors: Record<string, string> = {
    blue: '#1d4ed8',
    green: '#166534',
    red: '#dc2626',
    purple: '#7c3aed',
    orange: '#ea580c',
    teal: '#0d9488',
    indigo: '#4f46e5',
    navy: '#1e3a5f',
    black: '#1f2937',
  };

  for (const [name, hex] of Object.entries(colors)) {
    if (text.toLowerCase().includes(name)) return hex;
  }
  return null;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
