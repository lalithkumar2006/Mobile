import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [deviceFrame, setDeviceFrame] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 pt-16 pb-8 px-2 sm:px-4 flex flex-col items-center justify-center transition-colors">
      {/* Frame Toggle Controls on Desktop */}
      <div className="hidden lg:flex items-center gap-3 mb-3 text-xs text-slate-400 bg-slate-900/90 px-4 py-1.5 rounded-full border border-slate-800 shadow-md">
        <span className="flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-sky-400" />
          Customer Mobile Web View
        </span>
        <span className="text-slate-600">•</span>
        <button
          onClick={() => setDeviceFrame(!deviceFrame)}
          className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
        >
          {deviceFrame ? 'Expand to Full View' : 'Switch to iPhone Frame'}
        </button>
      </div>

      {deviceFrame ? (
        <div className="relative w-full max-w-[410px] h-[844px] bg-white rounded-[46px] shadow-[0_25px_70px_rgba(0,0,0,0.65)] border-[9px] border-slate-800 overflow-hidden flex flex-col transition-all">
          {/* Dynamic Island / speaker notch simulation */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-36 bg-slate-900 rounded-b-2xl z-40 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full ml-3 border border-slate-700/50"></div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-5 bg-slate-50 flex flex-col">
            {children}
          </div>

          {/* Home indicator bar */}
          <div className="h-4 bg-white flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden min-h-[820px] flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
