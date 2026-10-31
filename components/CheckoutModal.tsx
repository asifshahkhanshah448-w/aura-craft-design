'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, AlertCircle, Loader2 } from 'lucide-react';
import { ICartItem, IOrder } from '@/lib/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ICartItem[];
  authToken: string | null;
  onOrderSuccess: (order: IOrder) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  authToken,
  onOrderSuccess,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Credit / Debit Card'>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<IOrder | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customerName,
          phone,
          deliveryAddress: { street, city, postalCode },
          items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order.');
      }

      setCompletedOrder(data.order);
      onOrderSuccess(data.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during checkout.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              {completedOrder ? 'Order Confirmation' : 'Delivery & Payment'}
            </h2>
            <p className="text-xs text-stone-500">
              {completedOrder ? 'Receipt and tracking information' : 'Direct shipment from Copenhagen archives'}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          /* Receipt / Confirmation Screen */
          <div className="p-6 sm:p-8 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-semibold text-stone-900 mb-1">
              Order Confirmed & Placed
            </h3>
            <p className="text-xs text-stone-600 mb-6">
              Thank you, {completedOrder.customerName}. Your order reference is{' '}
              <span className="font-mono font-semibold text-stone-900">{completedOrder.orderId}</span>.
            </p>

            <div className="bg-stone-50 rounded-lg p-5 border border-stone-200 text-left mb-6 text-xs space-y-3">
              <div className="flex justify-between border-b border-stone-200 pb-2 font-medium text-stone-700">
                <span>Shipping Address</span>
                <span className="text-stone-900 text-right">
                  {completedOrder.deliveryAddress.street}, {completedOrder.deliveryAddress.city} {completedOrder.deliveryAddress.postalCode}
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2 text-stone-600">
                <span>Contact Phone</span>
                <span className="text-stone-900 font-medium">{completedOrder.phone}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2 text-stone-600">
                <span>Payment Method</span>
                <span className="text-stone-900 font-semibold">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2 text-stone-600">
                <span>Status</span>
                <span className="font-semibold text-amber-800">{completedOrder.orderStatus}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-semibold text-stone-900">
                <span>Total Amount Due</span>
                <span className="tabular-nums">${completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-stone-500 mb-6">
              A courier will contact your phone prior to dispatch. Please have exact cash ready if paying upon delivery.
            </p>

            <button
              onClick={handleResetAndClose}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors"
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {errorMessage && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Jane Sterling"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Mobile Phone Number (for delivery verification) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 723-9012"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Street Address & Apartment *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="72 Nordic Way, Apt 4"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Seattle"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="98101"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6 border-t border-stone-200 pt-5">
              <label className="block text-xs font-medium text-stone-800 mb-2">
                Payment Option
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`border rounded-lg p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-0.5 text-stone-900 focus:ring-stone-900"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-stone-900">
                      Cash on Delivery
                    </span>
                    <span className="block text-[11px] text-stone-500 mt-0.5">
                      Pay cash upon doorstep delivery. No advance payment needed.
                    </span>
                  </div>
                </label>

                <label
                  className={`border rounded-lg p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    paymentMethod === 'Credit / Debit Card'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit / Debit Card"
                    checked={paymentMethod === 'Credit / Debit Card'}
                    onChange={() => setPaymentMethod('Credit / Debit Card')}
                    className="mt-0.5 text-stone-900 focus:ring-stone-900"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-stone-900">
                      Credit / Debit Card
                    </span>
                    <span className="block text-[11px] text-stone-500 mt-0.5">
                      Simulated secure electronic gateway check.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary strip */}
            <div className="bg-stone-50 rounded p-4 mb-6 text-xs space-y-1.5 border border-stone-200">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span className="tabular-nums font-medium text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="tabular-nums font-medium text-stone-900">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Estimated Tax (8%)</span>
                <span className="tabular-nums font-medium text-stone-900">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-semibold text-stone-900">
                <span>Order Total</span>
                <span className="tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust Notice */}
            <div className="flex items-center gap-4 text-[11px] text-stone-500 mb-6">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-stone-700" />
                Dispatch within 24 business hours
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                Server-side verified pricing & stock
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying & Placing...</span>
                  </>
                ) : (
                  <span>Place Order (${total.toFixed(2)})</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
