import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '../lib/api';

export interface AdminPermissions {
  dashboard: boolean;
  products: boolean;
  orders: boolean;
  users: boolean;
  vendors: boolean;
  categories: boolean;
  banners: boolean;
  settings: boolean;
  profile: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  adminLevel?: 'SUPER_ADMIN' | 'ADMIN';
  phone?: string;
  status: 'active' | 'suspended' | 'banned';
  joinedDate: string;
  avatar?: string;
  ordersCount?: number;
  totalSpent?: number;
  permissions?: AdminPermissions;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: { productId: number; productName: string; quantity: number; price: number; image: string }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: string;
  date: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  storeName: string;
  storeDescription: string;
  status: 'pending' | 'approved' | 'suspended';
  productsCount: number;
  totalRevenue: number;
  commission: number;
  joinedDate: string;
  phone: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  cta: string;
  href: string;
  accent: string;
  image: string;
  tag: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  visible: boolean;
  showInHeader: boolean;
  showInFilters: boolean;
  order: number;
}

export interface SiteSettings {
  // GENERAL
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  defaultLanguage: string;
  defaultCurrency: string;
  timeFormat: '12h' | '24h';
  dateFormat: string;
  storeEnabled: boolean;
  maintenanceMessage: string;

  // CONTACT
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  contactAddress: string;
  googleMapsLink: string;
  businessHours: string;
  supportUrl: string;
  liveChatEnabled: boolean;
  contactFormEmail: string;
  multipleLocations: boolean;
  socialLinks: { facebook: string; instagram: string; twitter: string };
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  sitemapEnabled: boolean;
  robotsTxt: string;
  canonicalUrl: string;
  googleAnalyticsId: string;
  searchConsoleId: string;
  facebookPixelId: string;

  // PRICING & SHIPPING
  currency: string;
  currencyFormat: string;
  globalCommission: number;
  taxRate: number;
  taxType: 'inclusive' | 'exclusive';
  multipleTaxRates: boolean;
  shippingZones: string;
  shippingMethods: string;
  shippingRate: number;
  codCharges: number;
  deliveryTimeEstimate: string;
  freeShippingThreshold: number;
  discountRules: string;

  // NOTIFICATIONS
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  pushNotifications: boolean;
  adminAlerts: boolean;
  orderUpdates: boolean;
  emailTemplates: { orderPlaced: string; orderShipped: string; orderDelivered: string };
  notificationFrequency: 'instant' | 'batch';
  adminChannels: string;

  // SECURITY
  sessionTimeout: number; // in hours
  require2FA: boolean;
  passwordRules: string;
  loginAttemptLimit: number;
  ipWhitelist: string;
  ipBlacklist: string;
  sessionDeviceManagement: boolean;
  passwordExpiryDays: number;
  auditLogsEnabled: boolean;
  captchaEnabled: boolean;
  emailVerificationRequired: boolean;
  rbacEnabled: boolean;

  // SYSTEM
  maintenanceMode: boolean;
  timezone: string;
  autoBackup: 'none' | 'daily' | 'weekly';
  storageProvider: 'local' | 'cloud';
  apiKeys: string;
  environmentMode: 'development' | 'production';

  // Branding (legacy or merged)
  themeColor: string;
}

interface AdminState {
  admins: AdminUser[];
  users: AdminUser[];
  orders: Order[];
  vendors: Vendor[];
  banners: BannerSlide[];
  categories: Category[];
  settings: SiteSettings;
  subscribers: { email: string; date: string }[];

  // Admin CRUD
  addAdmin: (admin: AdminUser & { password?: string }) => Promise<void>;
  removeAdmin: (id: string) => Promise<void>;
  updateAdminPermissions: (id: string, permissions: AdminPermissions) => Promise<void>;

  // User actions
  updateUserStatus: (id: string, status: AdminUser['status']) => Promise<void>;
  updateUserRole: (id: string, role: AdminUser['role']) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Order actions
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;

  // Vendor actions
  updateVendorStatus: (id: string, status: Vendor['status']) => Promise<void>;
  updateVendorCommission: (id: string, commission: number) => Promise<void>;

  // Banner actions
  addBanner: (banner: BannerSlide) => Promise<void>;
  updateBanner: (id: string, updates: Partial<BannerSlide>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;

  // Category actions
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Settings
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
  hasHydrated: boolean;
  setHasHydrated: (h: boolean) => void;
  fetchAdminData: () => Promise<void>;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

const toStatus = (value?: string): AdminUser['status'] => {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'active') return 'active';
  if (normalized === 'banned') return 'banned';
  return 'suspended';
};

const toJoinedDate = (value?: string) => {
  if (!value) return new Date().toISOString().split('T')[0];
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().split('T')[0];
};

const normalizeAdmin = (row: any): AdminUser => ({
  id: String(row.id),
  name: row.name || 'Admin',
  email: row.email || '',
  role: 'admin',
  adminLevel: row.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
  phone: row.phone || '',
  status: row.isActive === false ? 'suspended' : toStatus(row.status),
  joinedDate: toJoinedDate(row.joinedDate || row.createdAt),
  avatar: row.avatar || '',
  permissions: row.permissions,
});

const normalizeUser = (row: any): AdminUser => ({
  id: String(row.id),
  name: row.name || 'User',
  email: row.email || '',
  role: row.role === 'seller' ? 'seller' : row.role === 'admin' ? 'admin' : 'buyer',
  adminLevel: row.role === 'admin' && row.adminLevel ? row.adminLevel : undefined,
  phone: row.phone || '',
  status: row.isActive === false ? 'banned' : toStatus(row.status),
  joinedDate: toJoinedDate(row.joinedDate || row.createdAt),
  avatar: row.avatar || '',
  ordersCount: Number(row.ordersCount || 0),
  totalSpent: Number(row.totalSpent || 0),
  permissions: row.permissions,
});

const normalizeOrderStatus = (status?: string): Order['status'] => {
  const value = String(status || '').toLowerCase();
  if (value === 'confirmed') return 'processing';
  if (value === 'pending' || value === 'processing' || value === 'shipped' || value === 'delivered' || value === 'cancelled') {
    return value;
  }
  return 'pending';
};

const normalizeOrder = (row: any): Order => ({
  id: String(row.id),
  customerId: String(row.user?.id || row.userId || ''),
  customerName: row.user?.name || row.customerName || 'Customer',
  customerEmail: row.user?.email || row.customerEmail || '',
  items: (row.orderItems || row.items || []).map((item: any) => ({
    productId: Number(item.productId),
    productName: item.name || item.productName || 'Product',
    quantity: Number(item.quantity || 0),
    price: Number(item.price || 0),
    image: item.product?.imageUrl || item.image || '',
  })),
  total: Number(row.totalAmount || row.total || 0),
  status: normalizeOrderStatus(row.status),
  paymentMethod: row.paymentMethod || 'N/A',
  shippingAddress: row.shippingAddress || 'N/A',
  date: toJoinedDate(row.createdAt || row.date),
});

const normalizeVendor = (row: any): Vendor => ({
  id: String(row.id),
  name: row.name || '',
  email: row.email || '',
  storeName: row.storeName || '',
  storeDescription: row.storeDescription || '',
  status: row.status === 'approved' || row.status === 'suspended' ? row.status : 'pending',
  productsCount: Number(row.productsCount || 0),
  totalRevenue: Number(row.totalRevenue || 0),
  commission: Number(row.commission || 0),
  joinedDate: toJoinedDate(row.joinedDate || row.createdAt),
  phone: row.phone || '',
});

const normalizeCategory = (row: any): Category => ({
  id: String(row.id),
  name: row.name || '',
  slug: row.slug || '',
  description: row.description || '',
  productCount: Number(row.productCount || row._count?.products || 0),
  visible: row.visible !== undefined ? Boolean(row.visible) : Boolean(row.isActive ?? true),
  showInHeader: row.showInHeader !== undefined ? Boolean(row.showInHeader) : true,
  showInFilters: row.showInFilters !== undefined ? Boolean(row.showInFilters) : true,
  order: Number(row.order || 0),
});

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      admins: [],
      users: [],
      orders: [],
      vendors: [],
      banners: [],
      categories: [],
      subscribers: [],
      settings: {
        siteName: '',
        tagline: '',
        logoUrl: '',
        faviconUrl: '',
        defaultLanguage: 'en',
        defaultCurrency: 'USD',
        timeFormat: '12h',
        dateFormat: 'YYYY-MM-DD',
        storeEnabled: false,
        maintenanceMessage: '',

        contactEmail: '',
        contactPhone: '',
        whatsappNumber: '',
        contactAddress: '',
        googleMapsLink: '',
        businessHours: '',
        supportUrl: '',
        liveChatEnabled: false,
        contactFormEmail: '',
        multipleLocations: false,
        socialLinks: { facebook: '', instagram: '', twitter: '' },

        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterCard: '',
        sitemapEnabled: false,
        robotsTxt: '',
        canonicalUrl: '',
        googleAnalyticsId: '',
        searchConsoleId: '',
        facebookPixelId: '',

        currency: '',
        currencyFormat: '',
        globalCommission: 0,
        taxRate: 0,
        taxType: 'exclusive',
        multipleTaxRates: false,
        shippingZones: '',
        shippingMethods: '',
        shippingRate: 0,
        codCharges: 0,
        deliveryTimeEstimate: '',
        freeShippingThreshold: 0,
        discountRules: '',

        emailNotifications: false,
        smsNotifications: false,
        whatsappNotifications: false,
        pushNotifications: false,
        adminAlerts: false,
        orderUpdates: false,
        emailTemplates: { orderPlaced: '', orderShipped: '', orderDelivered: '' },
        notificationFrequency: 'instant',
        adminChannels: '',

        sessionTimeout: 24,
        require2FA: false,
        passwordRules: '',
        loginAttemptLimit: 5,
        ipWhitelist: '',
        ipBlacklist: '',
        sessionDeviceManagement: false,
        passwordExpiryDays: 90,
        auditLogsEnabled: false,
        captchaEnabled: false,
        emailVerificationRequired: false,
        rbacEnabled: false,

        maintenanceMode: false,
        timezone: 'UTC',
        autoBackup: 'none',
        storageProvider: 'local',
        apiKeys: '',
        environmentMode: 'development',

        themeColor: '#000000',
      },

      addAdmin: async (admin) => {
        const response = await apiPost<ApiEnvelope<any>>('/admin/create', {
          name: admin.name,
          email: admin.email,
          role: admin.adminLevel || 'ADMIN',
          temporaryPassword: admin.password || 'Admin@123',
          phone: admin.phone || '',
          permissions: admin.permissions || {},
        }, { auth: 'admin' });

        set((s) => ({ admins: [normalizeAdmin(response.data), ...s.admins] }));
      },
      removeAdmin: async (id) => {
        await apiDelete<ApiEnvelope<any>>(`/admin/${id}`, { auth: 'admin' });
        set((s) => ({ admins: s.admins.filter(a => a.id !== id) }));
      },
      updateAdminPermissions: async (id, permissions) => {
        await apiPatch<ApiEnvelope<any>>(`/admin/${id}/permissions`, { permissions }, { auth: 'admin' });
        set((s) => ({
          admins: s.admins.map(a => a.id === id ? { ...a, permissions } : a)
        }));
      },

      updateUserStatus: async (id, status) => {
        await apiPatch<ApiEnvelope<any>>(`/admin/users/${id}/status`, { status }, { auth: 'admin' });
        set((s) => ({
          users: s.users.map(u => u.id === id ? { ...u, status } : u),
          admins: s.admins.map(a => a.id === id ? { ...a, status: status === 'banned' ? 'suspended' : status } : a),
        }));
      },
      updateUserRole: async (id, role) => {
        await apiPatch<ApiEnvelope<any>>(`/admin/users/${id}/role`, { role }, { auth: 'admin' });
        set((s) => ({
          users: s.users.map(u => u.id === id ? { ...u, role } : u),
        }));
      },
      deleteUser: async (id) => {
        await apiDelete<ApiEnvelope<any>>(`/admin/users/${id}`, { auth: 'admin' });
        set((s) => ({ users: s.users.filter(u => u.id !== id) }));
      },

      updateOrderStatus: async (id, status) => {
        await apiPatch<ApiEnvelope<any>>(`/orders/${id}/status`, { status: status.toUpperCase() }, { auth: 'admin' });
        set((s) => ({
          orders: s.orders.map(o => o.id === id ? { ...o, status } : o),
        }));
      },

      updateVendorStatus: async (id, status) => {
        const response = await apiPatch<ApiEnvelope<any>>(`/admin/vendors/${id}/status`, { status }, { auth: 'admin' });
        set((s) => ({
          vendors: s.vendors.map(v => v.id === id ? normalizeVendor(response.data) : v),
        }));
      },
      updateVendorCommission: async (id, commission) => {
        const response = await apiPatch<ApiEnvelope<any>>(`/admin/vendors/${id}/commission`, { commission }, { auth: 'admin' });
        set((s) => ({
          vendors: s.vendors.map(v => v.id === id ? normalizeVendor(response.data) : v),
        }));
      },

      addBanner: async (banner) => {
        const response = await apiPost<ApiEnvelope<BannerSlide>>('/admin/banners', banner, { auth: 'admin' });
        set((s) => ({ banners: [response.data, ...s.banners] }));
      },
      updateBanner: async (id, updates) => {
        const response = await apiPatch<ApiEnvelope<BannerSlide>>(`/admin/banners/${id}`, updates, { auth: 'admin' });
        set((s) => ({
          banners: s.banners.map(b => b.id === id ? response.data : b),
        }));
      },
      deleteBanner: async (id) => {
        await apiDelete<ApiEnvelope<any>>(`/admin/banners/${id}`, { auth: 'admin' });
        set((s) => ({ banners: s.banners.filter(b => b.id !== id) }));
      },

      addCategory: async (category) => {
        const response = await apiPost<ApiEnvelope<any>>('/categories', {
          name: category.name,
          description: category.description,
          showInHeader: category.showInHeader,
          showInFilters: category.showInFilters,
        }, { auth: 'admin' });
        set((s) => ({ categories: [normalizeCategory(response.data), ...s.categories] }));
      },
      updateCategory: async (id, updates) => {
        const response = await apiPut<ApiEnvelope<any>>(`/categories/${id}`, {
          name: updates.name,
          description: updates.description,
          isActive: updates.visible,
          showInHeader: updates.showInHeader,
          showInFilters: updates.showInFilters,
        }, { auth: 'admin' });
        set((s) => ({
          categories: s.categories.map(c => c.id === id ? normalizeCategory({ ...c, ...response.data }) : c),
        }));
      },
      deleteCategory: async (id) => {
        try {
          // Changed from soft delete (PATCH) to hard delete (DELETE) as per user request
          await apiDelete<ApiEnvelope<any>>(`/categories/${id}`, { auth: 'admin' });
          set((s) => ({ categories: s.categories.filter(c => c.id !== id) }));
        } catch (error) {
          console.error('Failed to delete category permanently', error);
          throw error;
        }
      },

      updateSettings: async (updates) => {
        const response = await apiPut<ApiEnvelope<SiteSettings>>('/admin/settings', updates, { auth: 'admin' });
        set(() => ({ settings: response.data }));
      },
      hasHydrated: false,
      setHasHydrated: (h) => set({ hasHydrated: h }),
      fetchAdminData: async () => {
        try {
          const [usersResponse, adminsResponse, ordersResponse, vendorsResponse, categoriesResponse, bannersResponse, settingsResponse] = await Promise.all([
            apiGet<ApiEnvelope<any[]>>('/admin/users', { auth: 'admin' }).catch(() => ({ success: false, data: [] })),
            apiGet<ApiEnvelope<any[]>>('/admin/all', { auth: 'admin' }).catch(() => ({ success: false, data: [] })),
            apiGet<ApiEnvelope<any[]>>('/orders', { auth: 'admin' }).catch(() => ({ success: false, data: [] })),
            apiGet<ApiEnvelope<any[]>>('/admin/vendors', { auth: 'admin' }).catch(() => ({ success: false, data: [] })),
            apiGet<ApiEnvelope<any[]>>('/categories/admin/all', { auth: 'admin' }).catch(() => ({ success: false, data: [] })),
            apiGet<ApiEnvelope<BannerSlide[]>>('/admin/banners', { auth: 'admin' }).catch(() => ({ success: false, data: [] })),
            apiGet<ApiEnvelope<SiteSettings>>('/admin/settings', { auth: 'admin' }).catch(() => ({ success: false, data: null as any })),
          ]);

          const combinedUsers = Array.isArray(usersResponse.data) ? usersResponse.data : [];
          const users = combinedUsers.filter((row) => row.role !== 'admin').map(normalizeUser);
          const adminsFromUsers = combinedUsers.filter((row) => row.role === 'admin').map((row) => normalizeAdmin({ ...row, role: row.adminLevel || 'ADMIN' }));
          const adminsFromAll = (Array.isArray(adminsResponse.data) ? adminsResponse.data : []).map(normalizeAdmin);
          const mergedAdmins = [...adminsFromAll, ...adminsFromUsers].reduce<AdminUser[]>((acc, current) => {
            if (!acc.find((item) => item.id === current.id)) acc.push(current);
            return acc;
          }, []);

          const orders = (Array.isArray(ordersResponse.data) ? ordersResponse.data : []).map(normalizeOrder);
          const vendors = (Array.isArray(vendorsResponse.data) ? vendorsResponse.data : []).map(normalizeVendor);
          const categories = (Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []).map(normalizeCategory);
          const banners = Array.isArray(bannersResponse.data) ? bannersResponse.data : [];

          set({
            users,
            admins: mergedAdmins,
            orders,
            vendors,
            categories,
            banners,
            settings: settingsResponse.data || get().settings,
          });
        } catch (err) {
          console.warn('Failed to fetch admin data', err);
        }
      },
    }),
    { 
      name: 'admin-storage-v2',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
