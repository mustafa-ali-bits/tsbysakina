import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  subcategories: string[];
  selectedSubcategory: string;
  onSelectSubcategory: (subcategory: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
  sortBy,
  onSortChange
}) => {
  return (
    <section id="products" className="bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-3 w-full max-w-4xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for chocolates..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-full focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <div className="relative w-1/5 min-w-[140px]">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none w-full pl-10 pr-8 py-3 bg-white border border-stone-200 rounded-full focus:ring-2 focus:ring-amber-900 focus:border-transparent transition-all text-sm"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Discount</option>
                <option value="rating">Rating</option>
              </select>
              <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {selectedCategory !== 'All' && subcategories.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-stone-600 self-center font-medium mr-2">Filter by:</span>
              {subcategories.map(subcategory => (
                <button
                  key={subcategory}
                  onClick={() => onSelectSubcategory(subcategory)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedSubcategory === subcategory
                      ? 'bg-amber-800 text-white shadow-md'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilter;
