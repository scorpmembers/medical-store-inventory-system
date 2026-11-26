import React, { useState } from 'react';
import { Pill, ArrowRight, Lock, Mail, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function LoginPage({ onRegisterStore }) {
  const { login } = useStore();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 text-white shadow-md mb-3">
            <Pill className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Medical Store Inventory System
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            B.Tech Major Project • Spring Boot & React.js
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-sm font-bold text-slate-800 mb-5">Sign In to Your Store</h2>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@yourstore.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing In...</span></>
              ) : (
                <><span>Sign In to System</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Register Your Store Link */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={onRegisterStore}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-teal-700 border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-400 rounded-lg transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Register Your Medical Store
            </button>
            <p className="text-xs text-slate-400 text-center mt-2">
              New to the platform? Register your pharmacy to get started.
            </p>
          </div>

        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Secured with Spring Security & BCrypt Password Encryption
        </p>
      </div>
    </div>
  );
}
