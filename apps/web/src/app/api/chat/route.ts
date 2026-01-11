import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SiteData {
  businessName?: string;
  tagline?: string;
  industry?: string;
  services?: string[];
  phone?: string;
  email?: string;
  address?: string;
  primaryColor?: string;
  style?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  aboutText?: string;
}

const SYSTEM_PROMPT = `You are SiteForge AI, a friendly and professional website building assistant. Your goal is to help users create beautiful, professional websites for their businesses through natural conversation.

IMPORTANT INSTRUCTIONS:
1. Be conversational, warm, and encouraging
2. Ask ONE question at a time to gather information naturally
3. Extract business details through friendly dialogue
4. When you have enough information, generate creative content (headlines, taglines, about text)
5. Suggest improvements and offer design choices

CONVERSATION FLOW:
1. First, ask about their business name and what they do
2. Then ask about their services/offerings
3. Ask about their contact information (phone, email, location)
4. Discuss design preferences (colors, style)
5. Generate creative content based on their input

RESPONSE FORMAT:
Always respond with valid JSON in this exact format:
{
  "message": "Your conversational response here",
  "siteData": {
    "businessName": "extracted or null",
    "tagline": "generated or null",
    "industry": "extracted or null",
    "services": ["service1", "service2"] or null,
    "phone": "extracted or null",
    "email": "extracted or null",
    "address": "extracted or null",
    "primaryColor": "#hex or null",
    "style": "modern/classic/bold/minimal or null",
    "heroHeadline": "generated or null",
    "heroSubheadline": "generated or null",
    "aboutText": "generated or null"
  },
  "suggestions": ["suggestion 1", "suggestion 2"]
}

Only include fields in siteData that you've extracted or generated. Use null for unknown fields.
Generate creative, professional copy when you have enough context.
For primaryColor, suggest colors that match the industry (blue for trust, green for eco, orange for energy, etc.)`;

export async function POST(request: NextRequest) {
  try {
    const { messages, currentSiteData }: { messages: Message[]; currentSiteData: SiteData } = await request.json();

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Demo mode - simulate AI responses
      return NextResponse.json(simulateResponse(messages, currentSiteData));
    }

    // Real API call to Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse the JSON response
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch {
      // If not valid JSON, wrap the response
      return NextResponse.json({
        message: content,
        siteData: {},
        suggestions: [],
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

// Demo mode simulation
function simulateResponse(messages: Message[], currentSiteData: SiteData) {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  const messageCount = messages.filter((m) => m.role === 'user').length;

  // Simulate conversation flow
  if (messageCount === 1) {
    // First message - extract business info
    const businessName = extractBusinessName(lastMessage);
    const industry = extractIndustry(lastMessage);

    return {
      message: businessName
        ? `Great! ${businessName} sounds like a fantastic business! ${
            industry ? `I can see you're in the ${industry} industry. ` : ''
          }What services do you offer to your customers? Feel free to list a few of your main offerings.`
        : "Welcome to SiteForge! I'm excited to help you build your website. Let's start with the basics - what's your business name and what do you do?",
      siteData: {
        businessName,
        industry,
        primaryColor: getColorForIndustry(industry),
        heroHeadline: businessName ? `Welcome to ${businessName}` : null,
      },
      suggestions: [
        'We offer home repairs and renovations',
        'Professional consulting services',
        'Custom product manufacturing',
      ],
    };
  }

  if (messageCount === 2) {
    // Second message - extract services
    const services = extractServices(lastMessage);

    return {
      message: `Excellent! Those are great services. Now let's make sure customers can reach you. What's the best phone number and email address for your business?`,
      siteData: {
        services,
        heroSubheadline: services?.length
          ? `Specializing in ${services.slice(0, 2).join(' and ')}`
          : null,
      },
      suggestions: [
        '555-123-4567, contact@mybusiness.com',
        'Just phone: 555-987-6543',
        'Email only: hello@company.com',
      ],
    };
  }

  if (messageCount === 3) {
    // Third message - extract contact info
    const { phone, email } = extractContactInfo(lastMessage);

    return {
      message: `Perfect! I've got your contact details. Where is your business located? This helps with local SEO and lets customers know your service area.`,
      siteData: {
        phone,
        email,
      },
      suggestions: [
        'Charlotte, North Carolina',
        'We serve the entire metro area',
        'Based in Los Angeles, CA',
      ],
    };
  }

  if (messageCount === 4) {
    // Fourth message - location + generate about text
    const address = lastMessage.length > 3 ? capitalizeWords(lastMessage) : null;
    const businessName = currentSiteData.businessName || 'Your Business';
    const services = currentSiteData.services || [];
    const industry = currentSiteData.industry || 'service';

    return {
      message: `Wonderful! Your website is really taking shape. I've drafted some content based on what you've told me. Take a look at the preview!

Would you like to:
- Adjust the color scheme
- Modify the headlines
- Add more details about your business

Or if everything looks good, we can proceed to set up your domain and deploy your site!`,
      siteData: {
        address,
        aboutText: `${businessName} is a trusted ${industry} provider serving ${
          address || 'your local area'
        }. With our commitment to quality and customer satisfaction, we deliver ${
          services[0] || 'exceptional services'
        } that exceed expectations. Contact us today to learn how we can help you.`,
        heroHeadline: `Your Trusted ${capitalizeWords(industry)} Partner`,
        heroSubheadline: `Professional ${services.slice(0, 2).join(' & ') || 'Services'} - Serving ${address || 'Your Area'}`,
        tagline: `Quality ${capitalizeWords(industry)} Solutions`,
      },
      suggestions: [
        'Change the color to blue',
        'Make the headline more bold',
        'Looks great, let\'s deploy!',
      ],
    };
  }

  // Later messages - handle requests
  if (lastMessage.includes('blue')) {
    return {
      message: 'Done! I\'ve updated the color scheme to blue. This gives a more professional and trustworthy feel. What do you think?',
      siteData: { primaryColor: '#3b82f6' },
      suggestions: ['Perfect!', 'Try green instead', 'Let\'s deploy the site'],
    };
  }

  if (lastMessage.includes('green')) {
    return {
      message: 'Updated to green! This gives an eco-friendly, growth-oriented feel. How does that look?',
      siteData: { primaryColor: '#22c55e' },
      suggestions: ['Love it!', 'Try purple', 'Ready to deploy'],
    };
  }

  if (lastMessage.includes('deploy') || lastMessage.includes('looks good') || lastMessage.includes('perfect')) {
    return {
      message: `Fantastic! Your website is ready to go live! 🎉

Here's what happens next:
1. Click "Deploy to Vercel" to publish your site
2. You'll get a free .vercel.app domain instantly
3. You can connect a custom domain anytime

Your site will be live in about 30 seconds. Ready to launch?`,
      siteData: {},
      suggestions: ['Deploy now!', 'Wait, I want to make more changes', 'Tell me about custom domains'],
    };
  }

  // Default response
  return {
    message: 'Is there anything else you\'d like to adjust? You can change colors, update the text, or add more details. Just let me know!',
    siteData: {},
    suggestions: ['Change the colors', 'Update the headline', 'Add more services', 'Deploy the site'],
  };
}

// Helper functions
function extractBusinessName(text: string): string | null {
  // Common patterns: "I own X", "my company is X", "called X", "named X"
  const patterns = [
    /(?:called|named|is|own|run|have)\s+["']?([A-Z][A-Za-z0-9\s&']+?)["']?(?:\.|,|$|\s+(?:and|we|i|it))/i,
    /^([A-Z][A-Za-z0-9\s&']+?)(?:\s+is|\s+does|\s+-|,|\.)/,
    /business\s+(?:is\s+)?["']?([A-Z][A-Za-z0-9\s&']+?)["']?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1] && match[1].length > 2 && match[1].length < 50) {
      return match[1].trim();
    }
  }

  // If text is short and capitalized, it might be just the name
  if (text.length < 40 && /^[A-Z]/.test(text)) {
    const words = text.split(/\s+/).slice(0, 4).join(' ');
    if (words.length > 2) return words;
  }

  return null;
}

function extractIndustry(text: string): string | null {
  const industries: Record<string, string[]> = {
    roofing: ['roof', 'roofing', 'shingle', 'gutter'],
    landscaping: ['landscape', 'landscaping', 'lawn', 'garden', 'tree'],
    plumbing: ['plumb', 'plumbing', 'pipe', 'drain'],
    hvac: ['hvac', 'heating', 'cooling', 'air condition', 'furnace'],
    electrical: ['electric', 'electrical', 'wiring', 'electrician'],
    construction: ['construct', 'building', 'contractor', 'renovation'],
    cleaning: ['clean', 'cleaning', 'maid', 'janitorial'],
    automotive: ['auto', 'car', 'mechanic', 'vehicle'],
    restaurant: ['restaurant', 'food', 'cafe', 'dining', 'catering'],
    consulting: ['consult', 'advisor', 'consulting'],
    photography: ['photo', 'photography', 'photographer', 'portrait'],
    fitness: ['fitness', 'gym', 'training', 'workout', 'personal trainer'],
  };

  const lowerText = text.toLowerCase();
  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some((kw) => lowerText.includes(kw))) {
      return industry;
    }
  }

  return null;
}

function extractServices(text: string): string[] | null {
  // Split by common delimiters
  const parts = text.split(/,|and|\n|•|;|\||\//).map((s) => s.trim()).filter((s) => s.length > 2 && s.length < 50);

  if (parts.length > 0) {
    return parts.map((s) => capitalizeWords(s)).slice(0, 6);
  }

  return null;
}

function extractContactInfo(text: string): { phone: string | null; email: string | null } {
  const phoneMatch = text.match(/[\d\-\(\)\s]{10,}/);
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);

  return {
    phone: phoneMatch ? phoneMatch[0].trim() : null,
    email: emailMatch ? emailMatch[0] : null,
  };
}

function getColorForIndustry(industry: string | null): string | null {
  const colors: Record<string, string> = {
    roofing: '#dc2626',
    landscaping: '#22c55e',
    plumbing: '#3b82f6',
    hvac: '#06b6d4',
    electrical: '#f59e0b',
    construction: '#f97316',
    cleaning: '#06b6d4',
    automotive: '#6b7280',
    restaurant: '#ef4444',
    consulting: '#6366f1',
    photography: '#8b5cf6',
    fitness: '#ec4899',
  };

  return industry ? colors[industry] || '#4f46e5' : null;
}

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
