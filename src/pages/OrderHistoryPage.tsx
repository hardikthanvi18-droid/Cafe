import React, { useState, useEffect } from 'react';
import { Package, ArrowRight, Clock, Coffee, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types/cafe';

interface Props {
  onExploreMenu: () => void;
  onSelectOrder: (order: Order) => void;
}

export const OrderHistoryPage: React.FC<Props> = ({ onExploreMenu, onSelectOrder }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`/api/orders/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-[#3D3035]">Please Sign In</h2>
        <p className="text-xs text-[#806F77]">Log in to your customer account to view your past orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0DDE5] pb-5">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#C96F91] font-bold">
            Customer Dashboard
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#3D3035]">
            My Order History
          </h1>
          <p className="text-xs text-[#806F77] mt-0.5">
            Track preparation progress and inspect past receipts.
          </p>
        </div>

        <button
          onClick={onExploreMenu}
          className="px-5 py-2.5 bg-[#C96F91] hover:bg-[#b05d7e] text-white text-xs font-semibold rounded-full shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          + Order Fresh Treats
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 bg-gray-100 rounded-3xl" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F0DDE5] shadow-xs space-y-4 hover:border-[#C96F91] transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#F0DDE5] pb-3.5">
                <div>
                  <span className="text-[11px] text-[#806F77]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <h3 className="font-mono font-bold text-sm text-[#C96F91]">
                    {order.orderNumber}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FCE7EF] text-[#C96F91] border border-[#F8D7E5]">
                    {order.orderStatus}
                  </span>
                  <span className="text-xs text-[#806F77]">
                    {order.orderType}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-1.5 text-xs text-[#3D3035]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.quantity} × {item.productName}</span>
                    <span className="font-semibold text-[#806F77]">₹{item.lineTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#F0DDE5] flex items-center justify-between text-xs">
                <span className="text-[#806F77]">
                  Payment: <strong className="text-[#3D3035]">{order.paymentMethod}</strong> ({order.paymentStatus})
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#C96F91]">
                    Total: ₹{order.totalAmount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onSelectOrder(order)}
                    className="text-xs text-[#806F77] hover:text-[#C96F91] font-semibold underline cursor-pointer"
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#FFF5F8] rounded-3xl border border-[#F0DDE5] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center text-3xl">☕</div>
          <h2 className="font-serif font-bold text-xl text-[#3D3035]">No orders placed yet</h2>
          <p className="text-xs text-[#806F77] max-w-sm mx-auto">
            Your delicious treats will appear right here once you order from our menu.
          </p>
          <button
            onClick={onExploreMenu}
            className="px-6 py-2.5 bg-[#C96F91] text-white text-xs font-semibold rounded-full hover:bg-[#b05d7e]"
          >
            Explore Café Menu
          </button>
        </div>
      )}
    </div>
  );
};
