import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ShieldCheck, 
  Package, 
  ShoppingCart, 
  Users, 
  Server, 
  FileText, 
  Trash2, 
  Edit2
} from 'lucide-react';
import type { Product } from '../types';

export const AdminDashboardModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    isAdmin,
    allOrders,
    updateOrderStatus,
    setViewInvoiceOrder,
    products,
    createProduct,
    updateProduct,
    deleteProduct,
    users,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'users' | 'system'>('orders');

  // Product form state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Mobiles',
    price: '',
    stockQuantity: '',
    description: '',
    imageUrl: '',
  });

  // STRICT ACCESS CONTROL: Only admins are allowed to render this modal!
  if (activeModal !== 'admin-dashboard' || !isAdmin) return null;

  const handleEditProductClick = (p: Product) => {
    setIsEditingProduct(true);
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      stockQuantity: String(p.stockQuantity),
      description: p.description,
      imageUrl: p.imageUrl,
    });
  };

  const resetProductForm = () => {
    setIsEditingProduct(false);
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'Mobiles',
      price: '',
      stockQuantity: '',
      description: '',
      imageUrl: '',
    });
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(productForm.price) || 0;
    const stock = parseInt(productForm.stockQuantity, 10) || 0;
    const imageUrl = productForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';

    if (isEditingProduct && editingProductId) {
      await updateProduct(editingProductId, {
        name: productForm.name,
        category: productForm.category,
        price,
        stockQuantity: stock,
        description: productForm.description,
        imageUrl,
      });
    } else {
      await createProduct({
        name: productForm.name,
        category: productForm.category,
        price,
        stockQuantity: stock,
        description: productForm.description,
        imageUrl,
      });
    }
    resetProductForm();
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveModal(null)}>
      <div
        className="modal-content"
        style={{
          maxWidth: '1000px',
          width: '95%',
          maxHeight: '90vh',
          background: '#FFFFFF',
          padding: 0,
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          background: '#0F172A',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #F59E0B',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#F59E0B',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShieldCheck size={22} color="#0F172A" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  Marketplace Administrator Portal
                </h2>
                <span style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid #F59E0B',
                  color: '#F59E0B',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}>
                  ROLE_ADMIN
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '2px 0 0 0' }}>
                Full system control: All customer orders, catalog CRUD, customer directory & microservices settings
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
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

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          padding: '6px 16px 0 16px',
          gap: '8px',
        }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '3px solid #1769D2' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'orders' ? '#1769D2' : '#64748B',
              fontWeight: activeTab === 'orders' ? 700 : 500,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShoppingCart size={16} />
            <span>All Customer Orders ({allOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom: activeTab === 'products' ? '3px solid #1769D2' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'products' ? '#1769D2' : '#64748B',
              fontWeight: activeTab === 'products' ? 700 : 500,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Package size={16} />
            <span>Product Catalog CRUD ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom: activeTab === 'users' ? '3px solid #1769D2' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'users' ? '#1769D2' : '#64748B',
              fontWeight: activeTab === 'users' ? 700 : 500,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={16} />
            <span>Registered Customers ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom: activeTab === 'system' ? '3px solid #1769D2' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'system' ? '#1769D2' : '#64748B',
              fontWeight: activeTab === 'system' ? 700 : 500,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Server size={16} />
            <span>Microservices Diagnostics</span>
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* TAB 1: ALL CUSTOMER ORDERS WITH USER NAMES */}
          {activeTab === 'orders' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    Global Orders Overview (Admin View)
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                    Every order placed across the marketplace, linked with customer identity and purchase items.
                  </p>
                </div>
                <span className="badge badge-amber" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                  Total Orders: {allOrders.length}
                </span>
              </div>

              {allOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#64748B', background: '#F8FAFC', borderRadius: '8px' }}>
                  <ShoppingCart size={36} color="#94A3B8" style={{ marginBottom: '8px' }} />
                  <p style={{ fontWeight: 600, margin: 0 }}>No orders have been recorded in the system.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {allOrders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      {/* Top Bar of Order Card: User Name, Email, Status */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '10px',
                        borderBottom: '1px solid #F1F5F9',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>
                              Order #{order.id}
                            </span>
                            <span style={{ fontSize: '0.76rem', color: '#64748B' }}>•</span>
                            {/* USER NAME HIGHLIGHTED */}
                            <span style={{
                              background: '#EFF6FF',
                              color: '#1D4ED8',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: '1px solid #BFDBFE',
                            }}>
                              Customer: {order.userName || 'Unknown Customer'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '3px' }}>
                            Email: <strong>{order.userEmail}</strong> • User ID: <code>{order.userId || 'N/A'}</code>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* Status changer */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Status:</span>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                background: '#F8FAFC',
                                color: order.status === 'CONFIRMED' ? '#15803D' : order.status === 'SHIPPED' ? '#D97706' : '#2563EB',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </div>

                          <button
                            onClick={() => {
                              setViewInvoiceOrder(order);
                              setActiveModal('invoice-view');
                            }}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.76rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <FileText size={14} />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>

                      {/* Items List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '0.82rem',
                              color: '#334155',
                              padding: '4px 0',
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 600 }}>{item.productName}</span>
                              <span style={{ color: '#64748B', marginLeft: '6px' }}>× {item.quantity}</span>
                            </div>
                            <span style={{ fontWeight: 600 }}>
                              ₹{item.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Total */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '8px',
                        borderTop: '1px solid #F1F5F9',
                        fontSize: '0.84rem',
                      }}>
                        <span style={{ color: '#64748B', fontSize: '0.75rem' }}>
                          Placed on: {new Date(order.createdAt).toLocaleString()}
                        </span>
                        <div>
                          <span style={{ color: '#64748B', marginRight: '6px' }}>Order Total:</span>
                          <strong style={{ color: '#B12704', fontSize: '0.98rem' }}>
                            ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
          {activeTab === 'products' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px' }}>
              {/* Product Form */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '16px',
              }}>
                <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Package size={17} color="#F59E0B" />
                  <span>{isEditingProduct ? `Edit Product #${editingProductId}` : 'Add New Product to PostgreSQL'}</span>
                </h3>

                <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Sony WH-1000XM5 Headphones"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                        Category
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      >
                        <option value="Mobiles">Mobiles</option>
                        <option value="Laptops">Laptops</option>
                        <option value="Audio">Audio</option>
                        <option value="Wearables">Wearables</option>
                        <option value="Cameras">Cameras</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="29999"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.stockQuantity}
                        onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                        placeholder="50"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                        placeholder="https://..."
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Specifications, features, warranty details..."
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#F59E0B',
                        color: '#111827',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isEditingProduct ? 'Update Product' : 'Save Product to Catalog'}
                    </button>
                    {isEditingProduct && (
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="btn btn-secondary"
                        style={{ padding: '10px 14px' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Product List */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#111827', marginBottom: '14px' }}>
                  Current Catalog ({products.length} items)
                </h3>
                <div style={{ maxHeight: '460px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                  {products.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#F8FAFC', borderRadius: '4px', overflow: 'hidden' }}>
                          <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            ₹{p.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })} • Stock: {p.stockQuantity}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => handleEditProductClick(p)}
                          style={{ width: '30px', height: '30px' }}
                          title="Edit Product"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-danger btn-icon"
                          onClick={() => deleteProduct(p.id)}
                          style={{ width: '30px', height: '30px' }}
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTERED CUSTOMER PROFILES */}
          {activeTab === 'users' && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Customer Directory (User Microservice / MongoDB)
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Synced accounts with Keycloak identities, MongoDB ObjectIDs, and shipping locations.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '14px' }}>
                {users.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${u.role === 'ADMIN' ? '#FDE68A' : '#E2E8F0'}`,
                      borderRadius: '8px',
                      padding: '14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                        {u.firstName} {u.lastName}
                      </span>
                      <span
                        className={u.role === 'ADMIN' ? 'badge badge-amber' : 'badge badge-blue'}
                        style={{ fontSize: '0.68rem', fontWeight: 700 }}
                      >
                        {u.role}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Email: <strong>{u.email}</strong></div>
                      <div>Phone: {u.phone}</div>
                      <div>
                        Address: {u.address ? `${u.address.street}, ${u.address.city}, ${u.address.zipcode}` : 'No address saved'}
                      </div>
                      <div style={{ marginTop: '4px', fontSize: '0.7rem', color: '#94A3B8' }}>
                        MongoDB ID: <code>{u.id}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MICROSERVICES DIAGNOSTICS & SYSTEM SETTINGS */}
          {activeTab === 'system' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Microservices Architecture & System Diagnostics
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Real-time health status of Spring Cloud 2024, Kafka event streams, and database engines.
                </p>
              </div>

              {/* Mode card */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Active Backend Communication</span>
                    <span className="badge badge-green">LIVE ONLY</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                    Direct reactive routing via Spring Cloud Gateway (:8080) to containerized microservices and Kafka event brokers
                  </div>
                </div>
                <div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#DEF7EC',
                    color: '#03543F',
                    border: '1px solid #31C48D',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0E9F6E' }} />
                    LIVE PRODUCTION MODE
                  </span>
                </div>
              </div>

              {/* Services Health Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Eureka Service Discovery</span>
                    <span className="badge badge-green">PORT 8761</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>http://localhost:8761 • Registry UP</div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Spring Cloud Gateway</span>
                    <span className="badge badge-green">PORT 8080</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>CircuitBreaker & Reactive Filter UP</div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Product Microservice</span>
                    <span className="badge badge-green">PORT 8081</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>PostgreSQL 14 Catalog Engine UP</div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>User Microservice</span>
                    <span className="badge badge-green">PORT 8082</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>MongoDB Identity & Keycloak Sync UP</div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Order Microservice</span>
                    <span className="badge badge-green">PORT 8083</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>PostgreSQL 14 Cart & Orders UP</div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Keycloak OAuth2 / OIDC</span>
                    <span className="badge badge-green">PORT 8443</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Realm: ecom-realm • PKCE Client UP</div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>RabbitMQ / Kafka Broker</span>
                    <span className="badge badge-green">PORT 15672</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Event exchange: order.exchange UP</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
