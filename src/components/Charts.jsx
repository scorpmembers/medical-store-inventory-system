import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

/**
 * 7-Day Sales Overview Bar Chart
 */
export function SalesBarChart({ data = [], height = 220 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Default past 7 days data if empty
  const defaultData = [
    { label: 'Thu', date: '12 Nov', amount: 3200, orders: 8 },
    { label: 'Fri', date: '13 Nov', amount: 4850, orders: 12 },
    { label: 'Sat', date: '14 Nov', amount: 6200, orders: 16 },
    { label: 'Sun', date: '15 Nov', amount: 3900, orders: 9 },
    { label: 'Mon', date: '16 Nov', amount: 5120, orders: 14 },
    { label: 'Tue', date: '17 Nov', amount: 4450, orders: 11 },
    { label: 'Wed', date: '18 Nov (Today)', amount: 6850, orders: 18, isToday: true },
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const maxVal = Math.max(...chartData.map((d) => d.amount), 7500);

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
export function MonthlyRevenueChart() {
  const months = [
    { month: 'Jun', revenue: 78500, purchases: 52000, profit: 26500 },
    { month: 'Jul', revenue: 92400, purchases: 61000, profit: 31400 },
    { month: 'Aug', revenue: 84000, purchases: 57500, profit: 26500 },
    { month: 'Sep', revenue: 105600, purchases: 72000, profit: 33600 },
    { month: 'Oct', revenue: 118200, purchases: 81000, profit: 37200 },
    { month: 'Nov (Est)', revenue: 125000, purchases: 84000, profit: 41000 },
  ];

  const maxVal = 135000;

  return (
    <div className="w-full">
      <div className="space-y-4 pt-2">
        {months.map((m, idx) => {
          const revPercent = (m.revenue / maxVal) * 100;
          const purPercent = (m.purchases / maxVal) * 100;

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
export function CategoryBreakdownList({ categories = [] }) {
  const defaultCategories = [
    { name: 'Antibiotics', items: 12, share: 28, color: 'bg-teal-500' },
    { name: 'Analgesics & Pain Relief', items: 15, share: 22, color: 'bg-emerald-500' },
    { name: 'Antacids & GI Care', items: 10, share: 18, color: 'bg-sky-500' },
    { name: 'Antidiabetic', items: 8, share: 14, color: 'bg-indigo-500' },
    { name: 'Cardiovascular & BP', items: 9, share: 10, color: 'bg-amber-500' },
    { name: 'Vitamins & Supplements', items: 14, share: 8, color: 'bg-rose-400' },
  ];

  const items = categories.length > 0 ? categories : defaultCategories;

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
