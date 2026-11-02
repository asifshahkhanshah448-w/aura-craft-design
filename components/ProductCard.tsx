'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { IProduct } from '@/lib/types';
import { getValidImageUrl, FALLBACK_PRODUCT_IMAGE } from '@/lib/imageFallback';

interface ProductCardProps {
  product: IProduct;
  onAddToCart: (product: IProduct) => void;
  onSelect: (product: IProduct) => void;
}

export default function ProductCard({ product, onAddToCart, onSelect }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const displaySrc =
    failedUrl === product.imageUrl
      ? FALLBACK_PRODUCT_IMAGE
      : getValidImageUrl(product.imageUrl);

  return (
    <article className="group bg-white rounded-lg border border-stone-200/90 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-stone-300">
      {/* Product Image Area */}
      <div
        onClick={() => onSelect(product)}
        className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden cursor-pointer"
      >
        <Image
          src={displaySrc}
          alt={product.name}
          fill
          referrerPolicy="no-referrer"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setFailedUrl(product.imageUrl)}
        />

        {/* Subtle single status indicator if low stock or out of stock */}
        {isOutOfStock ? (
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-stone-900/80 backdrop-blur-sm text-stone-100 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded">
            Sold Out
          </div>
        ) : isLowStock ? (
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-amber-900/80 backdrop-blur-sm text-amber-50 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded">
            Only {product.stock} left
          </div>
        ) : null}
      </div>

      {/* Product Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Unboxed Metadata */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-500 mb-1.5 sm:mb-2">
          <span className="uppercase tracking-wider font-medium text-stone-600">
            {product.category}
          </span>
          <span aria-hidden="true">·</span>
          <span>{product.stock > 0 ? `${product.stock} in stock` : 'Awaiting restock'}</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(product)}
          className="text-sm sm:text-base font-semibold text-stone-900 line-clamp-1 mb-1.5 sm:mb-2 hover:text-stone-700 cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3 sm:mb-4 flex-grow">
          {product.description}
        </p>

        {/* Footer: Price & Add to Bag */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 sm:gap-3">
          <div className="text-sm sm:text-base font-semibold text-stone-900 tabular-nums">
            ${product.price.toFixed(2)}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 min-h-[36px] rounded-md text-xs font-medium transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
