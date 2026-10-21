import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, CreditCard, QrCode, Building, CheckCircle2, Loader2, MapPin, Truck } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    currentUser,
    cartItems,
    cartTotal,
    appliedCoupon,
    couponDiscount,
    shippingCharge,
    checkout,
    isCheckingOut,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');

  const discountAmount = couponDiscount;
  const discountedCartTotal = Math.max(0, cartTotal - discountAmount) + shippingCharge;

  const handlePlaceOrder = async () => {
    await checkout({
      discountAmount,
      couponCode: appliedCoupon,
      shippingCharge,
      finalAmount: discountedCartTotal,
    });
  };

  if (activeModal !== 'checkout') return null;

  return (
    <div className="modal-overlay" onClick={() => !isCheckingOut && setActiveModal(null)}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px', padding: '0', background: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
              Select a Delivery Address & Payment
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Connected to Order Service with header <code>X-User-ID: {currentUser?.id}</code>
            </p>
          </div>
          {!isCheckingOut && (
            <button
              onClick={() => setActiveModal(null)}
              className="btn btn-ghost btn-icon"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Step 1: Delivery Address */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MapPin size={18} color="#1769D2" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>
                1. Delivery Address
              </h3>
            </div>

            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>
              {[currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || 'Customer'}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.4 }}>
              {currentUser?.address?.street}, {currentUser?.address?.city}, {currentUser?.address?.state} - {currentUser?.address?.zipcode}, {currentUser?.address?.country}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
              Phone: {currentUser?.phone} • Email: {currentUser?.email}
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
              2. Select Payment Method
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div
                onClick={() => setPaymentMethod('upi')}
                style={{
                  padding: '12px 8px',
                  borderRadius: '6px',
                  border: paymentMethod === 'upi' ? '2px solid #1769D2' : '1px solid #E2E8F0',
                  background: paymentMethod === 'upi' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <QrCode size={20} color={paymentMethod === 'upi' ? '#1769D2' : '#64748B'} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>UPI / QR</div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Instant</div>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                style={{
                  padding: '12px 8px',
                  borderRadius: '6px',
                  border: paymentMethod === 'card' ? '2px solid #1769D2' : '1px solid #E2E8F0',
                  background: paymentMethod === 'card' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <CreditCard size={20} color={paymentMethod === 'card' ? '#1769D2' : '#64748B'} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Card</div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Credit / Debit</div>
              </div>

              <div
                onClick={() => setPaymentMethod('netbanking')}
                style={{
                  padding: '12px 8px',
                  borderRadius: '6px',
                  border: paymentMethod === 'netbanking' ? '2px solid #1769D2' : '1px solid #E2E8F0',
                  background: paymentMethod === 'netbanking' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <Building size={20} color={paymentMethod === 'netbanking' ? '#1769D2' : '#64748B'} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>NetBanking</div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>All Banks</div>
              </div>

              <div
                onClick={() => setPaymentMethod('cod')}
                style={{
                  padding: '12px 8px',
                  borderRadius: '6px',
                  border: paymentMethod === 'cod' ? '2px solid #1769D2' : '1px solid #E2E8F0',
                  background: paymentMethod === 'cod' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <Truck size={20} color={paymentMethod === 'cod' ? '#1769D2' : '#64748B'} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Cash on Delivery</div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Pay on arrival</div>
              </div>
            </div>
          </div>

          {/* Step 3: Review Items and Delivery */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
              3. REVIEW ITEMS ({cartItems.length})
            </h4>

            <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cartItems.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span>
                    {item.product?.name || `Product #${item.productId}`} <strong>× {item.quantity}</strong>
                  </span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>
                    ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              {/* Coupon discount row */}
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#16A34A', fontWeight: 600 }}>
                  <span>✅ Coupon ({appliedCoupon}):</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {/* Shipping row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569' }}>
                <span>Shipping:</span>
                {shippingCharge === 0 ? (
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>FREE</span>
                ) : (
                  <span style={{ color: '#B45309', fontWeight: 700 }}>₹{shippingCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                )}
              </div>
              {/* Grand total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '6px',
                borderTop: '1px solid #E2E8F0',
              }}>
                <span style={{ fontWeight: 800, fontSize: '0.98rem' }}>Order Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#B12704' }}>
                  ₹{discountedCartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isCheckingOut}
            className="btn btn-yellow"
            style={{
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              width: '100%',
              boxShadow: '0 2px 6px rgba(213,217,217,0.5)',
            }}
          >
            {isCheckingOut ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Confirming Order with Order Service...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                <span>Place Your Order and Pay (₹{discountedCartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
              </>
            )}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.74rem', color: '#64748B' }}>
            By placing your order, you agree to ShopSphere's conditions of use and sale privacy notice.
          </div>
        </div>
      </div>
    </div>
  );
};
