'use client';

import { useState } from 'react';
import { useWizard } from './WizardContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Globe,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  X,
  ExternalLink,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

interface DomainResult {
  domain: string;
  available: boolean;
  price?: number;
  premium?: boolean;
}

export function StepDomain({ onNext, onBack }: StepProps) {
  const { data, updateData } = useWizard();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DomainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const searchDomains = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');

    try {
      const response = await fetch('/api/domains/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to search domains');
      }

      const results = await response.json();
      setSearchResults(results.domains);
    } catch (err) {
      setError('Unable to search domains. Please try again.');
      // Show mock results for demo purposes
      const baseName = searchQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
      setSearchResults([
        { domain: `${baseName}.com`, available: Math.random() > 0.3, price: 12.99 },
        { domain: `${baseName}.net`, available: true, price: 10.99 },
        { domain: `${baseName}.co`, available: true, price: 24.99 },
        { domain: `${baseName}pro.com`, available: true, price: 12.99 },
        { domain: `get${baseName}.com`, available: true, price: 12.99 },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectDomain = (domain: string) => {
    updateData({ selectedDomain: domain, domainOption: 'search' });
  };

  const isValid =
    data.domainOption === 'later' ||
    (data.domainOption === 'search' && data.selectedDomain) ||
    (data.domainOption === 'existing' && data.existingDomain);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Choose Your Domain</h2>
          <p className="text-sm text-muted-foreground">Search for a new domain or use your own</p>
        </div>
      </div>

      {/* Domain Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { id: 'search', label: 'Search & Buy', icon: Search },
          { id: 'existing', label: 'Use My Domain', icon: Globe },
          { id: 'later', label: 'Decide Later', icon: AlertCircle },
        ].map((option) => (
          <button
            key={option.id}
            onClick={() => updateData({ domainOption: option.id as any })}
            className={clsx(
              'flex items-center gap-2 p-4 rounded-xl border-2 transition-all',
              data.domainOption === option.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            <option.icon
              className={clsx(
                'w-5 h-5',
                data.domainOption === option.id ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={clsx(
                'font-medium',
                data.domainOption === option.id ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Buy Domain */}
      {data.domainOption === 'search' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for your perfect domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchDomains()}
            />
            <Button onClick={searchDomains} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-warning flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.domain}
                  className={clsx(
                    'flex items-center justify-between p-3 rounded-lg border transition-all',
                    data.selectedDomain === result.domain
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30',
                    !result.available && 'opacity-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {result.available ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : (
                      <X className="w-5 h-5 text-error" />
                    )}
                    <div>
                      <span className="font-medium text-foreground">{result.domain}</span>
                      {result.premium && (
                        <span className="ml-2 px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {result.available && result.price && (
                      <span className="text-sm font-semibold text-foreground">
                        ${result.price}/yr
                      </span>
                    )}
                    {result.available ? (
                      <Button
                        size="sm"
                        variant={data.selectedDomain === result.domain ? 'primary' : 'outline'}
                        onClick={() => selectDomain(result.domain)}
                      >
                        {data.selectedDomain === result.domain ? 'Selected' : 'Select'}
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">Taken</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.selectedDomain && (
            <div className="p-4 bg-success/10 rounded-xl border border-success/20">
              <div className="flex items-center gap-2 text-success font-medium">
                <Check className="w-5 h-5" />
                Domain selected: <strong>{data.selectedDomain}</strong>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                This domain will be purchased and configured automatically when you launch.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Use Existing Domain */}
      {data.domainOption === 'existing' && (
        <div className="space-y-4">
          <Input
            label="Your Domain Name"
            placeholder="yourdomain.com"
            value={data.existingDomain}
            onChange={(e) => updateData({ existingDomain: e.target.value })}
          />

          {data.existingDomain && (
            <div className="p-4 bg-muted rounded-xl">
              <h4 className="font-medium text-foreground mb-2">DNS Configuration Required</h4>
              <p className="text-sm text-muted-foreground mb-3">
                After deployment, you'll need to update your DNS settings. Add these records:
              </p>
              <div className="bg-white rounded-lg p-3 font-mono text-sm space-y-2">
                <div className="flex gap-4">
                  <span className="text-muted-foreground w-16">Type</span>
                  <span className="text-muted-foreground w-20">Name</span>
                  <span className="text-muted-foreground">Value</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-semibold w-16">A</span>
                  <span className="w-20">@</span>
                  <span className="text-primary">76.76.21.21</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-semibold w-16">CNAME</span>
                  <span className="w-20">www</span>
                  <span className="text-primary">cname.vercel-dns.com</span>
                </div>
              </div>
              <a
                href="https://vercel.com/docs/concepts/projects/domains/add-a-domain"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
              >
                Learn more about DNS setup
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Decide Later */}
      {data.domainOption === 'later' && (
        <div className="p-4 bg-muted rounded-xl">
          <p className="text-muted-foreground">
            No problem! Your site will be deployed to a free <strong>.vercel.app</strong> subdomain.
            You can add a custom domain anytime later.
          </p>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} size="lg">
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
