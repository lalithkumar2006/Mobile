import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ArrowUpRight } from 'lucide-react';

const CATEGORY_SALES = [
  { name: 'Main Course', value: 45, color: '#1d4ed8' },
  { name: 'Starters', value: 25, color: '#0284c7' },
  { name: 'Beverages', value: 18, color: '#38bdf8' },
  { name: 'Desserts', value: 12, color: '#93c5fd' },
];

const WEEKLY_TREND = [
  { day: 'Mon', revenue: 3200, dineInGuests: 110 },
  { day: 'Tue', revenue: 4100, dineInGuests: 135 },
  { day: 'Wed', revenue: 3800, dineInGuests: 125 },
  { day: 'Thu', revenue: 5200, dineInGuests: 160 },
  { day: 'Fri', revenue: 7800, dineInGuests: 240 },
  { day: 'Sat', revenue: 9400, dineInGuests: 295 },
  { day: 'Sun', revenue: 8600, dineInGuests: 270 },
];

export const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'quarter'>('7days');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Business Analytics & Metrics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Key operational health indicators, guest turnover rate, and category revenue distribution.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(['7days', '30days', 'quarter'] as const).map(dr => (
            <button
              key={dr}
              onClick={() => setDateRange(dr)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                dateRange === dr
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {dr === '7days' ? 'Last 7 Days' : dr === '30days' ? 'Last 30 Days' : 'Quarterly'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm">
          <p className="text-xs font-semibold text-slate-500">Gross Sales Volume</p>
          <h3 className="text-2xl font-black text-slate-800 mt-2">$42,100</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last period
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm">
          <p className="text-xs font-semibold text-slate-500">Average Order Value (AOV)</p>
          <h3 className="text-2xl font-black text-blue-600 mt-2">$48.50</h3>
          <p className="text-[11px] text-slate-400 mt-1">2.8 dishes per table order</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm">
          <p className="text-xs font-semibold text-slate-500">Table Turnover Rate</p>
          <h3 className="text-2xl font-black text-amber-600 mt-2">42 mins</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">12 min faster with QR pay</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm">
          <p className="text-xs font-semibold text-slate-500">Digital QR Adoption</p>
          <h3 className="text-2xl font-black text-purple-600 mt-2">91.2%</h3>
          <p className="text-[11px] text-slate-400 mt-1">Direct from smartphone</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-soft-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Weekly Daily Revenue ($)</h3>
          <p className="text-xs text-slate-400 mb-4">Highest revenue captured on Friday & Saturday dinner service</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`$${val}`, 'Sales']}
                />
                <Bar dataKey="revenue" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Revenue by Category</h3>
            <p className="text-xs text-slate-400 mb-3">Breakdown of product volume</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_SALES}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {CATEGORY_SALES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {CATEGORY_SALES.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-slate-600">{cat.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
