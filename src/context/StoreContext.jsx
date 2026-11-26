import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { isExpired, isNearExpiry, getDaysRemaining } from '../utils/formatters';
import {
  authApi,
  storeApi,
  medicineApi,
  inventoryApi,
  supplierApi,
  purchaseApi,
  saleApi,
} from '../services/api';

const StoreContext = createContext(null);

const STORAGE_KEYS = {
  AUTH: 'medstore_auth_v1',
  TOKEN: 'medstore_jwt_token',
};

const responseData = (response) => {
  if (!response?.success) {
    throw new Error(response?.message || 'The server returned an invalid response.');
  }
  return response.data;
};

const normalizeBatch = (batch) => ({
  ...batch,
  medicineId: batch.medicine?.id,
  medicineName: batch.medicine?.name || '',
});

const normalizeSale = (sale) => ({
  ...sale,
  date: sale.saleDate,
  time: sale.saleTime,
  items: (sale.items || []).map((item) => ({
    ...item,
    total: item.totalPrice,
  })),
});

const normalizePurchase = (purchase) => {
  const item = purchase.items?.[0] || {};
  return {
    ...purchase,
    purchaseId: purchase.purchaseCode,
    date: purchase.purchaseDate,
    medicineId: item.medicineId,
    medicineName: item.medicineName || '',
    batchNumber: item.batchNumber || '',
    quantity: item.quantity || 0,
    purchasePrice: item.purchasePrice || 0,
    totalAmount: purchase.totalAmount,
  };
};

export const StoreProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [storeProfile, setStoreProfile] = useState(null);

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

  useEffect(() => {
    if (!token || !user) return undefined;
    let active = true;

    const loadTenantData = async () => {
      try {
        const [userResponse, profileResponse, medicinesResponse, batchesResponse, salesResponse] = await Promise.all([
          authApi.getCurrentUser(),
          storeApi.getProfile(),
          medicineApi.getAll(),
          inventoryApi.getAll(),
          saleApi.getAll(),
        ]);
        if (!active) return;
        const currentUser = responseData(userResponse);
        const profile = responseData(profileResponse);
        setStoreProfile(profile);
        setUser((current) => current && ({
          ...current,
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          role: currentUser.role,
          storeId: currentUser.storeId,
          storeName: profile.storeName,
          address: profile.address,
          gstin: profile.gstin,
          licenseNo: profile.drugLicenseNumber,
        }));
        setMedicines(responseData(medicinesResponse) || []);
        setBatches((responseData(batchesResponse) || []).map(normalizeBatch));
        setSales((responseData(salesResponse) || []).map(normalizeSale));

        if (user.role === 'ROLE_ADMIN') {
          const [suppliersResponse, purchasesResponse] = await Promise.all([
            supplierApi.getAll(),
            purchaseApi.getAll(),
          ]);
          if (!active) return;
          setSuppliers(responseData(suppliersResponse) || []);
          setPurchases((responseData(purchasesResponse) || []).map(normalizePurchase));
        } else {
          setSuppliers([]);
          setPurchases([]);
        }
      } catch (error) {
        if (active) {
          if (error.status === 401) {
            setUser(null);
            setToken(null);
            clearTenantData();
          }
          showToast(error.message || 'Unable to load store data.', 'error', 'Data Load Failed');
        }
      }
    };

    loadTenantData();
    return () => { active = false; };
  }, [token, user?.id]);

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

  const clearTenantData = () => {
    ['medstore_medicines_v1', 'medstore_batches_v1', 'medstore_suppliers_v1', 'medstore_sales_v1', 'medstore_purchases_v1']
      .forEach((key) => localStorage.removeItem(key));
    setMedicines([]);
    setBatches([]);
    setSuppliers([]);
    setSales([]);
    setPurchases([]);
    setStoreProfile(null);
  };

  /**
   * Authenticate against the Spring Boot backend.
   */
  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const authData = responseData(await authApi.login({ email, password }));
    if (!authData?.token || !authData?.storeId) {
      throw new Error('Login response did not contain a valid session and store.');
    }
    clearTenantData();
    const loggedUser = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      phone: authData.phone,
      role: authData.role,
      storeId: authData.storeId,
      storeName: authData.storeName || '',
      licenseNo: authData.drugLicenseNumber || '',
      address: authData.address || '',
      gstin: authData.gstin || '',
    };

    setToken(authData.token);
    setUser(loggedUser);
    setIsAuthenticated(true);
    const roleDisplay = authData.role === 'ROLE_ADMIN' ? 'Administrator' : 'Staff Member';
    showToast(`Welcome, ${authData.name}! Logged in as ${roleDisplay}.`, 'success', 'Authentication Successful');
    return loggedUser;
  };

  /**
   * Register a new store (multi-tenant). This redirects after success.
   */
  const registerStore = async (registrationData) => {
    return responseData(await authApi.registerStore(registrationData));
  };

  /**
   * Update store profile
   */
  const updateStoreProfile = async (data) => {
    try {
      const updated = responseData(await storeApi.updateProfile(data));
      setStoreProfile(updated);
      setUser((prev) => prev && ({
        ...prev,
        name: data.ownerName,
        storeName: updated.storeName,
        licenseNo: updated.drugLicenseNumber || '',
        address: updated.address,
        gstin: updated.gstin || '',
      }));
      showToast('Store profile updated successfully.', 'success', 'Settings Saved');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update store profile.', 'error', 'Update Failed');
      throw err;
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    clearTenantData();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    showToast('You have been logged out securely.', 'info', 'Session Ended');
  };

  const addMedicine = async (medicineData) => {
    const { initialBatch, ...medicinePayload } = medicineData;
    try {
      const created = responseData(await medicineApi.create(medicinePayload));
      setMedicines((prev) => [created, ...prev]);
      if (initialBatch?.batchNumber) {
        const batch = responseData(await inventoryApi.addBatch(created.id, {
          ...initialBatch,
          batchNumber: initialBatch.batchNumber.toUpperCase(),
          quantity: Number(initialBatch.quantity),
          purchasePrice: Number(initialBatch.purchasePrice),
          sellingPrice: Number(initialBatch.sellingPrice),
          mfgDate: initialBatch.mfgDate || new Date().toISOString().split('T')[0],
        }));
        setBatches((prev) => [normalizeBatch(batch), ...prev]);
      }
      showToast(`Medicine "${created.name}" added successfully.`, 'success', 'Medicine Added');
      return created;
    } catch (error) {
      showToast(error.message || 'Unable to add medicine.', 'error', 'Medicine Add Failed');
      return null;
    }
  };

  const updateMedicine = async (id, updatedData) => {
    try {
      const updated = responseData(await medicineApi.update(id, updatedData));
      setMedicines((prev) => prev.map((med) => (med.id === id ? updated : med)));
      showToast('Medicine details updated.', 'success', 'Update Complete');
      return updated;
    } catch (error) {
      showToast(error.message || 'Unable to update medicine.', 'error', 'Update Failed');
      return null;
    }
  };

  const deleteMedicine = async (id) => {
    try {
      await medicineApi.delete(id);
      setMedicines((prev) => prev.filter((med) => med.id !== id));
      showToast('Medicine removed from the active catalog.', 'info', 'Medicine Deleted');
      return true;
    } catch (error) {
      showToast(error.message || 'Unable to delete medicine.', 'error', 'Delete Failed');
      return false;
    }
  };

  // Batch Operations
  const addBatch = async (batchData) => {
    try {
      const batch = responseData(await inventoryApi.addBatch(batchData.medicineId, {
        batchNumber: batchData.batchNumber.toUpperCase(),
        quantity: Number(batchData.quantity),
        purchasePrice: Number(batchData.purchasePrice),
        sellingPrice: Number(batchData.sellingPrice),
        mfgDate: batchData.mfgDate,
        expiryDate: batchData.expiryDate,
        supplierName: batchData.supplierName,
      }));
      setBatches((prev) => [normalizeBatch(batch), ...prev]);
      showToast(`Batch #${batch.batchNumber} added with ${batch.quantity} units.`, 'success', 'Batch Added');
      return true;
    } catch (error) {
      showToast(error.message || 'Unable to add inventory batch.', 'error', 'Batch Add Failed');
      return false;
    }
  };

  const updateBatch = async (batchNumber, updatedData) => {
    const target = batches.find((batch) => batch.batchNumber === batchNumber);
    if (!target) return false;
    try {
      const updated = normalizeBatch(responseData(await inventoryApi.updateBatch(target.id, updatedData)));
      setBatches((prev) => prev.map((batch) => (batch.id === target.id ? updated : batch)));
      showToast(`Batch #${batchNumber} updated.`, 'success', 'Batch Updated');
      return true;
    } catch (error) {
      showToast(error.message || 'Unable to update batch.', 'error', 'Update Failed');
      return false;
    }
  };

  const deleteBatch = async (batchNumber) => {
    const target = batches.find((batch) => batch.batchNumber === batchNumber);
    if (!target) return false;
    try {
      await inventoryApi.deleteBatch(target.id);
      setBatches((prev) => prev.filter((batch) => batch.id !== target.id));
      showToast(`Batch #${batchNumber} removed from inventory.`, 'info', 'Batch Removed');
      return true;
    } catch (error) {
      showToast(error.message || 'Unable to remove batch.', 'error', 'Delete Failed');
      return false;
    }
  };

  // Supplier Operations
  const addSupplier = async (supplierData) => {
    try {
      const created = responseData(await supplierApi.create(supplierData));
      setSuppliers((prev) => [...prev, created]);
      showToast(`Supplier "${created.name}" added successfully.`, 'success', 'Supplier Added');
      return created;
    } catch (error) {
      showToast(error.message || 'Unable to add supplier.', 'error', 'Supplier Add Failed');
      return null;
    }
  };

  const updateSupplier = async (id, updatedData) => {
    try {
      const updated = responseData(await supplierApi.update(id, updatedData));
      setSuppliers((prev) => prev.map((sup) => (sup.id === id ? updated : sup)));
      showToast('Supplier updated successfully.', 'success', 'Supplier Updated');
      return updated;
    } catch (error) {
      showToast(error.message || 'Unable to update supplier.', 'error', 'Update Failed');
      return null;
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await supplierApi.delete(id);
      setSuppliers((prev) => prev.filter((sup) => sup.id !== id));
      showToast('Supplier deleted.', 'info', 'Supplier Deleted');
      return true;
    } catch (error) {
      showToast(error.message || 'Unable to delete supplier.', 'error', 'Delete Failed');
      return false;
    }
  };

  const addSale = async (saleData) => {
    try {
      const created = normalizeSale(responseData(await saleApi.create({
        ...saleData,
        saleDate: saleData.date,
        saleTime: saleData.time,
        items: saleData.items.map(({ medicineId, expiryDate, total, ...item }) => ({
          ...item,
          totalPrice: item.totalPrice ?? total,
        })),
      })));
      setSales((prev) => [created, ...prev]);
      try {
        const updatedBatches = responseData(await inventoryApi.getAll());
        setBatches(updatedBatches.map(normalizeBatch));
      } catch (refreshError) {
        showToast(refreshError.message || 'Sale saved, but inventory refresh failed.', 'warning', 'Refresh Failed');
      }
      showToast(`Sale completed! Invoice #${created.invoiceNumber}.`, 'success', 'Sale Successful');
      return created;
    } catch (error) {
      showToast(error.message || 'Unable to complete sale.', 'error', 'Sale Failed');
      return false;
    }
  };

  const addPurchase = async (purchaseData) => {
    try {
      const created = responseData(await purchaseApi.create({
        purchaseCode: `PUR-${Date.now()}`,
        invoiceNumber: purchaseData.invoiceNumber,
        supplierName: purchaseData.supplierName,
        totalAmount: Number(purchaseData.quantity) * Number(purchaseData.purchasePrice),
        purchaseDate: purchaseData.date || new Date().toISOString().split('T')[0],
        status: 'Received',
        items: [{
          medicineName: purchaseData.medicineName,
          batchNumber: purchaseData.batchNumber.toUpperCase(),
          quantity: Number(purchaseData.quantity),
          purchasePrice: Number(purchaseData.purchasePrice),
          sellingPrice: Number(purchaseData.sellingPrice),
          expiryDate: purchaseData.expiryDate,
          totalCost: Number(purchaseData.quantity) * Number(purchaseData.purchasePrice),
        }],
      }));
      const normalizedCreated = normalizePurchase(created);
      setPurchases((prev) => [normalizedCreated, ...prev]);
      try {
        const [batchResponse, purchasesResponse] = await Promise.all([
          inventoryApi.getAll(),
          purchaseApi.getAll(),
        ]);
        setBatches((responseData(batchResponse) || []).map(normalizeBatch));
        setPurchases((responseData(purchasesResponse) || []).map(normalizePurchase));
      } catch (refreshError) {
        showToast(refreshError.message || 'Purchase saved, but inventory refresh failed.', 'warning', 'Refresh Failed');
      }
      return normalizedCreated;
    } catch (error) {
      showToast(error.message || 'Unable to record purchase.', 'error', 'Purchase Failed');
      return null;
    }
  };

  // Helper selectors
  const getMedicineStock = (medicineId) =>
    batches.filter((b) => String(b.medicineId) === String(medicineId)).reduce((sum, b) => sum + b.quantity, 0);

  const getAvailableNonExpiredStock = (medicineId) =>
    batches
      .filter((b) => String(b.medicineId) === String(medicineId) && !isExpired(b.expiryDate))
      .reduce((sum, b) => sum + b.quantity, 0);

  const getBatchesForMedicine = (medicineId) => batches.filter((b) => String(b.medicineId) === String(medicineId));

  // Aggregated Batches with computed status
  const batchesWithStatus = batches.map((b) => {
    const expired = isExpired(b.expiryDate);
    const nearExpiry = isNearExpiry(b.expiryDate, 90);
    const daysLeft = getDaysRemaining(b.expiryDate);
    let status = 'good';
    if (expired) status = 'expired';
    else if (nearExpiry) status = 'near-expiry';
    else if (b.quantity <= 15) status = 'low-stock';
    return { ...b, daysLeft, isExpired: expired, isNearExpiry: nearExpiry, isLowStock: b.quantity <= 15, status };
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
    storeProfile,
    token,
    isAuthenticated,
    isAdmin,
    isStaff,
    toasts,

    // Actions
    login,
    registerStore,
    updateStoreProfile,
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
