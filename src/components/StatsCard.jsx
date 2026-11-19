import React from 'react';

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'default', // 'success', 'warning', 'danger', 'teal'
  onClick,
}) {
  const badgeClasses = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    teal: 'bg-teal-50 text-teal-700 border border-teal-200',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all hover:border-teal-300 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h4>
        {badgeText && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              badgeClasses[badgeType] || badgeClasses.default
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}
