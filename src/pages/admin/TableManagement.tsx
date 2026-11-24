import React, { useState } from 'react';
import { 
  QrCode, 
  Printer, 
  Users, 
  Sparkles, 
  Check, 
  Clock, 
  ExternalLink
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { RestaurantTable } from '../../types';

export const TableManagement: React.FC = () => {
  const { tables, updateTableStatus, setCurrentTable } = useApp();
  const [selectedTableForQR, setSelectedTableForQR] = useState<RestaurantTable | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const baseUrl = window.location.origin;

  const handleCopyLink = (tableNum: string) => {
    const url = `${baseUrl}/customer/menu?table=${tableNum}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Table & QR Code Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor floor occupancy, generate instant high-resolution QR standees and table links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTableForQR(tables[0])}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-soft-sm flex items-center gap-1.5 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Batch QR Standees</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Dining Tables</p>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">{tables.length} Tables</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Currently Occupied</p>
            <h3 className="text-xl font-extrabold text-amber-600 mt-1">
              {tables.filter(t => t.status === 'occupied').length} Tables
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Available For Guests</p>
            <h3 className="text-xl font-extrabold text-emerald-600 mt-1">
              {tables.filter(t => t.status === 'available').length} Tables
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tables.map(table => {
          const statusBg =
            table.status === 'occupied' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            table.status === 'reserved' ? 'bg-indigo-50 border-indigo-200 text-indigo-800' :
            'bg-emerald-50 border-emerald-200 text-emerald-800';

          const dotColor =
            table.status === 'occupied' ? 'bg-amber-500' :
            table.status === 'reserved' ? 'bg-indigo-500' : 'bg-emerald-500';

          return (
            <div
              key={table.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                    {table.tableNumber}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${statusBg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                    <span className="capitalize">{table.status}</span>
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Capacity:</span>
                    <span className="font-semibold text-slate-800">{table.capacity} Guests</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Section:</span>
                    <span className="font-semibold text-slate-800">{table.section}</span>
                  </div>
                  {table.activeOrderId && (
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Active Ticket:</span>
                      <span className="font-bold text-blue-600">{table.activeOrderId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  {(['available', 'occupied', 'reserved'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => updateTableStatus(table.id, st)}
                      className={`py-1 text-[9px] font-bold rounded-lg capitalize transition-all ${
                        table.status === st
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'available' ? 'Free' : st === 'occupied' ? 'Busy' : 'Hold'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedTableForQR(table)}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View / Print QR</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTableForQR && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div 
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTableForQR(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100"
            >
              ✕
            </button>

            <div id="printable-qr-stand" className="bg-gradient-to-b from-brand-ice to-white p-6 rounded-2xl border-2 border-slate-100 mb-4 shadow-sm flex flex-col items-center">
              <span className="text-[10px] tracking-widest uppercase font-extrabold text-blue-600 mb-1">AuraDine Smart Bistro</span>
              <h3 className="text-xl font-black text-brand-navy">TABLE {selectedTableForQR.tableNumber}</h3>
              <p className="text-[11px] text-slate-400 mb-4">Scan with phone camera to view menu & order</p>

              <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-100">
                <QRCodeSVG
                  value={`${baseUrl}/customer/menu?table=${selectedTableForQR.tableNumber}`}
                  size={160}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                <span>⚡ Instant Ordering • Contactless Pay</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Standee</span>
                </button>

                <button
                  onClick={() => handleCopyLink(selectedTableForQR.tableNumber)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Direct URL'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setCurrentTable(selectedTableForQR.tableNumber);
                  setSelectedTableForQR(null);
                  window.location.hash = '#/customer/menu';
                }}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors"
              >
                Test Customer View as Table {selectedTableForQR.tableNumber}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
