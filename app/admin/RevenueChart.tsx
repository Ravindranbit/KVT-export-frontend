'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import adminApi from '../../src/lib/adminApi';

interface RevenueData {
  day: string;
  revenue: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl">
        <p className="text-gray-400 text-[10px] mb-0.5">{label}</p>
        <p>₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response: any = await adminApi.get('/orders');
        const orders = response?.data || [];

        // Get last 7 days
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date();
        const revenueByDay: Record<string, number> = {};

        // Initialize revenue for last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayName = days[date.getDay()];
          revenueByDay[dayName] = 0;
        }

        // Calculate revenue from orders
        orders.forEach((order: any) => {
          const orderDate = new Date(order.createdAt);
          const dayDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Only include orders from last 7 days
          if (dayDiff >= 0 && dayDiff < 7) {
            const dayName = days[orderDate.getDay()];
            const revenue = Number(order.totalAmount || 0);
            revenueByDay[dayName] = (revenueByDay[dayName] || 0) + revenue;
          }
        });

        // Convert to array format for chart
        const chartData = days.map((day) => ({
          day,
          revenue: Math.round(revenueByDay[day]),
        }));

        setData(chartData);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
        // Fallback to empty data
        setData([
          { day: 'Mon', revenue: 0 },
          { day: 'Tue', revenue: 0 },
          { day: 'Wed', revenue: 0 },
          { day: 'Thu', revenue: 0 },
          { day: 'Fri', revenue: 0 },
          { day: 'Sat', revenue: 0 },
          { day: 'Sun', revenue: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[220px] flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  if (totalRevenue === 0) {
    return (
      <div className="w-full h-[220px] flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7H5v12h8V7zm0-2h6a1 1 0 011 1v14a1 1 0 01-1 1h-6a1 1 0 01-1-1V6a1 1 0 011-1zm-8 8h.01M5 19h8M5 3h8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l2 2 4-4" />
          </svg>
        </div>
        <p className="text-sm font-bold text-gray-900">No revenue data yet</p>
        <p className="text-xs text-gray-500 mt-1">Orders will appear here once customers make purchases</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2.5} fill="url(#revenueGradient)" dot={{ fill: '#dc2626', strokeWidth: 2, r: 4, stroke: '#fff' }} activeDot={{ r: 6, fill: '#dc2626', stroke: '#fff', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
