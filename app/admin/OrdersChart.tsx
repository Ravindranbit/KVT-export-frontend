'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import adminApi from '../../src/lib/adminApi';

const BAR_COLOR = '#60a5fa';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 p-2.5 rounded-xl shadow-2xl shadow-gray-200/40 min-w-[120px]">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: payload[0].color }} />
            <span className="text-xs font-bold text-gray-500">Orders</span>
          </div>
          <p className="text-sm font-black text-gray-900 ml-4">{payload[0].value}</p>
        </div>
      </div>
    );
  }
  return null;
};

export default function OrdersChart() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response: any = await adminApi.get('/orders');
        setOrders(Array.isArray(response?.data) ? response.data : []);
      } catch {
        setOrders([]);
      }
    };

    loadOrders();
  }, []);

  const data = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();

    orders.forEach((order) => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt);
      const key = date.toISOString().slice(0, 10);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = counts.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        counts.set(key, { label, count: 1 });
      }
    });

    const sorted = Array.from(counts.entries())
      .map(([key, value]) => ({ key, name: value.label, count: value.count }))
      .sort((a, b) => a.key.localeCompare(b.key));

    return sorted.slice(-7);
  }, [orders]);

  const maxCount = Math.max(...data.map(d => d.count), 4);

  return (
    <div className="w-full flex justify-center pt-4">
      <ResponsiveContainer width="98%" height={220}>
        <BarChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} 
            axisLine={false} 
            tickLine={false} 
            dy={12}
          />
          <YAxis 
            tick={{ fontSize: 10, fontWeight: 800, fill: '#475569' }} 
            axisLine={false} 
            tickLine={false} 
            allowDecimals={false} 
            domain={[0, 'dataMax + 1']}
            tickCount={maxCount > 5 ? 6 : 5}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: '#f1f5f9', radius: 10 }}
          />
          <Bar 
            dataKey="count" 
            radius={[6, 6, 0, 0]} 
            barSize={58}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={BAR_COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
