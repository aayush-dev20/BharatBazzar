import React from 'react';
import { Order, Language } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { X, Printer, Download, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  language: Language;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, language, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  // 18% GST split: 9% CGST + 9% SGST
  const taxableAmount = Math.round((order.finalTotal / 1.18) * 100) / 100;
  const gstAmount = Math.round((order.finalTotal - taxableAmount) * 100) / 100;
  const cgst = Math.round((gstAmount / 2) * 100) / 100;
  const sgst = cgst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white text-ink border border-subtle rounded max-h-[92vh] flex flex-col overflow-hidden shadow-2xl print:max-w-none print:m-0 print:border-none print:shadow-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-concrete border-b border-subtle flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-slate-deep">
              Official GST Tax Invoice
            </span>
            <span className="text-xs text-ink-muted">({order.id})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1 px-3 bg-slate-deep hover:bg-slate-hover text-white text-xs font-semibold rounded flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-brass" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-ink-muted hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-ink font-body">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-zinc-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded bg-slate-deep text-brass font-bold flex items-center justify-center text-xs">
                  हा
                </span>
                <span className="font-heading font-bold text-lg text-slate-deep">
                  Haat | भारत बाज़ार
                </span>
              </div>
              <p className="text-[10px] text-zinc-500">
                Registered E-Commerce Facilitator • Consumer Protection Act 2019
              </p>
              <p className="text-[10px] text-zinc-500 font-mono">
                GSTIN: 07AABCB1429M1ZP • CIN: U72900DL2026PTC384192
              </p>
            </div>

            <div className="text-right">
              <span className="font-heading font-bold text-base text-zinc-800 block">
                TAX INVOICE
              </span>
              <p className="text-[11px] font-mono text-zinc-600">
                Invoice No: INV-{order.id.replace('BB-', '')}
              </p>
              <p className="text-[11px] text-zinc-500">
                Date: {formatDate(order.createdAt, 'en')}
              </p>
            </div>
          </div>

          {/* Billed To / Shipped To */}
          <div className="grid grid-cols-2 gap-6 bg-zinc-50 p-3 rounded border border-zinc-200 text-[11px]">
            <div>
              <span className="font-bold text-zinc-700 block uppercase tracking-wider mb-1">
                Sold By (Merchant)
              </span>
              <p className="font-semibold text-zinc-900">Verified Haat Merchant Partner</p>
              <p className="text-zinc-600">Fulfillment Hub, Local Store Cluster</p>
              <p className="text-zinc-500 font-mono">State Code: 27 (Maharashtra)</p>
            </div>

            <div>
              <span className="font-bold text-zinc-700 block uppercase tracking-wider mb-1">
                Billed & Shipped To
              </span>
              <p className="font-semibold text-zinc-900">{order.shippingAddress.fullName}</p>
              <p className="text-zinc-600">{order.shippingAddress.addressLine}</p>
              <p className="text-zinc-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-zinc-500 font-mono">Mobile: +91 {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs border border-zinc-200">
            <thead className="bg-zinc-100 border-b border-zinc-200 font-semibold text-zinc-700">
              <tr>
                <th className="p-2">Item Description</th>
                <th className="p-2">HSN/SAC</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-right">Unit Price</th>
                <th className="p-2 text-right">Taxable</th>
                <th className="p-2 text-right">Total (Inc. GST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {order.items.map((it, idx) => {
                const itemTotal = it.price * it.quantity;
                const itemTaxable = Math.round((itemTotal / 1.18) * 100) / 100;
                return (
                  <tr key={idx}>
                    <td className="p-2">
                      <p className="font-medium text-zinc-900">{it.productName}</p>
                      {it.wasBargained && (
                        <span className="text-[10px] text-amber-700 font-semibold">
                          (Bhaav-Taav Agreed Price)
                        </span>
                      )}
                    </td>
                    <td className="p-2 font-mono text-[10px] text-zinc-500">2106.90</td>
                    <td className="p-2 text-center font-mono">{it.quantity}</td>
                    <td className="p-2 text-right font-mono">{formatINR(it.price)}</td>
                    <td className="p-2 text-right font-mono">{formatINR(itemTaxable)}</td>
                    <td className="p-2 text-right font-mono font-semibold">{formatINR(itemTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Tax Breakdown & Totals */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5 text-[11px] text-zinc-500">
              <p className="font-semibold text-zinc-700">Payment & Delivery Terms:</p>
              <p>• Mode: <strong>Cash on Delivery (COD) / Doorstep UPI QR</strong></p>
              <p>• Delivery Slot: {order.deliverySlotLabel}</p>
              <p>• 7-Day Doorstep Replacement Guarantee</p>
            </div>

            <div className="space-y-1.5 text-xs text-right">
              <div className="flex justify-between">
                <span className="text-zinc-500">Item Total (Taxable):</span>
                <span className="font-mono">{formatINR(taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>CGST (9%):</span>
                <span className="font-mono">{formatINR(cgst)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>SGST (9%):</span>
                <span className="font-mono">{formatINR(sgst)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Delivery Charges:</span>
                <span className="font-mono">{order.deliveryFee === 0 ? 'FREE' : formatINR(order.deliveryFee)}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({order.couponCode}):</span>
                  <span className="font-mono">-{formatINR(order.couponDiscount)}</span>
                </div>
              )}
              {order.scratchRewardDiscount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Scratch Reward Credit:</span>
                  <span className="font-mono">-{formatINR(order.scratchRewardDiscount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-zinc-300 flex justify-between font-bold text-sm text-slate-deep">
                <span>Total Amount Payable:</span>
                <span className="font-mono">{formatINR(order.finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* Stamp & Verification */}
          <div className="pt-6 border-t border-zinc-200 flex justify-between items-end text-[10px] text-zinc-500">
            <div>
              <p className="font-semibold text-zinc-700">Digital Tax Compliance Verification</p>
              <p>Computer generated invoice as per Indian GST Rules 2017. No physical signature required.</p>
            </div>
            <div className="text-right">
              <div className="w-20 h-10 border border-dashed border-zinc-400 rounded flex items-center justify-center font-mono text-[9px] text-zinc-400 ml-auto mb-1">
                [SEAL / QR]
              </div>
              <span className="font-semibold text-zinc-700">Haat Technologies Pvt Ltd</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
