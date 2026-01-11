'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { WizardProvider } from '@/components/wizard/WizardContext';
import { WizardSteps } from '@/components/wizard/WizardSteps';
import { StepBusiness } from '@/components/wizard/StepBusiness';
import { StepServices } from '@/components/wizard/StepServices';
import { StepDesign } from '@/components/wizard/StepDesign';
import { StepDomain } from '@/components/wizard/StepDomain';
import { StepReview } from '@/components/wizard/StepReview';
import { StepDeploy } from '@/components/wizard/StepDeploy';

const STEPS = [
  { id: 'business', title: 'Business Info', component: StepBusiness },
  { id: 'services', title: 'Services', component: StepServices },
  { id: 'design', title: 'Design', component: StepDesign },
  { id: 'domain', title: 'Domain', component: StepDomain },
  { id: 'review', title: 'Review', component: StepReview },
  { id: 'deploy', title: 'Launch', component: StepDeploy },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <WizardProvider>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">SiteForge</h1>
            </div>
            <p className="text-muted-foreground">
              Build your professional website in minutes
            </p>
          </header>

          {/* Progress Steps */}
          <WizardSteps
            steps={STEPS.map((s) => s.title)}
            currentStep={currentStep}
          />

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <CurrentStepComponent
              onNext={() => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))}
              onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              isFirst={currentStep === 0}
              isLast={currentStep === STEPS.length - 1}
            />
          </div>

          {/* Footer */}
          <footer className="text-center mt-8 text-sm text-muted-foreground">
            Powered by Claude AI & Llama 4 Maverick
          </footer>
        </div>
      </div>
    </WizardProvider>
  );
}
