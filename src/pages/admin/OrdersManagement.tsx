import React, { useState } from 'react';
import { 
  Search, 
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const OrdersManagement: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(ord => {
    const matchStatus = filterStatus === 'all' || ord.status === filterStatus;
    const matchSearch = 
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.tableNumber.includes(searchQuery) ||
      (ord.customerName && ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Orders Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time track of all customer orders, billing breakdown, and status controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Table..."
              className="pl-9 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {['all', 'received', 'preparing', 'ready', 'completed'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
              filterStatus === st
                ? 'bg-blue-600 text-white shadow-soft-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            {st} ({st === 'all' ? orders.length : orders.filter(o => o.status === st).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Table</th>
                <th className="pb-3">Diner Name</th>
                <th className="pb-3">Item Breakdown</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3">Placed</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2 font-bold text-blue-600">{order.id}</td>
                  <td className="py-3 font-semibold text-slate-800">Table {order.tableNumber}</td>
                  <td className="py-3 text-slate-600">{order.customerName || 'Guest'}</td>
                  <td className="py-3 text-slate-600 max-w-xs truncate">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="py-3 font-extrabold text-slate-800">${order.total.toFixed(2)}</td>
                  <td className="py-3 text-slate-400">{order.createdAt}</td>
                  <td className="py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer uppercase ${
                        order.status === 'completed' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        order.status === 'ready' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        order.status === 'preparing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="received">RECEIVED</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="preparing">PREPARING</option>
                      <option value="ready">READY</option>
                      <option value="completed">COMPLETED</option>
                    </select>
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="View Receipt & Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg">
                {selectedOrder.id}
              </span>
              <span className="text-xs font-bold text-slate-600">Table {selectedOrder.tableNumber}</span>
            </div>

            <h3 className="text-base font-extrabold text-slate-800 mb-3">Order Receipt</h3>

            <div className="space-y-2 border-y border-slate-100 py-3 my-2 max-h-56 overflow-y-auto">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{item.quantity}x {item.name}</span>
                    {item.specialInstructions && (
                      <p className="text-[10px] text-amber-600 italic">“{item.specialInstructions}”</p>
                    )}
                  </div>
                  <span className="font-semibold text-slate-700">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 pt-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span className="font-semibold text-slate-800">${selectedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-brand-navy pt-2 border-t border-slate-100">
                <span>Total Amount:</span>
                <span className="text-blue-600">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
