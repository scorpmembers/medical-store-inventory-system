import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Bell,
  PlusCircle,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatDate } from '../utils/formatters';

export default function Navbar({ activePage, setActivePage, setIsMobileOpen }) {
  const {
    user,
    nearExpiryBatches,
    expiredBatches,
    lowStockMedicines,
    isAdmin,
    isStaff
  } = useStore();

  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Live Time
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowAlertsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalAlerts = expiredBatches.length + nearExpiryBatches.length + lowStockMedicines.length;

  const getPageTitle = (page) => {
    switch (page) {
      case 'dashboard':
        return isStaff ? 'Staff Counter Dashboard' : 'Dashboard Overview';
      case 'medicines':
        return 'Medicine Master Catalog';
      case 'inventory':
        return 'Batch Inventory & Expiry Tracker';
      case 'sales':
        return 'Point of Sale & Billing';
      case 'purchases':
        return 'Purchase Invoices & Stock Inward';
      case 'suppliers':
        return 'Supplier & Vendor Directory';
      case 'reports':
        return 'Reports & Performance Analytics';
      case 'staff-management':
        return 'Staff & User Access Management';
      case 'store-settings':
        return 'Store Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
              {getPageTitle(activePage)}
            </h2>
            <span
              className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isAdmin
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}
            >
              {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
              {isAdmin ? 'ADMIN' : 'STAFF'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <span className="max-w-40 truncate">{user?.storeName || 'Medical Store'}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-teal-700 font-medium capitalize">
              {activePage.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Date/Clock, Alerts Dropdown, New Sale CTA */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Date & Time pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>{formatDate(currentTime.toISOString().split('T')[0])}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span className="font-mono">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Quick Action: New Sale */}
        <button
          onClick={() => setActivePage('sales')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">New Sale (POS)</span>
          <span className="sm:hidden">Sell</span>
        </button>

        {/* Alerts Bell Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowAlertsDropdown((prev) => !prev)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            aria-label="View alerts"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">
                  {totalAlerts > 9 ? '9+' : totalAlerts}
                </span>
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Stock & Expiry Alerts
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {totalAlerts} issues require attention
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActivePage('inventory');
                    setShowAlertsDropdown(false);
                  }}
                  className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1"
                >
                  View All <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                {/* Expired Batches */}
                {expiredBatches.length > 0 && (
                  <div className="p-3 bg-rose-50/40">
                    <div className="flex items-center gap-1.5 text-rose-700 font-semibold mb-1">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Expired Batches ({expiredBatches.length})</span>
                    </div>
                    {expiredBatches.slice(0, 3).map((b) => (
                      <div
                        key={b.batchNumber}
                        className="py-1 text-slate-600 flex justify-between items-center"
                      >
                        <span className="truncate pr-2">
                          <strong>{b.medicineName}</strong> (Batch: {b.batchNumber})
                        </span>
                        <span className="text-rose-600 font-medium whitespace-nowrap">
                          Expired {b.expiryDate}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Near Expiry Batches */}
                {nearExpiryBatches.length > 0 && (
                  <div className="p-3 bg-amber-50/40">
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Expiring Within 90 Days ({nearExpiryBatches.length})</span>
                    </div>
                    {nearExpiryBatches.slice(0, 3).map((b) => (
                      <div
                        key={b.batchNumber}
                        className="py-1 text-slate-600 flex justify-between items-center"
                      >
                        <span className="truncate pr-2">
                          <strong>{b.medicineName}</strong> (Batch: {b.batchNumber})
                        </span>
                        <span className="text-amber-700 font-medium whitespace-nowrap">
                          {b.daysLeft} days left
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Low Stock Medicines */}
                {lowStockMedicines.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1">
                      <AlertCircle className="w-4 h-4 text-slate-500" />
                      <span>Low Stock Medicines ({lowStockMedicines.length})</span>
                    </div>
                    {lowStockMedicines.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className="py-1 text-slate-600 flex justify-between items-center"
                      >
                        <span className="truncate pr-2">{m.name}</span>
                        <span className="text-rose-600 font-medium whitespace-nowrap">
                          Min Alert: {m.minStockAlert}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {totalAlerts === 0 && (
                  <div className="p-6 text-center text-slate-400">
                    No active stock or expiry alerts. Inventory is healthy!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
