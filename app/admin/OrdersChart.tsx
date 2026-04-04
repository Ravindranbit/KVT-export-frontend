'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAdminStore } from '../../store/useAdminStore';

const COLORS: Record<string, string> = {
  'Pending': '#fbbf24',    // Amber-400 (Alert/Needs Action)
  'Processing': '#60a5fa', // Blue-400 (Active Work)
  'Shipped': '#818cf8',    // Indigo-400 (In Transit)
  'Delivered': '#34d399',  // Emerald-400 (Success/Done)
  'Cancelled': '#f87171',  // Red-400 (Negative/Stopped)
};

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
  const { orders } = useAdminStore();

  const data = [
    { name: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { name: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { name: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { name: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { name: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
  ];

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
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
