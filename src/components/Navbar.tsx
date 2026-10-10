import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Menu as MenuIcon, X, Coffee, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const { itemCount } = useCart();
  const { user, adminUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'About Us' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F0DDE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-[#C96F91] group-hover:scale-105 transition-transform shadow-xs">
            <Coffee className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#3D3035] group-hover:text-[#C96F91] transition-colors block leading-none">
              Sip And Joy
            </span>
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#806F77] block mt-0.5">
              Premium Pastel Café
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links (Clean unboxed typography) */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#3D3035]">
          {navItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors py-1 relative cursor-pointer ${
                  isActive
                    ? 'text-[#C96F91] font-semibold'
                    : 'text-[#3D3035] hover:text-[#C96F91]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C96F91] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions: Cart & Auth */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Admin shortcut if logged in */}
          {adminUser && (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              title="Admin Command Center"
              className="hidden lg:flex items-center gap-1.5 text-xs text-[#C96F91] bg-[#FFF5F8] border border-[#F8D7E5] px-3 py-1.5 rounded-full hover:bg-[#FCE7EF] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          {/* Cart Icon with Counter */}
          <button
            onClick={() => handleNavClick('cart')}
            className="relative p-2.5 text-[#3D3035] hover:text-[#C96F91] hover:bg-[#FFF5F8] rounded-full transition-colors"
            aria-label={`Shopping Cart with ${itemCount} items`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C96F91] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Account / Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('account')}
                className="flex items-center gap-2 text-xs font-semibold text-[#3D3035] bg-[#FFF5F8] border border-[#F0DDE5] hover:border-[#C96F91] px-3.5 py-2 rounded-full transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C96F91]" />
                <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="text-xs font-medium text-[#3D3035] hover:text-[#C96F91] px-3 py-2 cursor-pointer transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="text-xs font-semibold bg-[#C96F91] text-white px-4 py-2 rounded-full hover:bg-[#b05d7e] transition-colors shadow-xs"
              >
                Join
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#3D3035] hover:text-[#C96F91] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#F0DDE5] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-medium ${
                  currentPage === item.id
                    ? 'bg-[#FFF5F8] text-[#C96F91] font-semibold'
                    : 'text-[#3D3035] hover:bg-[#FFF5F8]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#F0DDE5] flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => handleNavClick('account')}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-[#3D3035] hover:bg-[#FFF5F8] flex items-center justify-between"
                >
                  <span>My Account & Details</span>
                  <span className="text-xs text-[#C96F91]">{user.name}</span>
                </button>
                <button
                  onClick={() => handleNavClick('order-history')}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-[#3D3035] hover:bg-[#FFF5F8]"
                >
                  Order History
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-center py-2 text-xs font-semibold border border-[#F0DDE5] rounded-xl text-[#3D3035]"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="text-center py-2 text-xs font-semibold bg-[#C96F91] text-white rounded-xl"
                >
                  Register
                </button>
              </div>
            )}

            <button
              onClick={() => handleNavClick('admin-login')}
              className="text-left px-3 py-2 text-xs text-[#806F77] hover:text-[#C96F91] flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Café Staff & Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
