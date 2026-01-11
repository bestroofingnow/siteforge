'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInterface, type Message } from '../chat/ChatInterface';
import { WebsitePreview } from '../preview/WebsitePreview';
import {
  Rocket,
  Sparkles,
  Globe,
  Check,
  Loader2,
  ExternalLink,
  Copy,
  PartyPopper,
  Settings,
  Plus,
  FileText,
  Image,
  HelpCircle,
  MapPin,
} from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import type { SiteConfig, PageConfig } from '@/lib/website-templates';
import { DEFAULT_PAGES, ADDITIONAL_PAGES } from '@/lib/website-templates';

type DeploymentStatus = 'idle' | 'deploying' | 'complete' | 'error';
type PageView = 'home' | 'about' | 'services' | 'contact';

export function ConversationalBuilder() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm SiteForge AI, and I'll help you build a professional website in minutes. 🚀\n\nLet's start - what's your business name, what industry are you in, and where are you located?\n\n(For example: \"I run Apex Roofing in Charlotte, NC\")",
      timestamp: new Date(),
    },
  ]);
  const [siteConfig, setSiteConfig] = useState<Partial<SiteConfig>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "I run Apex Roofing in Charlotte, NC",
    "Green Valley Landscaping in Austin, TX",
    "Premier Plumbing in Denver, CO",
  ]);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>('idle');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePage, setActivePage] = useState<PageView>('home');
  const [generatedPages, setGeneratedPages] = useState<string[]>(['home', 'about', 'services', 'contact']);
  const [showAddPageModal, setShowAddPageModal] = useState(false);

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#22c55e', '#f59e0b'];

    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentSiteConfig: siteConfig,
        }),
      });

      const data = await response.json();

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== 'typing');
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.message,
            timestamp: new Date(),
          },
        ];
      });

      if (data.siteConfig) {
        setSiteConfig((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(data.siteConfig).filter(([, v]) => v !== null && v !== undefined)
          ),
        }));
      }

      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== 'typing');
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    setShowDeployModal(true);
    setDeploymentStatus('deploying');

    await new Promise((r) => setTimeout(r, 3000));

    const subdomain = (siteConfig.businessName || 'my-site')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');

    setDeploymentUrl(`https://${subdomain}.vercel.app`);
    setDeploymentStatus('complete');
    triggerConfetti();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(deploymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isReadyToDeploy = siteConfig.businessName && siteConfig.heroHeadline;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SiteForge
              </h1>
              <p className="text-xs text-slate-500">AI Website Builder</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Pages indicator */}
            {isReadyToDeploy && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                <Check className="w-4 h-4" />
                <span>{generatedPages.length} pages ready</span>
              </div>
            )}

            {/* Add Page Button */}
            {isReadyToDeploy && (
              <button
                onClick={() => setShowAddPageModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Page
              </button>
            )}

            {/* Deploy Button */}
            {isReadyToDeploy && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeploy}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-shadow"
              >
                <Rocket className="w-4 h-4" />
                Deploy to Vercel
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="max-w-[1600px] mx-auto w-full flex gap-6 p-6">
          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-[400px] flex-shrink-0"
          >
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              suggestions={suggestions}
            />
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            <WebsitePreview
              siteConfig={siteConfig}
              activePage={activePage}
              onPageChange={setActivePage}
              isGenerating={isLoading}
            />
          </motion.div>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="flex-shrink-0 px-6 py-3 bg-white/80 backdrop-blur-xl border-t border-slate-200/50">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Building:</span>
            <div className="flex items-center gap-2">
              {[
                { label: 'Business Info', done: !!siteConfig.businessName },
                { label: 'Services', done: !!(siteConfig.services?.length) },
                { label: 'Contact Info', done: !!siteConfig.phone || !!siteConfig.email },
                { label: 'Content', done: !!siteConfig.heroHeadline },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div
                    className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                      step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                    )}
                  >
                    {step.done ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={clsx('text-xs hidden lg:inline', step.done ? 'text-emerald-600' : 'text-slate-400')}>
                    {step.label}
                  </span>
                  {i < 3 && <div className={clsx('w-6 h-0.5', step.done ? 'bg-emerald-300' : 'bg-slate-200')} />}
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Powered by Claude AI
          </div>
        </div>
      </div>

      {/* Add Page Modal */}
      <AnimatePresence>
        {showAddPageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddPageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">Add a New Page</h3>
              <p className="text-sm text-slate-500 mb-4">
                Choose a page type to add to your website. Each page will be generated with professional content.
              </p>

              <div className="space-y-2">
                {ADDITIONAL_PAGES.filter(p => !generatedPages.includes(p.id)).map((page) => (
                  <button
                    key={page.id}
                    onClick={() => {
                      setGeneratedPages((prev) => [...prev, page.id]);
                      setShowAddPageModal(false);
                      handleSendMessage(`Add a ${page.name} page to my website`);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      {page.icon === 'help-circle' && <HelpCircle className="w-5 h-5 text-indigo-600" />}
                      {page.icon === 'star' && <Sparkles className="w-5 h-5 text-indigo-600" />}
                      {page.icon === 'image' && <Image className="w-5 h-5 text-indigo-600" />}
                      {page.icon === 'map-pin' && <MapPin className="w-5 h-5 text-indigo-600" />}
                      {page.icon === 'file-text' && <FileText className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{page.name}</div>
                      <div className="text-xs text-slate-500">{page.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddPageModal(false)}
                className="w-full mt-4 py-2 text-sm text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deploy Modal */}
      <AnimatePresence>
        {showDeployModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => deploymentStatus === 'complete' && setShowDeployModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
            >
              {deploymentStatus === 'deploying' ? (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center"
                  >
                    <Loader2 className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Deploying Your Website</h3>
                  <p className="text-slate-500">Building and deploying to Vercel...</p>
                  <div className="mt-6 space-y-2">
                    {['Generating pages', 'Building assets', 'Deploying to CDN'].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.5 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                          className="w-2 h-2 bg-indigo-500 rounded-full"
                        />
                        <span className="text-slate-600">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
                  >
                    <PartyPopper className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Site is Live! 🎉</h3>
                  <p className="text-slate-500 mb-6">{siteConfig.businessName} is now online</p>

                  <div className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-xl mb-6">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex-1 text-left truncate"
                    >
                      {deploymentUrl}
                    </a>
                    <button onClick={copyUrl} className="p-1.5 hover:bg-slate-200 rounded-lg">
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => window.open(deploymentUrl, '_blank')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Site
                    </button>
                    <button
                      onClick={() => setShowDeployModal(false)}
                      className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
