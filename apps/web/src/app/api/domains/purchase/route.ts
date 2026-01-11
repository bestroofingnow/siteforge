import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { domain, projectId } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    const vercelToken = process.env.VERCEL_TOKEN;

    if (!vercelToken) {
      // Demo mode - simulate purchase
      console.log(`[Demo] Would purchase domain: ${domain}`);
      return NextResponse.json({
        success: true,
        domain,
        message: 'Domain purchase simulated (demo mode)',
      });
    }

    // Step 1: Purchase the domain
    const purchaseResponse = await fetch('https://api.vercel.com/v4/domains/buy', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });

    if (!purchaseResponse.ok) {
      const error = await purchaseResponse.json();
      throw new Error(error.error?.message || 'Failed to purchase domain');
    }

    // Step 2: If projectId provided, add domain to project
    if (projectId) {
      const addDomainResponse = await fetch(
        `https://api.vercel.com/v10/projects/${projectId}/domains`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: domain }),
        }
      );

      if (!addDomainResponse.ok) {
        console.error('Failed to add domain to project:', await addDomainResponse.text());
      }
    }

    return NextResponse.json({
      success: true,
      domain,
      message: 'Domain purchased successfully',
    });
  } catch (error) {
    console.error('Domain purchase error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to purchase domain' },
      { status: 500 }
    );
  }
}
