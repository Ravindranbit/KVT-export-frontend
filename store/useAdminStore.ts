import { create } from 'zustand';

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
  addAdmin: (admin: AdminUser) => void;
  removeAdmin: (id: string) => void;
  updateAdminPermissions: (id: string, permissions: AdminPermissions) => void;

  // User actions
  updateUserStatus: (id: string, status: AdminUser['status']) => void;
  updateUserRole: (id: string, role: AdminUser['role']) => void;
  deleteUser: (id: string) => void;

  // Order actions
  updateOrderStatus: (id: string, status: Order['status']) => void;

  // Vendor actions
  updateVendorStatus: (id: string, status: Vendor['status']) => void;
  updateVendorCommission: (id: string, commission: number) => void;

  // Banner actions
  addBanner: (banner: BannerSlide) => void;
  updateBanner: (id: string, updates: Partial<BannerSlide>) => void;
  deleteBanner: (id: string) => void;

  // Category actions
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Settings
  updateSettings: (updates: Partial<SiteSettings>) => void;
}

const EMPTY_SETTINGS: SiteSettings = {
  siteName: '',
  tagline: '',
  logoUrl: '',
  faviconUrl: '',
  defaultLanguage: 'en',
  defaultCurrency: 'USD',
  timeFormat: '12h',
  dateFormat: 'MM/DD/YYYY',
  storeEnabled: true,
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
  passwordExpiryDays: 0,
  auditLogsEnabled: false,
  captchaEnabled: false,
  emailVerificationRequired: false,
  rbacEnabled: false,
  maintenanceMode: false,
  timezone: '',
  autoBackup: 'none',
  storageProvider: 'local',
  apiKeys: '',
  environmentMode: 'production',
  themeColor: '',
};

export const useAdminStore = create<AdminState>((set) => ({
  admins: [],
  users: [],
  orders: [],
  vendors: [],
  banners: [],
  categories: [],
  subscribers: [],
  settings: EMPTY_SETTINGS,
  addAdmin: (admin) => set((state) => ({ admins: [...state.admins, admin] })),
  removeAdmin: (id) => set((state) => ({ admins: state.admins.filter((admin) => admin.id !== id) })),
  updateAdminPermissions: (id, permissions) =>
    set((state) => ({
      admins: state.admins.map((admin) => (admin.id === id ? { ...admin, permissions } : admin)),
    })),
  updateUserStatus: (id, status) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, status } : user)),
    })),
  updateUserRole: (id, role) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, role } : user)),
    })),
  deleteUser: (id) => set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === id ? { ...order, status } : order)),
    })),
  updateVendorStatus: (id, status) =>
    set((state) => ({
      vendors: state.vendors.map((vendor) => (vendor.id === id ? { ...vendor, status } : vendor)),
    })),
  updateVendorCommission: (id, commission) =>
    set((state) => ({
      vendors: state.vendors.map((vendor) => (vendor.id === id ? { ...vendor, commission } : vendor)),
    })),
  addBanner: (banner) => set((state) => ({ banners: [...state.banners, banner] })),
  updateBanner: (id, updates) =>
    set((state) => ({
      banners: state.banners.map((banner) => (banner.id === id ? { ...banner, ...updates } : banner)),
    })),
  deleteBanner: (id) => set((state) => ({ banners: state.banners.filter((banner) => banner.id !== id) })),
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((category) => (category.id === id ? { ...category, ...updates } : category)),
    })),
  deleteCategory: (id) => set((state) => ({ categories: state.categories.filter((category) => category.id !== id) })),
  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
    })),
}));
