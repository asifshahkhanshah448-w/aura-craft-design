'use client';

import React, { useState } from 'react';
import { ShoppingBag, User, ShieldCheck, LogOut, Package, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          className="text-base sm:text-lg font-bold tracking-tight text-stone-900 uppercase whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          AURA CRAFT
        </a>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a href="#catalog" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
            Catalog
          </a>
          <a href="#craftsmanship" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
            Craftsmanship
          </a>
          <button
            onClick={onOpenOrders}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-800 font-semibold cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          )}
          <button
            onClick={onOpenApiDocs}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 text-xs px-2 py-0.5 rounded border border-stone-300 text-stone-500 hover:border-stone-500 cursor-pointer"
          >
            API & DB Status
          </button>
        </nav>

        {/* Zone 3: Actions (Auth, Bag, Mobile Toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="hidden sm:inline-block text-xs text-stone-600 font-medium truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 sm:p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 px-2 sm:px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
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

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors md:hidden ml-1"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer / Accordion */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-5 space-y-2.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <a
            href="#catalog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 hover:text-stone-900 py-2 border-b border-stone-200/70"
          >
            Catalog
          </a>
          <a
            href="#craftsmanship"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 hover:text-stone-900 py-2 border-b border-stone-200/70"
          >
            Craftsmanship
          </a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenOrders();
            }}
            className="w-full flex items-center justify-between text-sm font-medium text-stone-700 hover:text-stone-900 py-2 border-b border-stone-200/70 text-left"
          >
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4 text-stone-500" />
              <span>My Orders</span>
            </span>
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-between text-sm font-semibold text-amber-800 hover:text-amber-900 py-2 border-b border-stone-200/70 text-left"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Admin Portal</span>
              </span>
            </button>
          )}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenApiDocs();
            }}
            className="w-full flex items-center justify-between text-xs font-medium text-stone-600 hover:text-stone-900 py-2 text-left"
          >
            <span>API & DB Diagnostics</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-stone-300 text-stone-500">Live</span>
          </button>
        </div>
      )}
    </header>
  );
}
