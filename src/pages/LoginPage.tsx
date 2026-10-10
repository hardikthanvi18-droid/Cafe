import React, { useState } from 'react';
import { Coffee, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onNavigateRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<Props> = ({ onNavigateRegister, onLoginSuccess }) => {
  const { loginCustomer } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await loginCustomer(email, password);
    setSubmitting(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-[#C96F91]">
            <Coffee className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-[#C96F91] font-bold block">
            Welcome Back
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#3D3035]">
            Sign In to Sip And Joy
          </h1>
          <p className="text-xs text-[#806F77]">
            Access your order history, saved addresses, and member privileges.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md transition-colors cursor-pointer"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#806F77] border-t border-[#F0DDE5]">
          <span>New to Sip And Joy? </span>
          <button
            onClick={onNavigateRegister}
            className="font-semibold text-[#C96F91] hover:underline cursor-pointer"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};
