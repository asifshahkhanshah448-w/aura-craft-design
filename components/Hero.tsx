'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Database, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onOpenApiDocs: () => void;
  dbMode: string;
}

export default function Hero({ onExplore, onOpenApiDocs, dbMode }: HeroProps) {
  return (
    <section id="home" className="relative pt-4 sm:pt-6 pb-10 sm:pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle System Status strip */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] sm:text-xs text-stone-500 border-b border-stone-200/60 pb-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-medium text-stone-700">AURA Studio 2026</span>
            <span aria-hidden="true">·</span>
            <span>Architectural Furniture & Horology</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Express.js REST Architecture</span>
          </div>
          <button
            onClick={onOpenApiDocs}
            className="self-start sm:self-auto flex items-center gap-1.5 hover:text-stone-900 transition-colors cursor-pointer text-stone-600"
          >
            <Database className="w-3.5 h-3.5 text-stone-600" />
            <span className="font-mono text-[11px]">{dbMode}</span>
          </button>
        </div>

        {/* Hero Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900 leading-[1.15] mb-4 sm:mb-6 text-balance">
              Timeless European craftsmanship, engineered for quiet spaces.
            </h1>
            <p className="text-sm sm:text-lg text-stone-600 leading-relaxed mb-6 sm:mb-8 max-w-xl">
              Each piece is created in limited runs using FSC-certified solid oak, hand-stitched
              Italian leather, and acoustic neodymium drivers. Built with end-to-end REST APIs and
              server-validated order security.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-all shadow-sm"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-xs text-stone-500 flex items-center gap-2 justify-center sm:justify-start">
                <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
                <span>Cash on Delivery & Free shipping over $500</span>
              </div>
            </div>

            {/* Editorial Proof Strip */}
            <div className="pt-5 sm:pt-6 border-t border-stone-200 grid grid-cols-3 gap-2 sm:gap-4 text-left">
              <div>
                <span className="block text-lg sm:text-xl font-semibold text-stone-900 tabular-nums">100%</span>
                <span className="text-[10px] sm:text-xs text-stone-500">Solid White Oak</span>
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-semibold text-stone-900 tabular-nums">40h</span>
                <span className="text-[10px] sm:text-xs text-stone-500">Acoustic Reserve</span>
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-semibold text-stone-900 tabular-nums">2824</span>
                <span className="text-[10px] sm:text-xs text-stone-500">Swiss Automatic</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative rounded-lg overflow-hidden border border-stone-200/80 bg-stone-100 min-h-[240px] sm:min-h-[380px] lg:min-h-[460px]">
            <Image
              src="/images/hero_store.jpg"
              alt="AURA Craft Design Studio and Showroom"
              fill
              priority
              referrerPolicy="no-referrer"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-4 sm:p-6">
              <div className="text-stone-100 text-xs flex items-center gap-2">
                <span className="font-medium text-white">Studio Flagship</span>
                <span aria-hidden="true">·</span>
                <span>Copenhagen & London</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
