'use client';

import Link from 'next/link';
import { useAdminStore } from '../../store/useAdminStore';
import { useProductStore } from '../../store/useProductStore';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useAdminStore();
  const { products } = useProductStore();
  const categories = Array.from(new Set(products.map(p => p.category.toLowerCase()))).slice(0, 7);
  const socialLinks = settings.socialLinks || { facebook: '#', instagram: '#', twitter: '#' };
  
  if (pathname.startsWith('/admin') || pathname.startsWith('/vendor')) {
    return null;
  }

  return (
    <footer className="bg-[#222222] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Footer Brand Logo */}
        <div className="mb-12 border-b border-white/5 pb-12">
          <Link href="/" className="inline-block transform hover:scale-105 transition-transform duration-300" style={{ fontFamily: 'var(--font-arvo)' }}>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.siteName} className="h-12 w-auto object-contain brightness-0 invert" />
            ) : (
              <div className="flex items-baseline gap-0.5 select-none">
                <span className="text-3xl font-bold text-white tracking-tight">{settings.siteName ? settings.siteName.split(' ')[0] : 'KVT'}</span>
                <span className="text-3xl font-normal text-white/30 tracking-tight ml-0.5">{settings.siteName ? settings.siteName.split(' ').slice(1).join(' ') : 'exports'}</span>
              </div>
            )}
          </Link>
          <p className="text-gray-400 mt-4 text-sm font-medium tracking-wide max-w-sm">
            {settings.tagline || 'Premium export quality products delivered to your doorstep.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
          {/* Categories */}
          <div>
            <h4 className="font-bold mb-5 text-sm tracking-wide uppercase">Categories</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              {categories.map(cat => (
                <li key={cat}>
                  <Link href={`/?category=${cat}`} className="hover:text-white transition capitalize">
                    {cat}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <>
                  <li><Link href="/?category=electronics" className="hover:text-white transition">Electronics</Link></li>
                  <li><Link href="/?category=fashion" className="hover:text-white transition">Fashion</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold mb-5 text-sm tracking-wide uppercase">Help</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><Link href="/track-order" className="hover:text-white transition">Track Order</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Returns</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping</Link></li>
              <li><Link href="/faqs" className="hover:text-white transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-5 text-sm tracking-wide uppercase">Get In Touch</h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {settings.contactAddress || 'Any questions? Let us know in store or call us.'}
            </p>
            <p className="text-gray-300 text-sm mb-4 font-medium">
              {settings.contactPhone && <span>Phone: {settings.contactPhone}</span>}
              <br />
              {settings.contactEmail && <span>Email: {settings.contactEmail}</span>}
            </p>
            <div className="flex items-center gap-4 text-gray-300">
              <a href={socialLinks.facebook} className="hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M18 2h-3a4 4 0 00-4 4v3H8v4h3v9h4v-9h3l1-4h-4V6a1 1 0 011-1h3z" /></svg>
              </a>
              <a href={socialLinks.instagram} className="hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="1.6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M17.5 6.5h.01" /></svg>
              </a>
              <a href={socialLinks.twitter} className="hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L5.769 21.75H2.462l7.726-8.835L1.54 2.25h6.826l4.853 6.093 5.825-6.093zM16.369 19.25h1.836L8.71 4.1H6.748l9.621 15.15z" /></svg>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-5 text-sm tracking-wide uppercase">Newsletter</h4>
            <div className="flex flex-col gap-4 max-w-xs">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-transparent border-b border-gray-500 text-gray-200 placeholder-gray-500 focus:outline-none pb-2 text-sm"
              />
              <button className="w-full max-w-[220px] bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg shadow-red-900/20 active:scale-95">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>Copyright ©{new Date().getFullYear()} {settings.siteName || 'KVT exports'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
