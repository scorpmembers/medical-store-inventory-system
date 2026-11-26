import React, { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { storeApi } from '../services/api';

const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export default function StoreSettingsPage() {
  const { updateStoreProfile, isAdmin } = useStore();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    ownerName: '',
    storeName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstin: '',
    drugLicenseNumber: '',
  });

  // Fetch current store profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setFetchLoading(true);
      try {
        const response = await storeApi.getProfile();
        if (response && response.success && response.data) {
          const d = response.data;
          setForm({
            ownerName: d.ownerName || '',
            storeName: d.storeName || '',
            phone: d.phone || '',
            email: d.email || '',
            address: d.address || '',
            city: d.city || '',
            state: d.state || '',
            pincode: d.pincode || '',
            gstin: d.gstin || '',
            drugLicenseNumber: d.drugLicenseNumber || '',
          });
        }
      } catch (err) {
        setError(err.message || 'Unable to load your store profile.');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.ownerName.trim().length < 2 || form.ownerName.trim().length > 100) { setError('Owner name must be between 2 and 100 characters.'); return; }
    if (form.storeName.trim().length < 2 || form.storeName.trim().length > 150) { setError('Store name must be between 2 and 150 characters.'); return; }
    if (!/^[0-9+() -]{7,20}$/.test(form.phone.trim())) { setError('Enter a valid store contact number.'); return; }
    if (!form.address.trim() || form.address.trim().length > 255) { setError('Address is required and cannot exceed 255 characters.'); return; }
    if (!form.city.trim() || form.city.trim().length > 80) { setError('City is required and cannot exceed 80 characters.'); return; }
    if (!form.state) { setError('State is required.'); return; }
    if (form.email.trim() && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.trim().length > 120)) {
      setError('Enter a valid store email address.'); return;
    }
    if (!form.pincode.trim() || !/^[0-9]{6}$/.test(form.pincode.trim())) {
      setError('Valid 6-digit PIN code is required.'); return;
    }
    if (form.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i.test(form.gstin.trim())) {
      setError('Invalid GSTIN format.'); return;
    }
    if (form.drugLicenseNumber.trim().length > 50) { setError('Drug License Number cannot exceed 50 characters.'); return; }

    setLoading(true);
    try {
      await updateStoreProfile(form);
      setSuccess('Store profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update store settings.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Store Settings is only accessible to Administrators.</p>
        </div>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const Field = ({ label, name, type = 'text', placeholder, required, icon: Icon, maxLength }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-teal-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Store Settings</h1>
        </div>
        <p className="text-sm text-slate-500 ml-12">
          Update your medical store profile, contact details, and license information.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {error && (
          <div className="flex items-center gap-2 p-3 mb-5 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 mb-5 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-700">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Store Identity */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Store Identity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Owner Name" name="ownerName" placeholder="Store owner full name" required icon={ShieldCheck} maxLength={100} />
              <div className="sm:col-span-2">
                <Field label="Medical Store Name" name="storeName" placeholder="Your medical store name" required icon={Building2} maxLength={150} />
              </div>
              <Field label="Contact Phone" name="phone" placeholder="Store phone number" required icon={Phone} />
              <Field label="Store Email" name="email" type="email" placeholder="Store email address" icon={Mail} maxLength={120} />
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Full Address" name="address" placeholder="Building, Street, Locality" required icon={MapPin} maxLength={255} />
              </div>
              <Field label="City" name="city" placeholder="City" required maxLength={80} />
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State <span className="text-rose-500">*</span>
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                >
                  <option value="">Select State</option>
                  {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Field label="PIN Code" name="pincode" placeholder="400001" required maxLength={6} />
            </div>
          </div>

          {/* Regulatory */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Regulatory & Tax</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="GSTIN (Optional)" name="gstin" placeholder="Enter GSTIN" icon={FileText} maxLength={15} />
              <Field label="Drug License Number" name="drugLicenseNumber" placeholder="Drug license number" icon={FileText} maxLength={50} />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving...' : 'Save Store Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
