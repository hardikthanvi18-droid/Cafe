import React, { useState } from 'react';
import { User as UserIcon, LogOut, Package, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onViewOrders: () => void;
  onLogout: () => void;
}

export const AccountPage: React.FC<Props> = ({ onViewOrders, onLogout }) => {
  const { user, logoutCustomer, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [savedMessage, setSavedMessage] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-[#3D3035]">Please Sign In</h2>
        <p className="text-xs text-[#806F77]">Sign in to manage your customer account.</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, address });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0DDE5] pb-5">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
            Customer Profile
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#3D3035]">
            My Account
          </h1>
          <p className="text-xs text-[#806F77] mt-0.5">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewOrders}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#F0DDE5] text-xs font-semibold text-[#3D3035] hover:bg-[#FFF5F8] transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4 text-[#C96F91]" />
            <span>Order History</span>
          </button>

          <button
            onClick={() => {
              logoutCustomer();
              onLogout();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-6">
        <h2 className="font-serif font-bold text-lg text-[#3D3035]">
          Personal Information & Saved Address
        </h2>

        {savedMessage && (
          <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-2xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Registered Email (Primary Key)
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Mobile Contact Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 9820011223"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
              Default Delivery Address
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Saved home address for quick delivery checkout"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md transition-colors cursor-pointer"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
