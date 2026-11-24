import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Sparkles, 
  Star, 
  Plus, 
  Minus, 
  Clock, 
  UtensilsCrossed,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { MenuItem } from '../../types';

export const MenuScreen: React.FC = () => {
  const { currentTable, menuItems, cart, addToCart, updateQuantity } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [selectedDishDetail, setSelectedDishDetail] = useState<MenuItem | null>(null);
  const [specialInstruction, setSpecialInstruction] = useState<string>('');

  const navigate = useNavigate();

  const filteredDishes = useMemo(() => {
    return menuItems.filter(dish => {
      const matchCat = selectedCategory === 'all' || dish.category === selectedCategory;
      const matchSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiet = 
        filterType === 'all' ? true :
        filterType === 'veg' ? dish.isVeg :
        !dish.isVeg;

      return matchCat && matchSearch && matchDiet;
    });
  }, [menuItems, selectedCategory, searchQuery, filterType]);

  const recommendedDishes = useMemo(() => {
    return menuItems.filter(dish => dish.isRecommended);
  }, [menuItems]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

  const getItemCartQuantity = (dishId: string) => {
    const item = cart.find(ci => ci.dish.id === dishId);
    return item ? item.quantity : 0;
  };

  const handleOpenDishModal = (dish: MenuItem) => {
    setSelectedDishDetail(dish);
    const existing = cart.find(c => c.dish.id === dish.id);
    setSpecialInstruction(existing?.specialInstructions || '');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative pb-24">
      {/* Top App Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 pt-2 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">TABLE {currentTable}</span>
            </div>
            <h1 className="text-base font-extrabold text-brand-navy">
              Aura<span className="text-blue-600">Dine</span> Bistro
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/customer/scan')}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              Change Table
            </button>
            <button
              onClick={() => navigate('/customer/cart')}
              className="relative p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search our delicious dishes, drinks..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-transparent focus:border-blue-400 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Veg / Non-Veg quick filters */}
        <div className="flex items-center gap-2 mt-2.5 pt-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-full shrink-0 transition-all ${
              filterType === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilterType('veg')}
            className={`flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded-full shrink-0 transition-all ${
              filterType === 'veg'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 border border-white"></span>
            Pure Veg
          </button>
          <button
            onClick={() => setFilterType('non-veg')}
            className={`flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded-full shrink-0 transition-all ${
              filterType === 'non-veg'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 border border-white"></span>
            Non-Veg
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="px-4 py-2 bg-white border-b border-slate-100 sticky top-[138px] z-20 shadow-sm">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategory === category.id
                  ? 'bg-brand-navy text-white shadow-soft-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-5">
        {/* Recommended Carousel */}
        {!searchQuery && selectedCategory === 'all' && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                <h2 className="text-sm font-bold text-slate-800">Chef's Signature Specials</h2>
              </div>
              <span className="text-[11px] text-blue-600 font-medium">Popular Now</span>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {recommendedDishes.slice(0, 5).map(dish => {
                const qty = getItemCartQuantity(dish.id);
                return (
                  <div
                    key={`rec-${dish.id}`}
                    className="w-48 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-soft-sm shrink-0 flex flex-col justify-between"
                  >
                    <div 
                      className="relative h-28 cursor-pointer group overflow-hidden"
                      onClick={() => handleOpenDishModal(dish)}
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-800 shadow-sm">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{dish.rating}</span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-0.5 ${
                          dish.isVeg ? 'border-emerald-600 bg-white' : 'border-rose-600 bg-white'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 
                          className="text-xs font-bold text-slate-800 line-clamp-1 cursor-pointer hover:text-blue-600"
                          onClick={() => handleOpenDishModal(dish)}
                        >
                          {dish.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{dish.description}</p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-brand-navy">${dish.price.toFixed(2)}</span>
                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(dish, 1)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-0.5 shadow-sm active:scale-95 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-lg border border-blue-200">
                            <button
                              onClick={() => updateQuantity(dish.id, qty - 1)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white rounded"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-xs font-bold w-3 text-center">{qty}</span>
                            <button
                              onClick={() => updateQuantity(dish.id, qty + 1)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white rounded"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Menu Items List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800 capitalize">
              {selectedCategory === 'all' ? 'All Menu Items' : selectedCategory} ({filteredDishes.length})
            </h2>
          </div>

          {filteredDishes.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 p-6">
              <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No dishes found</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching for other words or reset filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDishes.map(dish => {
                const qty = getItemCartQuantity(dish.id);
                return (
                  <div
                    key={dish.id}
                    className="bg-white rounded-2xl p-3 border border-slate-100 shadow-soft-sm flex gap-3 hover:border-slate-200 transition-all"
                  >
                    {/* Dish Image */}
                    <div 
                      className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer bg-slate-100"
                      onClick={() => handleOpenDishModal(dish)}
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {dish.isRecommended && (
                        <div className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          CHEF'S PICK
                        </div>
                      )}
                    </div>

                    {/* Dish Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-0.5 shrink-0 ${
                              dish.isVeg ? 'border-emerald-600 bg-white' : 'border-rose-600 bg-white'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                            </span>
                            <h3 
                              className="text-xs font-bold text-slate-800 truncate cursor-pointer hover:text-blue-600"
                              onClick={() => handleOpenDishModal(dish)}
                            >
                              {dish.name}
                            </h3>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                          {dish.description}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                          {dish.preparationTime && (
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {dish.preparationTime}
                            </span>
                          )}
                          {dish.calories && <span>• {dish.calories}</span>}
                          {dish.rating && (
                            <span className="flex items-center gap-0.5 text-amber-600 font-medium ml-auto">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              {dish.rating}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing and Add to cart */}
                      <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-sm font-black text-brand-navy">
                          ${dish.price.toFixed(2)}
                        </span>

                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(dish, 1)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-2 py-1 rounded-xl border border-blue-200">
                            <button
                              onClick={() => updateQuantity(dish.id, qty - 1)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white rounded transition-colors"
                            >
                              <Minus className="w-3 h-3 text-blue-700" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{qty}</span>
                            <button
                              onClick={() => updateQuantity(dish.id, qty + 1)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white rounded transition-colors"
                            >
                              <Plus className="w-3 h-3 text-blue-700" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-3 inset-x-4 max-w-[380px] mx-auto z-40 animate-in slide-in-from-bottom duration-300">
          <div className="bg-brand-navy text-white rounded-2xl p-3 shadow-soft-lg flex items-center justify-between border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xs">
                {totalCartCount}
              </div>
              <div>
                <p className="text-[11px] text-slate-300 font-medium">Cart Subtotal</p>
                <p className="text-sm font-extrabold text-white">${totalCartPrice.toFixed(2)}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/customer/cart')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md transition-all active:scale-95"
            >
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Dish Detail Modal */}
      {selectedDishDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div 
            className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 bg-slate-900">
              <img
                src={selectedDishDetail.image}
                alt={selectedDishDetail.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedDishDetail(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center font-bold text-sm hover:bg-slate-900 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-2 left-3 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedDishDetail.isVeg ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {selectedDishDetail.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
                {selectedDishDetail.isRecommended && (
                  <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold">
                    Signature
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">{selectedDishDetail.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {selectedDishDetail.rating} ({selectedDishDetail.reviewsCount} reviews)
                    </span>
                    <span>• {selectedDishDetail.preparationTime}</span>
                  </div>
                </div>
                <span className="text-base font-black text-brand-navy">
                  ${selectedDishDetail.price.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {selectedDishDetail.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Special Cooking Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstruction}
                  onChange={(e) => setSpecialInstruction(e.target.value)}
                  placeholder="e.g. Less spicy, dressing on the side..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => {
                  addToCart(selectedDishDetail, 1, specialInstruction);
                  setSelectedDishDetail(null);
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart (${selectedDishDetail.price.toFixed(2)})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
