'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useWizard } from './WizardContext';
import { Button } from '@/components/ui/Button';
import {
  Rocket,
  ArrowLeft,
  Check,
  Loader2,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Globe,
  PartyPopper,
  Copy,
  Zap,
  Code2,
  Upload,
  Link2,
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
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'active' | 'complete' | 'error';
  message?: string;
};

export function StepDeploy({ onBack }: StepProps) {
  const { data, updateData } = useWizard();
  const [steps, setSteps] = useState<DeploymentStep[]>([
    { id: 'generate', label: 'Generating content with AI', icon: Sparkles, status: 'pending' },
    { id: 'build', label: 'Building website files', icon: Code2, status: 'pending' },
    { id: 'deploy', label: 'Deploying to Vercel', icon: Upload, status: 'pending' },
    { id: 'domain', label: 'Configuring domain', icon: Link2, status: 'pending' },
  ]);
  const [copied, setCopied] = useState(false);

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#22c55e', '#f59e0b'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

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
      const simulateDeployment = async () => {
        updateData({ deploymentStatus: 'generating' });

        for (const step of steps) {
          updateStep(step.id, 'active');
          await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
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

  // Trigger confetti when complete
  useEffect(() => {
    if (data.deploymentStatus === 'complete') {
      triggerConfetti();
    }
  }, [data.deploymentStatus, triggerConfetti]);

  const isDeploying = data.deploymentStatus === 'generating' || data.deploymentStatus === 'deploying';
  const isComplete = data.deploymentStatus === 'complete';
  const hasError = data.deploymentStatus === 'error';

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <motion.div
          className="relative"
          animate={isComplete ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-30" />
          <div className="relative p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
            <Rocket className="w-7 h-7 text-white" />
          </div>
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isComplete ? 'Your Website is Live!' : 'Launching Your Website'}
          </h2>
          <p className="text-slate-500">
            {isComplete
              ? 'Congratulations! Your site is ready to go'
              : 'Please wait while we build and deploy your site'}
          </p>
        </div>
      </motion.div>

      {/* Deployment Steps */}
      <div className="space-y-3 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={clsx(
                'flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300',
                step.status === 'complete' && 'bg-emerald-50 border-emerald-200',
                step.status === 'active' && 'bg-indigo-50 border-indigo-200 shadow-lg shadow-indigo-500/10',
                step.status === 'error' && 'bg-red-50 border-red-200',
                step.status === 'pending' && 'bg-slate-50 border-slate-200'
              )}
            >
              <motion.div
                animate={step.status === 'active' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: step.status === 'active' ? Infinity : 0 }}
                className={clsx(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  step.status === 'complete' && 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30',
                  step.status === 'active' && 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30',
                  step.status === 'error' && 'bg-gradient-to-r from-red-400 to-red-500 shadow-lg shadow-red-500/30',
                  step.status === 'pending' && 'bg-slate-200'
                )}
              >
                <AnimatePresence mode="wait">
                  {step.status === 'complete' ? (
                    <motion.div
                      key="complete"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-6 h-6 text-white" strokeWidth={3} />
                    </motion.div>
                  ) : step.status === 'active' ? (
                    <motion.div
                      key="active"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : step.status === 'error' ? (
                    <AlertCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Icon className="w-6 h-6 text-slate-400" />
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="flex-1">
                <span
                  className={clsx(
                    'font-semibold',
                    step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'
                  )}
                >
                  {step.label}
                </span>
                {step.message && (
                  <p className="text-sm text-red-500 mt-0.5">{step.message}</p>
                )}
              </div>

              {step.status === 'complete' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm text-emerald-600 font-semibold bg-emerald-100 px-3 py-1 rounded-full"
                >
                  Complete
                </motion.span>
              )}
              {step.status === 'active' && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sm text-indigo-600 font-semibold"
                >
                  Processing...
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Success State */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="relative inline-block mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-2xl opacity-30" />
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30"
              >
                <PartyPopper className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-slate-900 mb-2"
            >
              {data.businessName} is Live!
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 mb-8"
            >
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                <Globe className="w-4 h-4 text-indigo-500" />
                <a
                  href={data.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  {data.deploymentUrl}
                </a>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyUrl}
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                variant="gradient"
                onClick={() => window.open(data.deploymentUrl, '_blank')}
              >
                <ExternalLink className="w-5 h-5" />
                Visit Your Website
              </Button>
              <Button variant="outline" size="lg">
                <Zap className="w-5 h-5" />
                Create Another Site
              </Button>
            </motion.div>

            {data.domainOption === 'existing' && data.existingDomain && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-6 bg-amber-50 rounded-2xl border-2 border-amber-200 text-left max-w-md mx-auto"
              >
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-500" />
                  Connect Your Domain
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Update your DNS settings to point <strong>{data.existingDomain}</strong> to your new site:
                </p>
                <div className="bg-white rounded-xl p-4 font-mono text-sm space-y-2 border border-amber-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">A</span>
                    <span className="text-slate-900">@ → 76.76.21.21</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CNAME</span>
                    <span className="text-slate-900">www → cname.vercel-dns.com</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4"
            >
              <AlertCircle className="w-10 h-10 text-red-500" />
            </motion.div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Something went wrong
            </h3>

            <p className="text-slate-500 mb-6">{data.deploymentError}</p>

            <Button variant="primary">Try Again</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button only if not complete */}
      {!isComplete && !isDeploying && (
        <div className="flex justify-start mt-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
