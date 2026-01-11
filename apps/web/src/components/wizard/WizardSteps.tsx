'use client';

import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface WizardStepsProps {
  steps: string[];
  currentStep: number;
}

export function WizardSteps({ steps, currentStep }: WizardStepsProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300',
                index < currentStep
                  ? 'bg-success text-white'
                  : index === currentStep
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={clsx(
                'mt-2 text-xs font-medium hidden sm:block',
                index <= currentStep
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={clsx(
                'flex-1 h-1 mx-2 rounded-full transition-all duration-300',
                index < currentStep ? 'bg-success' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
