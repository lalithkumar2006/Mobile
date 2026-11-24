import React from 'react';
import { 
  ChefHat, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Utensils
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const KitchenDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();

  const newOrders = orders.filter(o => o.status === 'received');
  const preparingOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  const handleNextStatus = (order: Order) => {
    if (order.status === 'received') {
      updateOrderStatus(order.id, 'preparing');
    } else if (order.status === 'confirmed' || order.status === 'preparing') {
      updateOrderStatus(order.id, 'ready');
    } else if (order.status === 'ready') {
      updateOrderStatus(order.id, 'completed');
    }
  };

  const handleRevertStatus = (order: Order) => {
    if (order.status === 'ready') {
      updateOrderStatus(order.id, 'preparing');
    } else if (order.status === 'preparing') {
      updateOrderStatus(order.id, 'received');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-16">
      {/* Top Bar for KDS */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
            <ChefHat className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">Kitchen Display System (KDS)</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-xs text-slate-400">Real-time Order Processing Station • Station #01</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400">Active Kitchen Orders:</span>
            <span className="font-extrabold text-white text-sm">{newOrders.length + preparingOrders.length}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/40 border border-blue-500/30 text-blue-300 rounded-xl text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-sync enabled</span>
          </div>
        </div>
      </div>

      {/* 3 Columns Order Board */}
      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto">
        {/* Column 1: New / Incoming Orders */}
        <div className="flex flex-col bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">New Orders</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black">
              {newOrders.length}
            </span>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {newOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <ChefHat className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No pending new tickets</p>
              </div>
            ) : (
              newOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow-md flex flex-col justify-between hover:border-amber-500/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5 mb-2.5">
                      <div>
                        <span className="text-xs font-bold text-amber-400">{order.id}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-base font-black text-white">Table {order.tableNumber}</span>
                          <span className="text-[11px] text-slate-400">({order.customerName || 'Guest'})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {order.createdAt}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400">Paid • {order.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="space-y-2 py-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between text-xs">
                          <div className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                              {item.quantity}
                            </span>
                            <div>
                              <p className="font-semibold text-white">{item.name}</p>
                              {item.specialInstructions && (
                                <p className="text-[10px] text-amber-300/90 italic bg-amber-500/10 px-1.5 py-0.5 rounded mt-0.5 border border-amber-500/20">
                                  Note: {item.specialInstructions}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-700/60 flex gap-2">
                    <button
                      onClick={() => handleNextStatus(order)}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Start Preparing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="flex flex-col bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-blue-500/10 border-b border-blue-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
              <h2 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Preparing</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300 text-xs font-black">
              {preparingOrders.length}
            </span>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Utensils className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No orders actively cooking</p>
              </div>
            ) : (
              preparingOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow-md flex flex-col justify-between hover:border-blue-500/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5 mb-2.5">
                      <div>
                        <span className="text-xs font-bold text-sky-400">{order.id}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-base font-black text-white">Table {order.tableNumber}</span>
                          <span className="text-[11px] text-slate-400">({order.customerName || 'Guest'})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-sky-400 flex items-center gap-1 justify-end animate-pulse">
                          <Clock className="w-3 h-3" />
                          Cooking now
                        </span>
                        <span className="text-[10px] text-slate-400">{order.items.length} dishes</span>
                      </div>
                    </div>

                    <div className="space-y-2 py-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between text-xs">
                          <div className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-md bg-blue-500/20 text-sky-300 font-bold flex items-center justify-center shrink-0">
                              {item.quantity}
                            </span>
                            <div>
                              <p className="font-semibold text-white">{item.name}</p>
                              {item.specialInstructions && (
                                <p className="text-[10px] text-amber-300 italic bg-amber-500/10 px-1.5 py-0.5 rounded mt-0.5">
                                  {item.specialInstructions}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-700/60 flex gap-2">
                    <button
                      onClick={() => handleRevertStatus(order)}
                      className="px-3 py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleNextStatus(order)}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Mark Ready for Pickup</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready to Serve */}
        <div className="flex flex-col bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Ready to Serve</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
              {readyOrders.length}
            </span>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No plated orders waiting</p>
              </div>
            ) : (
              readyOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-slate-800/90 rounded-2xl p-4 border border-emerald-500/30 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5 mb-2.5">
                      <div>
                        <span className="text-xs font-bold text-emerald-400">{order.id}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-base font-black text-white">Table {order.tableNumber}</span>
                          <span className="text-[11px] text-slate-400">({order.customerName || 'Guest'})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                          Plated & Hot
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 py-1 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-300">
                          <span>{item.quantity}x {item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-700/60 flex gap-2">
                    <button
                      onClick={() => handleNextStatus(order)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete & Handed to Waiter</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
