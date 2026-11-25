import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Building2,
  Edit2,
  Trash2,
  FileCheck,
  PackageCheck
} from 'lucide-react';
import Modal from '../components/Modal';
import { useStore } from '../context/StoreContext';

export default function SuppliersPage() {
  const {
    suppliers,
    purchases,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    isAdmin
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstin: '',
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialForm);

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
        (s.phone && s.phone.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.address && s.address.toLowerCase().includes(q)) ||
        (s.gstin && s.gstin.toLowerCase().includes(q))
      );
    });
  }, [suppliers, searchQuery]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (sup) => {
    setEditingSupplier(sup);
    setFormData({
      name: sup.name,
      contactPerson: sup.contactPerson || '',
      phone: sup.phone || '',
      email: sup.email || '',
      address: sup.address || '',
      gstin: sup.gstin || '',
      status: sup.status || 'Active'
    });
  };

  // Submit Add
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addSupplier({
      name: formData.name.trim(),
      contactPerson: formData.contactPerson.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      gstin: formData.gstin.trim() || 'Unregistered',
      status: formData.status
    });

    setIsAddModalOpen(false);
  };

  // Submit Edit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingSupplier || !formData.name.trim()) return;

    updateSupplier(editingSupplier.id, {
      name: formData.name.trim(),
      contactPerson: formData.contactPerson.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      gstin: formData.gstin.trim() || 'Unregistered',
      status: formData.status
    });

    setEditingSupplier(null);
  };

  // Confirm Delete
  const handleDeleteConfirm = () => {
    if (deletingSupplier) {
      deleteSupplier(deletingSupplier.id);
      setDeletingSupplier(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Suppliers & Vendor Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage pharmaceutical distributors, sales representatives, contact details and supply accounts.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors shadow-xs self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Supplier</span>
          </button>
        )}
      </div>

      {/* Search and Count */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search supplier, contact person, phone, city..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-teal-700">{filteredSuppliers.length}</strong> of {suppliers.length} suppliers
        </span>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.length > 0 ? (
          filteredSuppliers.map((sup) => {
            const purchaseCount = purchases.filter((p) => p.supplierId === sup.id || p.supplierName === sup.name).length;

            return (
              <div
                key={sup.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">
                          {sup.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {sup.id}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {sup.status || 'Active'}
                    </span>
                  </div>

                  {/* Details List */}
                  <div className="space-y-2 text-xs text-slate-600 my-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 w-4"><Users className="w-3.5 h-3.5" /></span>
                      <span className="font-medium text-slate-700">
                        {sup.contactPerson || 'Sales Desk'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 w-4"><Phone className="w-3.5 h-3.5" /></span>
                      <span>{sup.phone || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 w-4"><Mail className="w-3.5 h-3.5" /></span>
                      <span className="truncate">{sup.email || 'N/A'}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 w-4 mt-0.5"><MapPin className="w-3.5 h-3.5" /></span>
                      <span className="line-clamp-2 text-[11px] text-slate-500">
                        {sup.address || 'Address not registered'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {purchaseCount} Purchase{purchaseCount === 1 ? '' : 's'} Done
                  </span>

                  {isAdmin ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(sup)}
                        className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors"
                        title="Edit Supplier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingSupplier(sup)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Delete Supplier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">View Only</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No suppliers matched your search criteria.
          </div>
        )}
      </div>

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Supplier / Distributor"
        subtitle="Register pharmaceutical supply partner"
        maxWidth="max-w-md"
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
              Save Supplier
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Supplier / Agency Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Metro Pharma Logistics"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98110 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="orders@supplier.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                GSTIN / Tax ID
              </label>
              <input
                type="text"
                placeholder="07AAAAA0000A1Z5"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Warehouse / Office Address
            </label>
            <textarea
              rows="2"
              placeholder="Full physical business address..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </form>
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal
        isOpen={!!editingSupplier}
        onClose={() => setEditingSupplier(null)}
        title={`Edit Supplier: ${editingSupplier?.name}`}
        subtitle={`ID: ${editingSupplier?.id}`}
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingSupplier(null)}
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
        <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Supplier Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                GSTIN
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Address
            </label>
            <textarea
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Supplier Modal */}
      <Modal
        isOpen={!!deletingSupplier}
        onClose={() => setDeletingSupplier(null)}
        title="Confirm Delete Supplier"
        subtitle="This action cannot be undone"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={() => setDeletingSupplier(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
            >
              Confirm Delete
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          Delete supplier entry for <strong className="text-slate-900">{deletingSupplier?.name}</strong>?
          Historical purchase records will remain intact.
        </p>
      </Modal>
    </div>
  );
}
