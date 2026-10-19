import React from 'react';
import { Tag, Truck, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory } = useStore();

  return (
    <div style={{ maxWidth: '1440px', margin: '16px auto', padding: '0 24px' }}>
      <div style={{
        background: 'linear-gradient(90deg, #1E3A8A 0%, #1769D2 50%, #2563EB 100%)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 40px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative background shapes */}
        <div style={{
          position: 'absolute',
          right: '-40px',
          bottom: '-40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '640px', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.18)',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '14px',
          }}>
            <Zap size={14} color="#FDE047" />
            <span>FESTIVAL DEALS • LIMITED TIME ONLY</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '12px' }}>
            Flagship Tech at <br />Unbeatable Prices.
          </h1>

          <p style={{ fontSize: '0.98rem', color: '#DBEAFE', marginBottom: '20px', lineHeight: 1.5 }}>
            Explore verified genuine products from top brands. Powered by Spring Boot microservices, instant checkout, and automated tax invoices.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('Mobiles')}
              className="btn btn-yellow"
              style={{ fontSize: '0.9rem', padding: '10px 20px' }}
            >
              Shop Mobiles & Tablets
            </button>
            <button
              onClick={() => setSelectedCategory('Computers')}
              className="btn btn-secondary"
              style={{ fontSize: '0.9rem', padding: '10px 20px', background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Browse Laptops
            </button>
          </div>
        </div>

        {/* Feature Badges Card */}
        <div style={{
          background: '#FFFFFF',
          color: '#111827',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-lg)',
          minWidth: '280px',
          zIndex: 1,
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '14px', letterSpacing: '0.04em' }}>
            Why Shop with ShopSphere?
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={18} color="#1769D2" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Free Express Delivery</div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>On orders above ₹499 (₹49 under ₹499)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#DEF7EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#16A34A" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>100% Genuine Products</div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Direct from brand distributors</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FEF08A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag size={18} color="#D97706" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Instant GST Invoices</div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Generated automatically via Kafka</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
