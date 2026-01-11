'use client';

import { useEffect, useState } from 'react';
import { useWizard } from './WizardContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Rocket,
  ArrowLeft,
  Check,
  Loader2,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Code,
  Globe,
  PartyPopper,
  Copy,
} from 'lucide-react';
import { clsx } from 'clsx';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

type DeploymentStep = {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  message?: string;
};

export function StepDeploy({ onBack }: StepProps) {
  const { data, updateData } = useWizard();
  const [steps, setSteps] = useState<DeploymentStep[]>([
    { id: 'generate', label: 'Generating content with AI', status: 'pending' },
    { id: 'build', label: 'Building website files', status: 'pending' },
    { id: 'deploy', label: 'Deploying to Vercel', status: 'pending' },
    { id: 'domain', label: 'Configuring domain', status: 'pending' },
  ]);
  const [copied, setCopied] = useState(false);

  const startDeployment = async () => {
    updateData({ deploymentStatus: 'generating', deploymentError: '' });

    // Step 1: Generate content
    updateStep('generate', 'active');
    try {
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: data.businessName,
          industry: data.industry,
          phone: data.phone,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          services: data.services,
          serviceAreas: data.serviceAreas,
          colorScheme: data.colorScheme,
          style: data.style,
        }),
      });

      if (!generateRes.ok) {
        throw new Error('Failed to generate website');
      }

      const { projectId } = await generateRes.json();
      updateStep('generate', 'complete');

      // Step 2: Build
      updateStep('build', 'active');
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated build time
      updateStep('build', 'complete');

      // Step 3: Deploy
      updateData({ deploymentStatus: 'deploying' });
      updateStep('deploy', 'active');

      const deployRes = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          vercelToken: data.vercelToken,
        }),
      });

      if (!deployRes.ok) {
        throw new Error('Failed to deploy to Vercel');
      }

      const { url } = await deployRes.json();
      updateData({ deploymentUrl: url });
      updateStep('deploy', 'complete');

      // Step 4: Domain
      updateStep('domain', 'active');
      if (data.domainOption === 'search' && data.selectedDomain) {
        // Purchase and configure domain
        await fetch('/api/domains/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: data.selectedDomain,
            projectId,
          }),
        });
      }
      updateStep('domain', 'complete');

      updateData({ deploymentStatus: 'complete' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Deployment failed';
      updateData({ deploymentStatus: 'error', deploymentError: message });

      // Mark current active step as error
      setSteps((prev) =>
        prev.map((step) =>
          step.status === 'active' ? { ...step, status: 'error', message } : step
        )
      );
    }
  };

  const updateStep = (id: string, status: DeploymentStep['status'], message?: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, status, message } : step))
    );
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(data.deploymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-start deployment when component mounts (demo mode)
  useEffect(() => {
    if (data.deploymentStatus === 'idle') {
      // Simulate deployment for demo
      const simulateDeployment = async () => {
        updateData({ deploymentStatus: 'generating' });

        for (const step of steps) {
          updateStep(step.id, 'active');
          await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
          updateStep(step.id, 'complete');
        }

        const subdomain = data.businessName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-');
        updateData({
          deploymentStatus: 'complete',
          deploymentUrl: `https://${subdomain}.vercel.app`,
        });
      };

      simulateDeployment();
    }
  }, []);

  const isDeploying = data.deploymentStatus === 'generating' || data.deploymentStatus === 'deploying';
  const isComplete = data.deploymentStatus === 'complete';
  const hasError = data.deploymentStatus === 'error';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Rocket className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {isComplete ? 'Your Website is Live!' : 'Launching Your Website'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isComplete
              ? 'Congratulations! Your site is ready to go'
              : 'Please wait while we build and deploy your site'}
          </p>
        </div>
      </div>

      {/* Deployment Steps */}
      <div className="space-y-3 mb-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={clsx(
              'flex items-center gap-3 p-4 rounded-xl border transition-all',
              step.status === 'complete' && 'bg-success/5 border-success/20',
              step.status === 'active' && 'bg-primary/5 border-primary/20',
              step.status === 'error' && 'bg-error/5 border-error/20',
              step.status === 'pending' && 'bg-muted/50 border-border'
            )}
          >
            <div
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center',
                step.status === 'complete' && 'bg-success text-white',
                step.status === 'active' && 'bg-primary text-white',
                step.status === 'error' && 'bg-error text-white',
                step.status === 'pending' && 'bg-muted text-muted-foreground'
              )}
            >
              {step.status === 'complete' ? (
                <Check className="w-4 h-4" />
              ) : step.status === 'active' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : step.status === 'error' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <div className="flex-1">
              <span
                className={clsx(
                  'font-medium',
                  step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                )}
              >
                {step.label}
              </span>
              {step.message && (
                <p className="text-sm text-error mt-0.5">{step.message}</p>
              )}
            </div>
            {step.status === 'complete' && (
              <span className="text-sm text-success font-medium">Done</span>
            )}
          </div>
        ))}
      </div>

      {/* Success State */}
      {isComplete && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-4">
            <PartyPopper className="w-10 h-10 text-success" />
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-2">
            {data.businessName} is Live!
          </h3>

          <div className="flex items-center justify-center gap-2 mb-6">
            <a
              href={data.deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {data.deploymentUrl}
            </a>
            <button
              onClick={copyUrl}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => window.open(data.deploymentUrl, '_blank')}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Visit Your Website
            </Button>
            <Button variant="outline" size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Create Another Site
            </Button>
          </div>

          {data.domainOption === 'existing' && data.existingDomain && (
            <div className="mt-8 p-4 bg-warning/10 rounded-xl border border-warning/20 text-left max-w-md mx-auto">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Globe className="w-5 h-5 text-warning" />
                Connect Your Domain
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Update your DNS settings to point <strong>{data.existingDomain}</strong> to your new site:
              </p>
              <div className="bg-white rounded-lg p-3 font-mono text-xs space-y-1">
                <div>A @ → 76.76.21.21</div>
                <div>CNAME www → cname.vercel-dns.com</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-error/10 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-error" />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">
            Something went wrong
          </h3>

          <p className="text-muted-foreground mb-6">{data.deploymentError}</p>

          <Button onClick={startDeployment}>Try Again</Button>
        </div>
      )}

      {/* Back button only if not complete */}
      {!isComplete && !isDeploying && (
        <div className="flex justify-start mt-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
