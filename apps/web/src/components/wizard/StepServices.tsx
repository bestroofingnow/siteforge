'use client';

import { useState } from 'react';
import { useWizard } from './WizardContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Wrench, ArrowRight, ArrowLeft, Plus, X, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const SERVICE_SUGGESTIONS: Record<string, string[]> = {
  roofing: [
    'Roof Repair',
    'Roof Replacement',
    'Roof Inspection',
    'Storm Damage Repair',
    'Commercial Roofing',
    'Shingle Installation',
    'Metal Roofing',
    'Flat Roof Repair',
    'Gutter Installation',
    'Emergency Roof Repair',
  ],
  landscaping: [
    'Lawn Care',
    'Landscape Design',
    'Tree Trimming',
    'Irrigation Systems',
    'Hardscaping',
    'Garden Installation',
    'Mulching',
    'Sod Installation',
    'Outdoor Lighting',
    'Seasonal Cleanup',
  ],
  plumbing: [
    'Drain Cleaning',
    'Pipe Repair',
    'Water Heater Installation',
    'Leak Detection',
    'Bathroom Plumbing',
    'Kitchen Plumbing',
    'Sewer Line Repair',
    'Emergency Plumbing',
    'Fixture Installation',
    'Water Line Repair',
  ],
  hvac: [
    'AC Installation',
    'Heating Repair',
    'HVAC Maintenance',
    'Duct Cleaning',
    'Thermostat Installation',
    'Furnace Repair',
    'Heat Pump Service',
    'Indoor Air Quality',
    'Commercial HVAC',
    'Emergency HVAC Service',
  ],
  electrical: [
    'Electrical Repair',
    'Panel Upgrades',
    'Wiring Installation',
    'Lighting Installation',
    'Outlet Repair',
    'Ceiling Fan Installation',
    'Generator Installation',
    'EV Charger Installation',
    'Electrical Inspection',
    'Commercial Electrical',
  ],
  painting: [
    'Interior Painting',
    'Exterior Painting',
    'Cabinet Painting',
    'Deck Staining',
    'Wallpaper Removal',
    'Drywall Repair',
    'Pressure Washing',
    'Commercial Painting',
    'Color Consultation',
    'Trim Painting',
  ],
};

export function StepServices({ onNext, onBack }: StepProps) {
  const { data, updateData } = useWizard();
  const [newService, setNewService] = useState('');
  const [newArea, setNewArea] = useState('');

  const suggestions = SERVICE_SUGGESTIONS[data.industry] || SERVICE_SUGGESTIONS.roofing;

  const addService = (service: string) => {
    if (service && !data.services.includes(service)) {
      updateData({ services: [...data.services, service] });
    }
    setNewService('');
  };

  const removeService = (service: string) => {
    updateData({ services: data.services.filter((s) => s !== service) });
  };

  const addArea = (area: string) => {
    if (area && !data.serviceAreas.includes(area)) {
      updateData({ serviceAreas: [...data.serviceAreas, area] });
    }
    setNewArea('');
  };

  const removeArea = (area: string) => {
    updateData({ serviceAreas: data.serviceAreas.filter((a) => a !== area) });
  };

  const isValid = data.services.length > 0 && data.serviceAreas.length > 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Wrench className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Services & Areas</h2>
          <p className="text-sm text-muted-foreground">What services do you offer and where?</p>
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-foreground mb-3">Services Offered</h3>

        {/* Service Suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((service) => (
            <button
              key={service}
              onClick={() => addService(service)}
              disabled={data.services.includes(service)}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-full border transition-all',
                data.services.includes(service)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-muted-foreground border-border hover:border-primary hover:text-primary'
              )}
            >
              {data.services.includes(service) ? '✓ ' : '+ '}
              {service}
            </button>
          ))}
        </div>

        {/* Add Custom Service */}
        <div className="flex gap-2">
          <Input
            placeholder="Add custom service..."
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addService(newService)}
          />
          <Button variant="outline" onClick={() => addService(newService)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected Services */}
        {data.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {data.services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {service}
                <button
                  onClick={() => removeService(service)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Service Areas Section */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Service Areas
        </h3>

        <p className="text-sm text-muted-foreground mb-3">
          Add cities or neighborhoods where you provide services
        </p>

        {/* Add Area */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="e.g., Charlotte, Huntersville, Matthews..."
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addArea(newArea)}
          />
          <Button variant="outline" onClick={() => addArea(newArea)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected Areas */}
        {data.serviceAreas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.serviceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent-dark rounded-full text-sm font-medium"
              >
                <MapPin className="w-3 h-3" />
                {area}
                <button
                  onClick={() => removeArea(area)}
                  className="hover:bg-accent/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

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
