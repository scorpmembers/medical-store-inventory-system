import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Calendar,
  Download,
  Printer,
  Package,
  Layers,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { SalesBarChart, MonthlyRevenueChart, CategoryBreakdownList } from '../components/Charts';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';

export default function ReportsPage() {
  const {
    sales,
    purchases,
    batches,
    medicines,
    totalRevenue,
    showToast
  } = useStore();

  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'

  // Calculate Fast Moving Medicines (from sales items)
  const medicineSalesMap = {};
  sales.forEach((s) => {
    if (s.items) {
      s.items.forEach((item) => {
        if (!medicineSalesMap[item.medicineName]) {
          medicineSalesMap[item.medicineName] = {
            name: item.medicineName,
            unitsSold: 0,
            revenue: 0,
            category: ''
          };
        }
        medicineSalesMap[item.medicineName].unitsSold += Number(item.quantity) || 0;
        medicineSalesMap[item.medicineName].revenue += Number(item.total) || 0;
      });
    }
  });

  // Convert to array and sort descending
  const fastMoving = Object.values(medicineSalesMap).sort((a, b) => b.unitsSold - a.unitsSold);

  // Slow moving medicines (medicines in catalog with 0 or very few units sold)
  const slowMoving = medicines
    .filter((m) => !medicineSalesMap[m.name] || medicineSalesMap[m.name].unitsSold <= 1)
    .map((m) => {
      const stock = batches.filter((b) => b.medicineId === m.id).reduce((s, b) => s + b.quantity, 0);
      return {
        id: m.id,
        name: m.name,
        category: m.category,
        rackLocation: m.rackLocation,
        unitsSold: medicineSalesMap[m.name]?.unitsSold || 0,
        stockRemaining: stock
      };
    });

  // Inventory valuation
  const inventoryCostValue = batches.reduce(
    (sum, b) => sum + (Number(b.quantity) || 0) * (Number(b.purchasePrice) || 0),
    0
  );
  const inventoryRetailValue = batches.reduce(
    (sum, b) => sum + (Number(b.quantity) || 0) * (Number(b.sellingPrice) || 0),
    0
  );
  const potentialProfit = inventoryRetailValue - inventoryCostValue;

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCSV = () => {
    showToast('Report CSV export completed (Demo simulation).', 'success', 'Exported');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Financial Reports & Performance Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Store turnover trends, fast vs slow moving drug inventory, and profit margin analysis.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Gross Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="Cumulative sales billing"
          icon={IndianRupee}
          badgeText="+14.2%"
          badgeType="success"
        />

        <StatsCard
          title="Inventory At Cost"
          value={formatCurrency(inventoryCostValue)}
          subtitle="Capital locked in current stock"
          icon={Package}
          badgeText="Asset"
          badgeType="teal"
        />

        <StatsCard
          title="Inventory At Retail MRP"
          value={formatCurrency(inventoryRetailValue)}
          subtitle="Realizable retail revenue"
          icon={TrendingUp}
          badgeText="Gross Val."
          badgeType="teal"
        />

        <StatsCard
          title="Projected Profit Margin"
          value={formatCurrency(potentialProfit)}
          subtitle="Est. ~28.5% margin on retail"
          icon={BarChart3}
          badgeText="Profitable"
          badgeType="success"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Weekly Sales Turnover
              </h3>
              <p className="text-xs text-slate-500">
                Daily bill collection over the past 7 days
              </p>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Current Week
            </span>
          </div>
          <SalesBarChart height={220} />
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Monthly Revenue & Profit Progression
              </h3>
              <p className="text-xs text-slate-500">
                Historical monthly turnover vs purchase cost
              </p>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              H2 2026
            </span>
          </div>
          <MonthlyRevenueChart />
        </div>
      </div>

      {/* Fast-Moving vs Slow-Moving Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast-Moving Medicines */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Fast-Moving Medicines (Top Demand)
                </h3>
                <p className="text-xs text-slate-500">High turnover items to keep well-stocked</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              High Velocity
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">#</th>
                  <th className="py-2.5 px-4">Medicine Name</th>
                  <th className="py-2.5 px-4 text-center">Units Sold</th>
                  <th className="py-2.5 px-4 text-right">Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fastMoving.slice(0, 5).map((med, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      {med.name}
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-teal-800">
                      {med.unitsSold} units
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                      {formatCurrency(med.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slow-Moving / Dead Stock Risk */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Slow-Moving / Dead Stock Watchlist
                </h3>
                <p className="text-xs text-slate-500">Low turnover items at risk of expiry</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Low Velocity
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Medicine Name</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Location</th>
                  <th className="py-2.5 px-4 text-center">Unsold Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slowMoving.slice(0, 5).map((med, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      {med.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {med.category}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {med.rackLocation || 'Shelf'}
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-amber-800">
                      {med.stockRemaining} units
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
