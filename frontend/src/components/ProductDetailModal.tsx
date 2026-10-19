import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingCart, ShieldCheck, Truck, RotateCcw, Check, Star } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCartOpen } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedProduct) return null;

  const handleAdd = async (openCart = false) => {
    setIsAdding(true);
    await addToCart(String(selectedProduct.id), quantity);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setSelectedProduct(null);
      if (openCart) setIsCartOpen(true);
    }, 900);
  };

  const isOutOfStock = selectedProduct.stockQuantity <= 0;
  const rating = selectedProduct.rating || 4.7;
  const originalPrice = selectedProduct.originalPrice || Math.round(selectedProduct.price * 1.18);
  const discountPercent = Math.round(((originalPrice - selectedProduct.price) / originalPrice) * 100);

  return (
    <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
      <div
        className="modal-content"
        style={{ maxWidth: '820px', padding: '0', background: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span className="badge badge-blue">{selectedProduct.category}</span>
          <button
            onClick={() => setSelectedProduct(null)}
            className="btn btn-ghost btn-icon"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          padding: '24px 28px',
        }}>
          {/* Image */}
          <div style={{
            background: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #E2E8F0',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '360px',
          }}>
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';
              }}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', marginBottom: '8px', lineHeight: 1.35 }}>
                {selectedProduct.name}
              </h2>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{
                  background: '#16A34A',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <span>{rating.toFixed(1)}</span>
                  <Star size={12} fill="#FFFFFF" color="#FFFFFF" />
                </div>
                <span style={{ fontSize: '0.82rem', color: '#1769D2', fontWeight: 600 }}>
                  Verified Marketplace Rating
                </span>
              </div>

              {/* Price Block */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F1111' }}>
                    ₹{selectedProduct.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {originalPrice > selectedProduct.price && (
                    <>
                      <span style={{ fontSize: '0.9rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        M.R.P: ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700, marginTop: '4px' }}>
                  Inclusive of all taxes • In Stock: {selectedProduct.stockQuantity} units
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, marginBottom: '18px' }}>
                {selectedProduct.description}
              </p>

              {/* Perks */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center', padding: '10px 6px', background: '#F8FAFC', borderRadius: '6px' }}>
                  <Truck size={18} color="#1769D2" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                    {selectedProduct.price >= 499 ? 'Free Delivery' : 'Free over ₹499'}
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 6px', background: '#F8FAFC', borderRadius: '6px' }}>
                  <ShieldCheck size={18} color="#16A34A" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '0.72rem', fontWeight: 600 }}>1 Year Warranty</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 6px', background: '#F8FAFC', borderRadius: '6px' }}>
                  <RotateCcw size={18} color="#D97706" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '0.72rem', fontWeight: 600 }}>7 Days Return</div>
                </div>
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #E2E8F0',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
              }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '6px 12px' }}
                >
                  -
                </button>
                <span className="font-mono" style={{ padding: '0 10px', fontWeight: 700, fontSize: '0.9rem' }}>
                  {quantity}
                </span>
                <button
                  className="btn btn-ghost"
                  onClick={() => setQuantity(Math.min(selectedProduct.stockQuantity, quantity + 1))}
                  style={{ padding: '6px 12px' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAdd(false)}
                disabled={isOutOfStock || isAdding}
                className="btn btn-yellow"
                style={{ flex: 1, padding: '11px 20px', fontSize: '0.9rem' }}
              >
                {justAdded ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>{isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Cart`}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleAdd(true)}
                disabled={isOutOfStock || isAdding}
                className="btn"
                style={{
                  background: '#FFA41C',
                  color: '#0F1111',
                  fontWeight: 700,
                  padding: '11px 20px',
                  border: 'none',
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
