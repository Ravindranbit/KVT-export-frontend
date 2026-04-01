'use client';
import Header from '../../components/layout/Header';
import Link from 'next/link';

export default function About() {

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-900/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070"
          alt="KVT Exports warehouse"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="max-w-7xl mx-auto px-4 py-32 relative z-20">
          <p className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4">Who We Are</p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight max-w-3xl">
            Crafting Quality,<br />Delivering Trust.
          </h1>
          <p className="text-xl text-gray-300 max-w-xl leading-relaxed font-medium">
            KVT Exports was founded with a singular mission: connect quality artisans with the world, fairly and transparently.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">Our Story</h2>
            <p className="text-gray-500 leading-relaxed text-lg mb-6 font-medium">
              Founded in 2019, KVT Exports started as a small operation connecting independent textile artisans with buyers across India. What began as a passion project quickly grew into a full-scale multi-vendor marketplace, trusted by thousands of customers and hundreds of sellers.
            </p>
            <p className="text-gray-500 leading-relaxed text-lg font-medium">
              We believe that quality craftsmanship shouldn't be hidden. Our platform empowers sellers of all sizes — from independent designers to established studios — with the tools and reach they need to thrive.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: '5,000+', label: 'Happy Customers' },
              { value: '200+', label: 'Active Vendors' },
              { value: '10,000+', label: 'Products Listed' },
              { value: '15+', label: 'Cities Served' },
            ].map(stat => (
              <div key={stat.label} className="bg-gray-50 border border-gray-100 p-8 rounded-3xl text-center hover:shadow-md transition-shadow">
                <h3 className="text-4xl font-extrabold text-red-600 mb-2">{stat.value}</h3>
                <p className="text-gray-500 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16 tracking-tight">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Transparency', desc: 'Flat 3% commission, no hidden fees. Our sellers always know exactly what they earn.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { title: 'Quality First', desc: 'Every vendor on our platform is vetted. We maintain high standards so you never have to guess.', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
              { title: 'Community', desc: 'We invest in our sellers with tools, analytics, and support to help them grow their business.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
            ].map(v => (
              <div key={v.title} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:-translate-y-1 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={v.icon} /></svg>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Ready to be part of our story?</h2>
          <p className="text-gray-400 mb-10 text-lg font-medium">Join hundreds of vendors already growing with us.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/become-seller" className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5">
              Become a Seller
            </Link>
            <Link href="/contact" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-10 py-4 rounded-xl font-bold transition-all">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
