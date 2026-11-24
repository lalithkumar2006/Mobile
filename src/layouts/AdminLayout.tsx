import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Layers, 
  Grid3X3, 
  QrCode, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  ChefHat, 
  Smartphone, 
  Menu as MenuIcon, 
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useApp();

  const pendingCount = orders.filter(o => o.status === 'received' || o.status === 'preparing').length;

  const navItems = [
    { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, badge: pendingCount > 0 ? pendingCount : null },
    { name: 'Food Menu', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Table Management', path: '/admin/tables', icon: Grid3X3 },
    { name: 'QR Code Management', path: '/admin/qr', icon: QrCode },
    { name: 'Customer Feedback', path: '/admin/feedback', icon: MessageSquare },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex pt-14">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Professional Navy Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-navy text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center font-bold text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-white">
                  Aura<span className="text-sky-400">Dine</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Enterprise Admin Suite</p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <span className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Management
            </span>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-soft-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-sky-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Restaurant Manager</p>
              <p className="text-[10px] text-emerald-400">Live Service Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 sticky top-14 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
              AuraDine Smart Restaurant System
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/customer/menu')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer Mobile Web</span>
            </button>

            <button
              onClick={() => navigate('/kitchen')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-200"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-600" />
              <span>Kitchen Display</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
