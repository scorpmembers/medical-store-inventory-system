import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

/**
 * 7-Day Sales Overview Bar Chart
 */
const weeklySalesData = (sales) => Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - 6 + index);
  const dateKey = date.toISOString().split('T')[0];
  const daySales = sales.filter((sale) => (sale.saleDate || sale.date) === dateKey);
  return {
    label: date.toLocaleDateString(undefined, { weekday: 'short' }),
    date: date.toLocaleDateString(),
    amount: daySales.reduce((sum, sale) => sum + Number(sale.grandTotal || 0), 0),
    orders: daySales.length,
    isToday: index === 6,
  };
}).filter((day, index, days) => day.amount > 0 || days.some((item) => item.amount > 0));

export function SalesBarChart({ data = [], sales = [], height = 220 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const chartData = data.length > 0 ? data : weeklySalesData(sales);
  const maxVal = Math.max(...chartData.map((d) => d.amount), 1);

  if (chartData.length === 0) {
    return <p className="py-12 text-center text-xs text-slate-400">No sales recorded for this period.</p>;
  }

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 pt-6 pb-2" style={{ height: `${height}px` }}>
        {chartData.map((item, idx) => {
          const heightPercent = Math.round((item.amount / maxVal) * 100);
          const isHovered = hoveredIdx === idx;
          const isToday = item.isToday;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap pointer-events-none transform -translate-x-1/2 left-1/2">
                  <div className="font-semibold">{item.date || item.label}</div>
                  <div className="text-teal-300">{formatCurrency(item.amount)} ({item.orders} bills)</div>
                </div>
              )}

              {/* Bar value label */}
              <span className="text-[10px] font-medium text-slate-500 mb-1">
                ₹{(item.amount / 1000).toFixed(1)}k
              </span>

              {/* Bar track */}
              <div className="w-full max-w-[42px] bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden p-0.5">
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    isToday
                      ? 'bg-teal-600 group-hover:bg-teal-700'
                      : isHovered
                      ? 'bg-teal-500'
                      : 'bg-teal-400/80 group-hover:bg-teal-500'
                  }`}
                  style={{ height: `${Math.max(8, heightPercent)}%` }}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-xs mt-2 font-medium truncate max-w-full ${
                  isToday ? 'text-teal-700 font-bold' : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2 px-1">
        <span>Min: ₹0</span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-teal-400"></span> Previous Days
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-teal-600"></span> Today
        </span>
        <span>Peak: {formatCurrency(maxVal)}</span>
      </div>
    </div>
  );
}

/**
 * Monthly Revenue Comparison Chart
 */
export function MonthlyRevenueChart({ sales = [], purchases = [] }) {
  const today = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const revenue = sales
      .filter((sale) => {
        const saleDate = new Date(sale.saleDate || sale.date);
        return saleDate.getFullYear() === year && saleDate.getMonth() === monthIndex;
      })
      .reduce((sum, sale) => sum + Number(sale.grandTotal || 0), 0);
    const purchaseTotal = purchases
      .filter((purchase) => {
        const purchaseDate = new Date(purchase.purchaseDate || purchase.date);
        return purchaseDate.getFullYear() === year && purchaseDate.getMonth() === monthIndex;
      })
      .reduce((sum, purchase) => sum + Number(purchase.totalAmount || 0), 0);
    return {
      month: date.toLocaleDateString(undefined, { month: 'short' }),
      revenue,
      purchases: purchaseTotal,
      profit: revenue - purchaseTotal,
    };
  });

  if (sales.length === 0 && purchases.length === 0) {
    return <p className="py-12 text-center text-xs text-slate-400">No sales or purchases recorded for this period.</p>;
  }

  const maxVal = Math.max(...months.map((month) => month.revenue), 1);

  return (
    <div className="w-full">
      <div className="space-y-4 pt-2">
        {months.map((m, idx) => {
          const revPercent = (m.revenue / maxVal) * 100;
          return (
            <div key={idx} className="text-xs">
              <div className="flex justify-between items-center mb-1 text-slate-700 font-medium">
                <span className="w-16 font-semibold text-slate-800">{m.month}</span>
                <span className="text-emerald-700 font-semibold">{formatCurrency(m.revenue)}</span>
                <span className="text-slate-500">Cost: {formatCurrency(m.purchases)}</span>
                <span className="text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  Profit: {formatCurrency(m.profit)}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full rounded-l-full"
                  style={{ width: `${revPercent}%` }}
                  title={`Revenue: ${formatCurrency(m.revenue)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Total Revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-teal-100 border border-teal-300 inline-block"></span> Gross Profit
        </span>
      </div>
    </div>
  );
}

/**
 * Category Breakdown with visual bars
 */
export function CategoryBreakdownList({ medicines = [] }) {
  const colors = ['bg-teal-500', 'bg-emerald-500', 'bg-sky-500', 'bg-indigo-500', 'bg-amber-500', 'bg-rose-400'];
  const categoryCounts = medicines.reduce((counts, medicine) => {
    const category = medicine.category || 'Uncategorized';
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
  const totalMedicines = medicines.length;
  const items = Object.entries(categoryCounts).map(([name, total], index) => ({
    name,
    items: total,
    share: Math.round((total / totalMedicines) * 100),
    color: colors[index % colors.length],
  }));

  if (items.length === 0) {
    return <p className="py-8 text-center text-xs text-slate-400">No medicines have been added.</p>;
  }

  return (
    <div className="space-y-3.5">
      {items.map((cat, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-slate-700">{cat.name}</span>
            <span className="text-slate-500 font-semibold">{cat.share}% ({cat.items} products)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${cat.color || 'bg-teal-500'}`}
              style={{ width: `${cat.share}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
