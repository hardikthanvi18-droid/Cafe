import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { Order, WebsiteSettings } from './types/cafe';

const AppContent: React.FC = () => {
  const { adminUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings | undefined>(undefined);

  // Load public settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.settings);
        }
      })
      .catch(console.error);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setLastPlacedOrder(order);
    setCurrentPage('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in admin dashboard, render clean dashboard view
  if (currentPage === 'admin-dashboard') {
    if (!adminUser) {
      return (
        <AdminLoginPage
          onAdminLoginSuccess={() => handleNavigate('admin-dashboard')}
          onBackToHome={() => handleNavigate('home')}
        />
      );
    }
    return <AdminDashboardPage onBackToHome={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#3D3035]">
      {/* Top Announcement Bar */}
      <AnnouncementBar settings={settings} />

      {/* Main Navbar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content Router */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
            settings={settings}
          />
        )}

        {currentPage === 'menu' && (
          <MenuPage onViewProduct={handleViewProduct} />
        )}

        {currentPage === 'product-detail' && selectedProductId && (
          <ProductDetailPage
            productId={selectedProductId}
            onBackToMenu={() => handleNavigate('menu')}
            onSelectProduct={handleViewProduct}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onExploreMenu={() => handleNavigate('menu')} />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage />
        )}

        {currentPage === 'contact' && (
          <ContactPage settings={settings} />
        )}

        {currentPage === 'cart' && (
          <CartPage
            onProceedToCheckout={() => handleNavigate('checkout')}
            onExploreMenu={() => handleNavigate('menu')}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => handleNavigate('cart')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentPage === 'order-confirmation' && lastPlacedOrder && (
          <OrderConfirmationPage
            order={lastPlacedOrder}
            onContinueShopping={() => handleNavigate('menu')}
            onViewOrderHistory={() => handleNavigate('order-history')}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onNavigateRegister={() => handleNavigate('register')}
            onLoginSuccess={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            onNavigateLogin={() => handleNavigate('login')}
            onRegisterSuccess={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'account' && (
          <AccountPage
            onViewOrders={() => handleNavigate('order-history')}
            onLogout={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'order-history' && (
          <OrderHistoryPage
            onExploreMenu={() => handleNavigate('menu')}
            onSelectOrder={(ord) => {
              setLastPlacedOrder(ord);
              handleNavigate('order-confirmation');
            }}
          />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPage />
        )}

        {currentPage === 'terms' && (
          <TermsPage />
        )}

        {currentPage === 'admin-login' && (
          <AdminLoginPage
            onAdminLoginSuccess={() => handleNavigate('admin-dashboard')}
            onBackToHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer settings={settings} onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
