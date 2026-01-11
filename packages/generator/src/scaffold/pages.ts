/**
 * Generate page files
 */

import type { SiteConfig, GeneratedFile } from '@siteforge/shared';

export function generatePageFiles(siteConfig: SiteConfig): GeneratedFile[] {
  return [
    generateLayout(siteConfig),
    generateHomePage(siteConfig),
    generateAboutPage(siteConfig),
    generateContactPage(siteConfig),
    generateServicesPage(siteConfig),
    generateServiceDetailPage(siteConfig),
    generateLocationsPage(siteConfig),
    generateLocationDetailPage(siteConfig),
  ];
}

function generateLayout(siteConfig: SiteConfig): GeneratedFile {
  const content = `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.seo.canonicalBase),
  title: {
    default: SITE_CONFIG.seo.defaultTitle,
    template: SITE_CONFIG.seo.titleTemplate,
  },
  description: SITE_CONFIG.seo.defaultDescription,
  keywords: SITE_CONFIG.seo.keywords,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.seo.canonicalBase,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.seo.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
`;

  return {
    path: 'src/app/layout.tsx',
    content,
    type: 'layout',
    generator: 'template',
    size: 0,
  };
}

function generateHomePage(siteConfig: SiteConfig): GeneratedFile {
  const content = `import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/Services";
import { ValuePropsSection } from "@/components/sections/ValueProps";
import { CTASection } from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <ValuePropsSection />
      <CTASection />
    </>
  );
}
`;

  return {
    path: 'src/app/page.tsx',
    content,
    type: 'page',
    generator: 'template',
    size: 0,
  };
}

function generateAboutPage(siteConfig: SiteConfig): GeneratedFile {
  const content = `import type { Metadata } from "next";
import { SITE_CONFIG, VALUE_PROPS } from "@/lib/constants";
import { CTASection } from "@/components/sections/CTA";
import { Shield, Award, Clock, Star, Users, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: \`Learn about \${SITE_CONFIG.name} - your trusted \${SITE_CONFIG.industryDisplay.toLowerCase()} experts in \${SITE_CONFIG.address.city}.\`,
};

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Award,
  Clock,
  Star,
  Users,
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              About {SITE_CONFIG.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {SITE_CONFIG.description}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-4">
                Our Story
              </h2>
              <p className="text-muted-foreground mb-4">
                With {SITE_CONFIG.yearsInBusiness} years of experience serving {SITE_CONFIG.address.city} and surrounding areas, we&apos;ve built our reputation on quality workmanship and customer satisfaction.
              </p>
              <p className="text-muted-foreground mb-4">
                Our team of licensed and insured professionals is dedicated to providing the highest level of service for every project, big or small.
              </p>
              <ul className="space-y-3">
                {SITE_CONFIG.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>{cert}</span>
                  </li>
                ))}
                {SITE_CONFIG.licenses.map((license, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>{license}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-light rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {SITE_CONFIG.yearsInBusiness}+
                  </div>
                  <div className="text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {SITE_CONFIG.rating.count}+
                  </div>
                  <div className="text-muted-foreground">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {SITE_CONFIG.rating.value}
                  </div>
                  <div className="text-muted-foreground">Star Rating</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    100%
                  </div>
                  <div className="text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((prop, index) => {
              const Icon = iconMap[prop.icon] || Star;
              return (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark mb-2">{prop.title}</h3>
                  <p className="text-muted-foreground text-sm">{prop.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
`;

  return {
    path: 'src/app/about/page.tsx',
    content,
    type: 'page',
    generator: 'template',
    size: 0,
  };
}

function generateContactPage(siteConfig: SiteConfig): GeneratedFile {
  const content = `import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: \`Contact \${SITE_CONFIG.name} for a free estimate. Call \${SITE_CONFIG.phoneDisplay} or fill out our contact form.\`,
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground">
              Get in touch with us for a free estimate or to learn more about our services.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">
                Get In Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark">Phone</h3>
                    <a
                      href={\`tel:\${SITE_CONFIG.phoneLink}\`}
                      className="text-primary hover:underline"
                    >
                      {SITE_CONFIG.phoneDisplay}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark">Email</h3>
                    <a
                      href={\`mailto:\${SITE_CONFIG.email}\`}
                      className="text-primary hover:underline"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark">Location</h3>
                    <p className="text-muted-foreground">{SITE_CONFIG.address.formatted}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark">Hours</h3>
                    <p className="text-muted-foreground">Mon-Fri: {SITE_CONFIG.hours.weekdays}</p>
                    <p className="text-muted-foreground">Sat: {SITE_CONFIG.hours.saturday}</p>
                    <p className="text-muted-foreground">Sun: {SITE_CONFIG.hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-light rounded-xl p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">
                Request a Free Quote
              </h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-dark mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-dark mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-dark mb-1">
                    Service Needed
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a service...</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-dark mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent text-white py-4 rounded-lg font-semibold hover:bg-accent-dark transition-colors"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
`;

  return {
    path: 'src/app/contact/page.tsx',
    content,
    type: 'page',
    generator: 'template',
    size: 0,
  };
}

function generateServicesPage(siteConfig: SiteConfig): GeneratedFile {
  const content = `import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { SERVICES } from "@/lib/services";
import { CTASection } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Our Services",
  description: \`Professional \${SITE_CONFIG.industryDisplay.toLowerCase()} services in \${SITE_CONFIG.address.city}. View all our services and get a free quote.\`,
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Professional {SITE_CONFIG.industryDisplay.toLowerCase()} services for residential and commercial clients in {SITE_CONFIG.address.city} and surrounding areas.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={\`/services/\${service.slug}\`}
                className="group bg-card rounded-xl p-8 border border-border hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Wrench className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center text-primary font-semibold">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
`;

  return {
    path: 'src/app/services/page.tsx',
    content,
    type: 'page',
    generator: 'template',
    size: 0,
  };
}

function generateServiceDetailPage(siteConfig: SiteConfig): GeneratedFile {
  const content = `import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { getServiceBySlug, getAllServiceSlugs } from "@/lib/services";
import { CTASection } from "@/components/sections/CTA";
import { CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.metaTitle,
    description: service.metaDescription,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section className="section bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              {service.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg">
                Get a Free Quote
              </Button>
              <Button
                href={\`tel:\${SITE_CONFIG.phoneLink}\`}
                variant="outline"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                {SITE_CONFIG.phoneDisplay}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">
                What We Offer
              </h2>
              <ul className="space-y-4">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-light rounded-xl p-8">
              <h3 className="text-xl font-bold text-dark mb-4">
                Why Choose Us for {service.title}?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Licensed & Insured</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Free Estimates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>{SITE_CONFIG.yearsInBusiness}+ Years Experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Satisfaction Guaranteed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
`;

  return {
    path: 'src/app/services/[slug]/page.tsx',
    content,
    type: 'page',
    generator: 'template',
    size: 0,
  };
}

function generateLocationsPage(siteConfig: SiteConfig): GeneratedFile {
  const content = `import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { CITIES } from "@/lib/cities";
import { CTASection } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Service Areas",
  description: \`\${SITE_CONFIG.name} serves \${SITE_CONFIG.address.city} and surrounding areas. View all our service locations.\`,
};

export default function LocationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="section bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Service Areas
            </h1>
            <p className="text-lg text-muted-foreground">
              We proudly serve {SITE_CONFIG.address.city} and the surrounding communities with professional {SITE_CONFIG.industryDisplay.toLowerCase()} services.
            </p>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={\`/locations/\${city.slug}\`}
                className="group bg-card rounded-xl p-6 border border-border hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark mb-1 group-hover:text-primary transition-colors">
                      {city.name}, {city.stateAbbr}
                    </h2>
                    {city.county && (
                      <p className="text-sm text-muted-foreground mb-2">{city.county} County</p>
                    )}
                    <div className="flex items-center text-primary text-sm font-medium">
                      View Services
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
`;

  return {
    path: 'src/app/locations/page.tsx',
    content,
    type: 'page',
    generator: 'template',
    size: 0,
  };
}

function generateLocationDetailPage(siteConfig: SiteConfig): GeneratedFile {
  const content = `import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { getCityBySlug, getAllCitySlugs } from "@/lib/cities";
import { SERVICES } from "@/lib/services";
import { CTASection } from "@/components/sections/CTA";
import { CheckCircle, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllCitySlugs();
  return slugs.map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    return { title: "Location Not Found" };
  }

  return {
    title: city.metaTitle,
    description: city.metaDescription,
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section className="section bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              {city.h1}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {SITE_CONFIG.name} provides professional {SITE_CONFIG.industryDisplay.toLowerCase()} services to homeowners and businesses in {city.name}, {city.stateAbbr} and surrounding areas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg">
                Get a Free Quote
              </Button>
              <Button
                href={\`tel:\${SITE_CONFIG.phoneLink}\`}
                variant="outline"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                {SITE_CONFIG.phoneDisplay}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services in City */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark mb-8">
            Our Services in {city.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={\`/services/\${service.slug}\`}
                className="group bg-card rounded-xl p-6 border border-border hover:border-primary transition-all"
              >
                <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {service.shortDescription || service.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Areas */}
      {city.nearbyAreas.length > 0 && (
        <section className="section bg-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-dark mb-6">
              Also Serving Nearby Areas
            </h2>
            <div className="flex flex-wrap gap-3">
              {city.nearbyAreas.map((area, index) => (
                <span
                  key={index}
                  className="bg-white px-4 py-2 rounded-full text-muted-foreground border border-border"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
`;

  return {
    path: 'src/app/locations/[city]/page.tsx',
    content,
    type: 'page',
    generator: 'template',
    size: 0,
  };
}
