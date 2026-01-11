'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInterface, type Message } from '../chat/ChatInterface';
import { PreviewPanel } from '../preview/PreviewPanel';
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
  ChevronDown,
} from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';

interface SiteData {
  businessName?: string;
  tagline?: string;
  industry?: string;
  services?: string[];
  phone?: string;
  email?: string;
  address?: string;
  primaryColor?: string;
  style?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  aboutText?: string;
}

type DeploymentStatus = 'idle' | 'deploying' | 'complete' | 'error';

export function ConversationalBuilder() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm SiteForge AI, your personal website builder assistant. 👋\n\nI'll help you create a beautiful, professional website for your business in just a few minutes. Let's start with the basics - what's your business name and what do you do?",
      timestamp: new Date(),
    },
  ]);
  const [siteData, setSiteData] = useState<SiteData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "I own a roofing company called Apex Roofing",
    "My landscaping business is Green Valley Gardens",
    "I run a consulting firm",
  ]);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>('idle');
  const [deploymentUrl, setDeploymentUrl] = useState<string>('');
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#22c55e', '#f59e0b'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Add typing indicator
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
          currentSiteData: siteData,
        }),
      });

      const data = await response.json();

      // Remove typing indicator and add real response
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

      // Update site data with new information
      if (data.siteData) {
        setSiteData((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(data.siteData).filter(([, v]) => v !== null && v !== undefined)
          ),
        }));
      }

      // Update suggestions
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error sending message:', error);
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

    // Simulate deployment (in real app, this would call the deploy API)
    await new Promise((r) => setTimeout(r, 3000));

    const subdomain = (siteData.businessName || 'my-site')
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

  const isReadyToDeploy = siteData.businessName && (siteData.services?.length || siteData.heroHeadline);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex gap-6 p-6">
          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-[420px] flex-shrink-0"
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
            <PreviewPanel siteData={siteData} isGenerating={isLoading} />
          </motion.div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex-shrink-0 px-6 py-3 bg-white/80 backdrop-blur-xl border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Progress:</span>
            <div className="flex-1 flex items-center gap-2">
              {[
                { label: 'Business Info', done: !!siteData.businessName },
                { label: 'Services', done: !!siteData.services?.length },
                { label: 'Contact', done: !!siteData.phone || !!siteData.email },
                { label: 'Content', done: !!siteData.heroHeadline },
                { label: 'Deploy', done: deploymentStatus === 'complete' },
              ].map((step, index) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div
                    className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
                      step.done
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    )}
                  >
                    {step.done ? <Check className="w-3 h-3" /> : index + 1}
                  </div>
                  <span
                    className={clsx(
                      'text-xs hidden sm:inline',
                      step.done ? 'text-emerald-600 font-medium' : 'text-slate-400'
                    )}
                  >
                    {step.label}
                  </span>
                  {index < 4 && (
                    <div
                      className={clsx(
                        'w-8 h-0.5 hidden sm:block',
                        step.done ? 'bg-emerald-300' : 'bg-slate-200'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Deploying Your Website
                  </h3>
                  <p className="text-slate-500">
                    Building and deploying to Vercel...
                  </p>
                  <div className="mt-6 space-y-2">
                    {['Generating content', 'Building pages', 'Deploying to Vercel'].map(
                      (step, i) => (
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
                      )
                    )}
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

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Your Site is Live! 🎉
                  </h3>

                  <p className="text-slate-500 mb-6">
                    {siteData.businessName} is now available online
                  </p>

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
                    <button
                      onClick={copyUrl}
                      className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
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
                      Continue Editing
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
