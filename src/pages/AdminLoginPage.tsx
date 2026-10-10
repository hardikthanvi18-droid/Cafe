import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onAdminLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<Props> = ({ onAdminLoginSuccess, onBackToHome }) => {
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('admin@sipandjoycafe.com');
  const [password, setPassword] = useState('Admin@SipJoy2026');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await loginAdmin(email, password);
    setSubmitting(false);

    if (res.success) {
      onAdminLoginSuccess();
    } else {
      setError(res.error || 'Invalid administrator credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-1.5 text-xs text-[#806F77] hover:text-[#C96F91] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Café Front</span>
      </button>

      <div className="bg-white p-8 rounded-3xl border border-[#F0DDE5] shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-[#C96F91] shadow-2xs">
            <ShieldCheck className="w-7 h-7 stroke-[2]" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-[#C96F91] font-bold block">
            Administrative Portal
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#3D3035]">
            Café Staff Sign In
          </h1>
          <p className="text-xs text-[#806F77]">
            Authorized café management for kitchen ticketing, catalog, coupons, and financials.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo credentials hint for browser testing */}
        <div className="bg-[#FFF5F8] p-3 rounded-2xl border border-[#F0DDE5] text-xs text-[#806F77] space-y-1">
          <p className="font-semibold text-[#3D3035] flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#C96F91]" />
            <span>Default Seed Credentials:</span>
          </p>
          <p>Email: <code className="bg-white px-1.5 py-0.5 rounded text-[#3D3035]">admin@sipandjoycafe.com</code></p>
          <p>Password: <code className="bg-white px-1.5 py-0.5 rounded text-[#3D3035]">Admin@SipJoy2026</code></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md transition-colors cursor-pointer mt-2"
          >
            {submitting ? 'Verifying Credentials...' : 'Access Command Center'}
          </button>
        </form>
      </div>
    </div>
  );
};
