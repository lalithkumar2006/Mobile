import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';
import { CATEGORIES } from '../../data/mockData';

export const FoodMenuManagement: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'mains',
    price: '',
    description: '',
    image: '',
    isVeg: true,
    isRecommended: false,
    calories: '450 kcal',
    preparationTime: '15 min'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'mains',
      price: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
      isVeg: true,
      isRecommended: false,
      calories: '450 kcal',
      preparationTime: '15 min'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      image: item.image,
      isVeg: item.isVeg,
      isRecommended: item.isRecommended || false,
      calories: item.calories || '450 kcal',
      preparationTime: item.preparationTime || '15 min'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        image: formData.image,
        isVeg: formData.isVeg,
        isRecommended: formData.isRecommended,
        calories: formData.calories,
        preparationTime: formData.preparationTime
      });
    } else {
      const newItem: MenuItem = {
        id: `dish-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
        isVeg: formData.isVeg,
        isRecommended: formData.isRecommended,
        calories: formData.calories,
        preparationTime: formData.preparationTime,
        rating: 4.8,
        reviewsCount: 1
      };
      addMenuItem(newItem);
    }
    setIsModalOpen(false);
  };

  const filteredItems = menuItems.filter(item => {
    const matchCat = selectedCat === 'all' || item.category === selectedCat;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Food Menu Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dishes, pricing, dietary indicators, descriptions, and chef recommendations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-soft-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                selectedCat === cat.id
                  ? 'bg-brand-navy text-white shadow-soft-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu item..."
            className="pl-9 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map(dish => (
          <div
            key={dish.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-soft-sm flex flex-col justify-between hover:shadow-soft-md transition-all"
          >
            <div>
              <div className="relative h-36 bg-slate-100">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-0.5 bg-white ${
                    dish.isVeg ? 'border-emerald-600' : 'border-rose-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                  </span>
                  {dish.isRecommended && (
                    <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[9px] font-bold">
                      Recommended
                    </span>
                  )}
                </div>

                <span className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-xs font-black">
                  ${dish.price.toFixed(2)}
                </span>
              </div>

              <div className="p-3.5">
                <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{dish.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{dish.description}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                  <span className="capitalize font-semibold text-blue-600">{dish.category}</span>
                  <span>• {dish.preparationTime}</span>
                  <span>• {dish.calories}</span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(dish)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => deleteMenuItem(dish.id)}
                className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 font-bold"
            >
              ✕
            </button>

            <h3 className="text-base font-extrabold text-slate-800 mb-4">
              {editingItem ? 'Edit Dish Details' : 'Add New Dish to Menu'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Truffle Mushroom Risotto"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 capitalize"
                  >
                    <option value="starters">Starters</option>
                    <option value="mains">Main Course</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="18.50"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients and culinary notes..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Vegetarian Dish</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isRecommended}
                    onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Mark Chef Recommended</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-soft-sm transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
