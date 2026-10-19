import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { InvoiceModal } from './components/InvoiceModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminProductModal } from './components/AdminProductModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LoginModal } from './components/LoginModal';
import { ToastContainer } from './components/ToastContainer';
import { SearchX, Loader2 } from 'lucide-react';

const StoreContent: React.FC = () => {
  const {
    filteredProducts,
    isLoading,
    searchTerm,
    setSearchTerm,
    setSelectedCategory,
    currentUser,
    setActiveModal,
    activeModal,
    selectedProduct,
    isCartOpen,
  } = useStore();

  // Centralized modal scroll locking: lock background scroll when ANY modal/drawer is open, restore immediately when closed
  React.useEffect(() => {
    const isAnyModalOpen = Boolean(activeModal || selectedProduct || isCartOpen);
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal, selectedProduct, isCartOpen]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '48px' }}>
        <HeroBanner />
        <CategoryFilter />

        {/* Product Grid Container */}
        <section style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
        }}>
          {isLoading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 0',
              color: '#64748B',
              gap: '12px',
            }}>
              <Loader2 size={32} className="animate-spin" color="#1769D2" />
              <p style={{ fontSize: '0.9rem' }}>Loading products from Product Service...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 'var(--radius-lg)',
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}>
              <SearchX size={44} color="#94A3B8" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                  No products found
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.86rem', maxWidth: '420px' }}>
                  We couldn't find any products matching "{searchTerm}". Try checking your spelling or reset filters.
                </p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Reset Search & Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '18px',
            }}>
              {filteredProducts.map((product, idx) => (
                <ProductCard key={`${product.id}_${idx}`} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Marketplace Footer (Amazon / Flipkart Inspired) */}
      <footer style={{
        background: '#232F3E',
        color: '#FFFFFF',
        marginTop: 'auto',
      }}>
        {/* Back to top button */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: '#37475A',
            textAlign: 'center',
            padding: '12px',
            fontSize: '0.82rem',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Back to top
        </div>

        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '40px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '32px',
          fontSize: '0.85rem',
        }}>
          <div>
            <h4 style={{ fontWeight: 800, marginBottom: '14px', color: '#FFFFFF' }}>Get to Know Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#CBD5E1' }}>
              <li>About ShopSphere</li>
              <li>Careers</li>
              <li>Press Releases</li>
              <li>ShopSphere Science</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 800, marginBottom: '14px', color: '#FFFFFF' }}>Connect with Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#CBD5E1' }}>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/tejasranjan_cr7"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#F472B6',
                    textDecoration: 'none',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Instagram (@tejasranjan_cr7)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 800, marginBottom: '14px', color: '#FFFFFF' }}>Let Us Help You</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#CBD5E1' }}>
              <li>
                <button
                  onClick={() => setActiveModal(currentUser ? 'user-profile' : 'login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#93C5FD',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    textAlign: 'left',
                  }}
                >
                  Your Account Details →
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal(currentUser ? 'user-profile' : 'login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#CBD5E1',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    textAlign: 'left',
                  }}
                >
                  Returns Centre & Addresses
                </button>
              </li>
              <li>100% Purchase Protection</li>
              <li>
                <a
                  href="mailto:tejasranjansingh007@gmail.com"
                  style={{
                    color: '#FDE047',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>✉️ Help & Support: tejasranjansingh007@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 800, marginBottom: '14px', color: '#FFFFFF' }}>Backend Microservices</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#CBD5E1' }}>
              <li>• Product Service (PostgreSQL 14)</li>
              <li>• User Service (MongoDB)</li>
              <li>• Order Service (PostgreSQL 14)</li>
              <li>• Kafka Event Stream (`order.exchange`)</li>
              <li>• Notification Service (PDF Invoices)</li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #37475A',
          padding: '24px',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: '#94A3B8',
        }}>
          © 2026 ShopSphere Marketplace Inc. Built with React, Vite & Spring Boot 3.4 REST APIs.
        </div>
      </footer>

      {/* Modals & Slide-out Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <InvoiceModal />
      <UserProfileModal />
      <AdminProductModal />
      <AdminDashboardModal />
      <LoginModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
