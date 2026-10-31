'use client';

import React from 'react';

interface FooterProps {
  onOpenApiDocs: () => void;
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenApiDocs, onOpenAdmin }: FooterProps) {
  return (
    <footer className="border-t border-stone-200 bg-white mt-16 sm:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <span className="text-base font-bold tracking-tight text-stone-900 uppercase block mb-3">
              AURA CRAFT & DESIGN
            </span>
            <p className="text-xs text-stone-500 max-w-sm leading-relaxed mb-4">
              Curated architectural objects, limited-edition European furniture, acoustic studio
              hardware, and horology. Built with Node.js, Express REST APIs, Mongoose, and JWT security.
            </p>
            <div className="text-xs text-stone-400">
              Copenhagen Flagship · London Studio · San Francisco Logistics
            </div>
          </div>

          {/* Architecture Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-3">
              Architecture & Stack
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button onClick={onOpenApiDocs} className="hover:text-stone-900 transition-colors">
                  API & DB Diagnostics
                </button>
              </li>
              <li>
                <a
                  href="/vanilla-frontend/index.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-stone-900 transition-colors"
                >
                  Vanilla JS Frontend ↗
                </a>
              </li>
              <li>
                <span className="text-stone-400">Node.js + Express REST API</span>
              </li>
              <li>
                <span className="text-stone-400">MongoDB Atlas + Mongoose</span>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-3">
              Fulfillment & Security
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button onClick={onOpenAdmin} className="hover:text-stone-900 transition-colors">
                  Admin Order Management
                </button>
              </li>
              <li>
                <span className="text-stone-500">Cash on Delivery (COD)</span>
              </li>
              <li>
                <span className="text-stone-500">Bcrypt Password Hashing</span>
              </li>
              <li>
                <span className="text-stone-500">Server-Side Stock Validation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>&copy; {new Date().getFullYear()} AURA Craft & Design Inc. All rights reserved.</p>
          <p>Full-Stack Developer Internship Submission · Production-Grade Architecture</p>
        </div>
      </div>
    </footer>
  );
}
