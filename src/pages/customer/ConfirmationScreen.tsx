import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Clock, Receipt, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const ConfirmationScreen: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useApp();
  const navigate = useNavigate();

  const order = orders.find(o => o.id === orderId) || orders[0];

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-semibold text-slate-700">Order not found</p>
        <button
          onClick={() => navigate('/customer/menu')}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative p-5 justify-between min-h-full">
      {/* Top Animation & Badge */}
      <div className="flex flex-col items-center text-center pt-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center shadow-soft-md animate-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 stroke-[2.3]" />
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 rounded-full p-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        <h1 className="text-xl font-extrabold text-brand-navy mt-4">Order Confirmed!</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-[260px]">
          The kitchen has received your order and our chefs are ready to prepare your dishes.
        </p>

        <div className="flex items-center gap-2 mt-3">
          <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-lg">
            {order.id}
          </span>
          <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg">
            Table {order.tableNumber}
          </span>
        </div>
      </div>

      {/* Order Item Details Card */}
      <div className="my-5 bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Receipt className="w-4 h-4 text-slate-400" />
            <span>Ordered Items</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">{order.items.length} items</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between text-xs">
              <div className="flex items-start gap-2">
                <span className="font-extrabold text-blue-600 text-[11px] mt-0.5">{item.quantity}x</span>
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  {item.specialInstructions && (
                    <p className="text-[10px] text-amber-600 italic">“{item.specialInstructions}”</p>
                  )}
                </div>
              </div>
              <span className="font-bold text-slate-700">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-600">Total Paid (Demo)</span>
          <span className="text-sm font-extrabold text-blue-600">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pb-2">
        <button
          onClick={() => navigate(`/customer/track/${order.id}`)}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-soft-md flex items-center justify-center gap-2 transition-all"
        >
          <Clock className="w-4 h-4" />
          <span>Track Order Status Live</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('/customer/menu')}
          className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl font-semibold text-xs border border-slate-200 transition-colors"
        >
          Back to Food Menu
        </button>
      </div>
    </div>
  );
};
