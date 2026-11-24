import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, FileText, ChevronRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartScreen: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, updateInstructions, currentTable, placeOrder } = useApp();
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'upi' | 'cash'>('upi');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const serviceCharge = subtotal > 0 ? 1.50 : 0;
  const grandTotal = Number((subtotal + tax + serviceCharge).toFixed(2));

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      const order = placeOrder(
        selectedPayment === 'upi' ? 'UPI / QR Digital Pay' :
        selectedPayment === 'card' ? 'Contactless Card' : 'Pay at Counter'
      );
      setIsCheckingOut(false);
      navigate(`/customer/confirmation/${order.id}`);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/customer/menu')}
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-extrabold text-brand-navy">Order Summary</h1>
          <p className="text-[10px] text-slate-500 font-medium">Table {currentTable} • {cart.length} item{cart.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="w-8"></div>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
            <span className="text-2xl">🍽️</span>
          </div>
          <h2 className="text-sm font-bold text-slate-800">Your tray is empty</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Add your favorite dishes, chef specials and refreshing drinks from the menu.
          </p>
          <button
            onClick={() => navigate('/customer/menu')}
            className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 space-y-4 pb-32 overflow-y-auto">
          {/* Cart Item Cards */}
          <div className="space-y-3">
            {cart.map(({ dish, quantity, specialInstructions }) => (
              <div
                key={dish.id}
                className="bg-white rounded-2xl p-3 border border-slate-100 shadow-soft-sm flex flex-col gap-2.5"
              >
                <div className="flex gap-3">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-3 h-3 rounded-sm border flex items-center justify-center p-0.5 shrink-0 ${
                            dish.isVeg ? 'border-emerald-600 bg-white' : 'border-rose-600 bg-white'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                          </span>
                          <h3 className="text-xs font-bold text-slate-800 truncate">{dish.name}</h3>
                        </div>
                        <p className="text-xs font-extrabold text-blue-600 mt-0.5">${dish.price.toFixed(2)}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(dish.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructions Input */}
                <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 text-xs">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={specialInstructions || ''}
                    onChange={(e) => updateInstructions(dish.id, e.target.value)}
                    placeholder="Add cooking note (e.g. no onions, extra sauce)..."
                    className="bg-transparent text-[11px] text-slate-700 w-full focus:outline-none placeholder-slate-400"
                  />
                </div>

                {/* Quantity Controls & Item Total */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Item Total: <strong className="text-slate-700 font-bold">${(dish.price * quantity).toFixed(2)}</strong>
                  </span>

                  <div className="flex items-center gap-2 bg-slate-100 text-slate-800 px-2 py-1 rounded-xl">
                    <button
                      onClick={() => updateQuantity(dish.id, quantity - 1)}
                      className="w-5 h-5 flex items-center justify-center hover:bg-white rounded transition-colors"
                    >
                      <Minus className="w-3 h-3 text-slate-600" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(dish.id, quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center hover:bg-white rounded transition-colors"
                    >
                      <Plus className="w-3 h-3 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method Selector Demo */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-soft-sm">
            <h3 className="text-xs font-bold text-slate-800 mb-2.5">Simulated Payment Method</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPayment('upi')}
                className={`p-2 rounded-xl text-center border transition-all ${
                  selectedPayment === 'upi'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="text-xs">⚡ UPI / QR</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Instant pay</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPayment('card')}
                className={`p-2 rounded-xl text-center border transition-all ${
                  selectedPayment === 'card'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="text-xs">💳 Card / NFC</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Tap to pay</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPayment('cash')}
                className={`p-2 rounded-xl text-center border transition-all ${
                  selectedPayment === 'cash'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="text-xs">💵 Counter</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Pay later</div>
              </button>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm space-y-2 text-xs">
            <h3 className="font-bold text-slate-800 text-xs mb-2">Billing Details</h3>
            <div className="flex justify-between text-slate-500">
              <span>Item Subtotal</span>
              <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>State & City Tax (8%)</span>
              <span className="font-semibold text-slate-800">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Kitchen Service Fee</span>
              <span className="font-semibold text-slate-800">${serviceCharge.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-extrabold text-brand-navy">
              <span>To Pay</span>
              <span className="text-base text-blue-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Demo Order • Direct Kitchen Relay</span>
          </div>
        </div>
      )}

      {/* Floating Bottom Place Order Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-30 max-w-[410px] mx-auto">
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-soft-lg flex items-center justify-between transition-all disabled:opacity-75"
          >
            <span>${grandTotal.toFixed(2)}</span>
            <span className="flex items-center gap-1">
              {isCheckingOut ? 'Sending to Kitchen...' : 'Confirm & Place Order'}
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
