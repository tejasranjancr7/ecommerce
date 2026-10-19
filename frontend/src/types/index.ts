export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export interface User {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN' | string;
  address?: Address;
}

export interface UserSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  verifiedAt: number;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export type ModalType = 'user-profile' | 'admin-products' | 'checkout' | 'order-success' | 'invoice-view' | 'login' | 'admin-dashboard' | null;

export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  active?: boolean;
}

export interface CartItem {
  id?: string | number;
  userId?: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface OrderItem {
  id: number | string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface Order {
  id: number | string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  totalAmount: number;
  subTotal?: number;
  discountAmount?: number;
  couponCode?: string;
  shippingCharge?: number;
  status: 'CONFIRMED' | 'PENDING' | 'SHIPPED' | 'DELIVERED' | string;
  items: OrderItem[];
  createdAt: string;
}

export type BackendMode = 'live' | 'mock';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}
