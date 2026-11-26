import React, { useState } from 'react';
import {
  Pill,
  Building2,
  ArrowRight,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
} from 'lucide-react';
import { authApi } from '../services/api';

const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export default function RegisterStorePage({ onRegistered, onBackToLogin }) {
  const [step, setStep] = useState(1); // 1 = Owner Details, 2 = Store Details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    // Owner / Admin
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Store
    storeName: '',
    storePhone: '',
    storeEmail: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstin: '',
    drugLicenseNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (form.ownerName.trim().length < 2 || form.ownerName.trim().length > 100) return 'Full name must be between 2 and 100 characters.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email address is required.';
    if (form.email.trim().length > 120) return 'Email address cannot exceed 120 characters.';
    if (!form.phone.trim() || !/^[0-9]{10}$/.test(form.phone.trim())) return 'Valid 10-digit mobile number is required.';
    if (!form.password || form.password.length < 6 || form.password.length > 50) return 'Password must be between 6 and 50 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const validateStep2 = () => {
    if (form.storeName.trim().length < 2 || form.storeName.trim().length > 150) return 'Medical store name must be between 2 and 150 characters.';
    if (form.address.trim().length > 255) return 'Address cannot exceed 255 characters.';
    if (form.city.trim().length > 80) return 'City cannot exceed 80 characters.';
    if (form.storePhone.trim() && !/^[0-9+() -]{7,20}$/.test(form.storePhone.trim())) return 'Enter a valid store contact number.';
    if (form.storeEmail.trim() && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.storeEmail.trim()) || form.storeEmail.trim().length > 120)) {
      return 'Enter a valid store email address.';
    }
    if (!form.drugLicenseNumber.trim() || form.drugLicenseNumber.trim().length > 50) return 'Drug License Number is required and must be at most 50 characters.';
    if (!form.address.trim()) return 'Store address is required.';
    if (!form.city.trim()) return 'City is required.';
    if (!form.state) return 'State is required.';
    if (!form.pincode.trim() || !/^[0-9]{6}$/.test(form.pincode.trim())) return 'Valid 6-digit PIN code is required.';
    if (form.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i.test(form.gstin.trim())) {
      return 'Invalid GSTIN format (e.g. 27AABCU9603R1ZX).';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setStep(2);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ownerName: form.ownerName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        storeName: form.storeName.trim(),
        storePhone: form.storePhone.trim() || form.phone.trim(),
        storeEmail: form.storeEmail.trim() || null,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state,
        pincode: form.pincode.trim(),
        gstin: form.gstin.trim().toUpperCase() || null,
        drugLicenseNumber: form.drugLicenseNumber.trim(),
      };

      const response = await authApi.registerStore(payload);
      if (response && response.success && response.data) {
        setSuccess(`Store "${form.storeName}" registered successfully! Redirecting to login...`);
        setTimeout(() => {
          if (onRegistered) onRegistered(response.data);
        }, 2000);
      } else {
        throw new Error(response?.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'text', placeholder, required, icon: Icon, maxLength }) => (
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
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 shadow-lg mb-3">
            <Pill className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Register Your Medical Store</h1>
          <p className="text-sm text-slate-500 mt-1">Create your store account to get started</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                s < step ? 'bg-teal-600 text-white' :
                s === step ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              <span className={`text-xs font-medium ${s === step ? 'text-teal-700' : 'text-slate-400'}`}>
                {s === 1 ? 'Owner Details' : 'Store Details'}
              </span>
              {s < 2 && <div className={`w-8 h-0.5 ${step > s ? 'bg-teal-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 mb-5 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* STEP 1: Owner Details */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Owner / Administrator Details</h2>
                  <p className="text-xs text-slate-500">Your personal account credentials</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField label="Full Name" name="ownerName" placeholder="Full name" required icon={User} maxLength={100} />
                </div>
                <InputField label="Email Address" name="email" type="email" placeholder="owner@yourstore.com" required icon={Mail} />
                <InputField label="Mobile Number" name="phone" placeholder="9876543210" required icon={Phone} maxLength={10} />
                <InputField label="Password" name="password" type="password" placeholder="Min. 6 characters" required icon={Lock} />
                <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter password" required icon={Lock} />
              </div>

              <button
                onClick={handleNext}
                className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Next: Store Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Store Details */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Medical Store Details</h2>
                  <p className="text-xs text-slate-500">Your pharmacy/medical store information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField label="Medical Store Name" name="storeName" placeholder="Your medical store name" required icon={Building2} maxLength={150} />
                </div>
                <InputField label="Store Contact Number" name="storePhone" placeholder="Store phone / landline" icon={Phone} />
                <InputField label="Store Email (Optional)" name="storeEmail" type="email" placeholder="store@yourstore.com" icon={Mail} />
                <div className="sm:col-span-2">
                  <InputField label="Full Address" name="address" placeholder="Building, Street, Locality" required icon={MapPin} maxLength={255} />
                </div>
                <InputField label="City" name="city" placeholder="City" required maxLength={80} />
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  >
                    <option value="">Select State</option>
                    {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <InputField label="PIN Code" name="pincode" placeholder="400001" required maxLength={6} />
                <InputField label="GSTIN (Optional)" name="gstin" placeholder="27AABCU9603R1ZX" icon={FileText} maxLength={15} />
                <div className="sm:col-span-2">
                  <InputField label="Drug License Number" name="drugLicenseNumber" placeholder="Drug license number" required icon={FileText} maxLength={50} />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Registering Store...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Register Medical Store</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back to Login */}
        <div className="text-center mt-5">
          <button
            onClick={onBackToLogin}
            className="text-sm text-teal-700 hover:text-teal-800 font-medium hover:underline transition-colors"
          >
            ← Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
