import React, { useState } from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Star, Check, Eye } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stockQuantity <= 0) return;
    setIsAdding(true);
    await addToCart(String(product.id), 1);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const isOutOfStock = product.stockQuantity <= 0;
  const rating = product.rating || 4.5;
  const reviewsCount = product.reviewsCount || Math.floor(100 + Number(product.id || 1) * 370);
  const originalPrice = product.originalPrice || Math.round(product.price * 1.18);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="marketplace-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        cursor: 'pointer',
        position: 'relative',
        background: '#FFFFFF',
      }}
    >
      <div>
        {/* Product Image */}
        <div style={{
          width: '100%',
          height: '210px',
          background: '#F8FAFC',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: '14px',
          position: 'relative',
        }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              maxHeight: '190px',
              maxWidth: '90%',
              objectFit: 'contain',
              transition: 'transform 0.25s ease',
            }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />

          {discountPercent > 0 && (
            <span
              className="badge badge-amber"
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                fontWeight: 800,
                fontSize: '0.72rem',
              }}
            >
              {discountPercent}% OFF
            </span>
          )}

          <span
            className="badge badge-blue"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '0.68rem',
            }}
          >
            {product.category}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '0.94rem',
          fontWeight: 700,
          color: '#111827',
          lineHeight: 1.4,
          marginBottom: '6px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.6em',
        }}>
          {product.name}
        </h3>

        {/* Ratings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <div style={{
            background: '#16A34A',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '1px 6px',
            borderRadius: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
          }}>
            <span>{rating.toFixed(1)}</span>
            <Star size={11} fill="#FFFFFF" color="#FFFFFF" />
          </div>
          <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
            ({reviewsCount.toLocaleString()})
          </span>
        </div>

        {/* Price Row */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F1111' }}>
              ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {originalPrice > product.price && (
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                M.R.P: ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600 }}>
            {isOutOfStock ? (
              <span style={{ color: '#DC2626' }}>Currently out of stock</span>
            ) : product.stockQuantity <= 5 ? (
              <span style={{ color: '#D97706' }}>Only {product.stockQuantity} left in stock - order soon</span>
            ) : (
              <span>In stock ({product.stockQuantity} units) • {product.price >= 499 ? 'Free Delivery' : 'Free Delivery over ₹499'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}
          className="btn btn-secondary btn-icon"
          title="Quick View"
          style={{ width: '38px', height: '38px' }}
        >
          <Eye size={16} />
        </button>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className="btn btn-yellow"
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '0.84rem',
            opacity: isOutOfStock ? 0.5 : 1,
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
          }}
        >
          {justAdded ? (
            <>
              <Check size={16} />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
