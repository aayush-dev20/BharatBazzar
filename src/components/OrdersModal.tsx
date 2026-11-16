import React, { useState } from 'react';
import { Order, Language, UserSession, ReturnRequest } from '../types';
import { translations } from '../data/translations';
import { formatINR, formatDate } from '../utils/formatters';
import {
  X,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  FileText,
  RotateCcw,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

interface OrdersModalProps {
  orders: Order[];
  currentUser: UserSession;
  language: Language;
  onClose: () => void;
  onViewInvoice: (order: Order) => void;
  onReorder: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
  onRequestReturn: (orderId: string, returnReq: ReturnRequest) => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  orders,
  currentUser,
  language,
  onClose,
  onViewInvoice,
  onReorder,
  onCancelOrder,
  onRequestReturn
}) => {
  const t = translations[language];

  // User's private orders
  const userOrders = orders.filter(o => o.userId === currentUser.id);

  // Return dialog state
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('Damaged / Defective item');
  const [returnType, setReturnType] = useState<'return' | 'exchange'>('return');

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">Placed</span>;
      case 'confirmed':
        return <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">Confirmed</span>;
      case 'packed':
        return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-bold">Packed</span>;
      case 'shipped':
        return <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">Shipped</span>;
      case 'out_for_delivery':
        return <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded text-[10px] font-bold">Out for Delivery</span>;
      case 'delivered':
        return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">Delivered</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 bg-brick-light text-brick rounded text-[10px] font-bold">Cancelled</span>;
    }
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId) return;

    onRequestReturn(returnOrderId, {
      id: `ret-${Date.now()}`,
      reason: returnReason,
      type: returnType,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    });

    setReturnOrderId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-charcoal-800 border border-subtle rounded max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-brass" />
            <div>
              <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
                {t.myOrders} ({userOrders.length})
              </h2>
              <span className="text-[11px] text-ink-muted">
                Private order history for {currentUser.name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {userOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-ink-muted">
              You haven't placed any Cash on Delivery orders yet.
            </div>
          ) : (
            userOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 bg-concrete/50 dark:bg-charcoal-700/50 border border-subtle rounded space-y-3 text-xs"
              >
                {/* Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-subtle pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-slate-deep dark:text-brass text-sm">{ord.id}</span>
                    <span className="text-ink-muted ml-2">{formatDate(ord.createdAt, language)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(ord.status)}
                    <button
                      onClick={() => onViewInvoice(ord)}
                      className="py-1 px-2.5 bg-surface dark:bg-charcoal-800 border border-subtle hover:border-brass text-slate-deep dark:text-zinc-200 rounded font-semibold text-[11px] flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-brass" />
                      <span>GST Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={it.imageUrl} alt="" className="w-12 h-12 object-cover rounded border" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink dark:text-zinc-100 truncate">{it.productName}</p>
                        <div className="text-ink-muted flex items-center gap-2 mt-0.5">
                          <span>Qty: {it.quantity}</span>
                          <span>•</span>
                          <span className="font-bold text-slate-deep dark:text-brass">{formatINR(it.price * it.quantity)}</span>
                          {it.wasBargained && <span className="text-brass text-[10px] font-bold">Bargained Deal</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Return Request status if active */}
                {ord.returnRequest && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded text-[11px] space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>7-Day Return/Exchange Request:</span>
                      <span className="capitalize text-amber-800">{ord.returnRequest.status}</span>
                    </div>
                    <p className="text-ink-muted">Reason: {ord.returnRequest.reason} ({ord.returnRequest.type})</p>
                  </div>
                )}

                {/* Actions & Tracking */}
                <div className="pt-2 border-t border-subtle flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-ink-muted">Estimated Delivery: </span>
                    <strong className="text-emerald-700 dark:text-emerald-400">{ord.estimatedDelivery}</strong>
                    <span className="block text-[10px] text-ink-light">Payment: {ord.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Doorstep UPI QR'} ({formatINR(ord.finalTotal)})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Cancel button if not yet shipped */}
                    {['placed', 'confirmed'].includes(ord.status) && (
                      <button
                        onClick={() => onCancelOrder(ord.id)}
                        className="py-1 px-2.5 border border-brick/40 text-brick rounded hover:bg-brick-light text-[11px] font-semibold"
                      >
                        Cancel
                      </button>
                    )}

                    {/* Return button if delivered and within 7 days */}
                    {ord.status === 'delivered' && !ord.returnRequest && (
                      <button
                        onClick={() => setReturnOrderId(ord.id)}
                        className="py-1 px-2.5 border border-subtle text-ink-muted hover:text-ink rounded text-[11px] font-semibold"
                      >
                        Return / Exchange
                      </button>
                    )}

                    {/* Reorder Button */}
                    <button
                      onClick={() => onReorder(ord)}
                      className="py-1 px-2.5 bg-slate-deep hover:bg-slate-hover text-white rounded font-semibold text-[11px] flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-brass" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Return Dialog Sub-Modal */}
        {returnOrderId && (
          <div className="p-4 bg-surface dark:bg-charcoal-900 border-t border-subtle text-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-deep dark:text-brass">Request 7-Day Return / Replacement</span>
              <button onClick={() => setReturnOrderId(null)} className="text-ink-muted">Cancel</button>
            </div>
            <form onSubmit={handleReturnSubmit} className="space-y-2">
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={returnType === 'return'}
                    onChange={() => setReturnType('return')}
                    className="text-brass"
                  />
                  <span>Return & Doorstep Pickup</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={returnType === 'exchange'}
                    onChange={() => setReturnType('exchange')}
                    className="text-brass"
                  />
                  <span>Replacement / Exchange</span>
                </label>
              </div>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-concrete dark:bg-charcoal-700 border border-subtle rounded"
              >
                <option value="Damaged / Defective item">Damaged or defective product</option>
                <option value="Item not as described">Item not as described</option>
                <option value="Wrong size or variant received">Wrong size or variant received</option>
                <option value="Changed mind / No longer needed">Changed mind / No longer needed</option>
              </select>
              <button
                type="submit"
                className="w-full py-2 bg-slate-deep hover:bg-slate-hover text-white font-semibold uppercase rounded"
              >
                Submit Return Request to Seller
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-concrete hover:bg-zinc-200 dark:bg-charcoal-700 text-ink dark:text-zinc-200 text-xs font-semibold uppercase rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
