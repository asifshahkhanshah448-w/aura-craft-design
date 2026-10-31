'use client';

import React, { useEffect, useState } from 'react';
import { X, Server, Database, CheckCircle, Code, Shield } from 'lucide-react';

interface ApiDocDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiDocDrawer({ isOpen, onClose }: ApiDocDrawerProps) {
  const [healthData, setHealthData] = useState<{
    database?: { isConnected: boolean; mode: string; message: string; host: string };
    metrics?: { totalProducts: number; totalOrders: number };
    version?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/health')
        .then((res) => res.json())
        .then((data) => setHealthData(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-stone-200">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-stone-800" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                System & REST API Health
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6 text-xs text-stone-700">
            {/* Real Connection Status */}
            <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
              <div className="flex items-center gap-2 font-semibold text-stone-900 mb-2">
                <Database className="w-4 h-4 text-stone-700" />
                <span>Mongoose & MongoDB Atlas Status</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-500">Live Atlas Connected:</span>
                  <span className="font-semibold text-stone-800">
                    {healthData?.database?.isConnected ? 'Yes (Live Atlas)' : 'No (Local Fallback)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Active Storage Engine:</span>
                  <span className="font-mono text-stone-900">{healthData?.database?.mode || 'local_store'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Connection Host:</span>
                  <span className="font-mono text-stone-900">{healthData?.database?.host || 'Sandbox In-Memory'}</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-stone-500 leading-relaxed border-t border-stone-200 pt-2">
                {healthData?.database?.message}
              </p>
            </div>

            {/* REST API Endpoints Table */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-stone-700" />
                Implemented REST Endpoints
              </h3>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-2 bg-stone-50 border border-stone-200 rounded flex justify-between">
                  <span className="font-bold text-emerald-700">POST</span>
                  <span className="text-stone-900">/api/auth/register</span>
                  <span className="text-stone-400">Public</span>
                </div>
                <div className="p-2 bg-stone-50 border border-stone-200 rounded flex justify-between">
                  <span className="font-bold text-emerald-700">POST</span>
                  <span className="text-stone-900">/api/auth/login</span>
                  <span className="text-stone-400">Public</span>
                </div>
                <div className="p-2 bg-stone-50 border border-stone-200 rounded flex justify-between">
                  <span className="font-bold text-blue-700">GET</span>
                  <span className="text-stone-900">/api/auth/me</span>
                  <span className="text-amber-800 font-semibold">JWT Bearer</span>
                </div>
                <div className="p-2 bg-stone-50 border border-stone-200 rounded flex justify-between">
                  <span className="font-bold text-blue-700">GET</span>
                  <span className="text-stone-900">/api/products</span>
                  <span className="text-stone-400">Public</span>
                </div>
                <div className="p-2 bg-stone-50 border border-stone-200 rounded flex justify-between">
                  <span className="font-bold text-emerald-700">POST</span>
                  <span className="text-stone-900">/api/products</span>
                  <span className="text-rose-700 font-semibold">Admin</span>
                </div>
                <div className="p-2 bg-stone-50 border border-stone-200 rounded flex justify-between">
                  <span className="font-bold text-emerald-700">POST</span>
                  <span className="text-stone-900">/api/orders</span>
                  <span className="text-stone-400">Public/Auth</span>
                </div>
                <div className="p-2 bg-stone-50 border border-stone-200 rounded flex justify-between">
                  <span className="font-bold text-blue-700">GET</span>
                  <span className="text-stone-900">/api/orders/my-orders</span>
                  <span className="text-amber-800 font-semibold">Customer</span>
                </div>
                <div className="p-2 bg-stone-50 border border-stone-200 rounded flex justify-between">
                  <span className="font-bold text-amber-700">PUT</span>
                  <span className="text-stone-900">/api/orders/:id/status</span>
                  <span className="text-rose-700 font-semibold">Admin</span>
                </div>
              </div>
            </div>

            {/* Vanilla JS Frontend Link */}
            <div className="border border-stone-200 rounded-lg p-4 bg-white">
              <h4 className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-stone-800" />
                Standalone Vanilla HTML5/CSS/JS Client
              </h4>
              <p className="text-stone-500 text-[11px] mb-3">
                Included in <code className="font-mono bg-stone-100 px-1">/public/vanilla-frontend</code> without external React dependencies.
              </p>
              <a
                href="/vanilla-frontend/index.html"
                target="_blank"
                rel="noreferrer"
                className="inline-block px-3 py-1.5 text-[11px] font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 transition-colors"
              >
                Open Vanilla JS Client ↗
              </a>
            </div>

            {/* Credentials quick copy */}
            <div className="border border-stone-200 rounded-lg p-4 bg-stone-50 text-[11px]">
              <div className="flex items-center gap-1.5 font-semibold text-stone-900 mb-2">
                <Shield className="w-3.5 h-3.5 text-stone-700" />
                <span>Internship Evaluation Accounts</span>
              </div>
              <div className="space-y-1 font-mono text-stone-700">
                <div>Admin: <strong>admin@auracraft.com</strong> / <strong>admin123456</strong></div>
                <div>Customer: <strong>jane@example.com</strong> / <strong>customer123</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
