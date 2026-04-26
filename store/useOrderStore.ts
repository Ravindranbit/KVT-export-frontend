import { create } from 'zustand';
import api from '../src/lib/api';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  vendorId: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  shippingAddress: {
    line1: string;
    city: string;
    zip: string;
    country: string;
  };
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getOrdersByVendor: (vendorId: string) => Order[];
}

const normalizeStatus = (status: string): Order['status'] => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
      return 'Processing';
    case 'PENDING':
      return 'Processing';
    case 'SHIPPED':
      return 'Shipped';
    case 'DELIVERED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return 'Processing';
  }
};

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });

    try {
      const response: any = await api.get('/orders/my');
      const backendOrders = response?.data || [];

      const normalized: Order[] = backendOrders.map((order: any) => {
        const items = (order.orderItems || order.items || []).map((item: any) => ({
          id: String(item.productId || item.id),
          name: item.name || 'Product',
          price: Number(item.price || 0),
          image: item.image || '/placeholder.png',
          quantity: Number(item.quantity || 0),
          vendorId: String(item.vendorId || 'v0'),
        }));

        return {
          id: String(order.id),
          customerId: String(order.userId || 'guest'),
          customerName: order.user?.name || 'You',
          date: order.createdAt
            ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          total: Number(order.totalAmount || 0),
          status: normalizeStatus(order.status),
          items,
          shippingAddress: {
            line1: order.shippingAddress?.line1 || 'Address not available',
            city: order.shippingAddress?.city || '-',
            zip: order.shippingAddress?.zip || '-',
            country: order.shippingAddress?.country || 'India',
          },
        };
      });

      set({ orders: normalized, isLoading: false, error: null });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || 'Failed to fetch orders',
      });
    }
  },

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    })),

  getOrdersByCustomer: (customerId) => {
    return get().orders.filter((o) => o.customerId === customerId);
  },

  getOrdersByVendor: (vendorId) => {
    return get().orders.filter((o) => o.items.some((item) => item.vendorId === vendorId));
  },
}));
