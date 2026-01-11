'use client';

import { useWizard } from './WizardContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Building2, ArrowRight } from 'lucide-react';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const INDUSTRIES = [
  { value: 'roofing', label: 'Roofing' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'painting', label: 'Painting' },
  { value: 'cleaning', label: 'Cleaning Services' },
  { value: 'construction', label: 'General Construction' },
  { value: 'remodeling', label: 'Remodeling' },
  { value: 'pest-control', label: 'Pest Control' },
  { value: 'moving', label: 'Moving Services' },
  { value: 'auto-repair', label: 'Auto Repair' },
];

const STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

export function StepBusiness({ onNext }: StepProps) {
  const { data, updateData } = useWizard();

  const isValid =
    data.businessName.trim() !== '' &&
    data.phone.trim() !== '' &&
    data.email.trim() !== '' &&
    data.city.trim() !== '' &&
    data.state.trim() !== '';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Business Information</h2>
          <p className="text-sm text-muted-foreground">Tell us about your business</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Business Name"
            placeholder="ABC Roofing & Construction"
            value={data.businessName}
            onChange={(e) => updateData({ businessName: e.target.value })}
          />
        </div>

        <Select
          label="Industry"
          options={INDUSTRIES}
          value={data.industry}
          onChange={(e) => updateData({ industry: e.target.value as any })}
        />

        <Input
          label="Years in Business"
          type="number"
          placeholder="10"
          value={data.yearsInBusiness || ''}
          onChange={(e) => updateData({ yearsInBusiness: parseInt(e.target.value) || 0 })}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          value={data.phone}
          onChange={(e) => updateData({ phone: e.target.value })}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="info@yourbusiness.com"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
        />

        <div className="md:col-span-2">
          <Input
            label="Street Address"
            placeholder="123 Main Street"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
          />
        </div>

        <Input
          label="City"
          placeholder="Charlotte"
          value={data.city}
          onChange={(e) => updateData({ city: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="State"
            options={[{ value: '', label: 'Select...' }, ...STATES]}
            value={data.state}
            onChange={(e) => updateData({ state: e.target.value })}
          />

          <Input
            label="ZIP Code"
            placeholder="28202"
            value={data.zip}
            onChange={(e) => updateData({ zip: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button onClick={onNext} disabled={!isValid} size="lg">
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
