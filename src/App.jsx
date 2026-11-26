import React, { useState } from 'react';
import { useStore } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterStorePage from './pages/RegisterStorePage';
import DashboardPage from './pages/DashboardPage';
import MedicinesPage from './pages/MedicinesPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import PurchasesPage from './pages/PurchasesPage';
import SuppliersPage from './pages/SuppliersPage';
import ReportsPage from './pages/ReportsPage';
import StaffManagementPage from './pages/StaffManagementPage';
import StoreSettingsPage from './pages/StoreSettingsPage';

export default function App() {
  const { isAuthenticated, isAdmin } = useStore();
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [appMode, setAppMode] = useState('login'); // 'login' | 'register-store'

  // Not logged in — show login or registration page
  if (!isAuthenticated) {
    if (appMode === 'register-store') {
      return (
        <>
          <ToastContainer />
          <RegisterStorePage
            onRegistered={() => {
              // After successful registration, redirect to login
              setAppMode('login');
            }}
            onBackToLogin={() => setAppMode('login')}
          />
        </>
      );
    }

    return (
      <>
        <ToastContainer />
        <LoginPage onRegisterStore={() => setAppMode('register-store')} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      <ToastContainer />

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && <DashboardPage setActivePage={setActivePage} />}
          {activePage === 'medicines' && <MedicinesPage setActivePage={setActivePage} />}
          {activePage === 'inventory' && <InventoryPage setActivePage={setActivePage} />}
          {activePage === 'sales' && <SalesPage setActivePage={setActivePage} />}
          {activePage === 'purchases' && isAdmin && <PurchasesPage setActivePage={setActivePage} />}
          {activePage === 'suppliers' && isAdmin && <SuppliersPage setActivePage={setActivePage} />}
          {activePage === 'reports' && isAdmin && <ReportsPage setActivePage={setActivePage} />}
          {activePage === 'staff-management' && isAdmin && <StaffManagementPage setActivePage={setActivePage} />}
          {activePage === 'store-settings' && isAdmin && <StoreSettingsPage setActivePage={setActivePage} />}
        </main>

        <footer className="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
          <p>Medical Store Inventory & Sales System • Spring Boot + React.js + MySQL • B.Tech Final Year Project</p>
        </footer>
      </div>
    </div>
  );
}
