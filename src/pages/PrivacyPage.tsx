import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
          Customer Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3035]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#806F77]">Last updated: October 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-6 text-xs sm:text-sm text-[#806F77] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-[#3D3035]">1. Overview</h2>
          <p>
            At Sip And Joy, we respect and safeguard your privacy. This policy outlines how your contact information and order details are handled when you browse our website, place orders, or join our community newsletter.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-[#3D3035]">2. What Information We Collect</h2>
          <p>
            We collect personal details that you voluntarily submit to us, including your full name, email address, mobile phone number, delivery address, and culinary notes. We never store credit or debit card CVVs or raw payment credentials on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-[#3D3035]">3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To prepare and fulfill your bakery and beverage orders.</li>
            <li>To communicate pickup time estimates or delivery dispatch updates.</li>
            <li>To securely verify discount coupons and prevent fraud.</li>
            <li>To send optional seasonal promotional emails if you have subscribed to our newsletter.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-[#3D3035]">4. Security & Password Protection</h2>
          <p>
            All passwords are protected with cryptographic salting and hashing. We enforce strict server-side authentication rules to ensure one customer cannot view another customer’s private orders.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-[#3D3035]">5. Contact Our Privacy Officer</h2>
          <p>
            For inquiries or to request deletion of your account records, email us at <strong className="text-[#3D3035]">privacy@sipandjoycafe.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
