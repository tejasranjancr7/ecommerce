import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Product, User, CartItem, Order, BackendMode, ToastMessage, ModalType } from '../types';
import { ApiService } from '../services/api';
import { INITIAL_USERS } from '../services/mockData';
import confetti from 'canvas-confetti';

interface StoreContextType {
  // Products
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  updateProduct: (id: string | number, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string | number) => Promise<boolean>;

  // Users & Auth
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  token: string | null;
  refreshToken: string | null;
  verifiedSessions: string[];
  loginTarget: { emailOrUsername: string; role?: 'customer' | 'admin'; reason?: string } | null;
  setLoginTarget: (target: { emailOrUsername: string; role?: 'customer' | 'admin'; reason?: string } | null) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  switchUser: (targetIdentifier: string) => Promise<{ success: boolean; requiresVerification: boolean }>;
  logout: () => void;
  clearAllSessions: () => void;
  createUser: (userData: Omit<User, 'id'>) => Promise<boolean>;

  // Cart
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  appliedCoupon: string;
  couponDiscount: number;
  shippingCharge: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Orders & Checkout
  orders: Order[];
  allOrders: Order[];
  updateOrderStatus: (orderId: number | string, status: string) => Promise<boolean>;
  lastOrder: Order | null;
  viewInvoiceOrder: Order | null;
  setViewInvoiceOrder: (order: Order | null) => void;
  isCheckingOut: boolean;
  checkout: (options?: { discountAmount?: number; couponCode?: string; shippingCharge?: number; finalAmount?: number }) => Promise<boolean>;

  // Modals & UI
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeModal: 'user-profile' | 'admin-products' | 'checkout' | 'order-success' | 'invoice-view' | 'login' | 'admin-dashboard' | null;
  setActiveModal: (modal: 'user-profile' | 'admin-products' | 'checkout' | 'order-success' | 'invoice-view' | 'login' | 'admin-dashboard' | null) => void;

  // System & Backend
  backendMode: BackendMode;
  toggleBackendMode: () => void;
  isBackendLive: boolean;
  checkBackendStatus: () => Promise<void>;

  // Toast
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  // AUTHENTICATION FIRST: Only read saved user from localStorage. Do NOT default to any demo user.
  const [currentUser, setCurrentUser] = useState<User | null>(() => ApiService.getSavedUser());
  const [token, setToken] = useState<string | null>(() => ApiService.getToken());
  const [refreshToken, setRefreshToken] = useState<string | null>(() => ApiService.getRefreshToken());
  const [verifiedSessions, setVerifiedSessions] = useState<string[]>(() => ApiService.getVerifiedSessions());
  const [loginTarget, setLoginTarget] = useState<{ emailOrUsername: string; role?: 'customer' | 'admin'; reason?: string } | null>(null);

  const isAuthenticated = Boolean(currentUser && token);
  const isAdmin = Boolean(currentUser?.role === 'ADMIN');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');

  // All system orders from backend
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [viewInvoiceOrder, setViewInvoiceOrder] = useState<Order | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // Prompt login immediately if no user is authenticated
  const [activeModal, setActiveModal] = useState<ModalType>(() =>
    ApiService.getSavedUser() ? null : 'login'
  );

  const backendMode: BackendMode = 'live';
  const [isBackendLive, setIsBackendLive] = useState<boolean>(true);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastMessage['type'], title: string, description?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const checkBackendStatus = useCallback(async () => {
    const live = await ApiService.testBackendLive();
    setIsBackendLive(live);
  }, []);

  const toggleBackendMode = useCallback(() => {
    showToast(
      'info',
      'Live Mode Active',
      'Communicating directly with Spring Cloud Gateway at http://localhost:8080 and backend microservices.'
    );
  }, [showToast]);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.getProducts();
      setProducts(data);
    } catch {
      showToast('error', 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const refreshCart = useCallback(async (userId: string) => {
    try {
      const items = await ApiService.getCart(userId);
      setCartItems(items);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    const list = await ApiService.getOrders();
    setAllOrders(list);
  }, []);

  const refreshUsers = useCallback(async () => {
    const list = await ApiService.getUsers();
    setUsers(list);
    // Note: Do NOT auto-assign any user to currentUser; authentication must be explicit.
  }, []);

  // Initial load
  useEffect(() => {
    checkBackendStatus();
    refreshProducts();
    refreshUsers();
    refreshOrders();

    const interval = setInterval(checkBackendStatus, 15000);
    return () => clearInterval(interval);
  }, [checkBackendStatus, refreshProducts, refreshUsers, refreshOrders]);

  // When currentUser changes, reload cart
  useEffect(() => {
    refreshCart(currentUser?.id || 'guest');
  }, [currentUser, refreshCart]);

  // When backend mode changes, reload products & cart
  useEffect(() => {
    refreshProducts();
    refreshCart(currentUser?.id || 'guest');
  }, [backendMode, currentUser, refreshProducts, refreshCart]);

  // Categories extraction
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtered products calculation
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchTerm.trim() ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  // Strict Order Filtering: Customer sees ONLY their own orders; Admin sees all orders; Guest sees none
  const orders = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return allOrders;
    return allOrders.filter(o =>
      String(o.userId) === String(currentUser.id) ||
      (o.userEmail && o.userEmail.toLowerCase() === currentUser.email?.toLowerCase())
    );
  }, [allOrders, currentUser]);

  // Cart operations (Seamless for Guest, Customer, and Admin)
  const addToCart = async (productId: string, quantity = 1) => {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;

    if (product.stockQuantity < quantity) {
      showToast('warning', 'Low Stock', `Only ${product.stockQuantity} units available.`);
      return;
    }

    const effectiveUserId = currentUser?.id || 'guest';
    await ApiService.addToCart(effectiveUserId, String(productId), quantity);
    await refreshCart(effectiveUserId);
    showToast('success', 'Added to Cart', `${product.name} has been added.`);
  };

  const removeFromCart = async (productId: string) => {
    const effectiveUserId = currentUser?.id || 'guest';
    await ApiService.removeFromCart(effectiveUserId, String(productId));
    await refreshCart(effectiveUserId);
    showToast('info', 'Item Removed', 'The item was removed from your cart.');
  };

  const clearCart = async () => {
    const effectiveUserId = currentUser?.id || 'guest';
    await ApiService.clearCart(effectiveUserId);
    await refreshCart(effectiveUserId);
  };

  // Cart summary calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  // Delivery rules: orders above ₹499 get FREE Delivery; below ₹499 incurs ₹49 shipping charge.
  const SHIPPING_THRESHOLD = 499;
  const SHIPPING_CHARGE = 49;

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const upper = appliedCoupon.toUpperCase();
    if (upper === 'FESTIVAL') {
      return Math.min(200, Math.round(cartTotal * 0.10));
    }
    if (upper === 'SAVE10') {
      return Math.round(cartTotal * 0.10);
    }
    if (upper === 'WELCOME') {
      return Math.min(100, cartTotal);
    }
    return 0;
  }, [appliedCoupon, cartTotal]);

  const shippingCharge = useMemo(() => {
    if (cartTotal === 0) return 0;
    return cartTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  }, [cartTotal]);

  const applyCoupon = (code: string): boolean => {
    const upper = code.trim().toUpperCase();
    if (upper === 'FESTIVAL' || upper === 'SAVE10' || upper === 'WELCOME') {
      setAppliedCoupon(upper);
      showToast('success', 'Coupon Applied!', `${upper} — enjoy your festival discount!`);
      return true;
    }
    showToast('error', 'Invalid Coupon', `"${code}" is not a valid promo code.`);
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    showToast('info', 'Coupon Removed', 'Discount has been removed.');
  };

  // Checkout operation
  const checkout = async (options?: { discountAmount?: number; couponCode?: string; shippingCharge?: number; finalAmount?: number }): Promise<boolean> => {
    if (!currentUser) {
      showToast('info', 'Sign in to complete order', 'Please sign in or select a profile to confirm delivery address.');
      setActiveModal('login');
      return false;
    }
    if (cartItems.length === 0) {
      showToast('warning', 'Cart is empty');
      return false;
    }

    const effectiveDiscount = options?.discountAmount !== undefined ? options.discountAmount : couponDiscount;
    const effectiveCoupon = options?.couponCode !== undefined ? options.couponCode : appliedCoupon;
    const effectiveShipping = options?.shippingCharge !== undefined ? options.shippingCharge : shippingCharge;
    const effectiveFinal = options?.finalAmount !== undefined
      ? options.finalAmount
      : Math.max(0, cartTotal - effectiveDiscount) + effectiveShipping;

    setIsCheckingOut(true);
    try {
      const order = await ApiService.checkoutOrder(currentUser.id, currentUser, {
        items: cartItems,
        discountAmount: effectiveDiscount,
        couponCode: effectiveCoupon,
        shippingCharge: effectiveShipping,
        finalAmount: effectiveFinal,
      });
      setLastOrder(order);
      setAppliedCoupon('');
      await refreshCart(currentUser.id);
      await refreshOrders();
      setIsCheckingOut(false);
      setActiveModal('order-success');

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      });

      showToast('success', `Order #${order.id} Placed!`, `Kafka notification event published for ${currentUser.email}`);
      return true;
    } catch (err: any) {
      setIsCheckingOut(false);
      showToast('error', 'Checkout Failed', err.message || 'Unable to place order');
      return false;
    }
  };

  // Product CRUD (STRICTLY GATED TO ADMIN ONLY)
  const createProduct = async (productData: Omit<Product, 'id'>): Promise<boolean> => {
    if (!isAdmin) {
      showToast('error', 'Access Denied', 'Only administrators with ROLE_ADMIN are permitted to add products.');
      return false;
    }
    try {
      await ApiService.createProduct(productData);
      await refreshProducts();
      showToast('success', 'Product Created', `${productData.name} added to catalog.`);
      return true;
    } catch {
      showToast('error', 'Failed to create product');
      return false;
    }
  };

  const updateProduct = async (id: string | number, productData: Partial<Product>): Promise<boolean> => {
    if (!isAdmin) {
      showToast('error', 'Access Denied', 'Only administrators with ROLE_ADMIN are permitted to edit products.');
      return false;
    }
    try {
      await ApiService.updateProduct(id, productData);
      await refreshProducts();
      showToast('success', 'Product Updated', 'Changes saved to catalog.');
      return true;
    } catch {
      showToast('error', 'Failed to update product');
      return false;
    }
  };

  const deleteProduct = async (id: string | number): Promise<boolean> => {
    if (!isAdmin) {
      showToast('error', 'Access Denied', 'Only administrators with ROLE_ADMIN are permitted to delete products.');
      return false;
    }
    try {
      await ApiService.deleteProduct(id);
      await refreshProducts();
      showToast('info', 'Product Deleted', 'Item removed from catalog.');
      return true;
    } catch {
      showToast('error', 'Failed to delete product');
      return false;
    }
  };

  const switchUser = useCallback(async (targetIdentifier: string): Promise<{ success: boolean; requiresVerification: boolean }> => {
    // Attempt to switch user with stored refresh token
    const res = await ApiService.switchUserWithRefreshToken(targetIdentifier);

    if (res.success && res.user && res.token) {
      setCurrentUser(res.user);
      setToken(res.token);
      setRefreshToken(res.refreshToken || null);
      setVerifiedSessions(ApiService.getVerifiedSessions());
      showToast(
        'success',
        `Switched to ${res.user.firstName}!`,
        'Verified via Refresh Token without re-entering password.'
      );
      return { success: true, requiresVerification: false };
    }

    // First-time login / unverified account: prompt verification modal
    const isAdminTarget =
      targetIdentifier.toLowerCase() === 'admin' ||
      targetIdentifier.toLowerCase() === 'admin@shopsphere.io' ||
      targetIdentifier.toLowerCase() === 'tejasranjansingh007@gmail.com';
    setLoginTarget({
      emailOrUsername: targetIdentifier,
      role: isAdminTarget ? 'admin' : 'customer',
      reason: `First-time verification required for ${targetIdentifier}. Please verify password to activate access & refresh tokens.`
    });
    setActiveModal('login');
    showToast(
      'warning',
      'Verification Required',
      `Please verify credentials for ${targetIdentifier}. Once verified, your refresh token will handle future switches.`
    );
    return { success: false, requiresVerification: true };
  }, [showToast]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await ApiService.login(username, password);
      setCurrentUser(res.user);
      setToken(res.token);
      setRefreshToken(res.refreshToken);
      setVerifiedSessions(ApiService.getVerifiedSessions());
      setLoginTarget(null);

      // Transfer any guest cart items to logged-in user
      await ApiService.migrateGuestCart(res.user.id);
      await refreshCart(res.user.id);

      showToast(
        'success',
        `Signed In as ${res.user.role === 'ADMIN' ? 'Administrator' : 'Customer'}`,
        `Welcome, ${res.user.firstName}! Identity verified & refresh token active.`
      );
      return true;
    } catch (err: any) {
      showToast('error', 'Authentication Failed', err.message || 'Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    ApiService.logout(false);
    setToken(null);
    setRefreshToken(null);
    setCurrentUser(null);
    setCartItems([]);
    showToast('info', 'Signed Out', 'You have been successfully signed out.');
  };

  const clearAllSessions = useCallback(() => {
    ApiService.clearAllSessions();
    setCurrentUser(null);
    setToken(null);
    setRefreshToken(null);
    setVerifiedSessions([]);
    setCartItems([]);
    showToast('info', 'Sessions Reset', 'All cached sessions and refresh tokens have been cleared.');
  }, [showToast]);

  const createUser = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    try {
      const newUser = await ApiService.createUser(userData);
      await refreshUsers();
      setCurrentUser(newUser);
      showToast('success', 'Account Created', `Welcome, ${newUser.firstName}!`);
      return true;
    } catch {
      showToast('error', 'Failed to create user');
      return false;
    }
  };

  const updateOrderStatus = async (orderId: number | string, status: string): Promise<boolean> => {
    if (!isAdmin) {
      showToast('error', 'Access Denied', 'Only administrators can update order statuses.');
      return false;
    }
    const updated = await ApiService.updateOrderStatus(orderId, status);
    if (updated) {
      await refreshOrders();
      showToast('success', `Order #${orderId} Updated`, `Status changed to ${status}`);
      return true;
    }
    return false;
  };



  return (
    <StoreContext.Provider
      value={{
        products,
        filteredProducts,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchTerm,
        setSearchTerm,
        isLoading,
        refreshProducts,
        createProduct,
        updateProduct,
        deleteProduct,

        users,
        currentUser,
        setCurrentUser,
        token,
        refreshToken,
        verifiedSessions,
        loginTarget,
        setLoginTarget,
        isAuthenticated,
        isAdmin,
        login,
        switchUser,
        logout,
        clearAllSessions,
        createUser,

        cartItems,
        cartCount,
        cartTotal,
        appliedCoupon,
        couponDiscount,
        shippingCharge,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        clearCart,

        orders,
        allOrders,
        updateOrderStatus,
        lastOrder,
        viewInvoiceOrder,
        setViewInvoiceOrder,
        isCheckingOut,
        checkout,

        selectedProduct,
        setSelectedProduct,
        activeModal,
        setActiveModal,

        backendMode,
        toggleBackendMode,
        isBackendLive,
        checkBackendStatus,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
};
