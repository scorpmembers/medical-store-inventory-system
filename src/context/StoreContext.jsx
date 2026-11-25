import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_MEDICINES,
  INITIAL_BATCHES,
  INITIAL_SUPPLIERS,
  INITIAL_SALES,
  INITIAL_PURCHASES,
  INITIAL_CATEGORIES
} from '../data/initialData';
import { isExpired, isNearExpiry, getDaysRemaining } from '../utils/formatters';
import { authApi } from '../services/api';

const StoreContext = createContext(null);

const STORAGE_KEYS = {
  MEDICINES: 'medstore_medicines_v1',
  BATCHES: 'medstore_batches_v1',
  SUPPLIERS: 'medstore_suppliers_v1',
  SALES: 'medstore_sales_v1',
  PURCHASES: 'medstore_purchases_v1',
  AUTH: 'medstore_auth_v1',
  TOKEN: 'medstore_jwt_token',
};

export const StoreProvider = ({ children }) => {
  // Load from LocalStorage or initialize with sample data
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDICINES);
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [batches, setBatches] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BATCHES);
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALES);
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
  });

  // User & JWT Authentication State
  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || null;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH);
    return Boolean(savedToken && savedUser);
  });

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      setIsAuthenticated(false);
    }
  }, [user, token]);

  // Toast Helper
  const showToast = (message, type = 'success', title = '') => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, message, type, title };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ================= AUTHENTICATION ACTIONS =================

  /**
   * Real Login with Spring Boot Backend (with graceful offline fallback)
   */
  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    try {
      // 1. Attempt backend authentication
      const response = await authApi.login({ email, password });

      if (response && response.success && response.data) {
        const authData = response.data;
        const loggedUser = {
          id: authData.id,
          name: authData.name,
          email: authData.email,
          phone: authData.phone,
          role: authData.role, // 'ROLE_ADMIN' or 'ROLE_STAFF'
          storeName: 'City Care Pharmacy',
          licenseNo: 'DL-PH-2024-8890',
        };

        setToken(authData.token);
        setUser(loggedUser);
        setIsAuthenticated(true);

        const roleDisplay = authData.role === 'ROLE_ADMIN' ? 'Administrator' : 'Staff Member';
        showToast(
          `Welcome, ${authData.name}! Logged in as ${roleDisplay}.`,
          'success',
          'Authentication Successful'
        );
        return loggedUser;
      } else {
        throw new Error(response?.message || 'Login failed. Invalid response from server.');
      }
    } catch (err) {
      // If backend is not currently running, provide helpful offline demonstration mode
      if (err.isNetworkError) {
        console.warn('Backend server not reachable on port 8080. Using local demo fallback.');

        const isDemoAdmin = email.toLowerCase().includes('admin');
        const fallbackUser = {
          id: isDemoAdmin ? 1 : 2,
          name: isDemoAdmin ? 'System Administrator' : 'Pharmacist Staff',
          email: email.toLowerCase().trim(),
          role: isDemoAdmin ? 'ROLE_ADMIN' : 'ROLE_STAFF',
          storeName: 'City Care Pharmacy',
          licenseNo: 'DL-PH-2024-8890',
        };
        const mockToken = `mock_jwt_token_${Date.now()}`;

        setToken(mockToken);
        setUser(fallbackUser);
        setIsAuthenticated(true);

        showToast(
          `Logged in as ${fallbackUser.role === 'ROLE_ADMIN' ? 'Administrator' : 'Staff Member'} (Local Demo Mode). To use MySQL, run backend on port 8080.`,
          'info',
          'Notice'
        );
        return fallbackUser;
      }
      throw err;
    }
  };

  /**
   * Real Staff Signup with Spring Boot Backend
   */
  const signup = async (signupData) => {
    try {
      const response = await authApi.signup(signupData);

      if (response && response.success && response.data) {
        const authData = response.data;
        const newUser = {
          id: authData.id,
          name: authData.name,
          email: authData.email,
          phone: authData.phone,
          role: authData.role || 'ROLE_STAFF',
          storeName: 'City Care Pharmacy',
          licenseNo: 'DL-PH-2024-8890',
        };

        setToken(authData.token);
        setUser(newUser);
        setIsAuthenticated(true);

        showToast(
          `Welcome ${newUser.name}! Your Staff account has been created in MySQL.`,
          'success',
          'Registration Complete'
        );
        return newUser;
      } else {
        throw new Error(response?.message || 'Signup failed.');
      }
    } catch (err) {
      if (err.isNetworkError) {
        // Fallback for offline demo
        const fallbackUser = {
          id: Date.now(),
          name: signupData.name,
          email: signupData.email,
          phone: signupData.phone,
          role: 'ROLE_STAFF',
          storeName: 'City Care Pharmacy',
          licenseNo: 'DL-PH-2024-8890',
        };
        setToken(`mock_token_${Date.now()}`);
        setUser(fallbackUser);
        setIsAuthenticated(true);
        showToast(`Staff registered locally. Start Spring Boot to sync with MySQL.`, 'info');
        return fallbackUser;
      }
      throw err;
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    showToast('You have been logged out securely.', 'info', 'Session Ended');
  };

  // Medicine Operations
  const addMedicine = (medicineData) => {
    const newId = `MED-${Math.floor(100 + Math.random() * 900)}`;
    const newMed = {
      ...medicineData,
      id: newId,
      minStockAlert: Number(medicineData.minStockAlert) || 15
    };
    setMedicines((prev) => [newMed, ...prev]);

    if (medicineData.initialBatch && medicineData.initialBatch.batchNumber) {
      const b = medicineData.initialBatch;
      const newBatch = {
        batchNumber: b.batchNumber.toUpperCase(),
        medicineId: newId,
        medicineName: newMed.name,
        quantity: Number(b.quantity) || 0,
        purchasePrice: Number(b.purchasePrice) || 0,
        sellingPrice: Number(b.sellingPrice) || 0,
        mfgDate: b.mfgDate || new Date().toISOString().split('T')[0],
        expiryDate: b.expiryDate,
        supplierName: b.supplierName || 'Direct Purchase'
      };
      setBatches((prev) => [newBatch, ...prev]);
    }

    showToast(`Medicine "${newMed.name}" added successfully.`, 'success', 'Medicine Added');
    return newMed;
  };

  const updateMedicine = (id, updatedData) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updatedData } : med))
    );
    if (updatedData.name) {
      setBatches((prev) =>
        prev.map((b) => (b.medicineId === id ? { ...b, medicineName: updatedData.name } : b))
      );
    }
    showToast(`Medicine details updated.`, 'success', 'Update Complete');
  };

  const deleteMedicine = (id) => {
    const target = medicines.find((m) => m.id === id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    setBatches((prev) => prev.filter((b) => b.medicineId !== id));
    showToast(`Medicine "${target?.name || id}" and its batches deleted.`, 'info', 'Medicine Deleted');
  };

  // Batch Operations
  const addBatch = (batchData) => {
    const existing = batches.find((b) => b.batchNumber.toUpperCase() === batchData.batchNumber.toUpperCase());
    if (existing) {
      showToast(`Batch #${batchData.batchNumber} already exists. Please update it or use a unique batch number.`, 'error', 'Duplicate Batch');
      return false;
    }

    const med = medicines.find((m) => m.id === batchData.medicineId);
    const newBatch = {
      ...batchData,
      batchNumber: batchData.batchNumber.toUpperCase(),
      medicineName: med ? med.name : batchData.medicineName,
      quantity: Number(batchData.quantity) || 0,
      purchasePrice: Number(batchData.purchasePrice) || 0,
      sellingPrice: Number(batchData.sellingPrice) || 0,
    };

    setBatches((prev) => [newBatch, ...prev]);
    showToast(`Batch #${newBatch.batchNumber} added with ${newBatch.quantity} units.`, 'success', 'Batch Added');
    return true;
  };

  const updateBatch = (batchNumber, updatedData) => {
    setBatches((prev) =>
      prev.map((b) => (b.batchNumber === batchNumber ? { ...b, ...updatedData } : b))
    );
    showToast(`Batch #${batchNumber} updated.`, 'success', 'Batch Updated');
  };

  const deleteBatch = (batchNumber) => {
    setBatches((prev) => prev.filter((b) => b.batchNumber !== batchNumber));
    showToast(`Batch #${batchNumber} removed from inventory.`, 'info', 'Batch Removed');
  };

  // Supplier Operations
  const addSupplier = (supplierData) => {
    const newId = `SUP-${String(suppliers.length + 1).padStart(3, '0')}`;
    const newSup = {
      ...supplierData,
      id: newId,
      status: supplierData.status || 'Active'
    };
    setSuppliers((prev) => [...prev, newSup]);
    showToast(`Supplier "${newSup.name}" added successfully.`, 'success', 'Supplier Added');
    return newSup;
  };

  const updateSupplier = (id, updatedData) => {
    setSuppliers((prev) =>
      prev.map((sup) => (sup.id === id ? { ...sup, ...updatedData } : sup))
    );
    showToast(`Supplier updated successfully.`, 'success', 'Supplier Updated');
  };

  const deleteSupplier = (id) => {
    const target = suppliers.find((s) => s.id === id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    showToast(`Supplier "${target?.name || id}" deleted.`, 'info', 'Supplier Deleted');
  };

  // Sales Operations (with strict validation & inventory deduction)
  const addSale = (saleData) => {
    if (!saleData.items || saleData.items.length === 0) {
      showToast('Sale must contain at least one item.', 'error', 'Sale Failed');
      return false;
    }

    for (const item of saleData.items) {
      const batch = batches.find((b) => b.batchNumber === item.batchNumber);
      if (!batch) {
        showToast(`Batch ${item.batchNumber} was not found in stock.`, 'error', 'Invalid Batch');
        return false;
      }

      if (isExpired(batch.expiryDate)) {
        showToast(
          `Cannot sell expired medicine! Batch #${batch.batchNumber} expired on ${batch.expiryDate}.`,
          'error',
          'Expired Medicine Blocked'
        );
        return false;
      }

      if (item.quantity > batch.quantity) {
        showToast(
          `Insufficient stock for ${item.medicineName} (Batch ${batch.batchNumber}). Requested: ${item.quantity}, Available: ${batch.quantity}.`,
          'error',
          'Stock Limit Exceeded'
        );
        return false;
      }
    }

    setBatches((prevBatches) => {
      return prevBatches.map((b) => {
        const soldItem = saleData.items.find((item) => item.batchNumber === b.batchNumber);
        if (soldItem) {
          return {
            ...b,
            quantity: Math.max(0, b.quantity - soldItem.quantity)
          };
        }
        return b;
      });
    });

    const today = new Date();
    const invoiceNumber = `INV-${today.getFullYear()}-${String(sales.length + 43).padStart(4, '0')}`;
    const newSale = {
      ...saleData,
      invoiceNumber,
      date: saleData.date || today.toISOString().split('T')[0],
      time: saleData.time || today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSales((prev) => [newSale, ...prev]);
    showToast(
      `Sale completed! Invoice #${invoiceNumber} for ₹${newSale.grandTotal.toFixed(2)}.`,
      'success',
      'Sale Successful'
    );
    return newSale;
  };

  // Purchase Operations
  const addPurchase = (purchaseData) => {
    const today = new Date();
    const purchaseId = `PUR-${today.getFullYear()}-${String(purchases.length + 16).padStart(3, '0')}`;

    const newPurchase = {
      ...purchaseData,
      purchaseId,
      date: purchaseData.date || today.toISOString().split('T')[0],
      status: 'Received',
      totalAmount: Number(purchaseData.quantity) * Number(purchaseData.purchasePrice)
    };

    setBatches((prevBatches) => {
      const existingBatchIndex = prevBatches.findIndex(
        (b) => b.batchNumber.toUpperCase() === purchaseData.batchNumber.toUpperCase()
      );

      if (existingBatchIndex >= 0) {
        const updated = [...prevBatches];
        updated[existingBatchIndex] = {
          ...updated[existingBatchIndex],
          quantity: updated[existingBatchIndex].quantity + Number(purchaseData.quantity),
          purchasePrice: Number(purchaseData.purchasePrice),
          sellingPrice: Number(purchaseData.sellingPrice) || updated[existingBatchIndex].sellingPrice,
          expiryDate: purchaseData.expiryDate || updated[existingBatchIndex].expiryDate,
        };
        return updated;
      } else {
        const med = medicines.find((m) => m.id === purchaseData.medicineId);
        const newBatch = {
          batchNumber: purchaseData.batchNumber.toUpperCase(),
          medicineId: purchaseData.medicineId,
          medicineName: med ? med.name : purchaseData.medicineName,
          quantity: Number(purchaseData.quantity),
          purchasePrice: Number(purchaseData.purchasePrice),
          sellingPrice: Number(purchaseData.sellingPrice) || Number(purchaseData.purchasePrice) * 1.3,
          mfgDate: purchaseData.mfgDate || today.toISOString().split('T')[0],
          expiryDate: purchaseData.expiryDate,
          supplierId: purchaseData.supplierId,
          supplierName: purchaseData.supplierName
        };
        return [newBatch, ...prevBatches];
      }
    });

    setPurchases((prev) => [newPurchase, ...prev]);
    showToast(
      `Purchase #${purchaseId} recorded. Stock of ${purchaseData.medicineName} increased by ${purchaseData.quantity}.`,
      'success',
      'Purchase Recorded'
    );
    return newPurchase;
  };

  // Reset to initial sample data
  const resetToSampleData = () => {
    setMedicines(INITIAL_MEDICINES);
    setBatches(INITIAL_BATCHES);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales(INITIAL_SALES);
    setPurchases(INITIAL_PURCHASES);
    localStorage.removeItem(STORAGE_KEYS.MEDICINES);
    localStorage.removeItem(STORAGE_KEYS.BATCHES);
    localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.PURCHASES);
    showToast('Reset all inventory, sales, and suppliers to clean sample data.', 'info', 'Data Reset');
  };

  // Helper selectors
  const getMedicineStock = (medicineId) => {
    return batches
      .filter((b) => b.medicineId === medicineId)
      .reduce((sum, b) => sum + b.quantity, 0);
  };

  const getAvailableNonExpiredStock = (medicineId) => {
    return batches
      .filter((b) => b.medicineId === medicineId && !isExpired(b.expiryDate))
      .reduce((sum, b) => sum + b.quantity, 0);
  };

  const getBatchesForMedicine = (medicineId) => {
    return batches.filter((b) => b.medicineId === medicineId);
  };

  // Aggregated Batches with computed status
  const batchesWithStatus = batches.map((b) => {
    const expired = isExpired(b.expiryDate);
    const nearExpiry = isNearExpiry(b.expiryDate, 90);
    const daysLeft = getDaysRemaining(b.expiryDate);
    let status = 'good';
    if (expired) status = 'expired';
    else if (nearExpiry) status = 'near-expiry';
    else if (b.quantity <= 15) status = 'low-stock';

    return {
      ...b,
      daysLeft,
      isExpired: expired,
      isNearExpiry: nearExpiry,
      isLowStock: b.quantity <= 15,
      status
    };
  });

  // Alert calculations
  const expiredBatches = batchesWithStatus.filter((b) => b.isExpired);
  const nearExpiryBatches = batchesWithStatus.filter((b) => b.isNearExpiry && !b.isExpired);
  const lowStockMedicines = medicines.filter((m) => {
    const stock = getMedicineStock(m.id);
    return stock <= (m.minStockAlert || 15);
  });

  // Financial summary
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter((s) => s.date === todayStr);
  const todaySalesTotal = todaySales.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
  const totalRevenue = sales.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
  const totalStockCount = batches.reduce((sum, b) => sum + Number(b.quantity), 0);

  // Role Helpers
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isStaff = user?.role === 'ROLE_STAFF';

  const value = {
    // State
    medicines,
    batches: batchesWithStatus,
    rawBatches: batches,
    suppliers,
    sales,
    purchases,
    categories: INITIAL_CATEGORIES,
    user,
    token,
    isAuthenticated,
    isAdmin,
    isStaff,
    toasts,

    // Actions
    login,
    signup,
    logout,
    showToast,
    removeToast,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    addBatch,
    updateBatch,
    deleteBatch,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addSale,
    addPurchase,
    resetToSampleData,

    // Getters & Metrics
    getMedicineStock,
    getAvailableNonExpiredStock,
    getBatchesForMedicine,
    expiredBatches,
    nearExpiryBatches,
    lowStockMedicines,
    todaySalesTotal,
    todaySalesCount: todaySales.length,
    totalRevenue,
    totalStockCount,
    totalMedicinesCount: medicines.length,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
