import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { SALES_CHART_DATA, POPULAR_ITEMS_DATA } from '../../data/mockData';

export const AdminOverview: React.FC = () => {
  const { orders, tables } = useApp();
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');

  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const activeTablesCount = tables.filter(t => t.status === 'occupied').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'received' || o.status === 'preparing').length;
  const completedOrdersCount = orders.filter(o => o.status === 'completed' || o.status === 'ready').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Executive Restaurant Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time sales throughput, live floor dining activity, and dish velocity.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(['today', 'week', 'month'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                timeFilter === tf
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf === 'today' ? "Today's Live" : tf === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-2">{totalOrdersCount}</h3>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-2">${(totalRevenue + 8450).toFixed(2)}</h3>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+21.8% vs last week</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Tables</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-2">{activeTablesCount} / {tables.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {Math.round((activeTablesCount / tables.length) * 100)}% Occupancy Rate
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending in Kitchen</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-2">{pendingOrdersCount}</h3>
          <p className="text-[11px] text-sky-600 font-semibold mt-1">Avg Cook Time: 14m</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Orders</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-2">{completedOrdersCount}</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">98.4% On-time delivery</p>
        </div>
      </div>

      {/* Main Grid: Revenue Chart + Popular Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-soft-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Hourly Revenue Inflow ($)</h2>
              <p className="text-xs text-slate-400">Peak dining throughput observed between 7:00 PM – 9:30 PM</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">
              Live Stream
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`$${val}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800">Top Performing Dishes</h2>
              <span className="text-[10px] text-blue-600 font-semibold">Today's Sales</span>
            </div>

            <div className="space-y-3">
              {POPULAR_ITEMS_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs pb-2 border-b border-slate-50 last:border-none">
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.sales} orders served</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-brand-navy">${item.revenue}</span>
                    <p className="text-[10px] font-bold text-emerald-600">{item.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
            <span>Fastest re-ordered: <strong>Butter Chicken</strong></span>
            <span className="text-blue-600 font-bold">96% Positive</span>
          </div>
        </div>
      </div>

      {/* Recent Live Orders Table */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Recent Customer Orders</h2>
            <p className="text-xs text-slate-400">Directly synchronized with table QR scans & kitchen dispatch</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Table</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Time</th>
                <th className="pb-3 pr-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.slice(0, 6).map(ord => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2 font-bold text-blue-600">{ord.id}</td>
                  <td className="py-3 font-semibold text-slate-800">Table {ord.tableNumber}</td>
                  <td className="py-3 text-slate-600">
                    <span className="truncate max-w-[200px] block">
                      {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </span>
                  </td>
                  <td className="py-3 font-extrabold text-slate-800">${ord.total.toFixed(2)}</td>
                  <td className="py-3 text-slate-500">{ord.paymentMethod}</td>
                  <td className="py-3 text-slate-400">{ord.createdAt}</td>
                  <td className="py-3 pr-2 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'completed'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : ord.status === 'ready'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.status === 'preparing'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
