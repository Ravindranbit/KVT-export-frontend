import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getOrdersByVendor: (vendorId: string) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders] 
      })),
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
      })),
      getOrdersByCustomer: (customerId) => {
        return get().orders.filter(o => o.customerId === customerId);
      },
      getOrdersByVendor: (vendorId) => {
        return get().orders.filter(o => o.items.some(item => item.vendorId === vendorId));
      }
    }),
    {
      name: 'order-storage',
    }
  )
);
