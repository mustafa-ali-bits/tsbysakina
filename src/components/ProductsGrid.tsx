'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Product } from '../types/product';
import ProductCard from './ProductCard';

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
  selectedCategory: string;
  selectedSubcategory: string;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  loading,
  selectedCategory,
  selectedSubcategory
}) => {
  const getTitle = () => {
    if (selectedCategory === 'All') return 'All Products';
    if (selectedSubcategory === 'All') return selectedCategory;
    return `${selectedCategory} - ${selectedSubcategory}`;
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <RefreshCw className="w-12 h-12 text-amber-900 animate-spin mx-auto" />
            <p className="text-stone-600">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-amber-900">{getTitle()}</h2>
        <p className="text-stone-600 mt-2">
          Showing {products.length} handcrafted delights
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-stone-500 text-lg">No products found matching your filters.</p>
        </div>
      )}
    </main>
  );
};

export default ProductsGrid;
