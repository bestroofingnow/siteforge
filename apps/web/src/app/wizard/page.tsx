'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { WizardProvider } from '@/components/wizard/WizardContext';
import { WizardSteps } from '@/components/wizard/WizardSteps';
import { StepBusiness } from '@/components/wizard/StepBusiness';
import { StepServices } from '@/components/wizard/StepServices';
import { StepDesign } from '@/components/wizard/StepDesign';
import { StepDomain } from '@/components/wizard/StepDomain';
import { StepReview } from '@/components/wizard/StepReview';
import { StepDeploy } from '@/components/wizard/StepDeploy';
import { AnimatedBackground } from '@/components/effects/AnimatedBackground';

const STEPS = [
  { id: 'business', title: 'Business', component: StepBusiness },
  { id: 'services', title: 'Services', component: StepServices },
  { id: 'design', title: 'Design', component: StepDesign },
  { id: 'domain', title: 'Domain', component: StepDomain },
  { id: 'review', title: 'Review', component: StepReview },
  { id: 'deploy', title: 'Launch', component: StepDeploy },
];

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const CurrentStepComponent = STEPS[currentStep].component;

  const handleNext = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <WizardProvider>
      <AnimatedBackground />

      <div className="min-h-screen py-6 px-4 sm:py-10 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-3 mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="relative"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-xl opacity-50 rounded-full" />
                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 rounded-xl">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
                SiteForge
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              Build your professional website in minutes
              <Zap className="w-4 h-4 text-amber-500" />
            </motion.p>
          </motion.header>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <WizardSteps
              steps={STEPS.map((s) => s.title)}
              currentStep={currentStep}
            />
          </motion.div>

          {/* Step Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 relative"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="relative z-10"
                >
                  <CurrentStepComponent
                    onNext={handleNext}
                    onBack={handleBack}
                    isFirst={currentStep === 0}
                    isLast={currentStep === STEPS.length - 1}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-muted-foreground">
              Powered by{' '}
              <span className="font-medium text-indigo-600">Claude AI</span>
              {' & '}
              <span className="font-medium text-purple-600">Llama 4 Maverick</span>
            </p>
          </motion.footer>
        </div>
      </div>
    </WizardProvider>
  );
}
