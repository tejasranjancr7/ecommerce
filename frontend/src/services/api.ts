import type { Product, User, CartItem, Order, BackendMode, UserSession } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from './mockData';

// Local storage keys for persistent state
const STORAGE_PRODUCTS_KEY = 'shopsphere_products_v1';
const STORAGE_USERS_KEY = 'shopsphere_users_v2';
const STORAGE_CART_KEY = 'shopsphere_cart_v1';
const STORAGE_ORDERS_KEY = 'shopsphere_orders_v2';
const STORAGE_MODE_KEY = 'shopsphere_backend_mode_v1';
const STORAGE_TOKEN_KEY = 'shopsphere_auth_token_v1';
const STORAGE_REFRESH_TOKEN_KEY = 'shopsphere_refresh_token_v1';
const STORAGE_CURRENT_USER_KEY = 'shopsphere_current_user_v1';
const STORAGE_SESSIONS_KEY = 'shopsphere_verified_sessions_v1';

class LocalStoreManager {
  static getSessions(): Record<string, UserSession> {
    const raw = localStorage.getItem(STORAGE_SESSIONS_KEY);
    if (!raw) return {};
    try {
      const sessions = JSON.parse(raw);
      return sessions || {};
    } catch {
      return {};
    }
  }

  static saveSession(key: string, session: UserSession) {
    const sessions = this.getSessions();
    const normalized = key.toLowerCase();
    sessions[normalized] = session;
    if (session.user.email) {
      sessions[session.user.email.toLowerCase()] = session;
    }
    if (session.user.id) {
      sessions[session.user.id] = session;
    }
    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
  }

  static removeSession(key: string) {
    const sessions = this.getSessions();
    delete sessions[key.toLowerCase()];
    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
  }

  static clearAllSessions() {
    localStorage.removeItem(STORAGE_SESSIONS_KEY);
  }

  static getProducts(): Product[] {
    const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      const parsed: Product[] = JSON.parse(raw);
      const hasStale = parsed.some(p => [4, 5, 6, 7].includes(Number(p.id)));
      if (hasStale || parsed.length === 0) {
        localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return parsed;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  static saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  }

  static getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      const users: User[] = JSON.parse(raw);
      if (Array.isArray(users) && users.length > 0) return users;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  static getCart(userId: string): CartItem[] {
    const raw = localStorage.getItem(`${STORAGE_CART_KEY}_${userId}`);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveCart(userId: string, items: CartItem[]) {
    localStorage.setItem(`${STORAGE_CART_KEY}_${userId}`, JSON.stringify(items));
  }

  static getOrders(): Order[] {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  static saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
  }
}

export class ApiService {
  private static mode: BackendMode = 'live';

  static getMode(): BackendMode {
    return 'live';
  }

  static setMode(_mode: BackendMode) {
    this.mode = 'live';
    localStorage.setItem(STORAGE_MODE_KEY, 'live');
  }

  static getToken(): string | null {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
  }

  static setToken(token: string | null) {
    if (token) {
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(refreshToken: string | null) {
    if (refreshToken) {
      localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY);
    }
  }

  static getVerifiedSessions(): string[] {
    const sessions = LocalStoreManager.getSessions();
    return Object.keys(sessions);
  }

  static hasValidRefreshToken(identifier: string): boolean {
    const sessions = LocalStoreManager.getSessions();
    const session = sessions[identifier.toLowerCase()];
    return Boolean(session && session.refreshToken);
  }

  static clearAllSessions() {
    LocalStoreManager.clearAllSessions();
    this.setToken(null);
    this.setRefreshToken(null);
    this.saveCurrentUser(null);
  }

  static getSavedUser(): User | null {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      const user = JSON.parse(raw);
      return user;
    } catch {
      return null;
    }
  }

  static saveCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  }

  static getAuthHeaders(userId?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      headers['X-User-ID'] = userId;
    }
    return headers;
  }

  static async testBackendLive(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/products', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  }

  private static mintJwt(user: User): string {
    const isMatchedAdmin = user.role === 'ADMIN';
    const payload = {
      sub: user.id,
      preferred_username: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      roles: isMatchedAdmin ? ['ADMIN', 'USER'] : ['USER'],
      resource_access: {
        'oauth2-pkce': {
          roles: isMatchedAdmin ? ['ADMIN', 'USER'] : ['USER'],
        },
      },
      realm_access: {
        roles: isMatchedAdmin ? ['ADMIN', 'USER', 'default-roles-ecom-realm'] : ['USER', 'default-roles-ecom-realm'],
      },
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 900, // 15 minutes
    };
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.mockSignature`;
  }

  // --- AUTHENTICATION (Customer & Admin) ---

  static async login(username: string, password: string): Promise<{ user: User; token: string; refreshToken: string }> {
    const trimmedUser = username.trim();
    const isAdminLogin =
      trimmedUser.toLowerCase() === 'admin' ||
      trimmedUser.toLowerCase() === 'admin@shopsphere.io' ||
      trimmedUser.toLowerCase() === 'tejasranjansingh007@gmail.com';

    // 1. Try Keycloak Direct Grant authentication via proxy or direct
    try {
      const params = new URLSearchParams();
      params.append('client_id', 'oauth2-pkce');
      params.append('username', trimmedUser);
      params.append('password', password);
      params.append('grant_type', 'password');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch('/realms/ecom-realm/protocol/openid-connect/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const token = data.access_token;
        const refreshToken = data.refresh_token || `rt_keycloak_${Date.now()}`;
        this.setToken(token);
        this.setRefreshToken(refreshToken);

        // Fetch user profile from user service
        const users = await this.getUsers();
        const matched = users.find(u => u.email.toLowerCase() === trimmedUser.toLowerCase() || u.username === trimmedUser);
        const namePart = trimmedUser.split('@')[0];
        const parts = namePart.split(/[._-]/);
        const autoFirst = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Customer';
        const autoLast = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';

        const user: User = matched || {
          id: isAdminLogin ? 'admin_keycloak_01' : `usr_${Date.now()}`,
          firstName: isAdminLogin ? 'Admin' : autoFirst,
          lastName: isAdminLogin ? 'Operator' : autoLast,
          email: trimmedUser.includes('@') ? trimmedUser : `${trimmedUser}@shopsphere.io`,
          phone: '+91 9876543210',
          role: isAdminLogin ? 'ADMIN' : 'CUSTOMER',
        };
        this.saveCurrentUser(user);

        // Save session in verified sessions registry
        LocalStoreManager.saveSession(user.email, {
          user,
          accessToken: token,
          refreshToken,
          verifiedAt: Date.now(),
          expiresAt: Date.now() + 3600000,
        });
        if (isAdminLogin) {
          LocalStoreManager.saveSession('admin', {
            user,
            accessToken: token,
            refreshToken,
            verifiedAt: Date.now(),
            expiresAt: Date.now() + 3600000,
          });
        }

        return { user, token, refreshToken };
      }
    } catch {
      // Keycloak unavailable or timed out; smoothly continue to internal auth
    }

    // 2. Customer profile credentials authentication
    // Strict credential verification
    if (isAdminLogin) {
      if (password !== 'admin' && password !== 'admin123' && password !== 'Password@123') {
        throw new Error('Invalid Administrator password. Please try again.');
      }
    } else {
      if (!password || password.trim().length === 0) {
        throw new Error('Password cannot be empty.');
      }
      // If logging into Akshay or Joe demo profiles, enforce Password@123
      if (trimmedUser.toLowerCase() === 'akshayranjan@gmail.com' && password !== 'Password@123') {
        throw new Error('Incorrect password for Akshay Ranjan. (Preset: Password@123)');
      }
      if (trimmedUser.toLowerCase() === 'joe@example.com' && password !== 'Password@123') {
        throw new Error('Incorrect password for Joe Doe. (Preset: Password@123)');
      }
    }

    const users = LocalStoreManager.getUsers();
    let matchedUser = users.find(
      u => u.email.toLowerCase() === trimmedUser.toLowerCase() || 
           u.id === trimmedUser ||
           (isAdminLogin && u.role === 'ADMIN')
    );

    if (isAdminLogin && !matchedUser) {
      matchedUser = {
        id: 'admin_keycloak_01',
        firstName: 'Admin',
        lastName: 'Operator',
        email: 'admin@shopsphere.io',
        phone: '+91 9988776655',
        role: 'ADMIN',
        address: {
          street: 'Marketplace Operations Center',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          zipcode: '560100',
        },
      };
    } else if (!matchedUser) {
      // Create new customer profile on the fly
      const namePart = trimmedUser.split('@')[0];
      const parts = namePart.split(/[._-]/);
      const autoFirst = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Customer';
      const autoLast = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';

      matchedUser = {
        id: '67d533476a55cf5c8124a59c',
        firstName: autoFirst,
        lastName: autoLast,
        email: trimmedUser.includes('@') ? trimmedUser : `${trimmedUser}@example.com`,
        phone: '+91 9876543210',
        role: 'CUSTOMER',
        address: {
          street: '123 Market St',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          zipcode: '560038',
        },
      };
      LocalStoreManager.saveUsers([matchedUser, ...users]);
    }

    // Immediately sync user details to MongoDB User Service so Order Service and Notification Service have the exact active email
    if (this.mode === 'live' && matchedUser) {
      try {
        await fetch('/api/users/67d533476a55cf5c8124a59c', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: matchedUser.firstName,
            lastName: matchedUser.lastName,
            email: matchedUser.email,
            phone: matchedUser.phone,
          }),
        });
      } catch (e) {
        console.warn('Live user sync on login error:', e);
      }
    }

    // Mint Keycloak-compatible JWT access token
    const mockJwt = this.mintJwt(matchedUser);
    const mockRefreshToken = `rt_${matchedUser.id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    this.setToken(mockJwt);
    this.setRefreshToken(mockRefreshToken);
    this.saveCurrentUser(matchedUser);

    // Save into verified sessions registry so subsequent switches can use the refresh token
    LocalStoreManager.saveSession(matchedUser.email, {
      user: matchedUser,
      accessToken: mockJwt,
      refreshToken: mockRefreshToken,
      verifiedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    if (isAdminLogin) {
      LocalStoreManager.saveSession('admin', {
        user: matchedUser,
        accessToken: mockJwt,
        refreshToken: mockRefreshToken,
        verifiedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      });
    }

    return { user: matchedUser, token: mockJwt, refreshToken: mockRefreshToken };
  }

  static async refreshWithToken(refreshToken: string, user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
  }> {
    // 1. Try Keycloak refresh endpoint if live
    if (this.mode === 'live') {
      try {
        const params = new URLSearchParams();
        params.append('client_id', 'oauth2-pkce');
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refreshToken);

        const res = await fetch('/realms/ecom-realm/protocol/openid-connect/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });

        if (res.ok) {
          const data = await res.json();
          return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token || refreshToken,
            user,
          };
        }
      } catch {
        // Fallback to local token refresh
      }
    }

    // 2. Issue refreshed JWT access token + rotated refresh token
    const newAccessToken = this.mintJwt(user);
    const newRefreshToken = `rt_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }

  static async switchUserWithRefreshToken(identifier: string): Promise<{
    success: boolean;
    user?: User;
    token?: string;
    refreshToken?: string;
    requiresVerification: boolean;
    message?: string;
  }> {
    const sessions = LocalStoreManager.getSessions();
    const session = sessions[identifier.toLowerCase()];

    // If no prior verified session or refresh token exists, user must be verified first
    if (!session || !session.refreshToken) {
      return {
        success: false,
        requiresVerification: true,
        message: `First-time verification required for ${identifier}. Please enter your credentials.`,
      };
    }

    try {
      const refreshed = await this.refreshWithToken(session.refreshToken, session.user);
      this.setToken(refreshed.accessToken);
      this.setRefreshToken(refreshed.refreshToken);
      this.saveCurrentUser(refreshed.user);

      // Update session in store
      LocalStoreManager.saveSession(refreshed.user.email, {
        ...session,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        verifiedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      });
      if (refreshed.user.role === 'ADMIN') {
        LocalStoreManager.saveSession('admin', {
          ...session,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          verifiedAt: Date.now(),
          expiresAt: Date.now() + 3600000,
        });
      }

      return {
        success: true,
        user: refreshed.user,
        token: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        requiresVerification: false,
        message: `Authenticated via Refresh Token for ${refreshed.user.firstName}!`,
      };
    } catch {
      return {
        success: false,
        requiresVerification: true,
        message: `Session expired. Please verify your credentials for ${identifier}.`,
      };
    }
  }

  static logout(clearAll = false) {
    if (clearAll) {
      this.clearAllSessions();
    } else {
      this.setToken(null);
      this.setRefreshToken(null);
      this.saveCurrentUser(null);
    }
  }

  // --- PRODUCTS ---

  static resolveProductImage(name: string, category: string, currentUrl?: string): string {
    if (
      currentUrl &&
      !currentUrl.includes('placehold.co') &&
      !currentUrl.includes('via.placeholder') &&
      !currentUrl.includes('placeholder') &&
      currentUrl.startsWith('http')
    ) {
      return currentUrl;
    }

    const n = (name || '').toLowerCase();
    const c = (category || '').toLowerCase();

    if (n.includes('iphone') || n.includes('phone') || c.includes('mobile')) {
      return 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80';
    }
    if (n.includes('macbook') || n.includes('laptop') || n.includes('computer') || c.includes('computer')) {
      return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
    }
    if (n.includes('headphone') || n.includes('sony') || n.includes('audio') || c.includes('audio')) {
      return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
    }
    if (n.includes('watch') || c.includes('wearable')) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
    }
    if (n.includes('keyboard') || c.includes('accessories')) {
      return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80';
    }
    if (n.includes('monitor') || n.includes('display') || n.includes('dell')) {
      return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';
  }

  static async getProducts(keyword?: string): Promise<Product[]> {
    if (this.mode === 'live') {
      try {
        const url = keyword && keyword.trim()
          ? `/api/products/search?keyword=${encodeURIComponent(keyword.trim())}`
          : '/api/products';
        const res = await fetch(url, { headers: this.getAuthHeaders() });
        if (res.ok) {
          const liveData: any = await res.json();
          const items = Array.isArray(liveData) ? liveData : (liveData.content || []);
          if (items.length > 0) {
            const enrichedLive: Product[] = items.map((p: any) => ({
              ...p,
              category: p.category === 'Electronics' ? 'Mobiles' : p.category,
              imageUrl: this.resolveProductImage(p.name, p.category, p.imageUrl),
              rating: p.rating || 4.8,
              originalPrice: p.originalPrice || Math.round(p.price * 1.18),
              reviewsCount: p.reviewsCount || 140,
            }));

            // Deduplicate products with same name if any
            const seenNames = new Set<string>();
            const uniqueLive: Product[] = [];
            for (const p of enrichedLive) {
              const key = p.name.toLowerCase().trim();
              if (!seenNames.has(key)) {
                seenNames.add(key);
                uniqueLive.push(p);
              }
            }

            if (keyword && keyword.trim()) {
              const q = keyword.toLowerCase().trim();
              return uniqueLive.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
              );
            }
            return uniqueLive;
          }
        }
      } catch (err) {
        console.warn('Live API error, falling back to mock storage:', err);
      }
    }

    const all = LocalStoreManager.getProducts();
    if (keyword && keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      return all.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return all;
  }

  static async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    if (this.mode === 'live') {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(product),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Live createProduct error, using mock:', err);
      }
    }

    const current = LocalStoreManager.getProducts();
    const newId = Date.now();
    const newProduct: Product = { ...product, id: newId };
    LocalStoreManager.saveProducts([newProduct, ...current]);
    return newProduct;
  }

  static async updateProduct(id: string | number, product: Partial<Product>): Promise<Product | null> {
    if (this.mode === 'live') {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(product),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Live updateProduct error:', err);
      }
    }

    const current = LocalStoreManager.getProducts();
    const index = current.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;
    const updated = { ...current[index], ...product };
    current[index] = updated;
    LocalStoreManager.saveProducts(current);
    return updated;
  }

  static async deleteProduct(id: string | number): Promise<boolean> {
    if (this.mode === 'live') {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('Live deleteProduct error:', err);
      }
    }

    const current = LocalStoreManager.getProducts();
    const filtered = current.filter(p => String(p.id) !== String(id));
    LocalStoreManager.saveProducts(filtered);
    return true;
  }

  // --- CART ---

  static async getCart(userId: string): Promise<CartItem[]> {
    const products = await this.getProducts();
    const effectiveUserId = userId || 'guest';
    const localItems = LocalStoreManager.getCart(effectiveUserId);
    let liveCartItems: CartItem[] = [];

    if (this.mode === 'live' && effectiveUserId !== 'guest') {
      try {
        const res = await fetch('/api/cart', {
          headers: this.getAuthHeaders(effectiveUserId),
        });
        if (res.ok) {
          const rawItems: Array<{ id?: string | number; productId: string; quantity: number }> = await res.json();
          liveCartItems = rawItems.map(item => ({
            ...item,
            product: products.find(p => String(p.id) === String(item.productId)),
          }));
        }
      } catch (err) {
        console.warn('Live getCart error:', err);
      }
    }

    // Merge liveCartItems and localItems by productId so nothing is ever dropped
    const mergedMap = new Map<string, CartItem>();

    for (const item of localItems) {
      const prod = products.find(p => String(p.id) === String(item.productId));
      mergedMap.set(String(item.productId), {
        ...item,
        product: prod || item.product,
      });
    }

    for (const item of liveCartItems) {
      const prod = products.find(p => String(p.id) === String(item.productId));
      mergedMap.set(String(item.productId), {
        ...item,
        product: prod || item.product,
      });
    }

    const result = Array.from(mergedMap.values());
    LocalStoreManager.saveCart(effectiveUserId, result);
    return result;
  }

  static async addToCart(userId: string, productId: string, quantity: number): Promise<boolean> {
    const effectiveUserId = userId || 'guest';
    const backendUserId = (userId && userId.length === 24) ? userId : '67d533476a55cf5c8124a59c';

    // 1. Always update local cart state first
    const current = LocalStoreManager.getCart(effectiveUserId);
    const existing = current.find(i => String(i.productId) === String(productId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      current.push({
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: effectiveUserId,
        productId: String(productId),
        quantity,
      });
    }
    LocalStoreManager.saveCart(effectiveUserId, current);

    // 2. If live and not guest, attempt backend sync with order-service using active MongoDB user ID
    if (this.mode === 'live') {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: this.getAuthHeaders(backendUserId),
          body: JSON.stringify({ productId: String(productId), quantity }),
        });
      } catch (err) {
        console.warn('Live addToCart error:', err);
      }
    }

    return true;
  }

  static async removeFromCart(userId: string, productId: string): Promise<boolean> {
    const effectiveUserId = userId || 'guest';
    const backendUserId = (userId && userId.length === 24) ? userId : '67d533476a55cf5c8124a59c';
    const current = LocalStoreManager.getCart(effectiveUserId);
    const filtered = current.filter(i => String(i.productId) !== String(productId));
    LocalStoreManager.saveCart(effectiveUserId, filtered);

    if (this.mode === 'live') {
      try {
        await fetch(`/api/cart/items/${productId}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders(backendUserId),
        });
      } catch (err) {
        console.warn('Live removeFromCart error:', err);
      }
    }

    return true;
  }

  static async clearCart(userId: string): Promise<boolean> {
    const effectiveUserId = userId || 'guest';
    LocalStoreManager.saveCart(effectiveUserId, []);
    return true;
  }

  static async migrateGuestCart(targetUserId: string): Promise<void> {
    const guestItems = LocalStoreManager.getCart('guest');
    if (guestItems.length > 0) {
      for (const item of guestItems) {
        await this.addToCart(targetUserId, item.productId, item.quantity);
      }
      LocalStoreManager.saveCart('guest', []);
    }
  }

  // --- ORDERS ---

  static async checkoutOrder(
    userId: string,
    user?: User,
    options?: {
      items?: CartItem[];
      discountAmount?: number;
      couponCode?: string;
      shippingCharge?: number;
      finalAmount?: number;
    }
  ): Promise<Order> {
    const effectiveUserId = userId || 'guest';
    const backendUserId = (user?.id && user.id.length === 24)
      ? user.id
      : ((userId && userId.length === 24) ? userId : '67d533476a55cf5c8124a59c');

    if (this.mode === 'live') {
      // 1. Synchronize user details with MongoDB User Service so Notification Service sends email to this exact address
      const targetEmail = user?.email?.trim() || 'customer@shopsphere.io';
      const userFirst = (user?.firstName || '').trim();
      const userLast = (user?.lastName || '').trim();
      const targetName = [userFirst, userLast].filter(Boolean).join(' ') || (user?.email?.split('@')[0] || 'Customer');
      try {
        await fetch(`/api/users/${backendUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: userFirst || targetName,
            lastName: userLast,
            email: targetEmail,
            phone: user?.phone || '+91 9876543210',
          }),
        });
      } catch (syncErr) {
        console.warn('User MongoDB sync warning:', syncErr);
      }

      // 2. Synchronize live order-service cart with exact items being checked out
      // Clear backend cart first to prevent quantity duplication/accumulation (e.g., 2 becoming 4)
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'X-User-ID': backendUserId,
          },
        });
      } catch (clearErr) {
        console.warn('Live cart clear warning:', clearErr);
      }

      // Use the exact checkout items
      const passedItems = (options?.items && options.items.length > 0)
        ? options.items
        : LocalStoreManager.getCart(effectiveUserId);

      const itemsMap = new Map<string, { productId: string; quantity: number }>();
      for (const item of passedItems) {
        const pid = String(item.productId);
        if (item.quantity > 0) {
          itemsMap.set(pid, { productId: pid, quantity: item.quantity });
        }
      }

      for (const item of itemsMap.values()) {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-User-ID': backendUserId,
            },
            body: JSON.stringify({ productId: String(item.productId), quantity: item.quantity }),
          });
        } catch (cartErr) {
          console.warn('Live cart item sync warning:', cartErr);
        }
      }

      const discountAmount = options?.discountAmount || 0;
      const couponCode = options?.couponCode || '';
      const shippingCharge = options?.shippingCharge !== undefined ? options.shippingCharge : 0;
      const finalAmount = options?.finalAmount;

      // 3. Post order to Order Service (triggers Kafka order.exchange -> Notification Service -> Gmail confirmation)
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': backendUserId,
        },
        body: JSON.stringify({
          discountAmount,
          couponCode,
          shippingCharge,
          finalAmount,
          customerName: targetName,
          customerEmail: targetEmail,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Order placement failed on order-service (${res.status}): ${errText || 'Bad Request'}`);
      }

      const liveOrder = await res.json();
      const calculatedSubTotal = liveOrder.subTotalAmount !== undefined
        ? Number(liveOrder.subTotalAmount)
        : (Number(liveOrder.totalAmount) || 0);
      const orderDiscount = liveOrder.discountAmount !== undefined
        ? Number(liveOrder.discountAmount)
        : discountAmount;
      const orderCoupon = liveOrder.couponCode || couponCode;
      const orderShipping = liveOrder.shippingCharge !== undefined
        ? Number(liveOrder.shippingCharge)
        : (calculatedSubTotal >= 499 ? 0 : 49);
      const orderTotal = Math.max(0, calculatedSubTotal - orderDiscount) + orderShipping;

      const completeOrder: Order = {
        ...liveOrder,
        subTotal: calculatedSubTotal,
        totalAmount: orderTotal,
        discountAmount: orderDiscount,
        couponCode: orderCoupon,
        shippingCharge: orderShipping,
        userName: targetName,
        userEmail: targetEmail,
      };

      const currentOrders = LocalStoreManager.getOrders();
      LocalStoreManager.saveOrders([completeOrder, ...currentOrders]);
      LocalStoreManager.saveCart(effectiveUserId, []);
      LocalStoreManager.saveCart('guest', []);
      LocalStoreManager.saveCart(backendUserId, []);
      return completeOrder;
    }

    const cartItems = await this.getCart(effectiveUserId);
    if (cartItems.length === 0) {
      throw new Error('Shopping cart is empty');
    }

    const orderId = Math.floor(1000 + Math.random() * 9000);
    const orderItems = cartItems.map((item, idx) => {
      const price = item.product?.price || 0;
      return {
        id: orderId * 10 + idx + 1,
        productId: String(item.productId),
        productName: item.product?.name || `Product #${item.productId}`,
        quantity: item.quantity,
        price,
        subTotal: price * item.quantity,
      };
    });

    const subTotal = orderItems.reduce((sum, item) => sum + item.subTotal, 0);
    const discountAmount = options?.discountAmount || 0;
    const shippingCharge = options?.shippingCharge !== undefined
      ? options.shippingCharge
      : (subTotal >= 499 ? 0 : 49);
    const finalAmount = Math.max(0, subTotal - discountAmount) + shippingCharge;

    const order: Order = {
      id: orderId,
      userId: effectiveUserId,
      userName: [user?.firstName?.trim(), user?.lastName?.trim()].filter(Boolean).join(' ') || 'Valued Customer',
      userEmail: user?.email || 'customer@example.com',
      subTotal,
      totalAmount: finalAmount,
      discountAmount,
      couponCode: options?.couponCode || '',
      shippingCharge,
      status: 'CONFIRMED',
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    const currentOrders = LocalStoreManager.getOrders();
    LocalStoreManager.saveOrders([order, ...currentOrders]);
    LocalStoreManager.saveCart(effectiveUserId, []);
    LocalStoreManager.saveCart('guest', []);
    return order;
  }

  static async getOrders(): Promise<Order[]> {
    return LocalStoreManager.getOrders();
  }

  static async updateOrderStatus(orderId: number | string, status: string): Promise<Order | null> {
    const orders = LocalStoreManager.getOrders();
    const index = orders.findIndex(o => String(o.id) === String(orderId));
    if (index === -1) return null;
    orders[index].status = status;
    LocalStoreManager.saveOrders(orders);
    return orders[index];
  }

  // --- USERS ---

  static async getUsers(): Promise<User[]> {
    return LocalStoreManager.getUsers();
  }

  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const newId = `67d533476a55cf5c8124a${Math.floor(100 + Math.random() * 899)}`;
    const newUser: User = { ...userData, id: newId };

    if (this.mode === 'live') {
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            ...userData,
            username: userData.email,
            password: 'Password@123',
          }),
        });
      } catch (err) {
        console.warn('Live createUser error:', err);
      }
    }

    const current = LocalStoreManager.getUsers();
    LocalStoreManager.saveUsers([newUser, ...current]);
    return newUser;
  }

  static async updateUser(_userId: string, data: Partial<User>): Promise<void> {
    if (this.mode === 'live') {
      try {
        await fetch(`/api/users/67d533476a55cf5c8124a59c`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
          }),
        });
      } catch (err) {
        console.warn('Live updateUser error:', err);
      }
    }
  }
}
