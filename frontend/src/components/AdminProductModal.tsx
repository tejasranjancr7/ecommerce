import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Edit2, Trash2, Package, ShieldCheck, Lock } from 'lucide-react';
import type { Product } from '../types';

export const AdminProductModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    products,
    createProduct,
    updateProduct,
    deleteProduct,
    isAdmin,
    showToast,
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Mobiles',
    price: '',
    stockQuantity: '',
    description: '',
    imageUrl: '',
  });

  if (activeModal !== 'admin-products') return null;

  // STRICT ROLE GATE: Customers cannot view or use this management interface
  if (!isAdmin) {
    return (
      <div className="modal-overlay" onClick={() => setActiveModal(null)}>
        <div
          className="modal-content"
          style={{ maxWidth: '440px', background: '#FFFFFF', padding: '32px 24px', textAlign: 'center', borderRadius: '12px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: '#FEE2E2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}>
            <Lock size={30} color="#DC2626" />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
            Administrator Access Required
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
            You are signed in with a <strong>Customer Account</strong>. Customers do not have permissions to add, edit, or delete catalog items. Please authenticate with Administrator credentials (<code>ROLE_ADMIN</code>).
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveModal(null)}
              style={{ flex: 1, padding: '10px' }}
            >
              Dismiss
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setActiveModal('login')}
              style={{ flex: 1.2, padding: '10px', background: '#F59E0B', borderColor: '#F59E0B', color: '#111827', fontWeight: 700 }}
            >
              Sign In as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEditClick = (p: Product) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormData({
      name: p.name,
      category: p.category,
      price: String(p.price),
      stockQuantity: String(p.stockQuantity),
      description: p.description,
      imageUrl: p.imageUrl,
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Mobiles',
      price: '',
      stockQuantity: '',
      description: '',
      imageUrl: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.price) || 0;
    const stockNum = parseInt(formData.stockQuantity, 10) || 0;
    const imageUrl = formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';

    if (!isAdmin) {
      showToast('error', 'Administrator Access Required', 'Please sign in with Admin credentials to modify catalog.');
      setActiveModal('login');
      return;
    }

    if (isEditing && editingId) {
      await updateProduct(editingId, {
        name: formData.name,
        category: formData.category,
        price: priceNum,
        stockQuantity: stockNum,
        description: formData.description,
        imageUrl,
      });
    } else {
      await createProduct({
        name: formData.name,
        category: formData.category,
        price: priceNum,
        stockQuantity: stockNum,
        description: formData.description,
        imageUrl,
      });
    }
    resetForm();
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveModal(null)}>
      <div
        className="modal-content"
        style={{ maxWidth: '880px', background: '#FFFFFF', padding: '0' }}
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Catalog & Inventory Management
              </h2>
              {isAdmin ? (
                <span className="badge badge-amber" style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={12} />
                  <span>ADMIN ACCESS</span>
                </span>
              ) : (
                <span className="badge" style={{ background: '#F1F5F9', color: '#64748B', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Lock size={12} />
                  <span>READ-ONLY (CUSTOMER)</span>
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '4px 0 0 0' }}>
              Connected to Product Microservice (PostgreSQL 14) • <code>/api/products</code>
            </p>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="btn btn-ghost btn-icon"
          >
            <X size={20} />
          </button>
        </div>

        {/* Warning banner when not admin */}
        {!isAdmin && (
          <div style={{
            background: '#FFFBEB',
            borderBottom: '1px solid #FDE68A',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#92400E' }}>
              <Lock size={16} color="#B45309" style={{ flexShrink: 0 }} />
              <span>
                <strong>Administrator Authentication Required:</strong> You are currently signed in as a Customer. To add, edit, or delete catalog items, switch to the Admin role.
              </span>
            </div>
            <button
              onClick={() => setActiveModal('login')}
              style={{
                background: '#D97706',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Sign In as Admin
            </button>
          </div>
        )}

        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1.2fr 1.6fr', gap: '20px' }}>
          {/* Form */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Package size={17} color="#1769D2" />
              <span>{isEditing ? `Edit Product #${editingId}` : 'Add New Product to Catalog'}</span>
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Samsung Galaxy S24 Ultra"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Mobiles">Mobiles</option>
                    <option value="Computers">Computers</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (INR)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1099.99"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Stock Qty</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    placeholder="25"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product specs and features..."
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  type="submit"
                  className="btn btn-yellow"
                  style={{ flex: 1, fontWeight: 700 }}
                >
                  {isEditing ? 'Save Changes' : '+ Add Product'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Catalog List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>
              Products in Catalog ({products.length})
            </h3>

            <div style={{
              flex: 1,
              maxHeight: '420px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              paddingRight: '4px',
            }}>
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        ₹{p.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })} • Stock: {p.stockQuantity} • {p.category}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-secondary btn-icon"
                      onClick={() => handleEditClick(p)}
                      title="Edit"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn btn-danger btn-icon"
                      onClick={() => {
                        if (!isAdmin) {
                          showToast('error', 'Unauthorized Action', 'Admin authentication required to delete products.');
                          setActiveModal('login');
                          return;
                        }
                        deleteProduct(p.id);
                      }}
                      title={isAdmin ? 'Delete Product' : 'Admin authentication required to delete'}
                      style={{ width: '32px', height: '32px', opacity: isAdmin ? 1 : 0.5 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
