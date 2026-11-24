import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeedbackScreen: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, addFeedback, currentTable } = useApp();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const currentOrder = orders.find(o => o.id === orderId) || orders[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedback({
      orderId: currentOrder?.id || 'ORD-NEW',
      tableNumber: currentOrder?.tableNumber || currentTable || '04',
      customerName: 'Guest Diner',
      rating,
      foodQualityRating: foodRating,
      serviceRating,
      comment: comment || 'Exceptional experience and prompt service!'
    });
    setSubmitted(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative p-4 justify-between min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button
          onClick={() => navigate('/customer/menu')}
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-extrabold text-brand-navy">Guest Feedback</h1>
          <p className="text-[10px] text-slate-500 font-medium">Table {currentOrder?.tableNumber || currentTable}</p>
        </div>
        <div className="w-8"></div>
      </div>

      {submitted ? (
        <div className="my-auto bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-soft-lg animate-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-10 h-10 stroke-[2.3]" />
          </div>
          <h2 className="text-base font-extrabold text-slate-800">Thank You for Dining With Us!</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Your review has been dispatched to our management and kitchen team to help us continually elevate your dining experience.
          </p>

          <div className="mt-5 space-y-2">
            <button
              onClick={() => navigate('/customer/menu')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Order More Items
            </button>
            <button
              onClick={() => navigate('/admin/feedback')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
            >
              View in Admin Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="my-auto space-y-4 py-2">
          {/* Overall experience star selector */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm text-center">
            <span className="text-xs font-bold text-slate-700 block mb-1">Overall Dining Experience</span>
            <div className="flex items-center justify-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-200 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] font-semibold text-slate-500">
              {rating === 5 && '🌟 Exceptional!'}
              {rating === 4 && '✨ Very Good!'}
              {rating === 3 && '👍 Good'}
              {rating === 2 && '😐 Needs Improvement'}
              {rating === 1 && '👎 Poor'}
            </p>
          </div>

          {/* Sub ratings */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Food Taste & Presentation</span>
                <span className="text-amber-500 font-bold">{foodRating} / 5</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFoodRating(r)}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      r === foodRating ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {r}★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Service & Preparation Speed</span>
                <span className="text-amber-500 font-bold">{serviceRating} / 5</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setServiceRating(r)}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      r === serviceRating ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {r}★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Written notes */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Written Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you enjoyed most or what we can refine..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-soft-md flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Restaurant Review</span>
          </button>
        </form>
      )}

      <div className="text-center pt-2 text-[10px] text-slate-400">
        AuraDine Mobile Web Order System
      </div>
    </div>
  );
};
