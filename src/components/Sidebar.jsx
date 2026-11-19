import React from 'react';
import {
  LayoutDashboard,
  Pill,
  Boxes,
  ShoppingCart,
  Truck,
  Users,
  BarChart3,
  LogOut,
  X,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Sidebar({ activePage, setActivePage, isMobileOpen, setIsMobileOpen }) {
  const {
    totalMedicinesCount,
    nearExpiryBatches,
    expiredBatches,
    lowStockMedicines,
    logout,
    resetToSampleData,
    user
  } = useStore();

  const totalAlerts = nearExpiryBatches.length + expiredBatches.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medicines', label: 'Medicines', icon: Pill, badge: totalMedicinesCount },
    {
      id: 'inventory',
      label: 'Inventory & Expiry',
      icon: Boxes,
      badge: totalAlerts > 0 ? `${totalAlerts}` : null,
      badgeColor: expiredBatches.length > 0 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
    },
    { id: 'sales', label: 'Sales (Billing)', icon: ShoppingCart },
    { id: 'purchases', label: 'Purchases', icon: Truck },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm tracking-tight leading-tight">
                MedStore IMS
              </h1>
              <p className="text-[11px] text-teal-700 font-medium">Inventory System</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Profile Quick Card */}
        <div className="px-4 py-3 mx-3 my-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div className="font-semibold text-slate-800 truncate">
            {user?.storeName || 'City Care Pharmacy'}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Lic: {user?.licenseNo || 'DL-PH-2024'}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                      item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 space-y-1.5 bg-slate-50/50">
          {/* Reset Demo Data button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data (medicines, batches, sales, suppliers) back to default initial state?')) {
                resetToSampleData();
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset to fresh demo sample data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo Data</span>
          </button>

          {/* User logout */}
          <div className="pt-1 flex items-center justify-between px-2">
            <div className="truncate pr-2">
              <p className="text-xs font-medium text-slate-800 truncate">{user?.name || 'Pharmacist'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.role || 'Staff'}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
