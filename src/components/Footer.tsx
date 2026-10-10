import React, { useState } from 'react';
import { Coffee, Instagram, Facebook, Twitter, Heart, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { WebsiteSettings } from '../types/cafe';

interface Props {
  settings?: WebsiteSettings;
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<Props> = ({ settings, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Subscribed! Lovely updates are on their way.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to subscribe at the moment.');
    }
  };

  return (
    <footer className="bg-[#FFF5F8] border-t border-[#F0DDE5] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-[#F8D7E5] flex items-center justify-center text-[#C96F91]">
                <Coffee className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#3D3035]">
                {settings?.cafeName || 'Sip And Joy'}
              </span>
            </div>
            <p className="text-xs text-[#806F77] leading-relaxed max-w-sm">
              A cozy, aesthetic sanctuary where artisan roasted coffees, delicate floral teas, and gourmet patisserie converge. Baked fresh daily with pastel smiles and honest ingredients.
            </p>

            <div className="pt-2 text-xs text-[#806F77] space-y-1">
              <p><strong className="text-[#3D3035]">Hours:</strong> {settings?.openingHours || 'Mon - Sun: 8:00 AM – 10:30 PM'}</p>
              <p><strong className="text-[#3D3035]">Location:</strong> {settings?.address || '14 Blossom Boulevard, Bandra West, Mumbai 400050'}</p>
              <p><strong className="text-[#3D3035]">Contact:</strong> {settings?.phone || '+91 98765 43210'}</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings?.socialInstagram || '#'}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white border border-[#F0DDE5] text-[#806F77] hover:text-[#C96F91] hover:border-[#C96F91] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings?.socialFacebook || '#'}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white border border-[#F0DDE5] text-[#806F77] hover:text-[#C96F91] hover:border-[#C96F91] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings?.socialTwitter || '#'}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-white border border-[#F0DDE5] text-[#806F77] hover:text-[#C96F91] hover:border-[#C96F91] flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#3D3035] mb-4">Explore Café</h4>
            <ul className="space-y-2.5 text-xs text-[#806F77]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#C96F91] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#C96F91] transition-colors">
                  Artisan Menu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#C96F91] transition-colors">
                  Our Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-[#C96F91] transition-colors">
                  Pastel Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#C96F91] transition-colors">
                  Visit & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#3D3035] mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-[#806F77]">
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-[#C96F91] transition-colors">
                  Shopping Basket
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('order-history')} className="hover:text-[#C96F91] transition-colors">
                  Order History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-[#C96F91] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#C96F91] transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-login')} className="hover:text-[#C96F91] transition-colors">
                  Staff / Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#3D3035]">Stay in the Loop!</h4>
            <p className="text-xs text-[#806F77] leading-relaxed">
              Get café updates, seasonal treats, and secret discounts delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] bg-white focus:outline-none focus:border-[#C96F91] placeholder:text-[#806F77]/60"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-2.5 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {status === 'success' && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <p className="text-[10px] text-[#806F77]">
              Unsubscribe anytime with a single click. No spam ever.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#F0DDE5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#806F77] gap-3">
          <p>© 2026 Sip And Joy Café. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C96F91] fill-[#C96F91]" />
            <span>& pure Arabica love</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
