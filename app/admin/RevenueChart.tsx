'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', revenue: 12400 },
  { day: 'Tue', revenue: 8900 },
  { day: 'Wed', revenue: 15600 },
  { day: 'Thu', revenue: 11200 },
  { day: 'Fri', revenue: 18400 },
  { day: 'Sat', revenue: 22100 },
  { day: 'Sun', revenue: 16800 },
];

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
