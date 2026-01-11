'use client';

import { useWizard } from './WizardContext';
import { Button } from '@/components/ui/Button';
import { Palette, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const COLOR_SCHEMES = [
  { id: 'blue', name: 'Ocean Blue', primary: '#2563eb', accent: '#f97316' },
  { id: 'green', name: 'Forest Green', primary: '#16a34a', accent: '#eab308' },
  { id: 'red', name: 'Bold Red', primary: '#dc2626', accent: '#1d4ed8' },
  { id: 'purple', name: 'Royal Purple', primary: '#9333ea', accent: '#f97316' },
  { id: 'orange', name: 'Sunset Orange', primary: '#ea580c', accent: '#2563eb' },
  { id: 'teal', name: 'Modern Teal', primary: '#0d9488', accent: '#f59e0b' },
];

const STYLES = [
  {
    id: 'modern',
    name: 'Modern & Clean',
    description: 'Minimalist design with bold typography',
    preview: 'Sharp corners, lots of white space, strong contrast',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate look that builds trust',
    preview: 'Traditional layout, professional imagery',
  },
  {
    id: 'friendly',
    name: 'Warm & Friendly',
    description: 'Approachable design for family businesses',
    preview: 'Soft corners, warm colors, inviting feel',
  },
  {
    id: 'bold',
    name: 'Bold & Dynamic',
    description: 'Eye-catching design that stands out',
    preview: 'Strong colors, dynamic elements, attention-grabbing',
  },
];

export function StepDesign({ onNext, onBack }: StepProps) {
  const { data, updateData } = useWizard();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Palette className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Design Your Site</h2>
          <p className="text-sm text-muted-foreground">Choose colors and style for your website</p>
        </div>
      </div>

      {/* Color Scheme */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-foreground mb-3">Color Scheme</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COLOR_SCHEMES.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => updateData({ colorScheme: scheme.id })}
              className={clsx(
                'relative p-4 rounded-xl border-2 transition-all text-left',
                data.colorScheme === scheme.id
                  ? 'border-primary shadow-lg'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {data.colorScheme === scheme.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="flex gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-full shadow-inner"
                  style={{ backgroundColor: scheme.primary }}
                />
                <div
                  className="w-8 h-8 rounded-full shadow-inner"
                  style={{ backgroundColor: scheme.accent }}
                />
              </div>
              <span className="text-sm font-medium text-foreground">{scheme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Website Style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => updateData({ style: style.id })}
              className={clsx(
                'relative p-4 rounded-xl border-2 transition-all text-left',
                data.style === style.id
                  ? 'border-primary shadow-lg bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {data.style === style.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <h4 className="font-semibold text-foreground mb-1">{style.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">{style.description}</p>
              <p className="text-xs text-muted-foreground italic">{style.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8 p-4 bg-muted rounded-xl">
        <h3 className="text-sm font-semibold text-foreground mb-2">Preview</h3>
        <div
          className="h-24 rounded-lg flex items-center justify-center text-white font-semibold"
          style={{
            backgroundColor: COLOR_SCHEMES.find((s) => s.id === data.colorScheme)?.primary || '#2563eb',
          }}
        >
          {data.businessName || 'Your Business Name'}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} size="lg">
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
