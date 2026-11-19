import React from 'react';
import { Printer, CheckCircle, Pill, Phone, MapPin, FileText } from 'lucide-react';
import Modal from './Modal';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function InvoiceModal({ isOpen, onClose, sale }) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sales Tax Invoice"
      subtitle={`Invoice #${sale.invoiceNumber}`}
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        </>
      }
    >
      <div id="printable-invoice" className="p-2 text-slate-800">
        {/* Pharmacy Header */}
        <div className="border-b border-slate-200 pb-4 mb-4 text-center sm:text-left sm:flex sm:justify-between sm:items-start">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Pill className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                City Care Pharmacy
              </h2>
            </div>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Shop #12, Ground Floor, MediCentre Market, New Delhi - 110025
            </p>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              +91 98110 23456 | Drug Lic: DL-PH-2024-8890 | GSTIN: 07AABCC1234D1Z9
            </p>
          </div>

          <div className="mt-3 sm:mt-0 text-center sm:text-right">
            <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
              PAID INVOICE
            </span>
            <div className="text-xs text-slate-500 mt-1 font-mono">
              #{sale.invoiceNumber}
            </div>
          </div>
        </div>

        {/* Customer & Invoice Meta */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs mb-4">
          <div>
            <span className="text-slate-400 block font-medium">Customer Details</span>
            <span className="font-semibold text-slate-800 block text-sm">
              {sale.customerName || 'Walk-in Customer'}
            </span>
            <span className="text-slate-600">
              Phone: {sale.customerPhone || 'N/A'}
            </span>
            {sale.doctorName && (
              <span className="text-slate-500 block mt-0.5">
                Prescribed by: <strong className="text-slate-700">{sale.doctorName}</strong>
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-slate-400 block font-medium">Billing Details</span>
            <span className="text-slate-700 font-medium">
              Date: <strong>{formatDate(sale.date)}</strong>
            </span>
            <span className="text-slate-500 block">Time: {sale.time || '10:30 AM'}</span>
            <span className="text-slate-600 block mt-0.5">
              Payment: <strong className="uppercase text-teal-700 font-semibold">{sale.paymentMethod || 'CASH'}</strong>
            </span>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Medicine Description</th>
                <th className="py-2 px-3">Batch No.</th>
                <th className="py-2 px-3 text-right">Qty</th>
                <th className="py-2 px-3 text-right">Rate</th>
                <th className="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sale.items && sale.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 text-slate-400">{idx + 1}</td>
                  <td className="py-2 px-3 font-medium text-slate-800">
                    {item.medicineName}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-600">
                    {item.batchNumber}
                  </td>
                  <td className="py-2 px-3 text-right font-semibold text-slate-800">
                    {item.quantity}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-slate-800">
                    {formatCurrency(item.total || item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end mb-4">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(sale.subtotal || sale.grandTotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Special Discount:</span>
                <span>-{formatCurrency(sale.discount)}</span>
              </div>
            )}
            {sale.tax > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>GST Tax:</span>
                <span>+{formatCurrency(sale.tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-1.5">
              <span>Grand Total:</span>
              <span className="text-teal-700 text-base">{formatCurrency(sale.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 text-center flex flex-col items-center">
          <p className="font-medium text-slate-600">Thank you for visiting City Care Pharmacy! Wish you good health.</p>
          <p className="mt-0.5">Please consult registered doctor before consuming medicines. Keep out of reach of children.</p>
        </div>
      </div>
    </Modal>
  );
}
