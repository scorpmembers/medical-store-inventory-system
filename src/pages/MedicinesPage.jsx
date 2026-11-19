import React, { useState, useMemo } from 'react';
import {
  Pill,
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Check,
  AlertCircle,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import Modal from '../components/Modal';
import { StockBadge, ExpiryBadge } from '../components/Badge';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function MedicinesPage({ setActivePage }) {
  const {
    medicines,
    categories,
    getMedicineStock,
    getBatchesForMedicine,
    addMedicine,
    updateMedicine,
    deleteMedicine,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All'); // 'All', 'In Stock', 'Low Stock', 'Out of Stock'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(null);

  // Form State for Add / Edit
  const initialFormData = {
    name: '',
    genericName: '',
    category: 'Antibiotics',
    dosage: 'Tablet',
    rackLocation: 'Rack A-1',
    unit: 'Strip (10 tabs)',
    minStockAlert: 15,
    purchasePrice: '',
    sellingPrice: '',
    description: '',
    // Initial batch info (optional for Add)
    initialBatchNumber: '',
    initialBatchQty: '',
    initialExpiryDate: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // Filtered Medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      const totalStock = getMedicineStock(med.id);

      // Search match
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        med.name.toLowerCase().includes(query) ||
        (med.genericName && med.genericName.toLowerCase().includes(query)) ||
        (med.rackLocation && med.rackLocation.toLowerCase().includes(query)) ||
        (med.manufacturer && med.manufacturer.toLowerCase().includes(query));

      // Category match
      const matchesCategory =
        selectedCategory === 'All' || med.category === selectedCategory;

      // Stock filter match
      let matchesStock = true;
      if (stockFilter === 'In Stock') matchesStock = totalStock > (med.minStockAlert || 15);
      else if (stockFilter === 'Low Stock') matchesStock = totalStock > 0 && totalStock <= (med.minStockAlert || 15);
      else if (stockFilter === 'Out of Stock') matchesStock = totalStock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [medicines, searchQuery, selectedCategory, stockFilter, getMedicineStock]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData(initialFormData);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (med) => {
    setEditingMedicine(med);
    // Find latest batch prices for reference
    const batches = getBatchesForMedicine(med.id);
    const latestBatch = batches[0] || {};

    setFormData({
      name: med.name,
      genericName: med.genericName || '',
      category: med.category || 'Antibiotics',
      dosage: med.dosage || 'Tablet',
      rackLocation: med.rackLocation || 'Rack A-1',
      unit: med.unit || 'Strip (10 tabs)',
      minStockAlert: med.minStockAlert || 15,
      purchasePrice: latestBatch.purchasePrice || '',
      sellingPrice: latestBatch.sellingPrice || '',
      description: med.description || '',
    });
  };

  // Handle Add Medicine Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      genericName: formData.genericName.trim(),
      category: formData.category,
      dosage: formData.dosage,
      rackLocation: formData.rackLocation,
      unit: formData.unit,
      minStockAlert: Number(formData.minStockAlert) || 15,
      manufacturer: 'Local Pharma Supplies',
      description: formData.description,
    };

    // If initial batch details provided
    if (formData.initialBatchNumber && formData.initialBatchQty) {
      payload.initialBatch = {
        batchNumber: formData.initialBatchNumber,
        quantity: Number(formData.initialBatchQty),
        purchasePrice: Number(formData.purchasePrice) || 0,
        sellingPrice: Number(formData.sellingPrice) || 0,
        expiryDate: formData.initialExpiryDate || '2028-12-31',
      };
    }

    addMedicine(payload);
    setIsAddModalOpen(false);
  };

  // Handle Edit Medicine Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMedicine || !formData.name.trim()) return;

    updateMedicine(editingMedicine.id, {
      name: formData.name.trim(),
      genericName: formData.genericName.trim(),
      category: formData.category,
      dosage: formData.dosage,
      rackLocation: formData.rackLocation,
      unit: formData.unit,
      minStockAlert: Number(formData.minStockAlert) || 15,
      description: formData.description,
    });

    setEditingMedicine(null);
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = () => {
    if (deletingMedicine) {
      deleteMedicine(deletingMedicine.id);
      setDeletingMedicine(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Medicines Master Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, update, search and maintain standard pharmacy medicines database.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, generic, rack..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
            >
              <option value="All">All Stock Levels</option>
              <option value="In Stock">In Stock (&gt; Safety)</option>
              <option value="Low Stock">Low Stock Alert</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Result Count Pill */}
          <div className="flex items-center justify-between sm:justify-end px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <span>Showing:</span>
            <span className="font-bold text-teal-700 ml-1.5">
              {filteredMedicines.length} of {medicines.length} Medicines
            </span>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Medicine & Generic Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Rack Location</th>
                <th className="py-3 px-4 text-center">Batches</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-center">Expiry Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((med) => {
                  const batches = getBatchesForMedicine(med.id);
                  const totalStock = getMedicineStock(med.id);
                  const latestBatch = batches[0];
                  const primaryExpiry = latestBatch ? latestBatch.expiryDate : null;

                  return (
                    <tr
                      key={med.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Name & Generic */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-sm">
                          {med.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {med.genericName} • {med.dosage || 'Tablet'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ID: {med.id} | {med.manufacturer}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {med.category}
                        </span>
                      </td>

                      {/* Rack Location */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-700 font-medium bg-teal-50/60 px-2 py-0.5 rounded border border-teal-100">
                          {med.rackLocation || 'Unassigned'}
                        </span>
                      </td>

                      {/* Batch Count */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setActivePage('inventory')}
                          className="font-medium text-teal-700 hover:text-teal-900 hover:underline"
                          title="View batches in inventory"
                        >
                          {batches.length} Batch{batches.length === 1 ? '' : 'es'}
                        </button>
                      </td>

                      {/* Stock Badge */}
                      <td className="py-3 px-4 text-center">
                        <StockBadge
                          quantity={totalStock}
                          minAlert={med.minStockAlert || 15}
                        />
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-4 text-right">
                        {latestBatch ? (
                          <div className="font-semibold text-slate-800">
                            {formatCurrency(latestBatch.sellingPrice)}
                            <div className="text-[10px] text-slate-400 font-normal">
                              Cost: {formatCurrency(latestBatch.purchasePrice)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No batches</span>
                        )}
                      </td>

                      {/* Expiry Badge */}
                      <td className="py-3 px-4 text-center">
                        {primaryExpiry ? (
                          <ExpiryBadge expiryDate={primaryExpiry} />
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(med)}
                            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors"
                            title="Edit Medicine"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingMedicine(med)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Medicine"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No medicines matched your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Medicine Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Medicine to Catalog"
        subtitle="Enter medicine master information and optional initial batch"
        maxWidth="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSubmit}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Save Medicine
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Brand / Medicine Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Calpol 500mg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Generic Name / Composition
              </label>
              <input
                type="text"
                placeholder="e.g. Paracetamol 500mg"
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Dosage Form
              </label>
              <select
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup (100ml)">Syrup (100ml)</option>
                <option value="Syrup (200ml)">Syrup (200ml)</option>
                <option value="Ointment">Ointment</option>
                <option value="Drops">Eye/Ear Drops</option>
                <option value="Injection">Injection</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Rack Location
              </label>
              <input
                type="text"
                placeholder="e.g. Rack B-3"
                value={formData.rackLocation}
                onChange={(e) => setFormData({ ...formData, rackLocation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Packaging Unit
              </label>
              <input
                type="text"
                placeholder="e.g. Strip (10 tabs)"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Min. Reorder Stock Alert
              </label>
              <input
                type="number"
                min="1"
                value={formData.minStockAlert}
                onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Optional Initial Batch */}
          <div className="pt-3 border-t border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2">
              Initial Stock Batch (Optional)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Batch #</label>
                <input
                  type="text"
                  placeholder="e.g. CL-99A"
                  value={formData.initialBatchNumber}
                  onChange={(e) => setFormData({ ...formData, initialBatchNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Quantity</label>
                <input
                  type="number"
                  placeholder="50"
                  value={formData.initialBatchQty}
                  onChange={(e) => setFormData({ ...formData, initialBatchQty: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.initialExpiryDate}
                  onChange={(e) => setFormData({ ...formData, initialExpiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2.5">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Purchase Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="25.00"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Selling MRP (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="35.00"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Medicine Modal */}
      <Modal
        isOpen={!!editingMedicine}
        onClose={() => setEditingMedicine(null)}
        title={`Edit Medicine: ${editingMedicine?.name}`}
        subtitle={`ID: ${editingMedicine?.id}`}
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingMedicine(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditSubmit}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Medicine Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Generic Name
            </label>
            <input
              type="text"
              value={formData.genericName}
              onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Rack Location
              </label>
              <input
                type="text"
                value={formData.rackLocation}
                onChange={(e) => setFormData({ ...formData, rackLocation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Packaging Unit
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Min Stock Alert
              </label>
              <input
                type="number"
                value={formData.minStockAlert}
                onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingMedicine}
        onClose={() => setDeletingMedicine(null)}
        title="Confirm Delete Medicine"
        subtitle="This action cannot be undone"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={() => setDeletingMedicine(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
            >
              Delete Medicine
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          Are you sure you want to delete{' '}
          <strong className="text-slate-900">{deletingMedicine?.name}</strong>? All
          associated batches in the inventory will also be removed.
        </p>
      </Modal>
    </div>
  );
}
