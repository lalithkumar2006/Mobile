import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState(CATEGORIES.filter(c => c.id !== 'all'));
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategories(prev => [
      ...prev,
      {
        id: newCatName.toLowerCase().replace(/\s+/g, '-'),
        name: newCatName.trim(),
        icon: 'Sparkles',
        itemCount: 0
      }
    ]);
    setNewCatName('');
  };

  const handleDelete = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Categories Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize customer menu categories, course ordering, and navigation hierarchy.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm max-w-xl">
        <h3 className="text-xs font-bold text-slate-800 mb-2">Create New Category</h3>
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Artisanal Breads, Mocktails, Soups..."
            className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                0{idx + 1}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{cat.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{cat.itemCount} items listed</p>
              </div>
            </div>

            <button
              onClick={() => handleDelete(cat.id)}
              className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
