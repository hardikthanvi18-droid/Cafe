import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
          Café Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3035]">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#806F77]">Effective Date: October 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-6 text-xs sm:text-sm text-[#806F77] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-[#3D3035]">1. Acceptance of Terms</h2>
          <p>
            By accessing the Sip And Joy website, purchasing menu items, or registering an account, you agree to be bound by these Terms and Conditions and our café operational policies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-[#3D3035]">2. Menu Pricing, Taxes & Availability</h2>
          <p>
            All prices are shown in Indian Rupees (₹). While we strive for absolute accuracy, prices and item availability may change based on market ingredient availability. Orders are finalized only after the kitchen confirms receipt and server-side verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-[#3D3035]">3. Order Cancellations & Refunds</h2>
          <p>
            Because coffee and pastries are freshly perishable, orders may only be cancelled while in "Pending" status. Once our baristas begin preparation, orders cannot be cancelled or refunded.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-[#3D3035]">4. Allergen Information</h2>
          <p>
            Our kitchen processes dairy, wheat, nuts, and soy. While we take dietary tags (Vegetarian, Eggless, Gluten-Free) seriously, cross-contact can occur. Guests with severe allergies are advised to consult our staff before placing an order.
          </p>
        </section>
      </div>
    </div>
  );
};
