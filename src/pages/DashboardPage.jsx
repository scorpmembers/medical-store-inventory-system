import React, { useState } from 'react';
import {
  Pill,
  Boxes,
  IndianRupee,
  AlertTriangle,
  AlertCircle,
  PlusCircle,
  TrendingUp,
  ShoppingCart,
  Eye,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { SalesBarChart, CategoryBreakdownList } from '../components/Charts';
import InvoiceModal from '../components/InvoiceModal';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function DashboardPage({ setActivePage }) {
  const {
    totalMedicinesCount,
    totalStockCount,
    todaySalesTotal,
    todaySalesCount,
    lowStockMedicines,
    nearExpiryBatches,
    expiredBatches,
    sales,
    medicines,
    isAdmin,
    isStaff,
    user
  } = useStore();

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Take the 5 most recent sales
  const recentSales = sales.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {isStaff ? `Staff Counter Dashboard - Welcome, ${user?.name || 'Staff'}` : 'Pharmacy Control Center'}
            </h2>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isAdmin
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}
            >
              {isAdmin ? 'ADMINISTRATOR' : 'STAFF MEMBER'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isStaff
              ? 'Authorized for counter sales, medicine search, batch status lookup, and patient receipt generation.'
              : 'Real-time stock monitoring, sales turnover, user accounts, and batch expiry surveillance.'}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePage('sales')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Sale (POS)</span>
          </button>

          {isAdmin ? (
            <>
              <button
                onClick={() => setActivePage('medicines')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Pill className="w-4 h-4 text-slate-500" />
                <span>Add Medicine</span>
              </button>
              <button
                onClick={() => setActivePage('staff-management')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
              >
                <Pill className="w-4 h-4 text-indigo-600 hidden" />
                <span>Manage Staff</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setActivePage('medicines')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Pill className="w-4 h-4 text-slate-500" />
              <span>Browse Medicines</span>
            </button>
          )}

          <button
            onClick={() => setActivePage('inventory')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Boxes className="w-4 h-4 text-slate-500" />
            <span>Batch Inventory</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Medicines"
          value={totalMedicinesCount}
          subtitle="Registered catalog items"
          icon={Pill}
          badgeText="Active"
          badgeType="teal"
          onClick={() => setActivePage('medicines')}
        />

        <StatsCard
          title="Available Stock"
          value={totalStockCount}
          subtitle="Total units in pharmacy"
          icon={Boxes}
          badgeText="In Stock"
          badgeType="success"
          onClick={() => setActivePage('inventory')}
        />

        <StatsCard
          title="Today's Sales"
          value={formatCurrency(todaySalesTotal)}
          subtitle={`${todaySalesCount} invoices billed today`}
          icon={IndianRupee}
          badgeText="Today"
          badgeType="teal"
          onClick={() => setActivePage('sales')}
        />

        <StatsCard
          title="Low-Stock Alerts"
          value={lowStockMedicines.length}
          subtitle="Below safety threshold"
          icon={AlertCircle}
          badgeText={lowStockMedicines.length > 0 ? 'Reorder' : 'Optimal'}
          badgeType={lowStockMedicines.length > 0 ? 'warning' : 'success'}
          onClick={() => setActivePage('inventory')}
        />

        <StatsCard
          title="Expiry Alerts"
          value={nearExpiryBatches.length + expiredBatches.length}
          subtitle={`${expiredBatches.length} expired, ${nearExpiryBatches.length} near expiry`}
          icon={AlertTriangle}
          badgeText={expiredBatches.length > 0 ? 'Action Req.' : 'Protected'}
          badgeType={expiredBatches.length > 0 ? 'danger' : 'warning'}
          onClick={() => setActivePage('inventory')}
        />
      </div>

      {/* Urgent Alerts Notification Box (if expired or near expiry exist) */}
      {(expiredBatches.length > 0 || nearExpiryBatches.length > 0) && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Critical Inventory Expiry Notice
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {expiredBatches.length > 0 && (
                  <span className="font-semibold text-rose-700 mr-2">
                    • {expiredBatches.length} batch(es) have EXPIRED and are blocked from sales.
                  </span>
                )}
                {nearExpiryBatches.length > 0 && (
                  <span>
                    • {nearExpiryBatches.length} batch(es) will expire within 90 days.
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('inventory')}
            className="self-start md:self-center px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
          >
            Review Batches &rarr;
          </button>
        </div>
      )}

      {/* Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Sales Overview (Past 7 Days)
              </h3>
              <p className="text-xs text-slate-500">
                Daily turnover and bill volume progression
              </p>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Live Tracker
            </span>
          </div>

          <SalesBarChart />
        </div>

        {/* Medicine Category Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Stock by Therapy Category
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of inventoried medications
            </p>
          </div>

          <CategoryBreakdownList />
        </div>
      </div>

      {/* Recent Sales Activity & Alerts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Recent Sales Activity</h3>
              <p className="text-xs text-slate-500">Latest customer invoices processed</p>
            </div>
            <button
              onClick={() => setActivePage('sales')}
              className="text-xs font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              View All Invoices <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4">Invoice #</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Date / Time</th>
                  <th className="py-2.5 px-4 text-center">Items</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSales.map((sale) => (
                  <tr key={sale.invoiceNumber} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {sale.invoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{sale.customerName}</div>
                      <div className="text-[11px] text-slate-400">{sale.paymentMethod}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{formatDate(sale.date)}</div>
                      <div className="text-[11px] text-slate-400">{sale.time}</div>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-700 font-medium">
                      {sale.items?.length || 1}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-teal-800">
                      {formatCurrency(sale.grandTotal)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedInvoice(sale)}
                        className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors"
                        title="View & Print Bill"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Low Stock Watchlist</h3>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {lowStockMedicines.length} Items
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Items approaching reorder thresholds:
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {lowStockMedicines.length > 0 ? (
                lowStockMedicines.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{m.name}</p>
                      <p className="text-[11px] text-slate-500">{m.rackLocation} • Min: {m.minStockAlert}</p>
                    </div>
                    <button
                      onClick={() => setActivePage('purchases')}
                      className="px-2 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 transition-colors"
                    >
                      Reorder
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  All medicines are well-stocked.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActivePage('purchases')}
            className="w-full mt-4 py-2 px-3 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Create Purchase Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          sale={selectedInvoice}
        />
      )}
    </div>
  );
}
