import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiGet } from '../lib/api';

export interface OrderItem {
  id: number;
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
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Pending';
  items: OrderItem[];
  shippingAddress: string;
}

interface OrderState {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  fetchVendorOrders: () => Promise<void>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      fetchOrders: async () => {
        try {
          const response = await apiGet<{ success: boolean; data: any[] }>('/orders/my', { auth: 'user' });
          if (response && response.data) {
            const mappedOrders: Order[] = response.data.map(o => ({
              id: String(o.id),
              customerId: String(o.userId),
              customerName: o.user?.name || 'Customer',
              date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
              total: Number(o.totalAmount),
              status: (o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase()) as Order['status'],
              items: (o.orderItems || []).map((item: any) => ({
                id: item.productId,
                name: item.name || 'Product',
                price: Number(item.price),
                image: item.product?.imageUrl || '',
                quantity: item.quantity,
                vendorId: item.product?.vendorId || 'admin'
              })),
              shippingAddress: o.shippingAddress || '',
            }));
            set({ orders: mappedOrders });
          }
        } catch (err) {
          console.error('Failed to fetch orders', err);
        }
      },
      fetchVendorOrders: async () => {
        try {
          const response = await apiGet<{ success: boolean; data: any[] }>('/orders/vendor', { auth: 'user' });
          if (response && response.data) {
            const mappedOrders: Order[] = response.data.map(o => ({
              id: String(o.id),
              customerId: String(o.userId),
              customerName: o.user?.name || 'Customer',
              date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
              total: Number(o.totalAmount),
              status: (o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase()) as Order['status'],
              items: (o.items || []).map((item: any) => ({
                id: item.productId,
                name: item.name || 'Product',
                price: Number(item.price),
                image: item.product?.imageUrl || '',
                quantity: item.quantity,
                vendorId: item.product?.vendorId || 'admin'
              })),
              shippingAddress: o.shippingAddress || '',
            }));
            set({ orders: mappedOrders });
          }
        } catch (err) {
          console.error('Failed to fetch vendor orders', err);
        }
      },
      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders] 
      })),
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
      })),
      getOrdersByCustomer: (customerId) => {
        return get().orders.filter(o => o.customerId === customerId);
      },
    }),
    {
      name: 'order-storage-v2',
    }
  )
);
