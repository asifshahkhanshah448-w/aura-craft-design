'use client';

import React from 'react';
import { ShoppingBag, User, ShieldCheck, LogOut, Package } from 'lucide-react';
import { IUser } from '@/lib/types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currentUser: IUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onOpenApiDocs: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenOrders,
  onOpenAdmin,
  onOpenApiDocs,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#home"
          className="text-lg font-bold tracking-tight text-stone-900 uppercase whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          AURA CRAFT
        </a>

        {/* Zone 2: Navigation Links (Single-line, 4-5 items) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a href="#catalog" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
            Catalog
          </a>
          <a href="#craftsmanship" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
            Craftsmanship
          </a>
          <button
            onClick={onOpenOrders}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-800 font-semibold"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          )}
          <button
            onClick={onOpenApiDocs}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 text-xs px-2 py-0.5 rounded border border-stone-300 text-stone-500 hover:border-stone-500"
          >
            API & DB Status
          </button>
        </nav>

        {/* Zone 3: Actions (Auth & Bag) */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs text-stone-600 font-medium">
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={onOpenCart}
            aria-label="View shopping bag"
            className="relative inline-flex items-center justify-center p-2 text-stone-900 bg-stone-900 text-stone-50 rounded-md hover:bg-stone-800 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center tabular-nums shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
