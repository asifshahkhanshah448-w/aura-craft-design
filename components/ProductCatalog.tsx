'use client';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { IProduct } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductCatalogProps {
  products: IProduct[];
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onAddToCart: (product: IProduct) => void;
  onSelectProduct: (product: IProduct) => void;
  isLoading: boolean;
}

export default function ProductCatalog({
  products,
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onAddToCart,
  onSelectProduct,
  isLoading,
}: ProductCatalogProps) {
  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-stone-500 font-medium block mb-1">
            Curated Catalog
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
            Design Objects & Living Editions
          </h2>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-grow sm:flex-grow-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or material..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 text-stone-900 placeholder:text-stone-400"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-md px-2.5 py-1.5 text-xs text-stone-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-medium text-stone-900"
            >
              <option value="newest">Featured / Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Category Segmented Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-lg max-w-fit mb-8 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat === 'all' ? 'All Objects' : cat}
            </button>
          );
        })}
      </div>

      {/* Grid Container */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-stone-100 rounded-lg aspect-[4/3] animate-pulse border border-stone-200"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-stone-200 rounded-lg bg-stone-50">
          <p className="text-sm text-stone-600 mb-2">No objects match your current filter.</p>
          <button
            onClick={() => {
              onSelectCategory('all');
              onSearchChange('');
            }}
            className="text-xs text-stone-900 underline font-medium hover:text-stone-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
}
