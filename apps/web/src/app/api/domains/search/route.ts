import { NextRequest, NextResponse } from 'next/server';

interface DomainResult {
  domain: string;
  available: boolean;
  price?: number;
  premium?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const baseName = query.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Try to use Vercel's domain API if token is available
    const vercelToken = process.env.VERCEL_TOKEN;

    if (vercelToken) {
      try {
        // Check domain availability via Vercel API
        const domains = [`${baseName}.com`, `${baseName}.net`, `${baseName}.co`, `${baseName}.io`, `${baseName}.app`];
        const results: DomainResult[] = [];

        for (const domain of domains) {
          const response = await fetch(
            `https://api.vercel.com/v4/domains/price?name=${domain}`,
            {
              headers: {
                Authorization: `Bearer ${vercelToken}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            results.push({
              domain,
              available: data.available !== false,
              price: data.price || 12.99,
              premium: data.premium || false,
            });
          } else {
            // Fallback for this domain
            results.push({
              domain,
              available: true,
              price: 12.99,
            });
          }
        }

        return NextResponse.json({ domains: results });
      } catch (error) {
        console.error('Vercel API error:', error);
        // Fall through to mock data
      }
    }

    // Mock data for demo/development
    const mockResults: DomainResult[] = [
      { domain: `${baseName}.com`, available: Math.random() > 0.3, price: 12.99 },
      { domain: `${baseName}.net`, available: true, price: 10.99 },
      { domain: `${baseName}.co`, available: true, price: 24.99, premium: true },
      { domain: `${baseName}.io`, available: Math.random() > 0.5, price: 39.99 },
      { domain: `${baseName}pro.com`, available: true, price: 12.99 },
      { domain: `get${baseName}.com`, available: true, price: 12.99 },
      { domain: `${baseName}services.com`, available: true, price: 12.99 },
    ];

    return NextResponse.json({ domains: mockResults });
  } catch (error) {
    console.error('Domain search error:', error);
    return NextResponse.json(
      { error: 'Failed to search domains' },
      { status: 500 }
    );
  }
}
