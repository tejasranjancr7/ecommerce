import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Printer, Layers } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { activeModal, setActiveModal, viewInvoiceOrder, setViewInvoiceOrder } = useStore();

  if (activeModal !== 'invoice-view' || !viewInvoiceOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const orderDate = new Date(viewInvoiceOrder.createdAt);
  const formattedDate = orderDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="modal-overlay" onClick={() => { setActiveModal(null); setViewInvoiceOrder(null); }}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px', padding: '0', background: '#ffffff', color: '#111827' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden during printing) */}
        <div style={{
          background: '#0f172a',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="#818cf8" />
            <span>Notification Service Generated Invoice</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => { setActiveModal(null); setViewInvoiceOrder(null); }}
              className="btn btn-ghost"
              style={{ padding: '6px 10px', color: '#94a3b8' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="invoice-sheet" style={{ padding: '40px', background: '#ffffff', color: '#1e293b' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '24px',
            marginBottom: '24px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                }}>
                  N
                </div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  NovaStore
                </h1>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                eCommerce Microservices Platform
              </p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0' }}>
                Bengaluru, Karnataka, India
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4f46e5', margin: '0 0 4px', letterSpacing: '0.05em' }}>
                INVOICE
              </h2>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Invoice #{viewInvoiceOrder.id}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                Date: {formattedDate}, {formattedTime}
              </div>
            </div>
          </div>

          {/* Customer / Billed To Info */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>
                BILLED TO:
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                {viewInvoiceOrder.userName || 'Customer'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                {viewInvoiceOrder.userEmail}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>
                CUSTOMER ID / ORDER STATUS:
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#475569' }}>
                {viewInvoiceOrder.userId || 'N/A'}
              </div>
              <span style={{
                display: 'inline-block',
                marginTop: '6px',
                background: '#dcfce7',
                color: '#15803d',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
              }}>
                {viewInvoiceOrder.status}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '28px',
          }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>#</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Item Description</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Unit Price (INR)</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Subtotal (INR)</th>
              </tr>
            </thead>
            <tbody>
              {viewInvoiceOrder.items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>{index + 1}</td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                    {item.productName}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#0f172a' }}>
                    ₹{(item.subTotal !== undefined ? item.subTotal : item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          {(() => {
            const subTotalAmount = viewInvoiceOrder.subTotal ?? (
              viewInvoiceOrder.items?.reduce((sum, item) => sum + (item.subTotal || item.price * item.quantity), 0) ?? viewInvoiceOrder.totalAmount
            );
            const isFreeDelivery = viewInvoiceOrder.shippingCharge !== undefined
              ? viewInvoiceOrder.shippingCharge === 0
              : subTotalAmount >= 499;
            const shippingAmount = viewInvoiceOrder.shippingCharge !== undefined
              ? viewInvoiceOrder.shippingCharge
              : (isFreeDelivery ? 0 : 49);
            const couponDiscountAmount = viewInvoiceOrder.discountAmount || 0;
            const grandTotalAmount = Math.max(0, subTotalAmount - couponDiscountAmount) + shippingAmount;

            return (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
                <div style={{ width: '280px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>Subtotal:</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      ₹{subTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {Boolean(couponDiscountAmount > 0) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>
                      <span>Coupon ({viewInvoiceOrder.couponCode || 'PROMO'}):</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        -₹{couponDiscountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>Delivery:</span>
                    {isFreeDelivery ? (
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span>
                    ) : (
                      <span style={{ color: '#b45309', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                        ₹{shippingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderTop: '2px solid #0f172a',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#0f172a',
                  }}>
                    <span>Total Amount:</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4f46e5' }}>
                      ₹{grandTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '20px',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#94a3b8',
          }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Thank you for your business!</p>
            <p style={{ margin: 0 }}>This invoice is generated automatically by the Notification Service consumer for topic order.exchange.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
