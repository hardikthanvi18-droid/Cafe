import React from 'react';
import { CheckCircle2, Clock, Coffee, MapPin, Printer } from 'lucide-react';
import { Order } from '../types/cafe';

interface Props {
  order: Order;
  onContinueShopping: () => void;
  onViewOrderHistory: () => void;
}

export const OrderConfirmationPage: React.FC<Props> = ({
  order,
  onContinueShopping,
  onViewOrderHistory
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      {/* Top celebratory header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF5F8] border border-[#F8D7E5] flex items-center justify-center text-4xl shadow-xs">
          🌸
        </div>
        <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3035]">
          Thank You, {order.customerName.split(' ')[0]}!
        </h1>
        <p className="text-xs sm:text-sm text-[#806F77] max-w-md mx-auto">
          Our baristas have received your order ticket and are beginning to handcraft your treats.
        </p>
      </div>

      {/* Main Order Ticket Card */}
      <div className="bg-white rounded-3xl border border-[#F0DDE5] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Ticket Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0DDE5] pb-5">
          <div>
            <span className="text-[10px] text-[#806F77] uppercase font-semibold block">
              Order Reference
            </span>
            <span className="font-mono font-bold text-lg text-[#C96F91]">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FCE7EF] text-[#C96F91] border border-[#F8D7E5]">
              Status: {order.orderStatus}
            </span>
            <button
              onClick={() => window.print()}
              className="p-2 text-[#806F77] hover:text-[#3D3035] rounded-full hover:bg-gray-100 transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fulfillment & Customer Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#FFF5F8] p-3.5 rounded-2xl border border-[#F0DDE5]">
            <span className="text-[10px] text-[#806F77] uppercase block font-semibold">Fulfillment</span>
            <span className="font-bold text-[#3D3035] text-sm mt-0.5 block">{order.orderType}</span>
            <span className="text-[11px] text-[#806F77]">
              {order.orderType === 'Pickup' ? 'Collect at Counter' : 'Doorstep Courier'}
            </span>
          </div>

          <div className="bg-[#FFF5F8] p-3.5 rounded-2xl border border-[#F0DDE5]">
            <span className="text-[10px] text-[#806F77] uppercase block font-semibold">Payment</span>
            <span className="font-bold text-[#3D3035] text-sm mt-0.5 block">{order.paymentMethod}</span>
            <span className="text-[11px] text-[#806F77]">Status: {order.paymentStatus}</span>
          </div>

          <div className="bg-[#FFF5F8] p-3.5 rounded-2xl border border-[#F0DDE5]">
            <span className="text-[10px] text-[#806F77] uppercase block font-semibold">Contact</span>
            <span className="font-bold text-[#3D3035] text-sm mt-0.5 block truncate">{order.customerEmail}</span>
            <span className="text-[11px] text-[#806F77]">{order.customerPhone}</span>
          </div>
        </div>

        {order.deliveryAddress && (
          <div className="text-xs bg-pink-50/50 p-3.5 rounded-2xl border border-[#F0DDE5] flex items-start gap-2 text-[#3D3035]">
            <MapPin className="w-4 h-4 text-[#C96F91] shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Delivery Destination: </strong>
              <span>{order.deliveryAddress}</span>
            </div>
          </div>
        )}

        {/* Itemized Snapshot */}
        <div className="space-y-3 pt-2">
          <h3 className="font-serif font-bold text-sm text-[#3D3035]">
            Itemized Order Breakdown
          </h3>

          <div className="space-y-2 divide-y divide-[#F0DDE5]/60">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-12 rounded-xl object-cover border border-[#F0DDE5]"
                  />
                  <div>
                    <p className="font-semibold text-[#3D3035]">{item.productName}</p>
                    <p className="text-[11px] text-[#806F77]">
                      {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#3D3035]">
                  ₹{item.lineTotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="border-t border-[#F0DDE5] pt-4 space-y-2 text-xs text-[#806F77]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-[#3D3035]">₹{order.subtotal.toFixed(2)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount ({order.appliedCouponCode || 'Promotional'})</span>
              <span>- ₹{order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>GST ({Math.round(order.taxRate * 100)}%)</span>
            <span className="text-[#3D3035]">₹{order.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="text-[#3D3035]">
              {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge.toFixed(2)}`}
            </span>
          </div>
          <div className="border-t border-[#F0DDE5] pt-3 flex justify-between items-baseline text-sm font-bold text-[#3D3035]">
            <span>Total Payable Amount</span>
            <span className="font-serif text-xl text-[#C96F91]">
              ₹{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-2">
        <button
          onClick={onContinueShopping}
          className="px-7 py-3 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-md transition-colors cursor-pointer"
        >
          Explore More Delights
        </button>
        <button
          onClick={onViewOrderHistory}
          className="px-6 py-3 bg-white border border-[#F0DDE5] hover:border-[#C96F91] text-[#3D3035] text-xs font-semibold rounded-full hover:bg-[#FFF5F8] transition-colors cursor-pointer"
        >
          View My Past Orders
        </button>
      </div>
    </div>
  );
};
