import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  hasHydrated: boolean;
  setHasHydrated: (h: boolean) => void;
}

const MOCK_USERS: AdminUser[] = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'buyer', status: 'active', joinedDate: '2026-01-15', ordersCount: 12, totalSpent: 45600, phone: '+91 98765 43210' },
  { id: 'u2', name: 'Priya Patel', email: 'priya@gmail.com', role: 'buyer', status: 'active', joinedDate: '2026-02-03', ordersCount: 8, totalSpent: 23400, phone: '+91 87654 32109' },
  { id: 'u3', name: 'Amit Kumar', email: 'amit@gmail.com', role: 'seller', status: 'active', joinedDate: '2026-01-20', ordersCount: 0, totalSpent: 0, phone: '+91 76543 21098' },
  { id: 'u4', name: 'Sneha Reddy', email: 'sneha@gmail.com', role: 'buyer', status: 'active', joinedDate: '2026-03-10', ordersCount: 3, totalSpent: 8900, phone: '+91 65432 10987' },
  { id: 'u5', name: 'Vikram Singh', email: 'vikram@gmail.com', role: 'seller', status: 'suspended', joinedDate: '2026-02-28', ordersCount: 0, totalSpent: 0, phone: '+91 54321 09876' },
  { id: 'u6', name: 'Ananya Iyer', email: 'ananya@gmail.com', role: 'buyer', status: 'active', joinedDate: '2026-03-22', ordersCount: 5, totalSpent: 15200, phone: '+91 43210 98765' },
  { id: 'u7', name: 'Dev Mehta', email: 'dev@gmail.com', role: 'buyer', status: 'banned', joinedDate: '2026-01-05', ordersCount: 1, totalSpent: 2300, phone: '+91 32109 87654' },
  { id: 'u8', name: 'Kavya Nair', email: 'kavya@gmail.com', role: 'seller', status: 'active', joinedDate: '2026-03-15', ordersCount: 0, totalSpent: 0, phone: '+91 21098 76543' },
];

const MOCK_ADMINS: AdminUser[] = [
  { 
    id: 'admin1', 
    name: 'Super Admin', 
    email: 'admin123@gmail.com', 
    role: 'admin', 
    status: 'active', 
    joinedDate: '2025-12-01', 
    phone: '+91 99999 00000',
    permissions: {
      dashboard: true,
      products: true,
      orders: true,
      users: true,
      vendors: true,
      categories: true,
      banners: true,
      settings: true,
      profile: true,
    }
  },
];

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', customerId: 'u1', customerName: 'Rahul Sharma', customerEmail: 'rahul@gmail.com', items: [{ productId: 1, productName: 'Premium Cotton T-Shirt', quantity: 2, price: 1299, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80' }], total: 2598, status: 'delivered', paymentMethod: 'UPI', shippingAddress: '123, MG Road, Bangalore 560001', date: '2026-03-28' },
  { id: 'ORD-002', customerId: 'u2', customerName: 'Priya Patel', customerEmail: 'priya@gmail.com', items: [{ productId: 5, productName: 'Wireless Headphones', quantity: 1, price: 8999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80' }], total: 8999, status: 'shipped', paymentMethod: 'Card', shippingAddress: '456, Nehru Place, Delhi 110019', date: '2026-03-30' },
  { id: 'ORD-003', customerId: 'u4', customerName: 'Sneha Reddy', customerEmail: 'sneha@gmail.com', items: [{ productId: 3, productName: 'Running Sneakers', quantity: 1, price: 5499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80' }, { productId: 12, productName: 'Yoga Mat', quantity: 1, price: 1100, image: 'https://images.unsplash.com/photo-1592432678016-e910b06b3840?w=80' }], total: 6599, status: 'processing', paymentMethod: 'COD', shippingAddress: '789, Jubilee Hills, Hyderabad 500033', date: '2026-04-01' },
  { id: 'ORD-004', customerId: 'u6', customerName: 'Ananya Iyer', customerEmail: 'ananya@gmail.com', items: [{ productId: 6, productName: 'Smart Watch Series 5', quantity: 1, price: 14999, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=80' }], total: 14999, status: 'pending', paymentMethod: 'UPI', shippingAddress: '321, Marine Drive, Mumbai 400020', date: '2026-04-02' },
  { id: 'ORD-005', customerId: 'u1', customerName: 'Rahul Sharma', customerEmail: 'rahul@gmail.com', items: [{ productId: 14, productName: 'Organic Face Serum', quantity: 3, price: 850, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80' }], total: 2550, status: 'delivered', paymentMethod: 'Card', shippingAddress: '123, MG Road, Bangalore 560001', date: '2026-03-25' },
  { id: 'ORD-006', customerId: 'u2', customerName: 'Priya Patel', customerEmail: 'priya@gmail.com', items: [{ productId: 9, productName: 'Ceramic Table Lamp', quantity: 2, price: 1599, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=80' }], total: 3198, status: 'cancelled', paymentMethod: 'UPI', shippingAddress: '456, Nehru Place, Delhi 110019', date: '2026-03-20' },
  { id: 'ORD-007', customerId: 'u4', customerName: 'Sneha Reddy', customerEmail: 'sneha@gmail.com', items: [{ productId: 2, productName: 'Classic Denim Jacket', quantity: 1, price: 3499, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=80' }], total: 3499, status: 'shipped', paymentMethod: 'Card', shippingAddress: '789, Jubilee Hills, Hyderabad 500033', date: '2026-04-01' },
  { id: 'ORD-008', customerId: 'u6', customerName: 'Ananya Iyer', customerEmail: 'ananya@gmail.com', items: [{ productId: 15, productName: 'Essential Oil Set', quantity: 2, price: 1250, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=80' }], total: 2500, status: 'pending', paymentMethod: 'COD', shippingAddress: '321, Marine Drive, Mumbai 400020', date: '2026-04-03' },
];

const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Amit Kumar', email: 'amit@artisanthreads.com', storeName: 'Artisan Threadsco', storeDescription: 'Premium handcrafted fashion and accessories', status: 'approved', productsCount: 8, totalRevenue: 245000, commission: 10, joinedDate: '2026-01-20', phone: '+91 76543 21098' },
  { id: 'v2', name: 'Kavya Nair', email: 'kavya@urbansole.com', storeName: 'Urban Sole', storeDescription: 'Trendy footwear and lifestyle products', status: 'approved', productsCount: 8, totalRevenue: 189000, commission: 12, joinedDate: '2026-03-15', phone: '+91 21098 76543' },
  { id: 'v3', name: 'Vikram Singh', email: 'vikram@techgear.com', storeName: 'Tech Gear Hub', storeDescription: 'Latest electronics and gadgets', status: 'pending', productsCount: 0, totalRevenue: 0, commission: 10, joinedDate: '2026-04-01', phone: '+91 54321 09876' },
];

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Electronics', slug: 'electronics', description: 'Gadgets, headphones, cameras & more', productCount: 4, visible: true, order: 1 },
  { id: 'cat2', name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, bags & accessories', productCount: 4, visible: true, order: 2 },
  { id: 'cat3', name: 'Home', slug: 'home', description: 'Furniture, decor, lighting & more', productCount: 3, visible: true, order: 3 },
  { id: 'cat4', name: 'Sports', slug: 'sports', description: 'Fitness equipment & activewear', productCount: 2, visible: true, order: 4 },
  { id: 'cat5', name: 'Beauty', slug: 'beauty', description: 'Skincare, makeup & wellness', productCount: 2, visible: true, order: 5 },
  { id: 'cat6', name: 'Books', slug: 'books', description: 'Notebooks, novels & stationery', productCount: 1, visible: true, order: 6 },
  { id: 'cat7', name: 'Toys', slug: 'toys', description: 'Games, puzzles & kids items', productCount: 0, visible: true, order: 7 },
];

const MOCK_BANNERS: BannerSlide[] = [
  { id: 'b1', title: 'Up to 60% Off', subtitle: 'Electronics & Gadgets', desc: 'Smartphones, laptops, headphones & more — top brands at unbeatable prices.', cta: 'Shop Electronics', href: '/?category=electronics', accent: '#00d4ff', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80', tag: '⚡ Best Deals', active: true },
  { id: 'b2', title: 'New Season', subtitle: 'Fashion Collection', desc: 'Discover our latest arrivals in premium fashion. Elevate your wardrobe today.', cta: 'Explore Fashion', href: '/?category=fashion', accent: '#ff6b6b', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80', tag: '🔥 Flash Sale', active: true },
  { id: 'b3', title: 'Transform Your', subtitle: 'Living Space', desc: 'Curated home decor and essentials at prices you\'ll love.', cta: 'Shop Home', href: '/?category=home', accent: '#fbbf24', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80', tag: '✨ Trending', active: true },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admins: MOCK_ADMINS,
      users: MOCK_USERS,
      orders: MOCK_ORDERS,
      vendors: MOCK_VENDORS,
      banners: MOCK_BANNERS,
      categories: MOCK_CATEGORIES,
      subscribers: [
        { email: 'rahul@gmail.com', date: '2026-03-15' },
        { email: 'priya@gmail.com', date: '2026-03-18' },
        { email: 'sneha@gmail.com', date: '2026-03-20' },
        { email: 'ananya@gmail.com', date: '2026-03-25' },
      ],
      settings: {
        // GENERAL
        siteName: 'KVT exports',
        tagline: 'Premium Export Quality Products',
        logoUrl: '',
        faviconUrl: '',
        defaultLanguage: 'en',
        defaultCurrency: 'USD',
        timeFormat: '12h',
        dateFormat: 'MM/DD/YYYY',
        storeEnabled: true,
        maintenanceMessage: 'We will be right back.',

        // CONTACT
        contactEmail: 'support@kvtexports.com',
        contactPhone: '+91 96 716 6879',
        whatsappNumber: '+91 96 716 6879',
        contactAddress: '8th floor, 379 Hudson St, New York, NY 10018',
        googleMapsLink: '',
        businessHours: 'Mon - Fri: 9AM - 6PM',
        supportUrl: 'https://help.kvtexports.com',
        liveChatEnabled: true,
        contactFormEmail: 'queries@kvtexports.com',
        multipleLocations: false,
        socialLinks: { facebook: '#', instagram: '#', twitter: '#' },
        
        // SEO
        metaTitle: 'KVT Exports - Premium Marketplace',
        metaDescription: 'Shop premium export-quality products at KVT Exports.',
        metaKeywords: 'export, premium, clothing, electronics',
        ogTitle: 'KVT Exports',
        ogDescription: 'Shop premium export-quality products.',
        ogImage: '',
        twitterCard: 'summary_large_image',
        sitemapEnabled: true,
        robotsTxt: 'User-agent: *\nAllow: /',
        canonicalUrl: 'https://kvtexports.com',
        googleAnalyticsId: 'G-XXXXXXXXXX',
        searchConsoleId: '',
        facebookPixelId: '',

        // PRICING & SHIPPING
        currency: '₹',
        currencyFormat: '₹ {amount}',
        globalCommission: 10,
        taxRate: 18,
        taxType: 'exclusive',
        multipleTaxRates: false,
        shippingZones: 'India, International',
        shippingMethods: 'Flat rate, Weight-based',
        shippingRate: 99,
        codCharges: 50,
        deliveryTimeEstimate: '3-5 Business Days',
        freeShippingThreshold: 2000,
        discountRules: 'None',

        // NOTIFICATIONS
        emailNotifications: true,
        smsNotifications: false,
        whatsappNotifications: false,
        pushNotifications: true,
        adminAlerts: true,
        orderUpdates: true,
        emailTemplates: { orderPlaced: 'Default', orderShipped: 'Default', orderDelivered: 'Default' },
        notificationFrequency: 'instant',
        adminChannels: 'email',

        // SECURITY
        sessionTimeout: 24,
        require2FA: false,
        passwordRules: 'strong',
        loginAttemptLimit: 5,
        ipWhitelist: '',
        ipBlacklist: '',
        sessionDeviceManagement: true,
        passwordExpiryDays: 90,
        auditLogsEnabled: true,
        captchaEnabled: false,
        emailVerificationRequired: true,
        rbacEnabled: true,

        // SYSTEM
        maintenanceMode: false,
        timezone: 'Asia/Kolkata',
        autoBackup: 'weekly',
        storageProvider: 'local',
        apiKeys: '',
        environmentMode: 'production',

        // Branding
        themeColor: '#e60000',
      },

      addAdmin: (admin) => set((s) => ({ admins: [...s.admins, admin] })),
      removeAdmin: (id) => set((s) => ({ admins: s.admins.filter(a => a.id !== id) })),
      updateAdminPermissions: (id, permissions) => set((s) => ({
        admins: s.admins.map(a => a.id === id ? { ...a, permissions } : a)
      })),

      updateUserStatus: (id, status) => set((s) => ({
        users: s.users.map(u => u.id === id ? { ...u, status } : u),
      })),
      updateUserRole: (id, role) => set((s) => ({
        users: s.users.map(u => u.id === id ? { ...u, role } : u),
      })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter(u => u.id !== id) })),

      updateOrderStatus: (id, status) => set((s) => ({
        orders: s.orders.map(o => o.id === id ? { ...o, status } : o),
      })),

      updateVendorStatus: (id, status) => set((s) => ({
        vendors: s.vendors.map(v => v.id === id ? { ...v, status } : v),
      })),
      updateVendorCommission: (id, commission) => set((s) => ({
        vendors: s.vendors.map(v => v.id === id ? { ...v, commission } : v),
      })),

      addBanner: (banner) => set((s) => ({ banners: [...s.banners, banner] })),
      updateBanner: (id, updates) => set((s) => ({
        banners: s.banners.map(b => b.id === id ? { ...b, ...updates } : b),
      })),
      deleteBanner: (id) => set((s) => ({ banners: s.banners.filter(b => b.id !== id) })),

      addCategory: (category) => set((s) => ({ categories: [...s.categories, category] })),
      updateCategory: (id, updates) => set((s) => ({
        categories: s.categories.map(c => c.id === id ? { ...c, ...updates } : c),
      })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter(c => c.id !== id) })),

      updateSettings: (updates) => set((s) => ({
        settings: { ...s.settings, ...updates },
      })),
      hasHydrated: false,
      setHasHydrated: (h) => set({ hasHydrated: h }),
    }),
    { 
      name: 'admin-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
