import React, { useState } from 'react';
import { useStore } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MedicinesPage from './pages/MedicinesPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import PurchasesPage from './pages/PurchasesPage';
import SuppliersPage from './pages/SuppliersPage';
import ReportsPage from './pages/ReportsPage';
import StaffManagementPage from './pages/StaffManagementPage';

export default function App() {
  const { isAuthenticated, isAdmin, isStaff } = useStore();
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If not logged in, render the clean Login / Signup page
  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
        <LoginPage />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && <DashboardPage setActivePage={setActivePage} />}
          {activePage === 'medicines' && <MedicinesPage setActivePage={setActivePage} />}
          {activePage === 'inventory' && <InventoryPage setActivePage={setActivePage} />}
          {activePage === 'sales' && <SalesPage setActivePage={setActivePage} />}
          {activePage === 'purchases' && <PurchasesPage setActivePage={setActivePage} />}
          {activePage === 'suppliers' && <SuppliersPage setActivePage={setActivePage} />}
          {activePage === 'reports' && <ReportsPage setActivePage={setActivePage} />}
          {activePage === 'staff-management' && <StaffManagementPage setActivePage={setActivePage} />}
        </main>

        {/* Subtle Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
          <p>
            Medical Store Inventory System • Spring Boot + React.js + MySQL • B.Tech Final Year Project
          </p>
        </footer>
      </div>
    </div>
  );
}
