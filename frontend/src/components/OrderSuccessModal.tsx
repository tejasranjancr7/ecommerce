import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, FileText, ArrowRight, Mail } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { activeModal, setActiveModal, lastOrder, setViewInvoiceOrder, currentUser } = useStore();

  if (activeModal !== 'order-success' || !lastOrder) return null;

  return (
    <div className="modal-overlay" onClick={() => setActiveModal(null)}>
      <div
        className="modal-content"
        style={{ maxWidth: '580px', textAlign: 'center', padding: '36px 28px', background: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Circle */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: '#DEF7EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <CheckCircle2 size={40} color="#16A34A" />
        </div>

        <span className="badge badge-green" style={{ marginBottom: '10px' }}>
          Kafka Event Published • order.exchange
        </span>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
          Order Placed Successfully!
        </h2>

        <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '22px' }}>
          Thank you, <strong>{[currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || lastOrder?.userName || 'Customer'}</strong>. We've sent a confirmation email with PDF invoice to <strong>{currentUser?.email || lastOrder?.userEmail}</strong>.
        </p>

        {/* Order Details Card */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          textAlign: 'left',
          marginBottom: '22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748B' }}>Order Number:</span>
            <span style={{ fontWeight: 700, color: '#1769D2' }}>#{lastOrder.id}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748B' }}>Items Purchased:</span>
            <span style={{ fontWeight: 600 }}>
              {lastOrder.items.reduce((sum, i) => sum + i.quantity, 0)} unit(s) ({lastOrder.items.length} item{lastOrder.items.length > 1 ? 's' : ''})
            </span>
          </div>

          <div style={{
            margin: '8px 0 12px',
            padding: '8px 12px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            fontSize: '0.82rem',
          }}>
            {lastOrder.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span style={{ color: '#334155' }}>
                  {item.productName || `Product #${item.productId}`} <strong style={{ color: '#1769D2' }}>× {item.quantity}</strong>
                </span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>
                  ₹{(item.subTotal || item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748B' }}>Order Status:</span>
            <span className="badge badge-green">{lastOrder.status}</span>
          </div>

          {(() => {
            const subTotalAmount = lastOrder.subTotal ?? (
              lastOrder.items?.reduce((sum, item) => sum + (item.subTotal || item.price * item.quantity), 0) ?? lastOrder.totalAmount
            );
            const isFreeDelivery = lastOrder.shippingCharge !== undefined
              ? lastOrder.shippingCharge === 0
              : subTotalAmount >= 499;
            const shippingAmount = lastOrder.shippingCharge !== undefined
              ? lastOrder.shippingCharge
              : (isFreeDelivery ? 0 : 49);
            const couponDiscountAmount = lastOrder.discountAmount || 0;
            const grandTotalAmount = Math.max(0, subTotalAmount - couponDiscountAmount) + shippingAmount;

            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748B' }}>Subtotal:</span>
                  <span>₹{subTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                {Boolean(couponDiscountAmount > 0) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#16A34A', fontWeight: 600 }}>
                    <span>Coupon Discount ({lastOrder.couponCode || 'PROMO'}):</span>
                    <span>-₹{couponDiscountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748B' }}>Delivery:</span>
                  <span>
                    {isFreeDelivery ? (
                      <strong style={{ color: '#16A34A' }}>FREE</strong>
                    ) : (
                      <strong style={{ color: '#B45309' }}>₹{shippingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    )}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid #E2E8F0',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                }}>
                  <span>Total Amount Paid:</span>
                  <span style={{ color: '#B12704' }}>
                    ₹{grandTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            );
          })()}
        </div>

        {/* Kafka Notification Message */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#EFF6FF',
          border: '1px solid #DBEAFE',
          borderRadius: '6px',
          padding: '10px 14px',
          textAlign: 'left',
          marginBottom: '22px',
        }}>
          <Mail size={18} color="#1769D2" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.78rem', color: '#1E40AF' }}>
            <strong>Notification Service consumer received event:</strong><br />
            Invoice generated & dispatched asynchronously.
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setViewInvoiceOrder(lastOrder);
              setActiveModal('invoice-view');
            }}
          >
            <FileText size={17} />
            <span>View Tax Invoice</span>
          </button>

          <button
            className="btn btn-yellow"
            onClick={() => setActiveModal(null)}
          >
            <span>Continue Shopping</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
