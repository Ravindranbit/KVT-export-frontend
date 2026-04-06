'use client';

import { useAdminStore } from '../../store/useAdminStore';
import { useProductStore } from '../../store/useProductStore';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Recharts
const RevenueChart = dynamic(() => import('./RevenueChart'), { ssr: false, loading: () => <div className="h-[280px] bg-gray-50 rounded-lg animate-pulse" /> });
const OrdersChart = dynamic(() => import('./OrdersChart'), { ssr: false, loading: () => <div className="h-[280px] bg-gray-50 rounded-lg animate-pulse" /> });

export default function AdminDashboard() {
  const { orders, users, vendors } = useAdminStore();
  const { products } = useProductStore();

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingVendors = vendors.filter(v => v.status === 'pending').length;

  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const topProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);

  const statusColors: Record<string, string> = {
    pending: 'text-[#cca300]',
    processing: 'text-[#1976d2]',
    shipped: 'text-[#7b1fa2]',
    delivered: 'text-[#3b8c41]',
    cancelled: 'text-[#e60000]',
  };


  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            desc: 'All time earnings',
            accent: 'border-l-emerald-500',
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>),
          },
          {
            label: 'Total Orders',
            value: orders.length.toString(),
            desc: `${pendingOrders} pending`,
            accent: 'border-l-blue-500',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>),
          },
          {
            label: 'Products',
            value: products.length.toString(),
            desc: 'In catalog',
            accent: 'border-l-violet-500',
            iconBg: 'bg-violet-50',
            iconColor: 'text-violet-600',
            icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>),
          },
          {
            label: 'Active Users',
            value: activeUsers.toString(),
            desc: `${users.length} total registered`,
            accent: 'border-l-amber-500',
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>),
          },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white border border-gray-200 border-l-4 ${stat.accent} rounded-xl p-5 hover:shadow-md transition-all group`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-transform shrink-0`}>{stat.icon}</div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-gray-900 mt-0.5">{stat.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{stat.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900">Revenue Trend</h3>
            <p className="text-[11px] text-gray-400">Last 7 days</p>
          </div>
          <RevenueChart />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Orders by Status</h3>
              <p className="text-[11px] text-gray-400">{orders.length} total orders</p>
            </div>
          </div>
          <OrdersChart />
        </div>
      </div>

      {/* Order Status + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[11px] text-primary font-bold hover:opacity-80 transition-colors">View All →</Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={order.items[0].image} alt="" className="w-7 h-7 rounded object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.id}</p>
                      <p className="text-[11px] text-gray-400">{order.customerName} · {order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                    <span className={`flex items-center gap-1.5 text-[11px] font-black tracking-wide capitalize ${statusColors[order.status]}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-16 text-center">
              <div className="inline-block w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <p className="text-sm font-bold text-gray-400">No orders yet</p>
              <p className="text-xs text-gray-300 mt-1">Orders will appear here once customers make purchases</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Add Product', href: '/admin/products', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>) },
                { label: 'View Orders', href: '/admin/orders', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>) },
                { label: 'Approve Seller', href: '/admin/vendors', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>) },
                { label: 'Edit Banners', href: '/admin/banners', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>) },
              ].map(item => (
                <Link key={item.label} href={item.href} className="group bg-white border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgb(var(--primary-rgb),0.12)] hover:border-primary/30 rounded-xl px-4 py-5 flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-primary flex items-center justify-center text-gray-500 group-hover:text-white transition-colors mb-3">
                    {item.icon}
                  </div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{item.label}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">Top Products</h2>
              <Link href="/admin/products" className="text-[11px] text-primary font-bold hover:opacity-80 transition-colors">View All →</Link>
            </div>
            {topProducts.length > 0 ? (
              <div className="space-y-2.5">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-black w-5 text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-gray-300'}`}>#{i + 1}</span>
                    <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400">{p.reviews} sold</p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">No products yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
