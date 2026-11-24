import React from 'react';
import { Star, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerFeedbackManagement: React.FC = () => {
  const { feedbacks } = useApp();

  const avgRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / (feedbacks.length || 1)).toFixed(1);
  const avgFoodRating = (feedbacks.reduce((sum, f) => sum + f.foodQualityRating, 0) / (feedbacks.length || 1)).toFixed(1);
  const avgServiceRating = (feedbacks.reduce((sum, f) => sum + f.serviceRating, 0) / (feedbacks.length || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Customer Reviews & Feedback</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real customer impressions, service sentiments, and culinary reviews submitted after dining.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft-sm text-center">
          <p className="text-xs font-semibold text-slate-500">Overall Guest Rating</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span className="text-3xl font-black text-slate-800">{avgRating}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Based on verified orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft-sm text-center">
          <p className="text-xs font-semibold text-slate-500">Food Quality Score</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-3xl font-black text-blue-600">{avgFoodRating}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Taste, temperature, presentation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft-sm text-center">
          <p className="text-xs font-semibold text-slate-500">Service & Speed Score</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-3xl font-black text-emerald-600">{avgServiceRating}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Kitchen wait & waiter attention</p>
        </div>
      </div>

      <div className="space-y-4">
        {feedbacks.map(fb => (
          <div
            key={fb.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft-sm flex flex-col sm:flex-row gap-4 justify-between"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{fb.customerName}</h4>
                  <p className="text-[10px] text-slate-400">
                    Table {fb.tableNumber} • {fb.orderId} • {fb.createdAt}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/80">
                “{fb.comment}”
              </p>
            </div>

            <div className="sm:border-l sm:border-slate-100 sm:pl-5 flex flex-col justify-center gap-1.5 min-w-[140px]">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(st => (
                  <Star
                    key={st}
                    className={`w-3.5 h-3.5 ${
                      st <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Food: <strong className="text-slate-700">{fb.foodQualityRating}★</strong>
              </div>
              <div className="text-[11px] text-slate-500">
                Service: <strong className="text-slate-700">{fb.serviceRating}★</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
