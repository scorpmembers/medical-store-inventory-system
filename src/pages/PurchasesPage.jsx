import React, { useState, useMemo } from 'react';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import Modal from '../components/Modal';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function PurchasesPage({ setActivePage }) {
  const {
    purchases,
    medicines,
    suppliers,
    addPurchase,
    batches
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const initialForm = {
    supplierId: suppliers[0]?.id || '',
    medicineId: medicines[0]?.id || '',
    batchNumber: '',
    quantity: '50',
    purchasePrice: '25.00',
    sellingPrice: '35.00',
    invoiceNumber: '',
    mfgDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
  };

  const [formData, setFormData] = useState(initialForm);

  // Open Add Modal
  const handleOpenModal = () => {
    setFormData({
      ...initialForm,
      supplierId: suppliers[0]?.id || '',
      medicineId: medicines[0]?.id || '',
      invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      batchNumber: `BAT-${Math.floor(100 + Math.random() * 900)}`,
      expiryDate: '2028-06-30'
    });
    setIsAddModalOpen(true);
  };

  // Submit Purchase
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.supplierId || !formData.medicineId || !formData.batchNumber || !formData.quantity || !formData.purchasePrice) {
      return;
    }

    const selectedSup = suppliers.find((s) => s.id === formData.supplierId);
    const selectedMed = medicines.find((m) => m.id === formData.medicineId);

    addPurchase({
      supplierId: formData.supplierId,
      supplierName: selectedSup ? selectedSup.name : 'Unknown Supplier',
      invoiceNumber: formData.invoiceNumber || `PUR-${Date.now().toString().slice(-5)}`,
      medicineId: formData.medicineId,
      medicineName: selectedMed ? selectedMed.name : 'Medicine',
      batchNumber: formData.batchNumber.trim().toUpperCase(),
      quantity: Number(formData.quantity),
      purchasePrice: Number(formData.purchasePrice),
      sellingPrice: Number(formData.sellingPrice) || Number(formData.purchasePrice) * 1.35,
      mfgDate: formData.mfgDate,
      expiryDate: formData.expiryDate || '2028-12-31',
    });

    setIsAddModalOpen(false);
  };

  // Filtered Purchases History
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.purchaseId.toLowerCase().includes(q) ||
        (p.supplierName && p.supplierName.toLowerCase().includes(q)) ||
        (p.medicineName && p.medicineName.toLowerCase().includes(q)) ||
        (p.batchNumber && p.batchNumber.toLowerCase().includes(q)) ||
        (p.invoiceNumber && p.invoiceNumber.toLowerCase().includes(q))
      );
    });
  }, [purchases, searchQuery]);

  // Total purchase amount
  const totalPurchaseValue = purchases.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Purchases & Inward Stock Register
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Procure medicines from registered distributors and automatically increment active store inventory.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActivePage('inventory')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
          >
            <span>View Batch Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Purchase Entry</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Inward Purchases
          </span>
          <div className="text-xl font-bold text-slate-800 mt-1">
            {formatCurrency(totalPurchaseValue)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Across {purchases.length} supplier invoices
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Distributors
          </span>
          <div className="text-xl font-bold text-slate-800 mt-1">
            {suppliers.length} Registered
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Approved pharmaceutical vendors
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Stock Replenishment Status
          </span>
          <div className="text-xl font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Active & Synced</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Inventory auto-updates on every purchase
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search purchase ID, distributor, medicine, batch..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-teal-700">{filteredPurchases.length}</strong> of {purchases.length} inward entries
          </span>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Purchase ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Supplier / Distributor</th>
                <th className="py-3 px-4">Supplier Invoice #</th>
                <th className="py-3 px-4">Medicine Purchased</th>
                <th className="py-3 px-4">Batch Lot</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right">Unit Rate</th>
                <th className="py-3 px-4 text-right">Total Cost</th>
                <th className="py-3 px-4 text-center">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.purchaseId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {purchase.purchaseId}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(purchase.date)}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {purchase.supplierName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {purchase.invoiceNumber || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{purchase.medicineName}</div>
                      <div className="text-[10px] text-slate-400">ID: {purchase.medicineId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700 border border-slate-200">
                        {purchase.batchNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-teal-800">
                      +{purchase.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      {formatCurrency(purchase.purchasePrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(purchase.totalAmount || purchase.quantity * purchase.purchasePrice)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Inwarded
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-10 text-center text-slate-400">
                    <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No purchases match the search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record New Stock Purchase Order"
        subtitle="Inward goods from distributor and automatically update inventory stock"
        maxWidth="max-w-lg"
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
              onClick={handleSubmit}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Record & Update Stock
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select Supplier / Vendor *
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Distributor Invoice #
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                placeholder="e.g. APX-99812"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Medicine to Procure *
            </label>
            <select
              value={formData.medicineId}
              onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.genericName}) — {m.category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Batch Lot Number *
              </label>
              <input
                type="text"
                required
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                placeholder="e.g. DL-26K1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono uppercase"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Quantity Procured (Units) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="100"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Purchase Price per Unit (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Selling MRP (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
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

          {/* Total Cost preview */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between font-semibold text-slate-800">
            <span>Estimated Inward Total:</span>
            <span className="text-teal-700 font-bold text-sm">
              {formatCurrency((Number(formData.quantity) || 0) * (Number(formData.purchasePrice) || 0))}
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
}
