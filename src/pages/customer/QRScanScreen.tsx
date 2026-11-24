import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, ArrowRight, Camera, CheckCircle2, ShieldCheck, Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QRScanScreen: React.FC = () => {
  const { currentTable, setCurrentTable } = useApp();
  const [inputTable, setInputTable] = useState(currentTable || '04');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setCurrentTable(inputTable || '04');
      setTimeout(() => {
        navigate('/customer/menu');
      }, 900);
    }, 1500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTable) return;
    setCurrentTable(inputTable.padStart(2, '0'));
    navigate('/customer/menu');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-brand-ice via-white to-slate-50 min-h-full">
      {/* Top Header / Branding */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-navy via-brand-midnight to-blue-600 shadow-soft-lg text-white mb-3">
          <Utensils className="w-8 h-8 text-sky-300" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
          Aura<span className="text-sky-600">Dine</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Smart QR Restaurant Dining</p>
      </div>

      {/* Main Interactive Scan Area */}
      <div className="my-auto py-4 flex flex-col items-center">
        <div className="relative w-64 h-64 rounded-3xl bg-white p-4 shadow-soft-lg border border-slate-100 flex flex-col items-center justify-center overflow-hidden">
          {/* Animated Scanning Line */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent shadow-[0_0_12px_#0284c7] animate-bounce z-20" />
          )}

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-blue-600 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-blue-600 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-4 border-l-4 border-blue-600 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-blue-600 rounded-br-lg" />

          {scanSuccess ? (
            <div className="flex flex-col items-center text-emerald-600 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-16 h-16 stroke-[2.2]" />
              <p className="mt-2 text-sm font-semibold">Table {inputTable} Connected!</p>
              <span className="text-xs text-slate-500 mt-0.5">Redirecting to menu...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center p-3">
              <div className="w-24 h-24 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-3">
                <QrCode className={`w-14 h-14 ${isScanning ? 'text-blue-600 animate-pulse' : 'text-slate-800'}`} />
              </div>
              <p className="text-xs font-semibold text-slate-700">Scan Table QR Stand</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Point camera at table stand to view menu</p>
            </div>
          )}
        </div>

        <button
          onClick={handleSimulateScan}
          disabled={isScanning || scanSuccess}
          className="mt-5 w-64 py-3 px-4 bg-brand-navy hover:bg-brand-midnight active:scale-[0.98] text-white rounded-2xl font-semibold text-xs shadow-soft-md flex items-center justify-center gap-2 transition-all disabled:opacity-75"
        >
          {isScanning ? (
            <>
              <Camera className="w-4 h-4 animate-spin text-sky-400" />
              <span>Scanning QR Code...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 text-sky-400" />
              <span>Simulate QR Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Manual Entry Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-700">Or Enter Table Manually</span>
          <span className="text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full font-medium">Quick Demo</span>
        </div>
        
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
              Table #
            </span>
            <input
              type="text"
              value={inputTable}
              onChange={(e) => setInputTable(e.target.value)}
              placeholder="04"
              className="w-full pl-16 pr-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all"
          >
            <span>Enter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            No App Download Required
          </span>
          <span className="text-slate-400">Direct Browser Web</span>
        </div>
      </div>
    </div>
  );
};
