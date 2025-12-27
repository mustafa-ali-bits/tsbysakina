import { Product } from '../types/product';

export const ProductUtils = {
  getDiscountPercentage(mrp: number, price: number): number {
    return Math.round(((mrp - price) / mrp) * 100);
  },

  getSavingsAmount(mrp: number, price: number): string {
    return (mrp - price).toFixed(2);
  },

  getUniqueCategories(products: Product[]): string[] {
    return ['All', ...Array.from(new Set(products.map(p => p.category)))];
  },

  getSubcategories(products: Product[], category: string): string[] {
    if (category === 'All') return ['All'];
    const subs = products
      .filter(p => p.category === category)
      .map(p => p.subcategory);
    return ['All', ...Array.from(new Set(subs))];
  },

  filterProducts(products: Product[], searchTerm: string, selectedCategory: string, selectedSubcategory: string): Product[] {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'All' || product.subcategory === selectedSubcategory;
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  },

  sortProducts(products: Product[], sortBy: string): Product[] {
    const sortedProducts = [...products];

    switch (sortBy) {
      case 'price-low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'discount':
        return sortedProducts.sort((a, b) => {
          const discountA = this.getDiscountPercentage(a.mrp, a.price);
          const discountB = this.getDiscountPercentage(b.mrp, b.price);
          return discountB - discountA;
        });
      case 'rating':
        return sortedProducts.sort((a, b) => b.rating - a.rating);
      default:
        return sortedProducts;
    }
  }
};
