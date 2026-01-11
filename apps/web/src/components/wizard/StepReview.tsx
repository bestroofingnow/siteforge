'use client';

import { useWizard } from './WizardContext';
import { Button } from '@/components/ui/Button';
import {
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Building2,
  Wrench,
  Palette,
  Globe,
  MapPin,
  Edit2,
} from 'lucide-react';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function StepReview({ onNext, onBack }: StepProps) {
  const { data } = useWizard();

  const sections = [
    {
      title: 'Business Information',
      icon: Building2,
      items: [
        { label: 'Business Name', value: data.businessName },
        { label: 'Industry', value: data.industry.charAt(0).toUpperCase() + data.industry.slice(1) },
        { label: 'Phone', value: data.phone },
        { label: 'Email', value: data.email },
        {
          label: 'Location',
          value: [data.address, data.city, data.state, data.zip].filter(Boolean).join(', '),
        },
        { label: 'Years in Business', value: data.yearsInBusiness ? `${data.yearsInBusiness} years` : 'Not specified' },
      ],
    },
    {
      title: 'Services',
      icon: Wrench,
      items: [
        { label: 'Services Offered', value: data.services.join(', ') || 'None selected' },
      ],
    },
    {
      title: 'Service Areas',
      icon: MapPin,
      items: [
        { label: 'Areas', value: data.serviceAreas.join(', ') || 'None selected' },
      ],
    },
    {
      title: 'Design',
      icon: Palette,
      items: [
        { label: 'Color Scheme', value: data.colorScheme.charAt(0).toUpperCase() + data.colorScheme.slice(1) },
        { label: 'Style', value: data.style.charAt(0).toUpperCase() + data.style.slice(1) },
      ],
    },
    {
      title: 'Domain',
      icon: Globe,
      items: [
        {
          label: 'Domain',
          value:
            data.domainOption === 'search'
              ? data.selectedDomain || 'None selected'
              : data.domainOption === 'existing'
              ? data.existingDomain || 'Not specified'
              : 'Will use .vercel.app subdomain',
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Review Your Website</h2>
          <p className="text-sm text-muted-foreground">Make sure everything looks right</p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="p-4 bg-muted/50 rounded-xl border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <section.icon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">{section.title}</h3>
              </div>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground text-right max-w-[60%]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* What happens next */}
      <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
        <h4 className="font-semibold text-foreground mb-2">What happens next?</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>AI generates your website content and code</li>
          <li>Site is deployed to Vercel automatically</li>
          {data.domainOption === 'search' && data.selectedDomain && (
            <li>Domain {data.selectedDomain} is purchased and connected</li>
          )}
          {data.domainOption === 'existing' && data.existingDomain && (
            <li>DNS instructions provided for {data.existingDomain}</li>
          )}
          <li>Your live website URL is provided</li>
        </ol>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} size="lg">
          Generate & Launch
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
