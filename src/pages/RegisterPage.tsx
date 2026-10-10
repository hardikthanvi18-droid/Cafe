import React, { useState } from 'react';
import { Coffee, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onNavigateLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<Props> = ({ onNavigateLogin, onRegisterSuccess }) => {
  const { registerCustomer } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const res = await registerCustomer(name, email, password, phone);
    setSubmitting(false);

    if (res.success) {
      onRegisterSuccess();
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-white p-8 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-[#C96F91]">
            <Coffee className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-[#C96F91] font-bold block">
            Join The Family
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#3D3035]">
            Create Joy Account
          </h1>
          <p className="text-xs text-[#806F77]">
            Unlock member privileges, faster ordering, and surprise seasonal gifts.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Ananya Sen"
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
              placeholder="ananya@example.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Mobile Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="9820011223"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Password (min 6 characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md transition-colors cursor-pointer mt-2"
          >
            {submitting ? 'Creating Account...' : 'Register & Join'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#806F77] border-t border-[#F0DDE5]">
          <span>Already have an account? </span>
          <button
            onClick={onNavigateLogin}
            className="font-semibold text-[#C96F91] hover:underline cursor-pointer"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};
