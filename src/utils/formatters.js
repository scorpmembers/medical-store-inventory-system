// Utility functions for formatting and calculations

/**
 * Format number as Indian Rupee (₹)
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(num);
};

/**
 * Format date string (YYYY-MM-DD) to readable format (DD MMM YYYY)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Calculate days remaining until expiry
 * Negative value means already expired
 */
export const getDaysRemaining = (expiryDateString) => {
  if (!expiryDateString) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDateString);
  exp.setHours(0, 0, 0, 0);
  const diffTime = exp.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if a batch is expired
 */
export const isExpired = (expiryDateString) => {
  return getDaysRemaining(expiryDateString) <= 0;
};

/**
 * Check if a batch is near expiry (within 90 days)
 */
export const isNearExpiry = (expiryDateString, daysThreshold = 90) => {
  const days = getDaysRemaining(expiryDateString);
  return days > 0 && days <= daysThreshold;
};

/**
 * Get comprehensive expiry status object
 */
export const getExpiryBadgeInfo = (expiryDateString) => {
  const days = getDaysRemaining(expiryDateString);
  if (days <= 0) {
    return {
      status: 'expired',
      label: 'Expired',
      days,
      variant: 'danger',
      description: `Expired ${Math.abs(days)} days ago`
    };
  } else if (days <= 90) {
    return {
      status: 'near-expiry',
      label: 'Near Expiry',
      days,
      variant: 'warning',
      description: `Expires in ${days} days`
    };
  } else {
    return {
      status: 'good',
      label: 'Good',
      days,
      variant: 'success',
      description: `Valid (${days} days left)`
    };
  }
};

/**
 * Get stock badge status
 */
export const getStockBadgeInfo = (quantity, minAlert = 15) => {
  const qty = Number(quantity) || 0;
  if (qty <= 0) {
    return { status: 'out-of-stock', label: 'Out of Stock', variant: 'danger' };
  } else if (qty <= minAlert) {
    return { status: 'low-stock', label: `Low (${qty})`, variant: 'warning' };
  } else {
    return { status: 'in-stock', label: `In Stock (${qty})`, variant: 'success' };
  }
};
