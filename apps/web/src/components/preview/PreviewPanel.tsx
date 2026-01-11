'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Maximize2,
  Eye,
  Palette,
  Layout,
  Type,
} from 'lucide-react';
import { clsx } from 'clsx';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface SiteData {
  businessName: string;
  tagline: string;
  industry: string;
  services: string[];
  phone: string;
  email: string;
  address: string;
  primaryColor: string;
  style: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutText: string;
}

interface PreviewPanelProps {
  siteData: Partial<SiteData>;
  isGenerating: boolean;
}

const deviceSizes: Record<DeviceType, { width: string; label: string }> = {
  desktop: { width: '100%', label: 'Desktop' },
  tablet: { width: '768px', label: 'Tablet' },
  mobile: { width: '375px', label: 'Mobile' },
};

export function PreviewPanel({ siteData, isGenerating }: PreviewPanelProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const hasContent = siteData.businessName || siteData.heroHeadline;

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-3 text-xs text-slate-400">Live Preview</span>
        </div>

        {/* Device Toggles */}
        <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-lg">
          {[
            { type: 'desktop' as const, icon: Monitor },
            { type: 'tablet' as const, icon: Tablet },
            { type: 'mobile' as const, icon: Smartphone },
          ].map(({ type, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setDevice(type)}
              className={clsx(
                'p-1.5 rounded-md transition-colors',
                device === type
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={clsx('w-4 h-4', isRefreshing && 'animate-spin')} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* URL Bar */}
      <div className="px-4 py-2 bg-slate-800/50">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
          <span className="text-emerald-400 text-xs">https://</span>
          <span className="text-slate-300 text-xs">
            {siteData.businessName
              ? `${siteData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.vercel.app`
              : 'your-site.vercel.app'}
          </span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden bg-slate-950 p-4">
        <motion.div
          animate={{ width: deviceSizes[device].width }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="mx-auto h-full bg-white rounded-lg overflow-hidden shadow-2xl"
          style={{ maxWidth: '100%' }}
        >
          <AnimatePresence mode="wait">
            {!hasContent ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6"
                >
                  <Eye className="w-10 h-10 text-indigo-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Your Website Preview
                </h3>
                <p className="text-sm text-slate-500 max-w-xs">
                  Start chatting with SiteForge AI to see your website come to life in real-time
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: Palette, label: 'Colors' },
                    { icon: Layout, label: 'Layout' },
                    { icon: Type, label: 'Content' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-400" />
                      </div>
                      <span className="text-xs text-slate-400">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto"
              >
                {/* Live Preview Content */}
                <LivePreviewContent siteData={siteData} isGenerating={isGenerating} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isGenerating ? (
            <>
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400">Generating...</span>
            </>
          ) : hasContent ? (
            <>
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-xs text-slate-400">Ready to deploy</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-slate-500 rounded-full" />
              <span className="text-xs text-slate-400">Waiting for input</span>
            </>
          )}
        </div>
        <span className="text-xs text-slate-500">{deviceSizes[device].label}</span>
      </div>
    </div>
  );
}

function LivePreviewContent({ siteData, isGenerating }: { siteData: Partial<SiteData>; isGenerating: boolean }) {
  const primaryColor = siteData.primaryColor || '#4f46e5';

  return (
    <div className="min-h-full">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <motion.span
            key={siteData.businessName}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-slate-900"
            style={{ color: primaryColor }}
          >
            {siteData.businessName || 'Your Business'}
          </motion.span>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="hover:text-indigo-500 cursor-pointer">Services</span>
            <span className="hover:text-indigo-500 cursor-pointer">About</span>
            <span className="hover:text-indigo-500 cursor-pointer">Contact</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative px-6 py-16 text-center"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%)`,
        }}
      >
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{
              animation: 'shimmer 2s infinite',
            }}
          />
        )}

        <motion.h1
          key={siteData.heroHeadline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-slate-900 mb-4"
        >
          {siteData.heroHeadline || 'Welcome to ' + (siteData.businessName || 'Your Business')}
        </motion.h1>

        <motion.p
          key={siteData.heroSubheadline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-slate-600 mb-6 max-w-md mx-auto"
        >
          {siteData.heroSubheadline || siteData.tagline || 'Professional services tailored to your needs'}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 py-2.5 text-sm font-semibold text-white rounded-full shadow-lg"
          style={{ backgroundColor: primaryColor }}
        >
          Get Started
        </motion.button>
      </section>

      {/* Services Section */}
      {siteData.services && siteData.services.length > 0 && (
        <section className="px-6 py-12 bg-white">
          <h2 className="text-lg font-bold text-slate-900 mb-6 text-center">Our Services</h2>
          <div className="grid grid-cols-2 gap-3">
            {siteData.services.slice(0, 4).map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-50 rounded-xl text-center"
              >
                <div
                  className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <span style={{ color: primaryColor }}>
                    {index === 0 ? '🏠' : index === 1 ? '🔧' : index === 2 ? '⭐' : '💼'}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-700">{service}</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      {siteData.aboutText && (
        <section className="px-6 py-12 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">About Us</h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-600 text-center max-w-sm mx-auto"
          >
            {siteData.aboutText}
          </motion.p>
        </section>
      )}

      {/* Contact Section */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-lg font-bold text-slate-900 mb-6 text-center">Contact Us</h2>
        <div className="space-y-3 text-center text-sm text-slate-600">
          {siteData.phone && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              📞 {siteData.phone}
            </motion.p>
          )}
          {siteData.email && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              ✉️ {siteData.email}
            </motion.p>
          )}
          {siteData.address && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              📍 {siteData.address}
            </motion.p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-6 text-center text-xs text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <p>
          &copy; {new Date().getFullYear()} {siteData.businessName || 'Your Business'}. All rights reserved.
        </p>
        <p className="mt-1 opacity-75">Built with SiteForge</p>
      </footer>
    </div>
  );
}
