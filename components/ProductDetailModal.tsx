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
    onAddToCart(product, qty);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full border border-stone-200 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="relative aspect-square md:aspect-auto w-full bg-stone-100">
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

          {/* Details & Specifications */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
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
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <div className="text-2xl font-semibold text-stone-900 tabular-nums mb-4">
                ${product.price.toFixed(2)}
              </div>

              {/* Stock status indicator */}
              <div className="text-xs text-stone-600 mb-4 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.stock > 5
                      ? 'bg-emerald-600'
                      : product.stock > 0
                      ? 'bg-amber-600'
                      : 'bg-rose-600'
                  }`}
                />
                <span>
                  {product.stock > 0
                    ? `${product.stock} units available in Copenhagen archive`
                    : 'Currently out of stock'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Material / Specs Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="border-t border-b border-stone-100 py-3 mb-6">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Object Specifications
                  </span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-stone-400 text-[11px]">{key}</span>
                        <span className="text-stone-800 font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Purchase Row */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold tabular-nums text-stone-900">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxAvailable, q + 1))}
                    disabled={qty >= maxAvailable}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`flex-grow inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-medium transition-all ${
                    addedNotice
                      ? 'bg-emerald-700 text-white'
                      : isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
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

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-3 border-t border-stone-100">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-600" />
                  Free delivery over $500
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                  Pay on delivery available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
