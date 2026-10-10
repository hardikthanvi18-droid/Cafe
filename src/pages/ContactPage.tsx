import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { WebsiteSettings } from '../types/cafe';

interface Props {
  settings?: WebsiteSettings;
}

export const ContactPage: React.FC<Props> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setStatusMsg(data.message || 'Your message has been sent to our café managers!');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Failed to submit form. Please check your inputs.');
      }
    } catch {
      setStatus('error');
      setStatusMsg('Network error. Please try calling or visiting us directly.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3035]">
          Visit Us & Say Hello
        </h1>
        <p className="text-xs sm:text-sm text-[#806F77]">
          Have an inquiry regarding private events, feedback on your recent visit, or just want to chat coffee?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-6">
          <h2 className="font-serif font-bold text-xl text-[#3D3035]">
            Send Our Team a Note
          </h2>

          {status === 'success' && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Samarth Varma"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="samarth@example.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Table reservation for 6, Catering question"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
                Your Message *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your thoughts or questions here..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'loading' ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* Contact Info & Map Placeholder */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-[#FFF5F8] p-6 sm:p-7 rounded-3xl border border-[#F0DDE5] space-y-5">
            <h3 className="font-serif font-bold text-lg text-[#3D3035]">
              Café Details
            </h3>

            <div className="space-y-4 text-xs text-[#806F77]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C96F91] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3D3035] block">Address</strong>
                  <p>{settings?.address || '14 Blossom Boulevard, Rosewood Avenue, Bandra West, Mumbai 400050'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C96F91] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3D3035] block">Opening Hours</strong>
                  <p>{settings?.openingHours || 'Monday – Sunday: 8:00 AM – 10:30 PM'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C96F91] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3D3035] block">Telephone</strong>
                  <p>{settings?.phone || '+91 98765 43210'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C96F91] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3D3035] block">Email</strong>
                  <p>{settings?.email || 'hello@sipandjoycafe.com'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aesthetic Map Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#F0DDE5] shadow-2xs text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-xl text-[#C96F91]">
              📍
            </div>
            <h4 className="font-serif font-bold text-base text-[#3D3035]">
              Finding Our Pink Door
            </h4>
            <p className="text-xs text-[#806F77] leading-relaxed">
              We are situated just two blocks from Rosewood Park in Bandra West. Complimentary valet parking is available for all dine-in guests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
