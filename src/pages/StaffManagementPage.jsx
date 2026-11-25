import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Lock,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import Modal from '../components/Modal';
import { adminApi } from '../services/api';
import { useStore } from '../context/StoreContext';
import { formatDate } from '../utils/formatters';

export default function StaffManagementPage() {
  const { user, showToast, isAdmin } = useStore();

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  // New staff form state
  const initialForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
  };
  const [formData, setFormData] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch users from backend API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllUsers();
      if (response && response.data) {
        setUsersList(response.data);
      }
    } catch (err) {
      console.warn('Backend users fetch fallback to local:', err);
      // Fallback demo users if offline
      setUsersList([
        {
          id: 1,
          name: 'System Administrator',
          email: 'admin@medstore.com',
          phone: '+91 98110 00001',
          role: 'ROLE_ADMIN',
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Pharmacist Staff',
          email: 'staff@medstore.com',
          phone: '+91 98110 00002',
          role: 'ROLE_STAFF',
          active: true,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Permission Guard: Staff cannot view or manage this page
  if (!isAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Access Restricted: Administrator Only
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          You are currently logged in as <strong>{user?.name || 'Staff Member'}</strong> with role{' '}
          <span className="font-semibold text-teal-700">ROLE_STAFF</span>. Staff members are not permitted
          to access or manage user accounts and system credentials.
        </p>
        <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-200">
          This restriction is enforced on both the Spring Boot backend security layer and the frontend navigation.
        </div>
      </div>
    );
  }

  // Handle Add Staff Submit
  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setFormLoading(true);
    try {
      const response = await adminApi.createStaff(formData);
      showToast(response?.message || 'Staff member created successfully.', 'success', 'Staff Added');
      setIsAddModalOpen(false);
      setFormData(initialForm);
      fetchUsers();
    } catch (err) {
      setFormError(err.message || 'Failed to create staff account.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Toggle Active/Inactive
  const handleToggleStatus = async (targetUser) => {
    if (targetUser.email === user?.email) {
      showToast('You cannot deactivate your own logged-in admin account.', 'warning', 'Action Blocked');
      return;
    }

    try {
      const response = await adminApi.toggleStaffStatus(targetUser.id);
      showToast(
        response?.message || `User ${targetUser.active ? 'deactivated' : 'activated'}.`,
        'info',
        'Status Updated'
      );
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update user status.', 'error');
    }
  };

  // Handle Delete Staff
  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    try {
      await adminApi.deleteStaff(deletingUser.id);
      showToast(`User ${deletingUser.name} deleted successfully.`, 'info', 'User Deleted');
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to delete user.', 'error');
    }
  };

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  const staffCount = usersList.filter((u) => u.role === 'ROLE_STAFF').length;
  const adminCount = usersList.filter((u) => u.role === 'ROLE_ADMIN').length;
  const activeCount = usersList.filter((u) => u.active).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Staff & User Management
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              Admin Control Panel
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Create pharmacy staff accounts, manage operational credentials, and configure access permissions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Refresh users list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setFormData(initialForm);
              setFormError('');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total System Accounts
          </span>
          <div className="text-2xl font-bold text-slate-800 mt-1">
            {usersList.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {adminCount} Admin • {staffCount} Staff Members
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Staff Members
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {activeCount} Active
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Permitted to log in and bill medicines
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Access Security Layer
          </span>
          <div className="text-xl font-bold text-indigo-700 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>BCrypt & JWT</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Role-based Spring Security authorization
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by staff name, email, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-teal-700">{filteredUsers.length}</strong> accounts
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4 text-center">Assigned Role</th>
                <th className="py-3 px-4 text-center">Account Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isCurrentAdmin = u.email === user?.email;
                  const isUserAdmin = u.role === 'ROLE_ADMIN';

                  return (
                    <tr key={u.id || u.email} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {isCurrentAdmin && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                              (You)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{u.phone || 'Not provided'}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            isUserAdmin
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-teal-50 text-teal-700 border-teal-200'
                          }`}
                        >
                          {isUserAdmin ? (
                            <>
                              <ShieldCheck className="w-3 h-3" />
                              <span>ADMIN</span>
                            </>
                          ) : (
                            <>
                              <Users className="w-3 h-3" />
                              <span>STAFF</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            u.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {u.active ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              <span>Deactivated</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {formatDate(u.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        {isUserAdmin ? (
                          <span className="text-[11px] text-slate-400 italic">Protected</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`px-2 py-1 text-[11px] font-medium rounded border transition-colors ${
                                u.active
                                  ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200'
                                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                              }`}
                              title={u.active ? 'Deactivate staff account' : 'Activate staff account'}
                            >
                              {u.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => setDeletingUser(u)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete staff account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No staff or user accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Pharmacy Staff Account"
        subtitle="Administrator creating staff credentials for pharmacy staff"
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
              disabled={formLoading}
              onClick={handleAddStaffSubmit}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              {formLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Create Staff Account</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleAddStaffSubmit} className="space-y-3.5 text-xs">
          {formError && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Staff Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Meera Patel"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Staff Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="meera@medstore.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 98450 12345"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Initial Login Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Password will be encrypted using BCrypt before storing in MySQL database.
            </p>
          </div>
        </form>
      </Modal>

      {/* Delete Staff Confirmation Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Confirm Delete Staff Account"
        subtitle="This action removes staff credentials"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={() => setDeletingUser(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
            >
              Delete Staff
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          Are you sure you want to permanently delete staff member{' '}
          <strong className="text-slate-900">{deletingUser?.name}</strong> ({deletingUser?.email})?
          They will no longer be able to log in to the system.
        </p>
      </Modal>
    </div>
  );
}
