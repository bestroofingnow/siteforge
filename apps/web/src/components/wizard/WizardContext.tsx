'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { IndustryType } from '@siteforge/shared';

export interface WizardData {
  // Business Info
  businessName: string;
  industry: IndustryType;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  yearsInBusiness: number;

  // Services
  services: string[];
  serviceAreas: string[];

  // Design
  colorScheme: string;
  style: string;

  // Domain
  domainOption: 'search' | 'existing' | 'later';
  selectedDomain: string;
  existingDomain: string;

  // Deployment
  vercelToken: string;
  deploymentUrl: string;
  deploymentStatus: 'idle' | 'generating' | 'deploying' | 'complete' | 'error';
  deploymentError: string;
}

interface WizardContextType {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  resetData: () => void;
}

const defaultData: WizardData = {
  businessName: '',
  industry: 'roofing',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  yearsInBusiness: 0,
  services: [],
  serviceAreas: [],
  colorScheme: 'blue',
  style: 'modern',
  domainOption: 'search',
  selectedDomain: '',
  existingDomain: '',
  vercelToken: '',
  deploymentUrl: '',
  deploymentStatus: 'idle',
  deploymentError: '',
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WizardData>(defaultData);

  const updateData = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(defaultData);
  };

  return (
    <WizardContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
