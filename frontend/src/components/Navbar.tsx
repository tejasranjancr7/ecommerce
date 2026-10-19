import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingCart, 
  Search, 
  X, 
  MapPin, 
  ChevronDown, 
  Menu,
  ShieldCheck,
  LogOut,
  LogIn,
  User as UserIcon,
  Lock,
  RefreshCw,
  RotateCcw
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    cartCount,
    setIsCartOpen,
    currentUser,
    isAdmin,
    logout,
    switchUser,
    clearAllSessions,
    verifiedSessions,
    showToast,
    setActiveModal,
    orders,
    setViewInvoiceOrder,
    categories,
    selectedCategory,
    setSelectedCategory
  } = useStore();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
      {/* Main Marketplace Navbar (Amazon / Flipkart Style) */}
      <div style={{
        background: '#131921',
        padding: '10px 24px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '18px',
      }}>
        {/* Logo */}
        <div
          onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', flexShrink: 0 }}
        >
          <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Shop<span style={{ color: '#FFA41C' }}>Sphere</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94A3B8', marginLeft: '2px', fontWeight: 600 }}>.in</span>
        </div>

        {/* Delivery Location */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        onClick={() => {
          if (!currentUser) {
            setActiveModal('login');
          } else {
            setActiveModal('user-profile');
          }
        }}
        >
          <MapPin size={18} color="#CCCCCC" />
          <div style={{ fontSize: '0.78rem', lineHeight: 1.2 }}>
            <div style={{ color: '#CCCCCC' }}>
              {currentUser ? `Deliver to ${currentUser.firstName}` : 'Deliver to'}
            </div>
            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
              {currentUser
                ? `${currentUser.address?.city || 'Bengaluru'} ${currentUser.address?.zipcode || '560038'}`
                : 'Sign in to set location'}
            </div>
          </div>
        </div>

        {/* Search Bar with Category Dropdown */}
        <div style={{
          flex: 1,
          maxWidth: '720px',
          display: 'flex',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              background: '#E2E8F0',
              border: 'none',
              padding: '0 12px',
              fontSize: '0.82rem',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 600,
              outline: 'none',
              borderRight: '1px solid #CBD5E1',
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search products, brands, electronics, computers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 38px 10px 14px',
                border: 'none',
                outline: 'none',
                fontSize: '0.92rem',
                color: '#111827',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            style={{
              background: '#FEBD69',
              border: 'none',
              padding: '0 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Search"
          >
            <Search size={18} color="#111827" />
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          {/* Account & User Switcher */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setOrdersDropdownOpen(false);
              }}
              style={{
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '4px',
                border: isAdmin ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                background: isAdmin ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              }}
            >
              <div style={{ fontSize: '0.78rem', lineHeight: 1.2 }}>
                <div style={{ color: '#CCCCCC', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Hello, {currentUser ? currentUser.firstName : 'Sign in'}</span>
                  {isAdmin && (
                    <span style={{
                      background: '#F59E0B',
                      color: '#000000',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '3px',
                      letterSpacing: '0.02em',
                    }}>
                      ADMIN
                    </span>
                  )}
                  {currentUser && !isAdmin && (
                    <span style={{
                      background: '#1769D2',
                      color: '#FFFFFF',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '1px 4px',
                      borderRadius: '3px',
                    }}>
                      CUSTOMER
                    </span>
                  )}
                </div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span>{currentUser ? 'Account & Roles' : 'Sign In / Register'}</span>
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {userDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '300px',
                background: '#FFFFFF',
                color: '#111827',
                borderRadius: '8px',
                boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
                padding: '14px',
                zIndex: 300,
                border: '1px solid #E2E8F0',
              }}>
                {currentUser ? (
                  <>
                    {/* Active User Card */}
                    <div style={{
                      background: isAdmin ? '#FFFBEB' : '#F8FAFC',
                      border: `1px solid ${isAdmin ? '#FDE68A' : '#E2E8F0'}`,
                      borderRadius: '6px',
                      padding: '10px 12px',
                      marginBottom: '12px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isAdmin ? '#92400E' : '#1E40AF' }}>
                          {isAdmin ? '🛡️ KEYCLOAK ROLE: ADMIN' : '👤 KEYCLOAK ROLE: USER'}
                        </span>
                        <span className="badge badge-green" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                          Active Token
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        {currentUser.firstName} {currentUser.lastName}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B', wordBreak: 'break-all' }}>
                        {currentUser.email}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '4px' }}>
                        X-User-ID: <code>{currentUser.id}</code>
                      </div>
                    </div>

                    {/* Role Fast Switcher */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>
                        SWITCH ACCOUNT:
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <RefreshCw size={10} />
                        OAuth2 Refresh Token
                      </span>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setActiveModal('admin-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #FDE68A',
                          background: '#FFFBEB',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#92400E',
                        }}
                      >
                        <ShieldCheck size={16} color="#D97706" />
                        <div>
                          <div>Open Admin Portal & Settings</div>
                          <div style={{ fontSize: '0.7rem', color: '#B45309', fontWeight: 400 }}>All Orders, Catalog & Diagnostics</div>
                        </div>
                      </button>
                    )}

                    {/* Akshay Ranjan Switcher */}
                    {currentUser.email !== 'akshayranjan@gmail.com' && (() => {
                      const isVerified = verifiedSessions.includes('akshayranjan@gmail.com');
                      return (
                        <button
                          onClick={async () => {
                            setUserDropdownOpen(false);
                            await switchUser('akshayranjan@gmail.com');
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #BFDBFE',
                            background: '#EFF6FF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserIcon size={15} color="#1D4ED8" />
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E40AF' }}>Akshay Ranjan</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>akshayranjan@gmail.com</div>
                            </div>
                          </div>
                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: isVerified ? '#DCFCE7' : '#FEF3C7',
                            color: isVerified ? '#166534' : '#B45309',
                            border: `1px solid ${isVerified ? '#86EFAC' : '#FDE68A'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}>
                            {isVerified ? <RefreshCw size={10} /> : <Lock size={10} />}
                            {isVerified ? 'Refresh Token' : 'Verify First'}
                          </span>
                        </button>
                      );
                    })()}

                    {/* Joe Doe Switcher */}
                    {currentUser.email !== 'joe@example.com' && (() => {
                      const isVerified = verifiedSessions.includes('joe@example.com');
                      return (
                        <button
                          onClick={async () => {
                            setUserDropdownOpen(false);
                            await switchUser('joe@example.com');
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #BFDBFE',
                            background: '#EFF6FF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserIcon size={15} color="#1D4ED8" />
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E40AF' }}>Joe Doe</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>joe@example.com</div>
                            </div>
                          </div>
                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: isVerified ? '#DCFCE7' : '#FEF3C7',
                            color: isVerified ? '#166534' : '#B45309',
                            border: `1px solid ${isVerified ? '#86EFAC' : '#FDE68A'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}>
                            {isVerified ? <RefreshCw size={10} /> : <Lock size={10} />}
                            {isVerified ? 'Refresh Token' : 'Verify First'}
                          </span>
                        </button>
                      );
                    })()}

                    {/* Administrator Switcher */}
                    {!isAdmin && (() => {
                      const isVerified =
                        verifiedSessions.includes('tejasranjansingh007@gmail.com') ||
                        verifiedSessions.includes('admin');
                      return (
                        <button
                          onClick={async () => {
                            setUserDropdownOpen(false);
                            await switchUser('tejasranjansingh007@gmail.com');
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #FDE68A',
                            background: '#FFFBEB',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={16} color="#D97706" />
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E' }}>👑 Tejas Ranjan (Admin)</div>
                              <div style={{ fontSize: '0.7rem', color: '#B45309' }}>tejasranjansingh007@gmail.com</div>
                            </div>
                          </div>
                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: isVerified ? '#DCFCE7' : '#FEF3C7',
                            color: isVerified ? '#166534' : '#B45309',
                            border: `1px solid ${isVerified ? '#86EFAC' : '#FDE68A'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}>
                            {isVerified ? <RefreshCw size={10} /> : <Lock size={10} />}
                            {isVerified ? 'Refresh Token' : 'Verify First'}
                          </span>
                        </button>
                      );
                    })()}

                    {/* Reset Sessions & Tokens (Allows re-testing first-time verification anytime) */}
                    <button
                      onClick={() => {
                        clearAllSessions();
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px dashed #CBD5E1',
                        background: '#F8FAFC',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        color: '#64748B',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      title="Clear stored refresh tokens to test first-time login verification"
                    >
                      <RotateCcw size={12} color="#94A3B8" />
                      <span>Reset Sessions (Re-test Verification)</span>
                    </button>

                    {/* User Profile / Account Details Modal Trigger */}
                    <button
                      onClick={() => {
                        setActiveModal('user-profile');
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid #BFDBFE',
                        background: '#EFF6FF',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#1E40AF',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserIcon size={16} color="#1D4ED8" />
                        <span>Your Account & Details</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 600 }}>View →</span>
                    </button>

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#FEE2E2',
                        color: '#DC2626',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div>
                    <div style={{ textAlign: 'center', padding: '8px 0 14px 0' }}>
                      <p style={{ fontSize: '0.86rem', fontWeight: 600, color: '#111827', margin: '0 0 6px 0' }}>
                        Welcome to ShopSphere
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                        Sign in for personalized cart, fast checkout & order tracking.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveModal('login');
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#FEBD69',
                        color: '#111827',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginBottom: '8px',
                      }}
                    >
                      <LogIn size={16} />
                      <span>Sign In / Select Role</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Orders & Invoices */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                if (!currentUser) {
                  showToast('info', 'Sign In Required', 'Please sign in as a Customer to view your orders.');
                  setActiveModal('login');
                  return;
                }
                setOrdersDropdownOpen(!ordersDropdownOpen);
                setUserDropdownOpen(false);
              }}
              style={{
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '0.78rem', lineHeight: 1.2 }}>
                <div style={{ color: '#CCCCCC' }}>Returns</div>
                <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
                  {currentUser ? `& Orders (${orders.length})` : '& Orders'}
                </div>
              </div>
            </div>

            {ordersDropdownOpen && currentUser && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                background: '#FFFFFF',
                color: '#111827',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                padding: '12px',
                zIndex: 300,
                border: '1px solid #E2E8F0',
              }}>
                <div style={{
                  padding: '4px 8px',
                  borderBottom: '1px solid #F1F5F9',
                  marginBottom: '8px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: isAdmin ? '#B45309' : '#1D4ED8',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>{isAdmin ? 'ALL SYSTEM ORDERS (ADMIN)' : `ORDERS FOR ${currentUser.firstName.toUpperCase()}`}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B' }}>
                    {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                  </span>
                </div>
                {orders.length === 0 ? (
                  <div style={{ padding: '20px 16px', textAlign: 'center', color: '#64748B', fontSize: '0.84rem' }}>
                    <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>No orders placed yet</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>
                      Orders placed with {currentUser.email} will appear here.
                    </p>
                  </div>
                ) : (
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => {
                          setViewInvoiceOrder(order);
                          setActiveModal('invoice-view');
                          setOrdersDropdownOpen(false);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid #F1F5F9',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Order #{order.id}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • View Invoice
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: '#16A34A', fontSize: '0.85rem' }}>
                            ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Admin Portal & Settings Trigger - ONLY rendered for logged-in Administrator */}
          {isAdmin && (
            <button
              onClick={() => setActiveModal('admin-dashboard')}
              style={{
                background: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid rgba(245, 158, 11, 0.6)',
                borderRadius: '6px',
                padding: '4px 10px',
                color: '#F59E0B',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontSize: '0.78rem',
                transition: 'all 0.2s ease',
              }}
              title="Open Administrator Portal (Orders, Catalog & Diagnostics)"
            >
              <ShieldCheck size={18} color="#F59E0B" />
              <span style={{ fontWeight: 800 }}>Admin Portal</span>
            </button>
          )}

          {/* Cart Icon with Live Counter */}
          <div
            onClick={() => setIsCartOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '6px 10px',
            }}
          >
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={24} color="#FFFFFF" />
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#F59E0B',
                color: '#111827',
                fontWeight: 800,
                fontSize: '0.75rem',
                padding: '1px 6px',
                borderRadius: '9999px',
              }}>
                {cartCount}
              </span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>Cart</span>
          </div>
        </div>
      </div>

      {/* Sub-header Category Navigation Row (Amazon / Flipkart Inspired) */}
      <nav style={{
        background: '#232F3E',
        color: '#FFFFFF',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        fontSize: '0.85rem',
        overflowX: 'auto',
      }}>
        <div
          onClick={() => setSelectedCategory('All')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontWeight: selectedCategory === 'All' ? 700 : 500,
            color: selectedCategory === 'All' ? '#FFA41C' : '#FFFFFF',
          }}
        >
          <Menu size={16} />
          <span>All Categories</span>
        </div>

        {categories.filter(c => c !== 'All').map((cat) => (
          <div
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: selectedCategory === cat ? 700 : 500,
              color: selectedCategory === cat ? '#FFA41C' : '#FFFFFF',
              borderBottom: selectedCategory === cat ? '2px solid #FFA41C' : '2px solid transparent',
              paddingBottom: '2px',
            }}
          >
            {cat}
          </div>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94A3B8' }}>
          <ShieldCheck size={14} color="#34D399" />
          <span>Spring Boot REST Microservices</span>
        </div>
      </nav>
    </header>
  );
};
