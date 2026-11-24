import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  ChefHat, 
  Utensils, 
  CheckCheck, 
  ArrowLeft, 
  MessageSquare,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

interface Step {
  key: OrderStatus;
  title: string;
  desc: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  { key: 'received', title: 'Order Received', desc: 'Sent directly to the kitchen display', icon: Clock },
  { key: 'confirmed', title: 'Order Confirmed', desc: 'Ingredients assembled by chef team', icon: CheckCircle },
  { key: 'preparing', title: 'Preparing', desc: 'Dishes are actively being cooked fresh', icon: ChefHat },
  { key: 'ready', title: 'Ready', desc: 'Plated and ready for pickup/serving', icon: Utensils },
  { key: 'completed', title: 'Completed', desc: 'Served at your table • Enjoy your meal!', icon: CheckCheck },
];

export const TrackingScreen: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, updateOrderStatus } = useApp();
  const navigate = useNavigate();

  const currentOrder = orders.find(o => o.id === orderId) || orders[0];
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (currentOrder) {
      const idx = STEPS.findIndex(s => s.key === currentOrder.status);
      setActiveStepIndex(idx >= 0 ? idx : 0);
    }
  }, [currentOrder?.status]);

  const handleSimulateNextStep = () => {
    if (!currentOrder) return;
    const nextIdx = (activeStepIndex + 1) % STEPS.length;
    const nextStatus = STEPS[nextIdx].key;
    updateOrderStatus(currentOrder.id, nextStatus);
  };

  if (!currentOrder) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-semibold text-slate-700">No active order to track</p>
        <button
          onClick={() => navigate('/customer/menu')}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const currentStepInfo = STEPS[activeStepIndex] || STEPS[0];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative pb-6 min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/customer/menu')}
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-extrabold text-brand-navy">Live Kitchen Status</h1>
          <p className="text-[10px] text-slate-500 font-medium">{currentOrder.id} • Table {currentOrder.tableNumber}</p>
        </div>
        <button
          onClick={handleSimulateNextStep}
          title="Demo: Simulate next kitchen state"
          className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 flex items-center gap-1 text-[11px] font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Next Stage</span>
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Estimated Status Card */}
        <div className="bg-gradient-to-br from-brand-navy via-brand-midnight to-blue-900 text-white rounded-3xl p-5 shadow-soft-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold tracking-wide uppercase text-sky-300">
                Live Kitchen Feed
              </span>
              <span className="text-[11px] text-slate-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Estimated: ~15 mins
              </span>
            </div>

            <h2 className="text-lg font-black text-white">{currentStepInfo.title}</h2>
            <p className="text-xs text-sky-100 mt-1">{currentStepInfo.desc}</p>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>Table {currentOrder.tableNumber}</span>
              <span>{currentOrder.items.length} items ordered</span>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* 5-Step Progress Timeline */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-4">Preparation Timeline</h3>

          <div className="relative pl-6 space-y-6">
            <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-slate-100"></div>

            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <div key={step.key} className="relative flex items-start gap-3">
                  <div
                    className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                      isPast
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-blue-600'
                            : isPast
                            ? 'text-slate-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                      {isPast && (
                        <span className="text-[10px] font-semibold text-emerald-600">Done</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fast Step Switcher for Demonstrations */}
        <div className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/60">
          <p className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Demo: Click any status to simulate</span>
          </p>
          <div className="grid grid-cols-5 gap-1">
            {STEPS.map((step) => (
              <button
                key={step.key}
                onClick={() => updateOrderStatus(currentOrder.id, step.key)}
                className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  currentOrder.status === step.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                {step.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback CTA if ready or completed */}
        {(currentOrder.status === 'ready' || currentOrder.status === 'completed') && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center animate-in zoom-in duration-300">
            <h4 className="text-xs font-extrabold text-emerald-800">Meal Served! How was your experience?</h4>
            <p className="text-[11px] text-emerald-600 mt-0.5">Please share your feedback with our culinary team.</p>
            <button
              onClick={() => navigate(`/customer/feedback/${currentOrder.id}`)}
              className="mt-2.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 mx-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Leave Feedback & Rating</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="px-4 pt-2">
        <button
          onClick={() => navigate(`/customer/feedback/${currentOrder.id}`)}
          className="w-full py-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Skip to Feedback Form</span>
        </button>
      </div>
    </div>
  );
};
