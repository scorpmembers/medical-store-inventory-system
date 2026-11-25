import React, { useState } from 'react';
import { Pill, ShieldCheck, ArrowRight, UserCheck, Lock, Mail, User, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function LoginPage() {
  const { login, signup } = useStore();

  // Mode: 'login' or 'signup'
  const [mode, setMode] = useState('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@medstore.com');
  const [loginPassword, setLoginPassword] = useState('Admin@123');

  // Signup form state (Strictly for Staff role)
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Login Submit
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

  // Handle Signup Submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter confirm password.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
      });
    } catch (err) {
      setErrorMessage(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for demo presentation
  const handleQuickFill = (roleEmail, rolePass) => {
    setMode('login');
    setLoginEmail(roleEmail);
    setLoginPassword(rolePass);
    setErrorMessage('');
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
            B.Tech Major Project • Spring Boot & React.js Authentication
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {/* Tab Selector: Login vs Signup */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register (Staff)
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@medstore.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to System</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= SIGNUP FORM (STAFF ONLY) ================= */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {/* Role Notice */}
              <div className="p-2.5 bg-teal-50/80 border border-teal-200 rounded-lg text-[11px] text-teal-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Role: Staff (Pharmacist)</span>
                  <p className="text-teal-700 mt-0.5">
                    Public registration strictly assigns Staff permissions. Administrator accounts are protected and managed by the Store Owner.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="staff@medstore.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+91 98110 00000"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Staff Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register as Staff</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Fill Buttons (For College Project Viva Demo) */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Quick Viva Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@medstore.com', 'Admin@123')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('staff@medstore.com', 'Staff@123')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Staff Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Secured with Spring Security & BCrypt Password Encryption
        </p>
      </div>
    </div>
  );
}
