import React from 'react';
import { getExpiryBadgeInfo, getStockBadgeInfo } from '../utils/formatters';

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    blue: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const sizeStyles = {
    xs: 'text-[11px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variantStyles[variant] || variantStyles.default} ${
        sizeStyles[size] || sizeStyles.sm
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function ExpiryBadge({ expiryDate }) {
  const info = getExpiryBadgeInfo(expiryDate);
  return (
    <Badge variant={info.variant} size="sm">
      <span className="flex items-center gap-1">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            info.variant === 'danger'
              ? 'bg-rose-500'
              : info.variant === 'warning'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
        />
        {info.label} {info.days <= 90 && info.days > 0 ? `(${info.days}d)` : ''}
      </span>
    </Badge>
  );
}

export function StockBadge({ quantity, minAlert = 15 }) {
  const info = getStockBadgeInfo(quantity, minAlert);
  return (
    <Badge variant={info.variant} size="sm">
      <span className="flex items-center gap-1">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            info.variant === 'danger'
              ? 'bg-rose-500'
              : info.variant === 'warning'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
        />
        {info.label}
      </span>
    </Badge>
  );
}
