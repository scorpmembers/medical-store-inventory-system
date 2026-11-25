import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Trash2,
  Lock,
  ArrowRight,
  Filter
} from 'lucide-react';
import Modal from '../components/Modal';
import { ExpiryBadge, StockBadge } from '../components/Badge';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function InventoryPage({ setActivePage }) {
  const {
    batches,
    medicines,
    suppliers,
    addBatch,
    deleteBatch,
    expiredBatches,
    nearExpiryBatches,
    isAdmin
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Good', 'Near Expiry', 'Expired', 'Low Stock'

  // Modals
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [deletingBatch, setDeletingBatch] = useState(null);

  // Form State
  const initialBatchForm = {
    batchNumber: '',
    medicineId: medicines[0]?.id || '',
    quantity: '',
    purchasePrice: '',
    sellingPrice: '',
    mfgDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    supplierName: suppliers[0]?.name || 'Apex Health Logistics'
  };

  const [formData, setFormData] = useState(initialBatchForm);

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        b.batchNumber.toLowerCase().includes(query) ||
        b.medicineName.toLowerCase().includes(query) ||
        (b.supplierName && b.supplierName.toLowerCase().includes(query));

      let matchesStatus = true;
      if (statusFilter === 'Expired') matchesStatus = b.isExpired;
      else if (statusFilter === 'Near Expiry') matchesStatus = b.isNearExpiry && !b.isExpired;
      else if (statusFilter === 'Low Stock') matchesStatus = b.quantity <= 15;
      else if (statusFilter === 'Good') matchesStatus = !b.isExpired && !b.isNearExpiry;

      return matchesSearch && matchesStatus;
    });
  }, [batches, searchQuery, statusFilter]);

  const handleOpenAddBatch = () => {
    setFormData({
      ...initialBatchForm,
      medicineId: medicines[0]?.id || '',
      supplierName: suppliers[0]?.name || ''
    });
    setIsAddBatchOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.batchNumber || !formData.medicineId || !formData.quantity || !formData.expiryDate) {
      return;
    }

    const success = addBatch({
      batchNumber: formData.batchNumber.trim(),
      medicineId: formData.medicineId,
      quantity: Number(formData.quantity),
      purchasePrice: Number(formData.purchasePrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      mfgDate: formData.mfgDate,
      expiryDate: formData.expiryDate,
      supplierName: formData.supplierName
    });

    if (success) {
      setIsAddBatchOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingBatch) {
      deleteBatch(deletingBatch.batchNumber);
      setDeletingBatch(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Batch-Wise Inventory & Expiry Surveillance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time stock levels, manufacturing dates, shelf-life and expired drug segregation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActivePage('sales')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
          >
            <span>Go to Billing (POS)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {isAdmin && (
            <button
              onClick={handleOpenAddBatch}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Inward Batch</span>
            </button>
          )}
        </div>
      </div>

      {/* Expiry Risk Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Expired Batches */}
        <div
          onClick={() => setStatusFilter('Expired')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === 'Expired'
              ? 'bg-rose-100/70 border-rose-400 ring-2 ring-rose-300'
              : 'bg-rose-50/60 border-rose-200 hover:bg-rose-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Expired Batches (Locked)
            </span>
            <Lock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-900 mt-1">
            {expiredBatches.length}
          </div>
          <p className="text-[11px] text-rose-700 mt-1">
            Strictly blocked from POS sales & billing
          </p>
        </div>

        {/* Near Expiry Batches */}
        <div
          onClick={() => setStatusFilter('Near Expiry')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === 'Near Expiry'
              ? 'bg-amber-100/70 border-amber-400 ring-2 ring-amber-300'
              : 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Near Expiry (≤ 90 Days)
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-1">
            {nearExpiryBatches.length}
          </div>
          <p className="text-[11px] text-amber-700 mt-1">
            Prioritize for early dispensing (FEFO)
          </p>
        </div>

        {/* Healthy / Fresh Batches */}
        <div
          onClick={() => setStatusFilter('Good')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            statusFilter === 'Good'
              ? 'bg-teal-100/70 border-teal-400 ring-2 ring-teal-300'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Valid & Fresh Batches
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">
            {batches.filter((b) => !b.isExpired && !b.isNearExpiry).length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Safe for regular retail dispensing
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batch #, medicine name, distributor..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>

          {/* Status Tabs / Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
            >
              <option value="All">All Batches (No Filter)</option>
              <option value="Expired">Expired Only (Blocked)</option>
              <option value="Near Expiry">Near Expiry Only (≤ 90 Days)</option>
              <option value="Low Stock">Low Stock Batches (≤ 15 units)</option>
              <option value="Good">Valid / Fresh Only</option>
            </select>
          </div>

          {/* Count summary */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <span>Showing:</span>
            <span className="font-bold text-teal-700">
              {filteredBatches.length} of {batches.length} Batches
            </span>
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Batch Number</th>
                <th className="py-3 px-4">Medicine Name</th>
                <th className="py-3 px-4 text-center">In Stock Qty</th>
                <th className="py-3 px-4">Mfg. Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Days Left</th>
                <th className="py-3 px-4 text-center">Batch Status</th>
                <th className="py-3 px-4 text-center">Sales Eligibility</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => {
                  return (
                    <tr
                      key={batch.batchNumber}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        batch.isExpired
                          ? 'bg-rose-50/30'
                          : batch.isNearExpiry
                          ? 'bg-amber-50/20'
                          : ''
                      }`}
                    >
                      {/* Batch Number */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {batch.batchNumber}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                          {batch.supplierName || 'Distributor'}
                        </div>
                      </td>

                      {/* Medicine Name */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-sm">
                          {batch.medicineName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          Cost: {formatCurrency(batch.purchasePrice)} • MRP: {formatCurrency(batch.sellingPrice)}
                        </div>
                      </td>

                      {/* Available Qty */}
                      <td className="py-3 px-4 text-center">
                        <StockBadge quantity={batch.quantity} />
                      </td>

                      {/* Mfg Date */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {formatDate(batch.mfgDate)}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-800 text-[11px]">
                        {formatDate(batch.expiryDate)}
                      </td>

                      {/* Days Left */}
                      <td className="py-3 px-4">
                        {batch.isExpired ? (
                          <span className="font-semibold text-rose-600">
                            Expired ({Math.abs(batch.daysLeft)}d ago)
                          </span>
                        ) : batch.daysLeft <= 90 ? (
                          <span className="font-semibold text-amber-700">
                            {batch.daysLeft} days remaining
                          </span>
                        ) : (
                          <span className="text-slate-600">
                            {batch.daysLeft} days remaining
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center">
                        <ExpiryBadge expiryDate={batch.expiryDate} />
                      </td>

                      {/* Sales Eligibility Rule Display */}
                      <td className="py-3 px-4 text-center">
                        {batch.isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-md">
                            <Lock className="w-3 h-3" />
                            BLOCKED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
                            <CheckCircle2 className="w-3 h-3" />
                            Eligible
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        {isAdmin ? (
                          <button
                            onClick={() => setDeletingBatch(batch)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Remove Batch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">View Only</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-slate-400">
                    <Boxes className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No batches match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inward Batch Modal */}
      <Modal
        isOpen={isAddBatchOpen}
        onClose={() => setIsAddBatchOpen(false)}
        title="Add Inward Medicine Batch"
        subtitle="Record new batch lot with manufacturing and expiration details"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddBatchOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSubmit}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Add to Stock
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Medicine *
            </label>
            <select
              value={formData.medicineId}
              onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.genericName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Batch Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DL-25X9"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono uppercase"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Quantity (Units) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="50"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mfg. Date
              </label>
              <input
                type="date"
                value={formData.mfgDate}
                onChange={(e) => setFormData({ ...formData, mfgDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Purchase Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="50.00"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Selling Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="70.00"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Supplier / Distributor
            </label>
            <select
              value={formData.supplierName}
              onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Batch Modal */}
      <Modal
        isOpen={!!deletingBatch}
        onClose={() => setDeletingBatch(null)}
        title="Remove Batch Record"
        subtitle="Confirm batch deletion"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={() => setDeletingBatch(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
            >
              Confirm Removal
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          Remove batch <strong className="font-mono text-slate-900">{deletingBatch?.batchNumber}</strong> for{' '}
          <strong>{deletingBatch?.medicineName}</strong> with {deletingBatch?.quantity} units from inventory?
        </p>
      </Modal>
    </div>
  );
}
