import React, { useState } from 'react';
import { Bell, Store, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [restaurantName, setRestaurantName] = useState('AuraDine Bistro & Fine Dining');
  const [currency, setCurrency] = useState('USD ($)');
  const [taxPercent, setTaxPercent] = useState('8.0');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800">Restaurant System Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          General restaurant profile, tax computation, kitchen chime preferences, and prototype configuration.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">Restaurant Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Establishment Name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sales Tax / GST Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">Kitchen & Notification Preferences</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Sound notification on new order</span>
                <span className="text-[11px] text-slate-400">Audible chime when customer scans QR and completes checkout</span>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Auto-confirm incoming QR orders</span>
                <span className="text-[11px] text-slate-400">Directly bypass reception and dispatch tickets straight to prep line</span>
              </div>
              <input
                type="checkbox"
                checked={autoAcceptOrders}
                onChange={(e) => setAutoAcceptOrders(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0 w-4 h-4"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-soft-sm flex items-center gap-2 transition-all"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Settings Saved!' : 'Save System Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
