'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface WizardStepsProps {
  steps: string[];
  currentStep: number;
}

export function WizardSteps({ steps, currentStep }: WizardStepsProps) {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: index === currentStep ? 1.1 : 1,
                  y: index === currentStep ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative"
              >
                {/* Glow effect for current step */}
                {index === currentStep && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <motion.div
                  className={clsx(
                    'relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold transition-colors duration-300',
                    index < currentStep
                      ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-500/30'
                      : index === currentStep
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  {index < currentStep ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                    </motion.div>
                  ) : index === currentStep ? (
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                  ) : (
                    <span className="text-sm sm:text-base">{index + 1}</span>
                  )}
                </motion.div>
              </motion.div>

              <motion.span
                initial={false}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.5,
                  y: index === currentStep ? 2 : 0,
                }}
                className={clsx(
                  'mt-2 text-xs sm:text-sm font-medium hidden sm:block transition-colors',
                  index < currentStep
                    ? 'text-emerald-600'
                    : index === currentStep
                    ? 'text-indigo-600'
                    : 'text-slate-400'
                )}
              >
                {step}
              </motion.span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 sm:mx-4 h-1 relative overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{
                    width: index < currentStep ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                {index === currentStep - 1 && (
                  <motion.div
                    className="absolute inset-y-0 right-0 w-4 bg-gradient-to-r from-transparent to-white/50"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
