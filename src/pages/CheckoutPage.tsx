import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle, CreditCard, Banknote, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Order, PaymentMethod } from '../types/cafe';

interface Props {
  onBackToCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<Props> = ({ onBackToCart, onOrderSuccess }) => {
  const { items, appliedCoupon, orderType, setOrderType, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    orderType === 'Pickup' ? 'Cash on pickup' : 'Cash on delivery'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid mobile number for order notifications.');
      return;
    }
    if (orderType === 'Delivery' && address.trim().length < 5) {
      setErrorMessage('Please provide a complete doorstep delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        orderType,
        deliveryAddress: orderType === 'Delivery' ? address.trim() : undefined,
        notes: notes.trim() || undefined,
        paymentMethod,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        couponCode: appliedCoupon || undefined
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (res.ok && data.success && data.order) {
        clearCart();
        onOrderSuccess(data.order);
      } else {
        setErrorMessage(data.error || 'Failed to place order. Please review your cart.');
      }
    } catch {
      setErrorMessage('A network error occurred while communicating with the café kitchen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#806F77] hover:text-[#C96F91] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Basket</span>
      </button>

      <div className="text-center max-w-xl mx-auto space-y-1">
        <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
          Final Step
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#3D3035]">
          Fulfillment & Checkout
        </h1>
        <p className="text-xs text-[#806F77]">
          Fill in your details so our barista team can prepare your treats fresh.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Main form details */}
        <div className="md:col-span-7 space-y-6">
          {/* Contact Details */}
          <div className="bg-white p-6 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#3D3035]">
              1. Customer Information
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ria Deshmukh"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ria@example.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="9820011223"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment details */}
          <div className="bg-white p-6 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#3D3035]">
              2. Order Fulfillment
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setOrderType('Pickup');
                  if (paymentMethod === 'Cash on delivery') setPaymentMethod('Cash on pickup');
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  orderType === 'Pickup'
                    ? 'bg-[#FFF5F8] border-[#C96F91] shadow-2xs'
                    : 'bg-white border-[#F0DDE5]'
                }`}
              >
                <p className="font-bold text-xs text-[#3D3035]">Café Pickup</p>
                <p className="text-[10px] text-[#806F77]">Ready at counter in 15 mins</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderType('Delivery');
                  if (paymentMethod === 'Cash on pickup') setPaymentMethod('Cash on delivery');
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  orderType === 'Delivery'
                    ? 'bg-[#FFF5F8] border-[#C96F91] shadow-2xs'
                    : 'bg-white border-[#F0DDE5]'
                }`}
              >
                <p className="font-bold text-xs text-[#3D3035]">Home Delivery</p>
                <p className="text-[10px] text-[#806F77]">Delivered warm to your door</p>
              </button>
            </div>

            {orderType === 'Delivery' && (
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-semibold text-[#806F77] block">
                  Delivery Address *
                </label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Flat/House number, building name, street, landmark, PIN code"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-[#806F77] block mb-1">
                Order Notes / Dietary Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Extra hot, oat milk preferred, warm croissant"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#3D3035]">
              3. Payment Preference
            </h2>

            <div className="space-y-2.5">
              {orderType === 'Pickup' && (
                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#F0DDE5] hover:border-[#C96F91] cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on pickup"
                    checked={paymentMethod === 'Cash on pickup'}
                    onChange={() => setPaymentMethod('Cash on pickup')}
                    className="text-[#C96F91]"
                  />
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#C96F91]" />
                    <span className="text-xs font-semibold text-[#3D3035]">
                      Pay at Café Counter (Cash / UPI / Card on pickup)
                    </span>
                  </div>
                </label>
              )}

              {orderType === 'Delivery' && (
                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#F0DDE5] hover:border-[#C96F91] cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on delivery"
                    checked={paymentMethod === 'Cash on delivery'}
                    onChange={() => setPaymentMethod('Cash on delivery')}
                    className="text-[#C96F91]"
                  />
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#C96F91]" />
                    <span className="text-xs font-semibold text-[#3D3035]">
                      Cash on Delivery (Pay rider upon arrival)
                    </span>
                  </div>
                </label>
              )}

              <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#F0DDE5] hover:border-[#C96F91] cursor-pointer bg-white">
                <input
                  type="radio"
                  name="payment"
                  value="Online payment (Demo / Gateway)"
                  checked={paymentMethod === 'Online payment (Demo / Gateway)'}
                  onChange={() => setPaymentMethod('Online payment (Demo / Gateway)')}
                  className="text-[#C96F91]"
                />
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C96F91]" />
                  <div>
                    <span className="text-xs font-semibold text-[#3D3035] block">
                      Online Payment (UPI, Debit/Credit Card)
                    </span>
                    <span className="text-[10px] text-[#806F77]">
                      Secure server verified payment flow
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Mini Order Snapshot */}
        <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-4 sticky top-28">
          <h3 className="font-serif font-bold text-base text-[#3D3035]">
            Items in Order ({items.length})
          </h3>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {items.map(item => (
              <div
                key={item.productId}
                className="flex items-center justify-between text-xs py-1.5 border-b border-[#F0DDE5]/60"
              >
                <div>
                  <p className="font-semibold text-[#3D3035]">{item.name}</p>
                  <p className="text-[11px] text-[#806F77]">{item.quantity} × ₹{item.price.toFixed(2)}</p>
                </div>
                <span className="font-bold text-[#3D3035]">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-[#806F77] space-y-1">
            <p>✓ All items recalculated with live kitchen prices</p>
            <p>✓ 5% GST automatically configured</p>
            {appliedCoupon && (
              <p className="text-emerald-700 font-medium">✓ Coupon {appliedCoupon} applied</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <span>Preparing Ticket...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Place Order</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
