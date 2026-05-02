'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { useAdminStore } from '../../store/useAdminStore';

const WEEK_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
  const orders = useAdminStore((s) => s.orders);

  const data = useMemo(() => {
    const sums: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    if (Array.isArray(orders)) {
      for (const o of orders) {
        try {
          const d = new Date(o.date);
          if (!isNaN(d.getTime())) {
            // get day index: 0=Sun,1=Mon,...
            const idx = d.getDay();
            const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx];
            // ensure numeric total
            const t = typeof o.total === 'number' ? o.total : Number(o.total || 0);
            if (!Number.isNaN(t)) sums[day] = (sums[day] || 0) + t;
          }
        } catch (e) {
          // ignore malformed dates
        }
      }
    }

    // return data in Mon..Sun order to match UI
    return WEEK_ORDER.map((w) => ({ day: w, revenue: Math.round(sums[w] || 0) }));
  }, [orders]);

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
