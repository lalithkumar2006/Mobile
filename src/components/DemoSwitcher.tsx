import React from 'react';
import { Smartphone, ChefHat, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const DemoSwitcher: React.FC = () => {
  const { activeExperience, setActiveExperience, orders } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitch = (mode: 'customer' | 'kitchen' | 'admin') => {
    setActiveExperience(mode);
    if (mode === 'customer') {
      if (!location.pathname.startsWith('/customer')) {
        navigate('/customer/menu');
      }
    } else if (mode === 'kitchen') {
      navigate('/kitchen');
    } else if (mode === 'admin') {
      navigate('/admin/overview');
    }
  };

  const pendingKitchenOrdersCount = orders.filter(o => o.status === 'received' || o.status === 'preparing').length;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/95 backdrop-blur-md text-white rounded-full shadow-2xl border border-slate-700/60 transition-all hover:bg-slate-900">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-sky-400 border-r border-slate-700/80 mr-1">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>AuraDine Prototype</span>
        </div>

        <button
          onClick={() => handleSwitch('customer')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
            activeExperience === 'customer' || location.pathname.startsWith('/customer')
              ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Customer Mobile Web</span>
        </button>

        <button
          onClick={() => handleSwitch('kitchen')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all relative ${
            activeExperience === 'kitchen' || location.pathname.startsWith('/kitchen')
              ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Kitchen KDS</span>
          {pendingKitchenOrdersCount > 0 && (
            <span className="w-4 h-4 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full flex items-center justify-center">
              {pendingKitchenOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleSwitch('admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
            activeExperience === 'admin' || location.pathname.startsWith('/admin')
              ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </button>
      </div>
    </div>
  );
};
