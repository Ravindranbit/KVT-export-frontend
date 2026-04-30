'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

export default function ProfilePage() {
	const router = useRouter();
	const { user, token, hasHydrated, getProfile, logout, updateProfile } = useAuthStore();
	const { orders, fetchOrders, getOrdersByCustomer, isLoading: ordersLoading } = useOrderStore();
	const cartItems = useCartStore((state) => state.cart);
	const wishlistItems = useWishlistStore((state) => state.items);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [message, setMessage] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (!hasHydrated) return;

		if (!token && !user) {
			router.replace('/signin');
			return;
		}

		if (token && !user) {
			getProfile().catch(() => router.replace('/signin'));
		}
	}, [hasHydrated, token, user, getProfile, router]);

	useEffect(() => {
		if (!hasHydrated || !token || !user) return;
		fetchOrders();
	}, [hasHydrated, token, user, fetchOrders]);

	useEffect(() => {
		setName(user?.name || '');
		setEmail(user?.email || '');
		setPhone(user?.phone || '');
	}, [user]);

	const customerOrders = useMemo(() => {
		if (!user) return [];
		return getOrdersByCustomer(user.id);
	}, [user, getOrdersByCustomer, orders]);

	const recentOrders = useMemo(() => customerOrders.slice(0, 3), [customerOrders]);
	const deliveredOrders = customerOrders.filter((order) => order.status === 'Delivered').length;
	const activeOrders = customerOrders.filter((order) => order.status !== 'Delivered' && order.status !== 'Cancelled').length;
	const profileCompletion = [name, email, phone].filter(Boolean).length / 3;
	const profileCompletionLabel = `${Math.round(profileCompletion * 100)}%`;

	const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

	const handleSave = () => {
		setIsSaving(true);
		updateProfile({ name, email, phone });
		setMessage('Profile updated successfully!');
		window.setTimeout(() => {
			setMessage('');
			setIsSaving(false);
		}, 2500);
	};

	const handleLogout = () => {
		logout();
		router.push('/');
	};

	if (!hasHydrated) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
				Loading...
			</div>
		);
	}

	if (!token && !user) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
				Redirecting...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f6f7f9]">
			<header className="border-b border-gray-200 bg-white/95 backdrop-blur sticky top-0 z-20">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
					<Link href="/" className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-kumar-one)' }}>
						KVT exports
					</Link>
					<div className="flex items-center gap-3">
						<span className="hidden sm:inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
							Buyer Account
						</span>
						<Link href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
							Back to Store
						</Link>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-8 lg:py-10 space-y-6">
				<section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
					<div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-gray-800 text-white overflow-hidden shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
						<div className="p-8 lg:p-10">
							<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">My Account</p>
									<h1 className="mt-3 text-3xl lg:text-4xl font-black tracking-tight">{user.name}</h1>
									<p className="mt-3 max-w-2xl text-sm lg:text-base text-white/70">
										Review your profile, track purchases, and manage the details that keep your orders moving smoothly.
									</p>
								</div>
								<div className="grid grid-cols-2 gap-3 text-sm min-w-[260px]">
									<div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur">
										<p className="text-white/55 text-xs uppercase tracking-[0.18em]">Orders</p>
										<p className="mt-2 text-2xl font-black">{customerOrders.length}</p>
									</div>
									<div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur">
										<p className="text-white/55 text-xs uppercase tracking-[0.18em]">Wishlist</p>
										<p className="mt-2 text-2xl font-black">{wishlistItems.length}</p>
									</div>
									<div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur">
										<p className="text-white/55 text-xs uppercase tracking-[0.18em]">Cart Items</p>
										<p className="mt-2 text-2xl font-black">{cartItems.length}</p>
									</div>
									<div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur">
										<p className="text-white/55 text-xs uppercase tracking-[0.18em]">Profile</p>
										<p className="mt-2 text-2xl font-black">{profileCompletionLabel}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-[32px] bg-white border border-gray-200 shadow-sm p-6 lg:p-8">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Account status</p>
						<div className="mt-4 flex items-center justify-between gap-4">
							<div>
								<h2 className="text-xl font-black text-gray-900">{user.role === 'buyer' ? 'Verified Buyer' : 'Account Holder'}</h2>
								<p className="mt-1 text-sm text-gray-500">Signed in as {user.email}</p>
							</div>
							<span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
								Active
							</span>
						</div>

						<div className="mt-6 space-y-4 text-sm">
							<div className="flex items-center justify-between border-b border-gray-100 pb-3">
								<span className="text-gray-500">Member since</span>
								<span className="font-semibold text-gray-900">{user.joinedDate || 'Recently joined'}</span>
							</div>
							<div className="flex items-center justify-between border-b border-gray-100 pb-3">
								<span className="text-gray-500">Delivered orders</span>
								<span className="font-semibold text-gray-900">{deliveredOrders}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-500">Open orders</span>
								<span className="font-semibold text-gray-900">{activeOrders}</span>
							</div>
						</div>
					</div>
				</section>

				{message && (
					<div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700 shadow-sm">
						{message}
					</div>
				)}

				<section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
					<div className="rounded-[28px] border border-gray-200 bg-white p-6 lg:p-8 shadow-sm">
						<div className="flex items-center justify-between gap-4 mb-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Profile</p>
								<h2 className="mt-2 text-2xl font-black text-gray-900">Personal information</h2>
							</div>
							<span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">Secure profile</span>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<label className="space-y-2">
								<span className="text-sm font-semibold text-gray-700">Full name</span>
								<input
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
								/>
							</label>
							<label className="space-y-2">
								<span className="text-sm font-semibold text-gray-700">Email address</span>
								<input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
								/>
							</label>
							<label className="space-y-2 sm:col-span-2">
								<span className="text-sm font-semibold text-gray-700">Phone number</span>
								<input
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
								/>
							</label>
						</div>

						<div className="mt-6 flex flex-wrap items-center gap-3">
							<button
								onClick={handleSave}
								disabled={isSaving}
								className="rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
							>
								{isSaving ? 'Saving...' : 'Save changes'}
							</button>
							<button
								onClick={handleLogout}
								className="rounded-2xl border border-red-200 bg-red-50 px-6 py-3.5 text-sm font-bold text-red-700 transition hover:bg-red-100"
							>
								Sign out
							</button>
						</div>
					</div>

					<div className="space-y-6">
						<div className="rounded-[28px] border border-gray-200 bg-white p-6 lg:p-8 shadow-sm">
							<div className="flex items-center justify-between mb-5">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Recent orders</p>
									<h2 className="mt-2 text-xl font-black text-gray-900">Order activity</h2>
								</div>
								<Link href="/orders" className="text-sm font-semibold text-red-600 hover:text-red-700">
									View all
								</Link>
							</div>

							{ordersLoading ? (
								<p className="text-sm text-gray-500">Loading your recent orders...</p>
							) : recentOrders.length > 0 ? (
								<div className="space-y-3">
									{recentOrders.map((order) => (
										<div key={order.id} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
											<div className="flex items-start justify-between gap-4">
												<div>
													<p className="text-sm font-bold text-gray-900">Order #{order.id}</p>
													<p className="mt-1 text-xs text-gray-500">{order.date} • {order.items.length} item(s)</p>
												</div>
												<span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : order.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
													{order.status}
												</span>
											</div>
											<div className="mt-3 flex items-center justify-between text-sm">
												<span className="text-gray-500">Total</span>
												<span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
									No orders yet. Once you place an order, it will appear here.
								</div>
							)}
						</div>

						<div className="rounded-[28px] border border-gray-200 bg-white p-6 lg:p-8 shadow-sm">
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Shopping shortcuts</p>
							<h2 className="mt-2 text-xl font-black text-gray-900">Quick access</h2>
							<div className="mt-5 grid gap-3">
								<Link href="/orders" className="rounded-2xl border border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
									My orders
								</Link>
								<Link href="/cart" className="rounded-2xl border border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
									Shopping cart
								</Link>
								<Link href="/wishlist" className="rounded-2xl border border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
									Wishlist
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
