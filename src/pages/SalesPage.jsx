import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  CreditCard,
  User,
  Phone,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate, isExpired } from '../utils/formatters';

export default function SalesPage() {
  const {
    medicines,
    batches,
    sales,
    addSale,
    showToast
  } = useStore();

  // Selected invoice for preview modal
  const [activeInvoice, setActiveInvoice] = useState(null);

  // Sales History search
  const [historySearch, setHistorySearch] = useState('');

  // Bill Customer Details
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // 'Cash', 'UPI', 'Card'
  const [discountAmount, setDiscountAmount] = useState('');

  // Current Item Selection
  const [selectedMedicineId, setSelectedMedicineId] = useState(medicines[0]?.id || '');
  const [selectedBatchNumber, setSelectedBatchNumber] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');

  // Cart Items
  const [cartItems, setCartItems] = useState([]);

  React.useEffect(() => {
    if (medicines.length > 0 && !medicines.some((medicine) => String(medicine.id) === String(selectedMedicineId))) {
      setSelectedMedicineId(String(medicines[0].id));
    }
  }, [medicines, selectedMedicineId]);

  // Batches for the currently selected medicine
  const availableBatchesForMed = useMemo(() => {
    return batches.filter((b) => String(b.medicineId) === String(selectedMedicineId));
  }, [batches, selectedMedicineId]);

  // Active batch object
  const activeBatch = useMemo(() => {
    return batches.find((b) => b.batchNumber === selectedBatchNumber);
  }, [batches, selectedBatchNumber]);

  // Update batch selection when medicine changes
  React.useEffect(() => {
    if (availableBatchesForMed.length > 0) {
      // Find the first non-expired batch with quantity > 0 if possible
      const validBatch = availableBatchesForMed.find((b) => !b.isExpired && b.quantity > 0);
      setSelectedBatchNumber(validBatch ? validBatch.batchNumber : availableBatchesForMed[0].batchNumber);
    } else {
      setSelectedBatchNumber('');
    }
  }, [selectedMedicineId, availableBatchesForMed]);

  // Check if active batch has issues
  const batchExpired = activeBatch ? isExpired(activeBatch.expiryDate) : false;
  const batchOutOfStock = activeBatch ? activeBatch.quantity <= 0 : true;

  // Add Item to Cart
  const handleAddToCart = () => {
    if (!selectedMedicineId || !selectedBatchNumber) {
      showToast('Please select a medicine and batch.', 'error');
      return;
    }

    if (!activeBatch) {
      showToast('Invalid batch selected.', 'error');
      return;
    }

    if (batchExpired) {
      showToast(
        `Safety Block: Batch #${activeBatch.batchNumber} has expired on ${activeBatch.expiryDate}. Expired medicines cannot be sold.`,
        'error',
        'Expired Drug Locked'
      );
      return;
    }

    const qty = parseInt(itemQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      showToast('Please enter a valid quantity of at least 1.', 'error');
      return;
    }

    // Check existing quantity already in cart for this batch
    const existingCartItem = cartItems.find((item) => item.batchNumber === activeBatch.batchNumber);
    const alreadyInCart = existingCartItem ? existingCartItem.quantity : 0;
    const totalRequired = alreadyInCart + qty;

    if (totalRequired > activeBatch.quantity) {
      showToast(
        `Cannot add ${qty} units. Only ${activeBatch.quantity - alreadyInCart} units remaining in Batch #${activeBatch.batchNumber}.`,
        'error',
        'Stock Insufficient'
      );
      return;
    }

    const med = medicines.find((m) => String(m.id) === String(selectedMedicineId));

    if (existingCartItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.batchNumber === activeBatch.batchNumber
            ? {
                ...item,
                quantity: item.quantity + qty,
                total: (item.quantity + qty) * item.unitPrice
              }
            : item
        )
      );
    } else {
      const newItem = {
        medicineId: med.id,
        medicineName: med.name,
        batchNumber: activeBatch.batchNumber,
        expiryDate: activeBatch.expiryDate,
        quantity: qty,
        unitPrice: activeBatch.sellingPrice || 10,
        total: qty * (activeBatch.sellingPrice || 10)
      };
      setCartItems((prev) => [...prev, newItem]);
    }

    setItemQuantity('1');
    showToast(`Added ${med.name} (${qty}) to invoice.`, 'success');
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const discount = Math.min(subtotal, Math.max(0, Number(discountAmount) || 0));
  const grandTotal = Math.max(0, subtotal - discount);

  // Complete Checkout
  const handleCompleteSale = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast('Please add at least one medicine to the bill before checkout.', 'error');
      return;
    }

    const salePayload = {
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim() || 'N/A',
      doctorName: doctorName.trim() || 'Self',
      paymentMethod,
      items: cartItems,
      subtotal,
      discount,
      tax: 0,
      grandTotal
    };

    const recordedSale = await addSale(salePayload);
    if (recordedSale) {
      // Clear form
      setCartItems([]);
      setCustomerName('Walk-in Customer');
      setCustomerPhone('');
      setDoctorName('');
      setDiscountAmount('');
      // Open invoice modal for immediate viewing / printing
      setActiveInvoice(recordedSale);
    }
  };

  // Filtered Sales History
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const query = historySearch.toLowerCase();
      return (
        s.invoiceNumber.toLowerCase().includes(query) ||
        (s.customerName && s.customerName.toLowerCase().includes(query)) ||
        (s.customerPhone && s.customerPhone.toLowerCase().includes(query))
      );
    });
  }, [sales, historySearch]);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Point of Sale (POS) & Retail Billing
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time batch selection, automatic stock verification, expired drug prevention, and instant bill generation.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto text-xs font-semibold px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Real-time Stock Deduction Active</span>
        </div>
      </div>

      {/* POS Billing Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Item Picker & Cart (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Item Selector Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 text-teal-600" />
              <span>Select Medicine & Batch</span>
            </h3>

            <div className="space-y-3 text-xs">
              {/* Medicine Dropdown */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  1. Select Medicine *
                </label>
                <select
                  value={selectedMedicineId}
                  onChange={(e) => setSelectedMedicineId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-800"
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.genericName}) — {m.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Selector & Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    2. Select Batch *
                  </label>
                  <select
                    value={selectedBatchNumber}
                    onChange={(e) => setSelectedBatchNumber(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-mono ${
                      batchExpired ? 'border-rose-400 bg-rose-50/50 text-rose-700' : 'border-slate-300 text-slate-800'
                    }`}
                  >
                    {availableBatchesForMed.length > 0 ? (
                      availableBatchesForMed.map((b) => (
                        <option
                          key={b.batchNumber}
                          value={b.batchNumber}
                          disabled={b.isExpired}
                        >
                          {b.batchNumber} ({b.quantity} in stock, exp: {b.expiryDate})
                          {b.isExpired ? ' [EXPIRED - CANNOT SELL]' : ''}
                        </option>
                      ))
                    ) : (
                      <option value="">No batches available</option>
                    )}
                  </select>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    3. Sale Quantity *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max={activeBatch ? activeBatch.quantity : 1}
                      value={itemQuantity}
                      disabled={batchExpired || batchOutOfStock}
                      onChange={(e) => setItemQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 disabled:bg-slate-100"
                    />
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={batchExpired || batchOutOfStock || !activeBatch}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Batch Status Notice / Warning */}
              {activeBatch && (
                <div
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                    batchExpired
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : batchOutOfStock
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {batchExpired ? (
                      <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : batchOutOfStock ? (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <div>
                      {batchExpired ? (
                        <span className="font-semibold text-rose-700">
                          SAFETY ALERT: Batch #{activeBatch.batchNumber} has expired on {activeBatch.expiryDate}. Sales of expired drugs are blocked.
                        </span>
                      ) : batchOutOfStock ? (
                        <span>Batch #{activeBatch.batchNumber} is currently Out of Stock (0 units).</span>
                      ) : (
                        <span>
                          Batch <strong>#{activeBatch.batchNumber}</strong>: <strong>{activeBatch.quantity}</strong> units available • Rate: <strong>{formatCurrency(activeBatch.sellingPrice)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap ml-2">
                    Expires: {formatDate(activeBatch.expiryDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cart Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Current Bill Items ({cartItems.length})
              </span>
              {cartItems.length > 0 && (
                <button
                  onClick={() => setCartItems([])}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Medicine</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cartItems.length > 0 ? (
                    cartItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {item.medicineName}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                          {item.batchNumber}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                          {formatCurrency(item.total)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleRemoveFromCart(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                        No medicines added to bill yet. Select a medicine and batch above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Customer & Checkout Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleCompleteSale}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4 text-xs"
          >
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Customer & Payment Details</span>
              <FileText className="w-4 h-4 text-teal-600" />
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Customer Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="9812345678"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Prescribing Doctor
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Dr. S. K. Roy (Optional)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Payment Method Radio / Tabs */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Payment Mode *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Cash', 'UPI', 'Card'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMethod(mode)}
                    className={`py-2 px-3 rounded-lg border font-medium text-center transition-colors ${
                      paymentMethod === mode
                        ? 'bg-teal-50 border-teal-500 text-teal-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Discount (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0.00"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Financial Totals */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Applied:</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
                <span>Payable Amount:</span>
                <span className="text-teal-700 text-lg">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Submit / Checkout Button */}
            <button
              type="submit"
              disabled={cartItems.length === 0}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Complete Sale & Generate Invoice</span>
            </button>
          </form>
        </div>
      </div>

      {/* Recent Sales History */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Recent Sales Transactions History
            </h3>
            <p className="text-xs text-slate-500">
              Audit log of completed customer bills and invoices
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Search invoice or customer..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4 text-center">Items Billed</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale.invoiceNumber} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {sale.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{formatDate(sale.date)}</div>
                      <div className="text-[11px] text-slate-400">{sale.time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{sale.customerName}</div>
                      <div className="text-[11px] text-slate-500">{sale.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {sale.doctorName || '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-700">
                      {sale.items?.length || 1} item(s)
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-teal-800 text-sm">
                      {formatCurrency(sale.grandTotal)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setActiveInvoice(sale)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>View Bill</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">
                    No sales history matches the search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal for Viewing & Printing */}
      {activeInvoice && (
        <InvoiceModal
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
          sale={activeInvoice}
        />
      )}
    </div>
  );
}
