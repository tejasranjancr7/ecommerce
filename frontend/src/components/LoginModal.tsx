import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShieldCheck, UserCheck, KeyRound, Sparkles, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { activeModal, setActiveModal, login, createUser, showToast, loginTarget, setLoginTarget } = useStore();
  const [authMode, setAuthMode] = useState<'customer' | 'admin' | 'register'>('customer');

  // Customer / Admin form
  const [username, setUsername] = useState('akshayranjan@gmail.com');
  const [password, setPassword] = useState('Password@123');
  const [isLoading, setIsLoading] = useState(false);

  // Register form
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zipcode: '560038',
  });

  useEffect(() => {
    if (loginTarget) {
      if (loginTarget.role) {
        setAuthMode(loginTarget.role);
      }
      setUsername(loginTarget.emailOrUsername);
      setPassword(''); // Blank so user must explicitly verify credentials
    }
  }, [loginTarget]);

  if (activeModal !== 'login') return null;

  const closeModal = () => {
    setActiveModal(null);
    setLoginTarget(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      showToast('error', 'Please enter your username or email');
      return;
    }

    if (!password) {
      showToast('error', 'Password Required', 'Please enter your password to verify credentials.');
      return;
    }

    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);

    if (success) {
      closeModal();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.firstName || !regForm.email) {
      showToast('error', 'First name and email are required');
      return;
    }

    setIsLoading(true);
    const success = await createUser({
      firstName: regForm.firstName,
      lastName: regForm.lastName,
      email: regForm.email,
      phone: regForm.phone || '+91 9876543210',
      role: 'CUSTOMER',
      address: {
        street: regForm.street || '42 Market Road',
        city: regForm.city,
        state: regForm.state,
        country: regForm.country,
        zipcode: regForm.zipcode,
      },
    });
    setIsLoading(false);

    if (success) {
      setActiveModal(null);
    }
  };

  const setTejasAdminPreset = () => {
    setAuthMode('admin');
    setUsername('tejasranjansingh007@gmail.com');
    setPassword('admin');
  };

  const setAkshayPreset = () => {
    setAuthMode('customer');
    setUsername('akshayranjan@gmail.com');
    setPassword('Password@123');
  };

  const setJoePreset = () => {
    setAuthMode('customer');
    setUsername('joe@example.com');
    setPassword('Password@123');
  };

  const setAdminPreset = () => {
    setAuthMode('admin');
    setUsername('admin');
    setPassword('admin');
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content"
        style={{
          maxWidth: '520px',
          maxHeight: '88vh',
          background: '#FFFFFF',
          padding: '0',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Fixed) */}
        <div style={{
          padding: '18px 24px',
          background: authMode === 'admin' ? '#0F172A' : '#131921',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid',
          borderColor: authMode === 'admin' ? '#F59E0B' : '#1769D2',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {authMode === 'admin' ? (
              <ShieldCheck size={26} color="#F59E0B" />
            ) : (
              <UserCheck size={26} color="#38BDF8" />
            )}
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                {loginTarget ? 'Verify Account Identity' : authMode === 'admin' ? 'Admin Portal Authentication' : authMode === 'register' ? 'Create Customer Account' : 'Customer Sign In'}
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0 }}>
                {loginTarget ? 'First-time verification required • Refresh token will be issued' : 'Keycloak 26.2 OAuth2 • JWT Token Auth • Role Based Access'}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection (Fixed) */}
        <div style={{
          display: 'flex',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          padding: '6px 12px 0 12px',
          gap: '8px',
          flexShrink: 0,
        }}>
          <button
            onClick={() => { setAuthMode('customer'); setUsername('akshayranjan@gmail.com'); }}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderBottom: authMode === 'customer' ? '3px solid #1769D2' : '3px solid transparent',
              background: 'transparent',
              color: authMode === 'customer' ? '#1769D2' : '#64748B',
              fontWeight: authMode === 'customer' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <UserCheck size={16} />
            <span>Customer</span>
          </button>

          <button
            onClick={() => { setAuthMode('admin'); setUsername('admin'); setPassword('admin'); }}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderBottom: authMode === 'admin' ? '3px solid #F59E0B' : '3px solid transparent',
              background: 'transparent',
              color: authMode === 'admin' ? '#D97706' : '#64748B',
              fontWeight: authMode === 'admin' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} />
            <span>Admin</span>
          </button>

          <button
            onClick={() => setAuthMode('register')}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderBottom: authMode === 'register' ? '3px solid #10B981' : '3px solid transparent',
              background: 'transparent',
              color: authMode === 'register' ? '#059669' : '#64748B',
              fontWeight: authMode === 'register' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={16} />
            <span>Register</span>
          </button>
        </div>

        {/* Content Body (Scrollable Inside Modal) */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          WebkitOverflowScrolling: 'touch',
        }}>
          {/* First-Time Verification Alert */}
          {loginTarget && (
            <div style={{
              background: '#FFFBEB',
              border: '2px solid #F59E0B',
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <Lock size={22} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Identity Verification Required</span>
                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '4px', color: '#B45309', fontWeight: 700 }}>
                    First Time Login
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78350F', marginTop: '4px', lineHeight: 1.45 }}>
                  {loginTarget.reason || `Please enter password for ${loginTarget.emailOrUsername} to verify access. Once verified for the first time, your session refresh token will handle future switches automatically.`}
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Presets Banner */}
          <div style={{
            background: authMode === 'admin' ? '#FFFBEB' : '#EFF6FF',
            border: `1px solid ${authMode === 'admin' ? '#FDE68A' : '#BFDBFE'}`,
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '20px',
          }}>
            {authMode === 'customer' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.78rem', color: '#1E40AF', fontWeight: 700 }}>
                  ⚡ SELECT DEMO CUSTOMER (Order Isolation Demo):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={setAkshayPreset}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: username === 'akshayranjan@gmail.com' ? '2px solid #1D4ED8' : '1px solid #CBD5E1',
                      background: username === 'akshayranjan@gmail.com' ? '#DBEAFE' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1E40AF' }}>👤 Akshay Ranjan</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>akshayranjan@gmail.com</div>
                  </button>

                  <button
                    type="button"
                    onClick={setJoePreset}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: username === 'joe@example.com' ? '2px solid #1D4ED8' : '1px solid #CBD5E1',
                      background: username === 'joe@example.com' ? '#DBEAFE' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1E40AF' }}>👤 Joe Doe</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>joe@example.com</div>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.78rem', color: '#92400E', fontWeight: 700 }}>
                  🛡️ SELECT ADMINISTRATOR PROFILE (ROLE_ADMIN):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={setTejasAdminPreset}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: username === 'tejasranjansingh007@gmail.com' ? '2px solid #D97706' : '1px solid #CBD5E1',
                      background: username === 'tejasranjansingh007@gmail.com' ? '#FEF3C7' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#92400E' }}>👑 Tejas Ranjan (Admin)</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      tejasranjansingh007@gmail.com
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#D97706', fontWeight: 600 }}>Pass: admin</div>
                  </button>

                  <button
                    type="button"
                    onClick={setAdminPreset}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: username === 'admin' ? '2px solid #D97706' : '1px solid #CBD5E1',
                      background: username === 'admin' ? '#FEF3C7' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#92400E' }}>🛡️ Root Admin</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>admin / admin</div>
                    <div style={{ fontSize: '0.68rem', color: '#D97706', fontWeight: 600 }}>Role: ROLE_ADMIN</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {authMode !== 'register' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  {authMode === 'admin' ? 'Admin Username' : 'Email or Mobile Phone Number'}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={authMode === 'admin' ? 'admin' : 'you@example.com'}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Password</label>
                  <span style={{ fontSize: '0.72rem', color: '#1769D2', cursor: 'pointer' }}>Forgot Password?</span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{
                background: '#F8FAFC',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#64748B',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}>
                <KeyRound size={16} color="#64748B" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  {authMode === 'admin'
                    ? 'Authenticating grants role ROLE_ADMIN with access to product CRUD endpoints (/api/products).'
                    : 'Customer login sets X-User-ID header and links shopping cart and order history in MongoDB.'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: authMode === 'admin' ? '#F59E0B' : '#FEBD69',
                  color: '#111827',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>{loginTarget ? 'Verify & Activate Session (Refresh Token)' : `Sign In as ${authMode === 'admin' ? 'Administrator' : 'Customer'}`}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.firstName}
                    onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                    placeholder="John"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={regForm.lastName}
                    onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                    placeholder="Doe"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={regForm.street}
                    onChange={(e) => setRegForm({ ...regForm, street: e.target.value })}
                    placeholder="123 Tech Park"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={regForm.zipcode}
                    onChange={(e) => setRegForm({ ...regForm, zipcode: e.target.value })}
                    placeholder="560038"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#10B981',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isLoading ? <span>Registering...</span> : <span>Create Customer Profile</span>}
              </button>
            </form>
          )}

          {/* Microservice Info */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748B',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#16A34A" />
              <span>Keycloak OAuth2 / OpenID Connect</span>
            </div>
            <span>Port: 8443 / 8080</span>
          </div>
        </div>
      </div>
    </div>
  );
};
