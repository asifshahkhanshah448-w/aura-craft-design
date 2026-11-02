'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Check, Star, ShieldCheck, Truck } from 'lucide-react';
import { IProduct } from '@/lib/types';
import { getValidImageUrl, FALLBACK_PRODUCT_IMAGE } from '@/lib/imageFallback';

interface ProductDetailModalProps {
  product: IProduct | null;
  onClose: () => void;
  onAddToCart: (product: IProduct, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [qty, setQty] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!product) return null;

  const displaySrc =
    failedUrl === product.imageUrl
      ? FALLBACK_PRODUCT_IMAGE
      : getValidImageUrl(product.imageUrl);

  const isOutOfStock = product.stock <= 0;
  const maxAvailable = product.stock;

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, qty);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6">
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full border border-stone-200 overflow-hidden my-3 sm:my-6 max-h-[92vh] flex flex-col md:grid md:grid-cols-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 text-stone-500 hover:text-stone-900 bg-white/90 rounded-full hover:bg-stone-100 transition-colors shadow-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-[4/3] sm:aspect-square md:aspect-auto min-h-[220px] sm:min-h-[280px] md:min-h-full w-full bg-stone-100 shrink-0">
          <Image
            src={displaySrc}
            alt={product.name}
            fill
            referrerPolicy="no-referrer"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setFailedUrl(product.imageUrl)}
          />
        </div>

        {/* Details & Specifications (scrollable if screen is short) */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="uppercase tracking-wider font-medium text-stone-600">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-stone-700">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-medium tabular-nums">{product.rating?.average || 4.9}</span>
                <span className="text-stone-400">({product.rating?.count || 18} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-2xl font-semibold text-stone-900 mb-2">
              {product.name}
            </h2>

            {/* Price */}
            <div className="text-xl sm:text-2xl font-semibold text-stone-900 tabular-nums mb-3 sm:mb-4">
              ${product.price.toFixed(2)}
            </div>

            {/* Stock status indicator */}
            <div className="text-xs text-stone-600 mb-4 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  product.stock > 5
                    ? 'bg-emerald-600'
                    : product.stock > 0
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                }`}
              />
              <span className="truncate">
                {product.stock > 0
                  ? `${product.stock} units available in Copenhagen archive`
                  : 'Currently out of stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5 sm:mb-6">
              {product.description}
            </p>

            {/* Material / Specs Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border-t border-b border-stone-100 py-3 mb-5 sm:mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                  Object Specifications
                </span>
                <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1.5 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-stone-400 text-[10px] sm:text-[11px]">{key}</span>
                      <span className="text-stone-800 font-medium truncate">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Purchase Row */}
          <div className="pt-2">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 shrink-0">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                  className="p-2 sm:p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 sm:w-8 text-center text-xs font-semibold tabular-nums text-stone-900">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(maxAvailable, q + 1))}
                  disabled={qty >= maxAvailable}
                  aria-label="Increase quantity"
                  className="p-2 sm:p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`flex-grow inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[42px] cursor-pointer ${
                  addedNotice
                    ? 'bg-emerald-700 text-white'
                    : isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Sold Out</span>
                ) : (
                  <>
                    <span>Add to Bag</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">${(product.price * qty).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-400" />
                <span>Express courier</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                <span>Authentic workshop origin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
