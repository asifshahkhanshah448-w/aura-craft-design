'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Package, Clock, Truck, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { IOrder, OrderStatus } from '@/lib/types';
import { getValidImageUrl, FALLBACK_PRODUCT_IMAGE } from '@/lib/imageFallback';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  authToken: string | null;
  onRequireAuth: () => void;
}

function OrderItemThumbnail({ src, alt }: { src: string; alt: string }) {
  const [currentSrc, setCurrentSrc] = useState(() => getValidImageUrl(src));
  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      referrerPolicy="no-referrer"
      className="object-cover"
      sizes="40px"
      onError={() => {
        if (currentSrc !== FALLBACK_PRODUCT_IMAGE) {
          setCurrentSrc(FALLBACK_PRODUCT_IMAGE);
        }
      }}
    />
  );
}

export default function OrderHistoryModal({
  isOpen,
  onClose,
  authToken,
  onRequireAuth,
}: OrderHistoryModalProps) {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (isOpen && authToken) {
      const load = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
          const res = await fetch('/api/orders/user', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const data = await res.json();
          if (!cancelled) {
            if (res.ok && data.success) {
              setOrders(data.orders || []);
            } else {
              setErrorMessage(data.message || 'Failed to load order history.');
            }
          }
        } catch {
          if (!cancelled) {
            setErrorMessage('Network error loading orders.');
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };
      load();
    }
    return () => {
      cancelled = true;
    };
  }, [isOpen, authToken]);

  if (!isOpen) return null;

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
            <RefreshCw className="w-3 h-3" />
            Processing in Workshop
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
            <Truck className="w-3 h-3" />
            Shipped with Courier
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden my-3 sm:my-6 max-h-[92vh] sm:max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/60 shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-stone-700" />
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-900">
              Your Order History
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close order history"
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {!authToken ? (
            <div className="text-center py-10 sm:py-12">
              <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-stone-900 mb-1">Sign In to Track Orders</h3>
              <p className="text-xs text-stone-500 mb-4 max-w-xs mx-auto">
                Please authenticate to view your verified orders and shipment tracking details.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onRequireAuth();
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Sign In Now
              </button>
            </div>
          ) : isLoading ? (
            <div className="py-12 text-center text-xs text-stone-500">
              Loading your verified orders...
            </div>
          ) : errorMessage ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 sm:py-12">
              <p className="text-sm font-medium text-stone-900 mb-1">No Orders Yet</p>
              <p className="text-xs text-stone-500 mb-4">
                You have not placed any orders with this account yet.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-900 border border-stone-300 rounded-md hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="space-y-3.5 sm:space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-stone-200 rounded-lg p-3.5 sm:p-5 bg-stone-50/40 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-2.5 mb-2.5 sm:pb-3 sm:mb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-stone-900">
                        {order.orderId}
                      </span>
                      <span className="text-[11px] text-stone-400 ml-2">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div>{renderStatusBadge(order.orderStatus)}</div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 mb-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 sm:gap-3">
                        <div className="relative w-10 h-10 bg-stone-200 rounded overflow-hidden shrink-0">
                          <OrderItemThumbnail
                            src={item.imageUrl}
                            alt={item.name}
                          />
                        </div>
                        <div className="flex-grow text-xs min-w-0">
                          <span className="font-medium text-stone-900 block truncate">{item.name}</span>
                          <span className="text-stone-500 tabular-nums text-[11px]">
                            Qty: {item.quantity} · ${item.price.toFixed(2)} each
                          </span>
                        </div>
                        <span className="text-xs font-semibold tabular-nums text-stone-900 shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Payment note */}
                  <div className="pt-2.5 sm:pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-500 gap-1.5 sm:gap-2">
                    <span className="truncate">
                      Delivery: {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    </span>
                    <span className="font-semibold text-stone-900 tabular-nums shrink-0">
                      Total: ${order.total.toFixed(2)} ({order.paymentMethod})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
