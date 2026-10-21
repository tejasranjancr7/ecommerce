import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ApiService } from '../services/api';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Edit3, 
  Package
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    currentUser, 
    setCurrentUser, 
    orders, 
    showToast 
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
  });

  useEffect(() => {
    if (currentUser) {
      setEditForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || '',
        street: currentUser.address?.street || '',
        city: currentUser.address?.city || '',
        state: currentUser.address?.state || '',
        country: currentUser.address?.country || 'India',
        zipcode: currentUser.address?.zipcode || '',
      });
    }
  }, [currentUser]);

  const closeModal = () => {
    setActiveModal(null);
  };

  if (activeModal !== 'user-profile') return null;

  if (!currentUser) {
    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div
          className="modal-content"
          style={{ maxWidth: '420px', padding: '32px 24px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
            Sign In Required
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5, marginBottom: '20px' }}>
            Please sign in to view your account details and addresses.
          </p>
          <button
            className="btn btn-yellow"
            onClick={() => setActiveModal('login')}
            style={{ width: '100%', fontWeight: 700 }}
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: editForm.phone,
      address: {
        street: editForm.street,
        city: editForm.city,
        state: editForm.state,
        country: editForm.country,
        zipcode: editForm.zipcode,
      },
    };
    setCurrentUser(updated);
    ApiService.saveCurrentUser(updated);
    await ApiService.updateUser(currentUser.id, updated);
    setIsEditing(false);
    showToast('success', 'Profile Updated', 'Your account details and shipping address have been saved.');
  };

  const userOrdersTotal = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content"
        style={{
          maxWidth: '640px',
          maxHeight: '90vh',
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
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          background: currentUser.role === 'ADMIN' ? '#0F172A' : '#131921',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid',
          borderColor: currentUser.role === 'ADMIN' ? '#F59E0B' : '#1769D2',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: currentUser.role === 'ADMIN' ? '#FEF3C7' : '#DBEAFE',
              color: currentUser.role === 'ADMIN' ? '#92400E' : '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}>
              {currentUser.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Your Account Details
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0 }}>
                {currentUser.role === 'ADMIN' ? 'Administrator Account' : 'Verified Customer Account'} • MongoDB User ID
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

        {/* Content Body (Scrollable inside modal) */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          WebkitOverflowScrolling: 'touch',
        }}>
          {/* Identity & Role Badge Card */}
          <div style={{
            background: currentUser.role === 'ADMIN' ? '#FFFBEB' : '#F8FAFC',
            border: `1px solid ${currentUser.role === 'ADMIN' ? '#FDE68A' : '#E2E8F0'}`,
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
                  {[currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ') || 'Customer'}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: currentUser.role === 'ADMIN' ? '#F59E0B' : '#1769D2',
                  color: currentUser.role === 'ADMIN' ? '#000000' : '#FFFFFF',
                }}>
                  {currentUser.role === 'ADMIN' ? 'ADMINISTRATOR' : 'CUSTOMER'}
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>MongoDB ID:</span>
                <code style={{ background: '#E2E8F0', padding: '1px 5px', borderRadius: '4px', color: '#0F172A', fontWeight: 600 }}>
                  {currentUser.id}
                </code>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <Edit3 size={14} />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
            </button>
          </div>

          {!isEditing ? (
            /* Account Overview Information */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Primary Contact Details */}
              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                  Contact Information
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Mail size={18} color="#1D4ED8" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Email Address</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>{currentUser.email}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Phone size={18} color="#1D4ED8" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Phone Number</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>{currentUser.phone || '+91 9876543210'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery & Shipping Address */}
              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                  Default Delivery & Shipping Address
                </h4>
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  <MapPin size={20} color="#EA580C" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                      {[currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ') || 'Customer'}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '2px' }}>
                      {currentUser.address?.street || '123 Market Street, Indiranagar'}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#475569' }}>
                      {currentUser.address?.city || 'Bengaluru'}, {currentUser.address?.state || 'Karnataka'} - {currentUser.address?.zipcode || '560038'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                      Country: {currentUser.address?.country || 'India'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders & Security Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  padding: '14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', marginBottom: '6px' }}>
                    <Package size={18} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Order Activity</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E40AF' }}>
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    Total Spend: ₹{userOrdersTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '8px',
                  padding: '14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', marginBottom: '6px' }}>
                    <ShieldCheck size={18} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Security & Auth</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#166534' }}>
                    OAuth2 Token Active
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    Refresh Token: Verified & Persistent
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Account Details Form */
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  value={editForm.street}
                  onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Zipcode
                  </label>
                  <input
                    type="text"
                    value={editForm.zipcode}
                    onChange={(e) => setEditForm({ ...editForm, zipcode: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#FEBD69',
                    color: '#111827',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save Account Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
