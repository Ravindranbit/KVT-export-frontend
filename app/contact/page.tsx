'use client';
import { useState } from 'react';
import Header from '../../components/layout/Header';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4">We'd Love to Hear From You</p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">Get In Touch</h1>
          <p className="text-xl text-gray-500 font-medium max-w-xl mx-auto">
            Whether you're a customer, a seller, or just curious our team is always happy to help.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">Contact Information</h2>
              <div className="space-y-8">
                {[
                  {
                    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                    label: 'Address',
                    value: '8th Floor, 379 KVT Complex, Chennai, TN 600001'
                  },
                  {
                    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
                    label: 'Phone',
                    value: '+91 96 716 6879'
                  },
                  {
                    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                    label: 'Email',
                    value: 'support@kvtexports.com'
                  },
                ].map(item => (
                  <div key={item.label} className="flex gap-5 items-start group">
                    <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} /></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-gray-700 font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-l-4 border-l-red-500 border border-gray-100 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Business Hours</h3>
              <p className="text-gray-400 font-medium mb-5 text-sm">Our support team is available:</p>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center font-medium pb-3 border-b border-gray-50"><span className="text-gray-500">Monday – Friday</span><span className="text-gray-900 font-bold bg-gray-50 px-3 py-1 rounded-lg">9:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between items-center font-medium pb-3 border-b border-gray-50"><span className="text-gray-500">Saturday</span><span className="text-gray-900 font-bold bg-gray-50 px-3 py-1 rounded-lg">10:00 AM – 4:00 PM</span></div>
                <div className="flex justify-between items-center font-medium"><span className="text-gray-500">Sunday</span><span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-lg">Closed</span></div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-gray-50 border border-gray-100 rounded-3xl p-12">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Message Sent!</h3>
                <p className="text-gray-500 font-medium">Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 space-y-6">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Send Us a Message</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="John" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="Doe" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" required placeholder="john@example.com" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" required placeholder="+91 98765 43210" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all" />
                </div>




                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
                  <textarea required rows={5} placeholder="Tell us how we can help you..." className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all resize-none" />
                </div>

                <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-extrabold py-5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg">
                  Send Message →
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
