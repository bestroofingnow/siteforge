/**
 * Generate component files
 */

import type { SiteConfig, GeneratedFile } from '@siteforge/shared';

export function generateComponentFiles(siteConfig: SiteConfig): GeneratedFile[] {
  return [
    generateButton(),
    generateHeader(siteConfig),
    generateFooter(siteConfig),
    generateHero(siteConfig),
    generateServices(siteConfig),
    generateValueProps(siteConfig),
    generateCTA(siteConfig),
  ];
}

function generateButton(): GeneratedFile {
  const content = `"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  children: ReactNode;
}

const variants = {
  primary: "bg-accent text-white hover:bg-accent-dark shadow-sm",
  secondary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  ghost: "text-primary hover:bg-primary/10",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
`;

  return {
    path: 'src/components/ui/Button.tsx',
    content,
    type: 'component',
    generator: 'template',
    size: 0,
  };
}

function generateHeader(siteConfig: SiteConfig): GeneratedFile {
  const content = `"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { SERVICES } from "@/lib/services";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold text-primary">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray hover:text-primary transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray hover:text-primary transition-colors flex items-center gap-1">
                Services
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white rounded-lg shadow-lg border border-border py-2 min-w-[200px]">
                  {SERVICES.map((service) => (
                    <Link
                      key={service.slug}
                      href={\`/services/\${service.slug}\`}
                      className="block px-4 py-2 text-gray hover:text-primary hover:bg-light transition-colors"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/about" className="text-gray hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={\`tel:\${SITE_CONFIG.phoneLink}\`}
              className="flex items-center gap-2 text-primary font-semibold"
            >
              <Phone className="w-5 h-5" />
              {SITE_CONFIG.phoneDisplay}
            </a>
            <Button href="/contact" size="sm">
              Get a Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-gray hover:text-primary" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/services" className="text-gray hover:text-primary" onClick={() => setIsOpen(false)}>
                Services
              </Link>
              <Link href="/about" className="text-gray hover:text-primary" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="text-gray hover:text-primary" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
              <a
                href={\`tel:\${SITE_CONFIG.phoneLink}\`}
                className="flex items-center gap-2 text-primary font-semibold"
              >
                <Phone className="w-5 h-5" />
                {SITE_CONFIG.phoneDisplay}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
`;

  return {
    path: 'src/components/layout/Header.tsx',
    content,
    type: 'component',
    generator: 'template',
    size: 0,
  };
}

function generateFooter(siteConfig: SiteConfig): GeneratedFile {
  const content = `import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { SERVICES } from "@/lib/services";
import { CITIES } from "@/lib/cities";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{SITE_CONFIG.name}</h3>
            <p className="text-gray-300 mb-4">{SITE_CONFIG.tagline}</p>
            <div className="space-y-2">
              <a
                href={\`tel:\${SITE_CONFIG.phoneLink}\`}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                {SITE_CONFIG.phoneDisplay}
              </a>
              <a
                href={\`mailto:\${SITE_CONFIG.email}\`}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                {SITE_CONFIG.email}
              </a>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                {SITE_CONFIG.address.formatted}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {SERVICES.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={\`/services/\${service.slug}\`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
            <ul className="space-y-2">
              {CITIES.slice(0, 6).map((city) => (
                <li key={city.slug}>
                  <Link
                    href={\`/locations/\${city.slug}\`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {city.name}, {city.stateAbbr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Built with SiteForge
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
`;

  return {
    path: 'src/components/layout/Footer.tsx',
    content,
    type: 'component',
    generator: 'template',
    size: 0,
  };
}

function generateHero(siteConfig: SiteConfig): GeneratedFile {
  const content = `"use client";

import { Phone, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG, VALUE_PROPS } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-to-b from-light to-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          {/* Rating Badge */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={\`w-4 h-4 \${
                    i < Math.floor(SITE_CONFIG.rating.value)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }\`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {SITE_CONFIG.rating.display}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-6 animate-fade-in-up">
            ${siteConfig.primaryAddress.city}&apos;s Trusted{" "}
            <span className="text-primary">${siteConfig.industryDisplay}</span> Experts
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {SITE_CONFIG.tagline}
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {VALUE_PROPS.slice(0, 4).map((prop, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {prop.title}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button href="/contact" size="lg">
              Get a Free Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              href={\`tel:\${SITE_CONFIG.phoneLink}\`}
            >
              <Phone className="w-5 h-5 mr-2" />
              {SITE_CONFIG.phoneDisplay}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
`;

  return {
    path: 'src/components/sections/Hero.tsx',
    content,
    type: 'component',
    generator: 'template',
    size: 0,
  };
}

function generateServices(siteConfig: SiteConfig): GeneratedFile {
  const content = `import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { SERVICES } from "@/lib/services";

export function ServicesSection() {
  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional ${siteConfig.industryDisplay.toLowerCase()} services tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={\`/services/\${service.slug}\`}
              className="group bg-card rounded-xl p-6 border border-border hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Wrench className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {service.description}
              </p>
              <div className="flex items-center text-primary font-medium">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

  return {
    path: 'src/components/sections/Services.tsx',
    content,
    type: 'component',
    generator: 'template',
    size: 0,
  };
}

function generateValueProps(siteConfig: SiteConfig): GeneratedFile {
  const content = `import { Shield, Award, Clock, Star } from "lucide-react";
import { VALUE_PROPS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Award,
  Clock,
  Star,
};

export function ValuePropsSection() {
  return (
    <section className="section bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;re committed to providing the best service experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PROPS.map((prop, index) => {
            const Icon = iconMap[prop.icon] || Star;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">
                  {prop.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

  return {
    path: 'src/components/sections/ValueProps.tsx',
    content,
    type: 'component',
    generator: 'template',
    size: 0,
  };
}

function generateCTA(siteConfig: SiteConfig): GeneratedFile {
  const content = `import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="section bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
          Contact us today for a free estimate. We&apos;re here to help with all your {SITE_CONFIG.industryDisplay.toLowerCase()} needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            href="/contact"
            variant="primary"
            size="lg"
            className="bg-white text-primary hover:bg-gray-100"
          >
            Get a Free Quote
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            href={\`tel:\${SITE_CONFIG.phoneLink}\`}
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary"
          >
            <Phone className="w-5 h-5 mr-2" />
            {SITE_CONFIG.phoneDisplay}
          </Button>
        </div>
      </div>
    </section>
  );
}
`;

  return {
    path: 'src/components/sections/CTA.tsx',
    content,
    type: 'component',
    generator: 'template',
    size: 0,
  };
}
