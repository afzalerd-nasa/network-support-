import React, { useState } from 'react';
import { PROFILE_INFO } from '../data/initialData';
import { ContactMessage } from '../types/network';
import { getStoredMessages, saveStoredMessages } from '../utils/storage';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);

    setTimeout(() => {
      const newMessage: ContactMessage = {
        id: `msg-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Portfolio Inquiry',
        message: formData.message,
        createdAt: new Date().toLocaleString(),
        read: false,
      };

      const existing = getStoredMessages();
      saveStoredMessages([newMessage, ...existing]);

      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSubmitted(false), 6000);
    }, 600);
  };

  return (
    <section id="contact" className="py-20 bg-[#060a14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            GET IN TOUCH
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Contact &amp; Professional Inquiries
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Interested in discussing enterprise network engineering, infrastructure support opportunities, or lab architectures? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Coordinates & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white">Direct Communication Channels</h3>

              <div className="space-y-4 text-xs">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400">Direct Email</div>
                    <a
                      href={`mailto:${PROFILE_INFO.email}`}
                      className="text-white hover:text-cyan-400 font-mono font-medium text-sm transition-colors"
                    >
                      {PROFILE_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400">Phone / WhatsApp</div>
                    <a
                      href={`tel:${PROFILE_INFO.phone}`}
                      className="text-white hover:text-cyan-400 font-mono font-medium text-sm transition-colors"
                    >
                      {PROFILE_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400">Availability &amp; Location</div>
                    <div className="text-white font-medium">{PROFILE_INFO.location}</div>
                  </div>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300">Professional Networks:</div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={PROFILE_INFO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/60 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </a>

                  <a
                    href={PROFILE_INFO.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/60 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>GitHub Repos</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </a>
                </div>
              </div>

              <div className="p-3 bg-[#070b14] border border-slate-800/80 rounded-lg text-slate-400 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Quick response guaranteed within 24 business hours.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Send a Message</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in your details below. Your message will be recorded in my engineering inbox.
                </p>
              </div>

              {submitted && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-800 rounded-lg flex items-center gap-3 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-emerald-300">Message Dispatched Successfully!</div>
                    <div className="text-emerald-400/90 mt-0.5">
                      Thank you for reaching out. I have received your note and will review it shortly.
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Henderson"
                      className="w-full px-3.5 py-2.5 bg-[#070b14] border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. alex@company.com"
                      className="w-full px-3.5 py-2.5 bg-[#070b14] border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Network Support Role / Consulting Inquiry"
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Message Content *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, project scope, or opportunity..."
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Transmitting Message...' : 'Send Message to Afzal'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
