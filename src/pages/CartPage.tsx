import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Props {
  onProceedToCheckout: () => void;
  onExploreMenu: () => void;
}

export const CartPage: React.FC<Props> = ({ onProceedToCheckout, onExploreMenu }) => {
  const {
    items,
    appliedCoupon,
    orderType,
    setOrderType,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Server quote states
  const [serverQuote, setServerQuote] = useState<{
    subtotal: number;
    taxAmount: number;
    deliveryCharge: number;
    discountAmount: number;
    totalAmount: number;
  }>({
    subtotal: 0,
    taxAmount: 0,
    deliveryCharge: 0,
    discountAmount: 0,
    totalAmount: 0
  });

  // Calculate live quote with server
  useEffect(() => {
    if (items.length === 0) return;

    const payload = {
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      couponCode: appliedCoupon || undefined,
      orderType
    };

    fetch('/api/cart/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.calculation) {
          setServerQuote({
            subtotal: data.calculation.subtotal,
            taxAmount: data.calculation.taxAmount,
            deliveryCharge: data.calculation.deliveryCharge,
            discountAmount: data.calculation.discountAmount,
            totalAmount: data.calculation.totalAmount
          });
        }
      })
      .catch(console.error);
  }, [items, appliedCoupon, orderType]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplying(true);
    setCouponFeedback(null);
    const res = await applyCoupon(couponInput.trim());
    setIsApplying(false);

    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-3xl text-[#C96F91]">
          🧺
        </div>
        <h1 className="font-serif font-bold text-3xl text-[#3D3035]">
          Your Joy Basket is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#806F77] max-w-sm mx-auto leading-relaxed">
          Looks like you haven't picked your treats yet! Explore our strawberry delicacies, croissants, and iced lattes.
        </p>
        <div className="pt-2">
          <button
            onClick={onExploreMenu}
            className="px-8 py-3 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md transition-all cursor-pointer"
          >
            Explore Menu & Fill Basket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0DDE5] pb-5">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#3D3035]">
            Shopping Basket
          </h1>
          <p className="text-xs text-[#806F77] mt-0.5">
            {items.reduce((s, i) => s + i.quantity, 0)} delicious item(s) selected
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-[#806F77] hover:text-red-500 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Basket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-7 space-y-4">
          {items.map(item => (
            <div
              key={item.productId}
              className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0DDE5] shadow-2xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#F0DDE5] shrink-0"
                />
                <div>
                  <span className="text-[10px] text-[#806F77] uppercase font-semibold">
                    {item.categoryName}
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#3D3035]">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold text-[#C96F91] mt-0.5">
                    ₹{item.price.toFixed(2)} each
                  </p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-[11px] text-red-500 hover:underline mt-1 inline-block cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center border border-[#F0DDE5] rounded-full px-2.5 py-1 bg-[#FFF5F8]">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 text-[#3D3035] hover:text-[#C96F91] cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-semibold text-xs text-[#3D3035] w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 text-[#3D3035] hover:text-[#C96F91] cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="font-bold text-sm text-[#3D3035]">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {/* Fulfillment Mode Selector */}
          <div className="bg-[#FFF5F8] p-5 rounded-3xl border border-[#F0DDE5] space-y-3">
            <span className="text-xs font-bold text-[#3D3035] uppercase tracking-wider block">
              Choose Order Type
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('Pickup')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  orderType === 'Pickup'
                    ? 'bg-white border-[#C96F91] shadow-2xs'
                    : 'bg-white/60 border-[#F0DDE5] hover:bg-white'
                }`}
              >
                <p className="font-serif font-bold text-xs text-[#3D3035]">Café Pickup</p>
                <p className="text-[11px] text-[#806F77] mt-0.5">Collect at counter (No delivery fee)</p>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('Delivery')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  orderType === 'Delivery'
                    ? 'bg-white border-[#C96F91] shadow-2xs'
                    : 'bg-white/60 border-[#F0DDE5] hover:bg-white'
                }`}
              >
                <p className="font-serif font-bold text-xs text-[#3D3035]">Home Delivery</p>
                <p className="text-[11px] text-[#806F77] mt-0.5">₹40 fee (Free above ₹500)</p>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-6 sticky top-28">
          <h2 className="font-serif font-bold text-lg text-[#3D3035]">
            Order Summary
          </h2>

          {/* Coupon Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-[#806F77] uppercase tracking-wider block">
              Discount Coupon Code
            </label>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Try JOY15 or WELCOME10"
                className="flex-grow text-xs uppercase px-3.5 py-2.5 rounded-xl border border-[#F0DDE5] focus:outline-none focus:border-[#C96F91]"
              />
              <button
                type="submit"
                disabled={isApplying}
                className="px-4 py-2.5 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Coupon {appliedCoupon} active</span>
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[11px] text-red-500 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {couponFeedback && (
              <div
                className={`flex items-center gap-1.5 text-xs p-2.5 rounded-xl border ${
                  couponFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {couponFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{couponFeedback.message}</span>
              </div>
            )}
          </div>

          {/* Calculation Line Items (Server Authoritative) */}
          <div className="space-y-2.5 text-xs text-[#806F77] border-t border-[#F0DDE5] pt-4">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#3D3035]">
                ₹{serverQuote.subtotal.toFixed(2)}
              </span>
            </div>

            {serverQuote.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promotional Discount</span>
                <span>- ₹{serverQuote.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Restaurant GST (5%)</span>
              <span className="text-[#3D3035]">
                ₹{serverQuote.taxAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee ({orderType})</span>
              <span className="text-[#3D3035]">
                {serverQuote.deliveryCharge === 0 ? (
                  <span className="text-emerald-600 font-semibold">FREE</span>
                ) : (
                  `₹${serverQuote.deliveryCharge.toFixed(2)}`
                )}
              </span>
            </div>
          </div>

          {/* Final Total */}
          <div className="border-t border-[#F0DDE5] pt-4 flex justify-between items-baseline">
            <div>
              <span className="text-xs text-[#806F77] block">Total Amount</span>
              <span className="text-[10px] text-[#806F77]">Inclusive of all taxes</span>
            </div>
            <span className="font-serif font-bold text-2xl text-[#C96F91]">
              ₹{serverQuote.totalAmount.toFixed(2)}
            </span>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={onProceedToCheckout}
            className="w-full py-4 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
