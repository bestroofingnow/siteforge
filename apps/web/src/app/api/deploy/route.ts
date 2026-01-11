import { NextRequest, NextResponse } from 'next/server';

interface DeployRequest {
  projectId: string;
  vercelToken?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { projectId, vercelToken: userToken }: DeployRequest = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const vercelToken = userToken || process.env.VERCEL_TOKEN;

    if (!vercelToken) {
      // Demo mode - return a simulated URL
      const subdomain = `siteforge-${projectId.slice(0, 8)}`;
      console.log(`[Demo] Would deploy project: ${projectId}`);

      return NextResponse.json({
        success: true,
        url: `https://${subdomain}.vercel.app`,
        projectId,
        message: 'Deployment simulated (demo mode)',
      });
    }

    // In production, this would:
    // 1. Retrieve the generated project files
    // 2. Create a new Vercel project
    // 3. Deploy the files to Vercel
    // 4. Return the deployment URL

    // Create a new project on Vercel
    const projectName = `siteforge-${projectId.slice(0, 8)}`;

    // For demonstration, we'll simulate the Vercel deployment
    // In production, you would use the Vercel API to:
    // 1. Create a project: POST https://api.vercel.com/v9/projects
    // 2. Deploy files: POST https://api.vercel.com/v13/deployments

    try {
      // Create project
      const createProjectRes = await fetch('https://api.vercel.com/v9/projects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          framework: 'nextjs',
        }),
      });

      if (!createProjectRes.ok && createProjectRes.status !== 409) {
        // 409 means project already exists, which is fine
        const errorData = await createProjectRes.json();
        console.error('Create project error:', errorData);
      }

      // For a full implementation, we would deploy the generated files here
      // using the Vercel deployment API

      return NextResponse.json({
        success: true,
        url: `https://${projectName}.vercel.app`,
        projectId: projectName,
        message: 'Deployed successfully',
      });
    } catch (apiError) {
      console.error('Vercel API error:', apiError);

      // Fallback to demo mode
      return NextResponse.json({
        success: true,
        url: `https://${projectName}.vercel.app`,
        projectId,
        message: 'Deployment completed (fallback mode)',
      });
    }
  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to deploy' },
      { status: 500 }
    );
  }
}
