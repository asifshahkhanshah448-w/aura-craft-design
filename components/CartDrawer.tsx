'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { ICartItem } from '@/lib/types';
import { getValidImageUrl, FALLBACK_PRODUCT_IMAGE } from '@/lib/imageFallback';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: ICartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

function CartItemThumbnail({ src, alt }: { src: string; alt: string }) {
  const [currentSrc, setCurrentSrc] = useState(() => getValidImageUrl(src));
  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      referrerPolicy="no-referrer"
      className="object-cover"
      sizes="72px"
      onError={() => {
        if (currentSrc !== FALLBACK_PRODUCT_IMAGE) {
          setCurrentSrc(FALLBACK_PRODUCT_IMAGE);
        }
      }}
    />
  );
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-stone-700" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-grow overflow-y-auto p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-stone-300 mb-3" />
                <p className="text-sm font-medium text-stone-900 mb-1">Your bag is empty</p>
                <p className="text-xs text-stone-500 mb-6 max-w-xs">
                  Explore our collection of handcrafted objects and furniture to add items.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-900 border border-stone-300 rounded-md hover:bg-stone-50 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product._id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-18 h-18 bg-stone-100 rounded border border-stone-200 overflow-hidden shrink-0">
                    <CartItemThumbnail
                      src={item.product.imageUrl}
                      alt={item.product.name}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product._id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">
                        {item.product.category}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-200 rounded bg-stone-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product._id, -1)}
                          className="p-1 text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold tabular-nums text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product._id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-stone-900 tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/50">
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-medium tabular-nums text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Standard Insured Shipping</span>
                  <span className="font-medium tabular-nums text-stone-900">
                    {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-semibold text-stone-900">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
