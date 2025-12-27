'use client';

import React, { useState, useEffect } from 'react';
import { DataService } from '@/lib/dataService';
import { ProductUtils } from '@/lib/productUtils';
import { Product } from '@/types/product';
import Header from '@/components/Header';
import ErrorBanner from '@/components/ErrorBanner';
import HeroSection from '@/components/HeroSection';
import CategoryNav from '@/components/CategoryNav';
import SearchAndFilter from '@/components/SearchAndFilter';
import ProductsGrid from '@/components/ProductsGrid';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Page: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await DataService.fetchFromGoogleSheets();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError((err as Error).message);
      setProducts(DataService.getDemoData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedSubcategory('All');
  }, [selectedCategory]);

  // Scroll to product if stored in sessionStorage (from back navigation)
  useEffect(() => {
    if (typeof window !== 'undefined' && !loading && products.length > 0) {
      const scrollToProductId = sessionStorage.getItem('scrollToProduct');
      if (scrollToProductId) {
        // Clear the sessionStorage immediately
        sessionStorage.removeItem('scrollToProduct');

        const element = document.getElementById(`product-${scrollToProductId}`);
        if (element) {
          // Small delay to ensure DOM is fully rendered
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            // Update URL hash to reflect current position
            window.history.replaceState(null, '', `#product-${scrollToProductId}`);
            // Optional: Highlight the product briefly
            element.classList.add('ring-4', 'ring-amber-400', 'ring-opacity-50');
            setTimeout(() => {
              element.classList.remove('ring-4', 'ring-amber-400', 'ring-opacity-50');
            }, 2000);
          }, 100);
        }
      }
    }
  }, [loading, products]);

  const categories = ProductUtils.getUniqueCategories(products);
  const subcategories = ProductUtils.getSubcategories(products, selectedCategory);
  const filteredProducts = ProductUtils.filterProducts(
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory
  );
  const sortedProducts = ProductUtils.sortProducts(filteredProducts, sortBy);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header onRefresh={fetchProducts} isLoading={loading} />
      <ErrorBanner error={error} />
      <HeroSection />
      <CategoryNav 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        subcategories={subcategories}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={setSelectedSubcategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <ProductsGrid
        products={sortedProducts}
        loading={loading}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
      />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Page;
