import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    cartCount,
    cartTotal,
    removeFromCart,
    addToCart,
    clearCart,
    setActiveModal,
    currentUser,
    appliedCoupon,
    couponDiscount,
    shippingCharge,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const SHIPPING_THRESHOLD = 499;
  const SHIPPING_CHARGE = 49;

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
  };

  const couponApplied = Boolean(appliedCoupon);
  const finalTotal = Math.max(0, cartTotal - couponDiscount) + shippingCharge;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: '#FFFFFF',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #E2E8F0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} color="#1769D2" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>
              Shopping Cart
            </h2>
            <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
              {cartCount} items
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="btn btn-ghost btn-icon"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free / Paid Delivery Bar */}
        <div style={{
          background: cartTotal >= SHIPPING_THRESHOLD ? '#DEF7EC' : '#FEF3C7',
          color: cartTotal >= SHIPPING_THRESHOLD ? '#03543F' : '#92400E',
          padding: '8px 20px',
          fontSize: '0.78rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <ShieldCheck size={16} color={cartTotal >= SHIPPING_THRESHOLD ? '#16A34A' : '#D97706'} />
          {cartTotal >= SHIPPING_THRESHOLD ? (
            <span>Your order qualifies for <strong>FREE Delivery</strong> across India.</span>
          ) : (
            <span>Add ₹{(SHIPPING_THRESHOLD - cartTotal).toLocaleString('en-IN')} more for <strong>FREE Delivery</strong> (₹{SHIPPING_CHARGE} shipping applies)</span>
          )}
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {!currentUser ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '14px',
              color: '#64748B',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShoppingCart size={28} color="#1769D2" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                  Sign In to see your Cart
                </h3>
                <p style={{ fontSize: '0.82rem', maxWidth: '300px', color: '#64748B' }}>
                  Your shopping cart is linked to your customer profile. Please authenticate to view items and checkout.
                </p>
              </div>
              <button
                className="btn btn-yellow"
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveModal('login');
                }}
                style={{ padding: '10px 24px', fontWeight: 700 }}
              >
                Sign In as Customer
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '14px',
              color: '#64748B',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShoppingCart size={28} color="#94A3B8" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                  Your ShopSphere Cart is empty
                </h3>
                <p style={{ fontSize: '0.82rem' }}>Your shopping cart lives to serve. Give it purpose — fill it with electronics, laptops, and gadgets!</p>
              </div>
              <button
                className="btn btn-yellow"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cartItems.map((item) => {
                const product = item.product;
                const unitPrice = product?.price || 0;
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div style={{
                      width: '74px',
                      height: '74px',
                      background: '#F8FAFC',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      padding: '4px',
                    }}>
                      <img
                        src={product?.imageUrl}
                        alt={product?.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                          {product?.name || `Product #${item.productId}`}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="btn btn-ghost"
                          style={{ padding: '2px', color: '#DC2626' }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                        {/* Stepper */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid #CBD5E1',
                          borderRadius: '4px',
                          background: '#F8FAFC',
                        }}>
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                addToCart(item.productId, -1);
                              } else {
                                removeFromCart(item.productId);
                              }
                            }}
                            style={{ background: 'none', border: 'none', padding: '2px 8px', cursor: 'pointer', fontWeight: 700 }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.8rem', padding: '0 6px', fontWeight: 700 }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item.productId, 1)}
                            style={{ background: 'none', border: 'none', padding: '2px 8px', cursor: 'pointer', fontWeight: 700 }}
                          >
                            +
                          </button>
                        </div>

                        <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0F1111' }}>
                          ₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <button
                  className="btn btn-ghost"
                  onClick={clearCart}
                  style={{ fontSize: '0.78rem', color: '#64748B' }}
                >
                  Clear all items
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC',
          }}>
            {/* Coupon Box */}
            {!couponApplied ? (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input
                  type="text"
                  placeholder="Promo Code (e.g. FESTIVAL)"
                  className="form-input"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{ flex: 1, padding: '7px 10px', fontSize: '0.82rem' }}
                />
                <button type="submit" className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '0.82rem' }}>
                  Apply
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', background: '#DEF7EC', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: '#065F46', fontWeight: 700 }}>✅ {appliedCoupon} applied</span>
                <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>Remove</button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Subtotal ({cartCount} items):</span>
                <span>₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {couponApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 600 }}>
                  <span>Discount ({appliedCoupon}):</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Delivery:</span>
                {shippingCharge === 0 ? (
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>FREE</span>
                ) : (
                  <span style={{ color: '#B45309', fontWeight: 700 }}>₹{shippingCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                )}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#0F1111',
                paddingTop: '6px',
                borderTop: '1px solid #E2E8F0',
              }}>
                <span>Order Total:</span>
                <span style={{ color: '#B12704' }}>
                  ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setActiveModal('checkout');
              }}
              className="btn btn-yellow"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.96rem',
                fontWeight: 700,
              }}
            >
              <span>Proceed to Buy</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
