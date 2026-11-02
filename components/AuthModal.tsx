'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { IUser } from '@/lib/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string, user: IUser) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    executeLogin(demoEmail, demoPass);
  };

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid credentials.');
      }

      onAuthSuccess(data.token, data.user);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'login') {
        await executeLogin(email, password);
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, phone }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Registration failed.');
        }

        onAuthSuccess(data.token, data.user);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden my-3 sm:my-6 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/60 shrink-0">
          <div>
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-900">
              {mode === 'login' ? 'Account Sign In' : 'Create Customer Account'}
            </h2>
            <p className="text-[10px] sm:text-[11px] text-stone-500">
              Secure JWT session & bcrypt authentication
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sign in"
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100/50 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Demo Fast Fill Credentials */}
        <div className="p-3.5 sm:p-4 bg-stone-50 border-b border-stone-200 text-xs shrink-0">
          <span className="text-[11px] font-semibold uppercase text-stone-500 block mb-2">
            One-Click Demo Evaluation Credentials:
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('jane@example.com', 'customer123')}
              className="flex-1 py-2 px-2 bg-white border border-stone-300 rounded text-stone-700 hover:bg-stone-100 text-[11px] font-medium transition-colors text-center cursor-pointer"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@auracraft.com', 'admin123456')}
              className="flex-1 py-2 px-2 bg-stone-900 border border-stone-900 rounded text-stone-50 hover:bg-stone-800 text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Shield className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Sterling"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Password {mode === 'register' && '(min 6 characters)'} *
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Phone Number (optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2.5 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-50 min-h-[42px] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : mode === 'login' ? (
              <span>Sign In to Account</span>
            ) : (
              <span>Complete Registration</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
