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
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Award,
  ChevronRight,
  Check,
  Quote,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { SiteConfig, PageConfig } from '@/lib/website-templates';

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type PageView = 'home' | 'about' | 'services' | 'contact';

interface WebsitePreviewProps {
  siteConfig: Partial<SiteConfig>;
  activePage: PageView;
  onPageChange: (page: PageView) => void;
  isGenerating: boolean;
}

const deviceSizes: Record<DeviceType, { width: string; scale: number }> = {
  desktop: { width: '100%', scale: 1 },
  tablet: { width: '768px', scale: 0.9 },
  mobile: { width: '375px', scale: 0.85 },
};

export function WebsitePreview({ siteConfig, activePage, onPageChange, isGenerating }: WebsitePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hasContent = siteConfig.businessName || siteConfig.heroHeadline;
  const primaryColor = siteConfig.primaryColor || '#1e3a5f';
  const accentColor = siteConfig.accentColor || '#f59e0b';

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Browser Chrome */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
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
                device === type ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* URL Bar */}
      <div className="px-4 py-2 bg-slate-800/50">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
          <span className="text-emerald-400 text-xs">https://</span>
          <span className="text-slate-300 text-xs truncate">
            {siteConfig.businessName
              ? `${siteConfig.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.vercel.app`
              : 'your-business.vercel.app'}
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
          {!hasContent ? (
            <EmptyState />
          ) : (
            <div className="h-full overflow-y-auto">
              {/* Website Navigation */}
              <WebsiteNav
                siteConfig={siteConfig}
                primaryColor={primaryColor}
                activePage={activePage}
                onPageChange={onPageChange}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />

              {/* Page Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activePage === 'home' && (
                    <HomePage siteConfig={siteConfig} primaryColor={primaryColor} accentColor={accentColor} isGenerating={isGenerating} />
                  )}
                  {activePage === 'about' && (
                    <AboutPage siteConfig={siteConfig} primaryColor={primaryColor} />
                  )}
                  {activePage === 'services' && (
                    <ServicesPage siteConfig={siteConfig} primaryColor={primaryColor} />
                  )}
                  {activePage === 'contact' && (
                    <ContactPage siteConfig={siteConfig} primaryColor={primaryColor} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer */}
              <WebsiteFooter siteConfig={siteConfig} primaryColor={primaryColor} />
            </div>
          )}
        </motion.div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isGenerating ? (
            <>
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400">Generating content...</span>
            </>
          ) : hasContent ? (
            <>
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-xs text-slate-400">4 pages ready</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-slate-500 rounded-full" />
              <span className="text-xs text-slate-400">Waiting for input</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {['home', 'about', 'services', 'contact'].map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page as PageView)}
              className={clsx(
                'text-xs capitalize transition-colors',
                activePage === page ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              )}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6"
      >
        <Eye className="w-10 h-10 text-indigo-400" />
      </motion.div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">Your Website Preview</h3>
      <p className="text-sm text-slate-500 max-w-xs">
        Start chatting to see your professional website come to life
      </p>
    </div>
  );
}

function WebsiteNav({
  siteConfig,
  primaryColor,
  activePage,
  onPageChange,
  isMenuOpen,
  setIsMenuOpen,
}: {
  siteConfig: Partial<SiteConfig>;
  primaryColor: string;
  activePage: PageView;
  onPageChange: (page: PageView) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}) {
  const navItems: { id: PageView; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold" style={{ color: primaryColor }}>
            {siteConfig.businessName || 'Your Business'}
          </span>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={clsx(
                  'text-sm font-medium transition-colors',
                  activePage === item.id ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {item.label}
              </button>
            ))}
            <button
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Get Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden mt-3 space-y-2 overflow-hidden"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

function HomePage({
  siteConfig,
  primaryColor,
  accentColor,
  isGenerating,
}: {
  siteConfig: Partial<SiteConfig>;
  primaryColor: string;
  accentColor: string;
  isGenerating: boolean;
}) {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative py-16 px-6 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, -20)} 100%)` }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full" />
        </div>

        <div className="relative max-w-2xl">
          {/* Rating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white text-sm font-medium">5.0 Rating</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
          >
            {siteConfig.heroHeadline || `${siteConfig.city || 'Your City'}'s Trusted Experts`}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/90 mb-6 leading-relaxed"
          >
            {siteConfig.heroSubheadline || 'Professional services with quality craftsmanship guaranteed.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <button
              className="px-6 py-3 font-semibold rounded-lg shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: accentColor, color: '#000' }}
            >
              Get Free Quote
            </button>
            <button className="px-6 py-3 font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors">
              {siteConfig.phone || 'Call Now'}
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {(siteConfig.trustBadges || [
              { icon: 'star', text: '5-Star Rated' },
              { icon: 'shield', text: 'Licensed' },
              { icon: 'award', text: 'Top Rated' },
              { icon: 'clock', text: 'Fast Service' },
            ]).slice(0, 4).map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
              >
                <div className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }}>
                  {badge.icon === 'star' && <Star className="w-5 h-5" />}
                  {badge.icon === 'shield' && <Shield className="w-5 h-5" />}
                  {badge.icon === 'award' && <Award className="w-5 h-5" />}
                  {badge.icon === 'clock' && <Clock className="w-5 h-5" />}
                </div>
                <span className="text-white text-xs font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto" preserveAspectRatio="none">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-6 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Our Services</h2>
          <p className="text-slate-600">Professional solutions for all your needs</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(siteConfig.services || []).slice(0, 6).map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-slate-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <div className="w-5 h-5" style={{ color: primaryColor }}>
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 px-6 bg-slate-50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Why Choose {siteConfig.businessName}?</h2>
          <p className="text-slate-600">What sets us apart from the competition</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Expert Team', desc: 'Skilled professionals with years of experience' },
            { title: 'Quality Work', desc: 'Premium materials and attention to detail' },
            { title: 'Fair Pricing', desc: 'Competitive rates with no hidden fees' },
            { title: 'Satisfaction', desc: '100% satisfaction guaranteed on all work' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 p-4 bg-white rounded-xl">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <Check className="w-4 h-4" style={{ color: accentColor }} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-6 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">What Customers Say</h2>
          <p className="text-slate-600">Don't just take our word for it</p>
        </div>

        <div className="space-y-4">
          {(siteConfig.testimonials || [
            { name: 'Sarah M.', text: 'Excellent service! Professional and reliable.', rating: 5 },
            { name: 'John D.', text: 'Best experience we\'ve had. Highly recommend!', rating: 5 },
          ]).slice(0, 2).map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-slate-50 rounded-xl"
            >
              <div className="flex gap-1 mb-2">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 mb-2">"{testimonial.text}"</p>
              <p className="text-xs font-semibold text-slate-900">— {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 px-6 text-center"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, -20)} 100%)` }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          {siteConfig.ctaHeadline || 'Ready to Get Started?'}
        </h2>
        <p className="text-white/80 mb-6">
          {siteConfig.ctaSubheadline || 'Contact us today for a free consultation'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="px-6 py-3 font-semibold rounded-lg shadow-lg"
            style={{ backgroundColor: accentColor, color: '#000' }}
          >
            Get Free Quote
          </button>
          <button className="px-6 py-3 font-semibold text-white border-2 border-white/30 rounded-lg">
            Call {siteConfig.phone || '(555) 123-4567'}
          </button>
        </div>
      </section>
    </>
  );
}

function AboutPage({ siteConfig, primaryColor }: { siteConfig: Partial<SiteConfig>; primaryColor: string }) {
  return (
    <div className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">About {siteConfig.businessName}</h1>
        <p className="text-slate-600 mb-6 leading-relaxed">
          {siteConfig.aboutText || `${siteConfig.businessName} has been proudly serving the community with professional services. Our team of experienced professionals is dedicated to delivering exceptional results with integrity and quality workmanship.`}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Years in Business', value: siteConfig.yearsInBusiness || 10 },
            { label: 'Projects Completed', value: '500+' },
            { label: 'Happy Customers', value: '1,000+' },
            { label: 'Team Members', value: '25+' },
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-xl text-center">
              <div className="text-2xl font-bold" style={{ color: primaryColor }}>{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Our Values</h2>
        <div className="space-y-3">
          {[
            { title: 'Quality', desc: 'We never compromise on the quality of our work' },
            { title: 'Integrity', desc: 'Honest, transparent communication with every client' },
            { title: 'Reliability', desc: 'We show up on time and deliver on our promises' },
          ].map((value, i) => (
            <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-xl">
              <Check className="w-5 h-5 flex-shrink-0" style={{ color: primaryColor }} />
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{value.title}</h3>
                <p className="text-xs text-slate-500">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesPage({ siteConfig, primaryColor }: { siteConfig: Partial<SiteConfig>; primaryColor: string }) {
  return (
    <div className="py-12 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Our Services</h1>
        <p className="text-slate-600">Comprehensive solutions for all your needs</p>
      </div>

      <div className="space-y-4">
        {(siteConfig.services || []).map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 bg-slate-50 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Shield className="w-6 h-6" style={{ color: primaryColor }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">{service.name}</h3>
                <p className="text-sm text-slate-600">{service.description}</p>
                <button
                  className="mt-2 text-sm font-medium flex items-center gap-1"
                  style={{ color: primaryColor }}
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ContactPage({ siteConfig, primaryColor }: { siteConfig: Partial<SiteConfig>; primaryColor: string }) {
  return (
    <div className="py-12 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Contact Us</h1>
        <p className="text-slate-600">Get in touch for a free consultation</p>
      </div>

      <div className="grid gap-4 mb-8">
        {[
          { icon: Phone, label: 'Phone', value: siteConfig.phone || '(555) 123-4567' },
          { icon: Mail, label: 'Email', value: siteConfig.email || 'info@example.com' },
          { icon: MapPin, label: 'Address', value: siteConfig.address || 'Your City, State' },
          { icon: Clock, label: 'Hours', value: 'Mon-Fri: 8am-6pm' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <item.icon className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <div>
              <div className="text-xs text-slate-500">{item.label}</div>
              <div className="font-medium text-slate-900">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form Preview */}
      <div className="p-6 bg-slate-50 rounded-xl">
        <h3 className="font-semibold text-slate-900 mb-4">Send us a Message</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm"
          />
          <textarea
            placeholder="Your Message"
            rows={3}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm resize-none"
          />
          <button
            className="w-full py-3 text-white font-semibold rounded-lg"
            style={{ backgroundColor: primaryColor }}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

function WebsiteFooter({ siteConfig, primaryColor }: { siteConfig: Partial<SiteConfig>; primaryColor: string }) {
  return (
    <footer className="py-8 px-6 text-white" style={{ backgroundColor: primaryColor }}>
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">{siteConfig.businessName}</h3>
        <p className="text-white/70 text-sm mb-4">{siteConfig.tagline || 'Professional Services'}</p>
        <div className="flex justify-center gap-4 text-sm text-white/70 mb-4">
          <span>Home</span>
          <span>About</span>
          <span>Services</span>
          <span>Contact</span>
        </div>
        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} {siteConfig.businessName}. All rights reserved.
        </p>
        <p className="text-xs text-white/30 mt-1">Built with SiteForge</p>
      </div>
    </footer>
  );
}

// Helper function to darken/lighten colors
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}
