'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  MapPin,
  Tag,
  Bell,
  Shield,
  Save,
  Globe,
  CheckCircle,
  Clock,
  Calendar,
  Image as ImageIcon,
  Palette,
  Languages,
  DollarSign,
  Truck,
  MessageSquare,
  Mail,
  Smartphone,
  CreditCard,
  Lock,
  Eye,
  AlertCircle,
  Database,
  Copy,
  UploadCloud,
  ChevronRight
} from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'contact', label: 'Contact', icon: MapPin },
  { id: 'pricing', label: 'Pricing & Shipping', icon: Tag },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function AdminSettings() {
  const { settings, updateSettings } = useAdminStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState(() => {
    const defaults = {
      siteName: '', tagline: '', logoUrl: '', faviconUrl: '', defaultLanguage: 'en', defaultCurrency: 'USD',
      timeFormat: '12h' as '12h' | '24h', dateFormat: 'MM/DD/YYYY', storeEnabled: true, maintenanceMessage: '',
      contactEmail: '', contactPhone: '', whatsappNumber: '', contactAddress: '', googleMapsLink: '', businessHours: '',
      supportUrl: '', liveChatEnabled: false, contactFormEmail: '', multipleLocations: false,
      socialLinks: { facebook: '', instagram: '', twitter: '' },
      currency: '', currencyFormat: '', globalCommission: 0, taxRate: 0, taxType: 'exclusive' as 'exclusive' | 'inclusive', multipleTaxRates: false,
      shippingZones: '', shippingMethods: '', shippingRate: 0, codCharges: 0, deliveryTimeEstimate: '', freeShippingThreshold: 0,
      emailNotifications: false, smsNotifications: false, whatsappNotifications: false,
      adminAlerts: false, emailTemplates: { orderPlaced: '', orderShipped: '', orderDelivered: '' },
      notificationFrequency: 'instant' as 'instant' | 'batch', adminChannels: 'email',
      sessionTimeout: 1, require2FA: false, passwordRules: 'basic', loginAttemptLimit: 5, ipWhitelist: '',
      auditLogsEnabled: false, captchaEnabled: false, emailVerificationRequired: false,
      themeColor: '#e60000'
    };
    return { ...defaults, ...settings };
  });

  const isDirty = JSON.stringify(form) !== JSON.stringify({ ...form, ...settings });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    updateSettings(form);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ModernSwitch = ({ checked, onChange, label, description, icon: Icon }: any) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`p-2.5 rounded-xl transition-all duration-300 ${checked ? 'bg-[#e60000]/10 text-[#e60000]' : 'bg-gray-100 text-gray-400'} group-hover:scale-110`}>
            <Icon size={20} />
          </div>
        )}
        <div className="space-y-1">
          <span className="block text-sm font-black text-gray-900 tracking-tight leading-none">{label}</span>
          {description && <span className="block text-xs text-gray-500 font-bold opacity-80">{description}</span>}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${checked ? 'bg-[#e60000]' : 'bg-gray-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xl ring-0 transition duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </motion.div>
  );

  const InputField = ({ label, icon: Icon, children, ...props }: any) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[11px] font-black text-gray-600 uppercase tracking-[0.1em] ml-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e60000] group-hover:text-gray-500 transition-colors z-10 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        {props.type === 'select' ? (
          <select
            {...props}
            className={`w-full bg-white/80 border border-gray-200 rounded-[14px] ${Icon ? 'pl-10' : 'px-4'} py-3 text-xs font-bold text-gray-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#e60000]/10 focus:border-[#e60000] hover:border-gray-300 transition-all shadow-sm focus:shadow-md appearance-none cursor-pointer`}
          >
            {children}
          </select>
        ) : (
          <input
            {...props}
            className={`w-full bg-white/80 border border-gray-200 rounded-[14px] ${Icon ? 'pl-10' : 'px-4'} py-3 text-xs font-bold text-gray-800 placeholder:text-gray-400 placeholder:font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#e60000]/10 focus:border-[#e60000] hover:border-gray-300 transition-all shadow-sm focus:shadow-md`}
          />
        )}
      </div>
    </div>
  );

  const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="mb-6">
      <h3 className="text-xl font-black text-gray-900 tracking-tighter leading-none">{title}</h3>
      <p className="text-[11px] text-gray-500 font-bold mt-1.5 opacity-60 tracking-tight leading-relaxed">{subtitle}</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-32">
      <div className="flex justify-center mb-6">
        <div className="bg-white p-1.5 rounded-[22px] flex items-center gap-1 overflow-x-auto scrollbar-hide border border-gray-100 shadow-sm">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-3 px-8 py-3 text-[11px] uppercase tracking-[0.15em] transition-all duration-300 rounded-[18px] whitespace-nowrap outline-none
                  ${isActive ? 'bg-red-50 text-[#e60000] font-black' : 'text-gray-400 font-bold hover:text-gray-900 hover:bg-gray-50'}
                `}
              >
                <Icon size={16} className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'opacity-60'}`} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 border-2 border-[#e60000]/10 rounded-[18px]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e60000]/10 to-transparent"></div>

        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <SectionHeader title="Brand Infrastructure" subtitle="The visual and semiotic core of your customer experience" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <InputField label="Official Site Identity" value={form.siteName} onChange={(e: any) => setForm({ ...form, siteName: e.target.value })} icon={Globe} placeholder="e.g. KVT Exports" />
                  <InputField label="Brand Tagline" value={form.tagline} onChange={(e: any) => setForm({ ...form, tagline: e.target.value })} icon={Tag} placeholder="Excellence in every stitch" />

                  <div className="pt-2">
                    <label className="block text-[11px] font-black text-gray-600 uppercase tracking-[0.1em] mb-2 ml-1">Universal Theme Palette</label>
                    <div className="flex items-center gap-4 bg-gray-50/50 border border-gray-100 rounded-[20px] p-2 pr-6 hover:bg-white hover:border-gray-200 hover:shadow-lg transition-all transition-duration-300">
                      <div className="relative group">
                        <input type="color" value={form.themeColor} onChange={(e) => setForm({ ...form, themeColor: e.target.value })} className="w-12 h-12 rounded-[16px] cursor-pointer border-0 p-0 bg-transparent shrink-0 overflow-hidden shadow-inner" />
                        <div className="absolute inset-0 rounded-[16px] pointer-events-none ring-1 ring-black/5"></div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <input type="text" value={form.themeColor.toUpperCase()} onChange={(e) => setForm({ ...form, themeColor: e.target.value })} className="bg-transparent border-0 text-base font-black text-gray-900 outline-none w-full uppercase" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Primary Brand Accent</span>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {[
                    { label: 'Corporate Logo', icon: <ImageIcon size={22} />, desc: 'SVG or High-Res PNG', fieldLabel: 'Master Brand Identity' },
                    { label: 'System Favicon', icon: <UploadCloud size={22} />, desc: 'ICO, PNG or SVG', fieldLabel: 'Browser Interface Icon' }
                  ].map((u, i) => (
                    <div key={i} className="space-y-2">
                      <label className="block text-[11px] font-black text-gray-600 uppercase tracking-[0.1em] ml-1">{u.fieldLabel}</label>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="group relative p-6 border-2 border-dashed border-gray-200 hover:border-[#e60000] hover:bg-red-50/10 rounded-[24px] bg-gray-50/20 transition-all duration-500 cursor-pointer overflow-hidden border-spacing-4"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-[20px] bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-300 group-hover:text-[#e60000] group-hover:scale-105 transition-all duration-500">
                            {u.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                              {u.label}
                              <ChevronRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#e60000]" />
                            </p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 mb-2 opacity-70">
                              📁 Drop your file here or click to browse
                            </p>
                            <span className="text-[9px] font-black text-[#e60000]/60 uppercase tracking-widest bg-white/80 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm group-hover:bg-[#e60000] group-hover:text-white transition-all">
                              {u.desc}
                            </span>
                          </div>
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                <InputField label="UI Localisation" value={form.defaultLanguage} onChange={(e: any) => setForm({ ...form, defaultLanguage: e.target.value })} icon={Languages} type="select">
                  <option value="en">English (Universal)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                </InputField>
                <InputField label="Temporal Standard" value={form.timeFormat} onChange={(e: any) => setForm({ ...form, timeFormat: e.target.value })} icon={Clock} type="select">
                  <option value="12h">12-Hour (AM/PM)</option>
                  <option value="24h">24-Hour (Military)</option>
                </InputField>
                <InputField label="Global Date Format" value={form.dateFormat} onChange={(e: any) => setForm({ ...form, dateFormat: e.target.value })} icon={Calendar} type="select">
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (UK/India)</option>
                  <option value="YYYY/MM/DD">YYYY/MM/DD (ISO)</option>
                </InputField>
              </div>

              <div className={`p-6 border-2 rounded-[28px] transition-all duration-500 relative overflow-hidden group ${!form.storeEnabled ? 'border-[#e60000] bg-red-50/30 shadow-lg' : 'border-gray-100 bg-gray-50/30 hover:border-gray-200 hover:bg-white'}`}>
                {!form.storeEnabled && <div className="absolute top-0 right-0 p-3"><span className="text-[9px] font-black text-red-600 bg-white px-3 py-1 rounded-full shadow-sm animate-pulse tracking-widest border border-red-100">SYSTEM OFFLINE</span></div>}
                <label 
                  onClick={() => setForm({ ...form, storeEnabled: !form.storeEnabled })}
                  className="flex items-center justify-between cursor-pointer relative z-10 select-none"
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${!form.storeEnabled ? 'bg-[#e60000] text-white shadow-xl shadow-red-500/40 rotate-12' : 'bg-white text-gray-400 group-hover:text-gray-600 shadow-sm border border-gray-100'}`}>
                      <AlertCircle size={22} />
                    </div>
                    <div>
                      <span className="block text-lg font-black text-gray-900 tracking-tighter flex items-center gap-2">
                        Maintenance Mode
                        {!form.storeEnabled && <span className="bg-[#e60000] w-2 h-2 rounded-full animate-ping"></span>}
                      </span>
                      <span className="block text-[11px] font-bold text-gray-500 mt-1 opacity-70">Toggle public availability of the storefront portal.</span>
                    </div>
                  </div>
                  <div className="flex items-center group/toggle">
                    <div className={`relative w-14 h-7 rounded-full transition-all duration-500 overflow-hidden ${!form.storeEnabled ? 'bg-red-600' : 'bg-gray-200'}`}>
                      <motion.div
                        animate={{ x: !form.storeEnabled ? 30 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg z-10"
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-2 text-[8px] font-black uppercase text-white/40">
                         <span className="ml-5">OFF</span>
                         <span className="mr-5">ON</span>
                      </div>
                    </div>
                    <span className={`ml-3 text-[10px] font-black ${!form.storeEnabled ? 'text-red-700' : 'text-gray-400'} uppercase tracking-widest min-w-[100px]`}>
                      {form.storeEnabled ? 'Portal Live' : 'Maintenance Active'}
                    </span>
                  </div>
                </label>

                {!form.storeEnabled && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-8 pt-8 border-t border-[#e60000]/10"
                  >
                    <label className="block text-[11px] font-black text-[#e60000] uppercase tracking-widest mb-4 ml-1">Global Broadcast Message</label>
                    <textarea value={form.maintenanceMessage} onChange={(e) => setForm({ ...form, maintenanceMessage: e.target.value })} rows={4} className="w-full bg-white border-2 border-[#e60000]/10 rounded-[28px] px-8 py-6 text-base font-bold text-gray-950 focus:outline-none focus:border-[#e60000] focus:ring-4 focus:ring-[#e60000]/10 transition-all resize-none shadow-xl shadow-red-500/5 placeholder:text-gray-300" placeholder="e.g. We're currently enhancing your shopping experience..." />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <SectionHeader title="Support Nodes" subtitle="Orchestrate your customer relations and physical presence" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <InputField label="Primary Support Inbox" value={form.contactEmail} onChange={(e: any) => setForm({ ...form, contactEmail: e.target.value })} icon={Mail} />
                  <InputField label="Helpline Contact" value={form.contactPhone} onChange={(e: any) => setForm({ ...form, contactPhone: e.target.value })} icon={Smartphone} />
                  <InputField label="Official WhatsApp Business" value={form.whatsappNumber} onChange={(e: any) => setForm({ ...form, whatsappNumber: e.target.value })} icon={MessageSquare} />
                </div>
                <div className="space-y-8">
                  <InputField label="Business Operational Window" value={form.businessHours} onChange={(e: any) => setForm({ ...form, businessHours: e.target.value })} icon={Clock} placeholder="Mon - Sat | 09:00 - 18:00" />
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest ml-1">HQ Physical Registered Address</label>
                    <textarea value={form.contactAddress} onChange={(e) => setForm({ ...form, contactAddress: e.target.value })} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-[24px] px-6 py-6 text-sm font-bold focus:bg-white focus:border-[#e60000] focus:ring-8 focus:ring-[#e60000]/5 transition-all outline-none resize-none shadow-sm" />
                  </div>
                </div>

                <div className="lg:col-span-2 pt-2">
                  <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-6 space-y-6 hover:shadow-2xl hover:bg-white transition-all duration-500 group">
                    <div className="flex items-center gap-5 border-b border-gray-100 pb-5">
                      <div className="p-3 bg-white rounded-[18px] shadow-lg text-[#e60000] group-hover:scale-110 transition-transform duration-500 ring-1 ring-black/5">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-gray-950 tracking-tighter">Satellite Precision Mapping</h4>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">Embed your physical location for consumer trust</p>
                      </div>
                    </div>
                    <InputField label="Map Embed Source Code" value={form.googleMapsLink} onChange={(e: any) => setForm({ ...form, googleMapsLink: e.target.value })} placeholder="https://www.google.com/maps/embed?..." />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <SectionHeader title="Logistics & Finance" subtitle="Universal pricing rules, taxation policy, and shipping protocols" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div className="p-2 bg-[#e60000]/10 rounded-lg text-[#e60000]"><DollarSign size={20} /></div>
                    <h4 className="text-base font-black text-gray-900 uppercase tracking-widest leading-none">Monetary Interface</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <InputField label="Display Format" value={form.currencyFormat} onChange={(e: any) => setForm({ ...form, currencyFormat: e.target.value })} placeholder="₹ {amount}" />
                    <InputField label="Taxation Logic" value={form.taxType} onChange={(e: any) => setForm({ ...form, taxType: e.target.value as 'inclusive' | 'exclusive' })} type="select">
                      <option value="exclusive">Exclusionary (Add at Pay)</option>
                      <option value="inclusive">Inclusionary (Net Price)</option>
                    </InputField>
                    <InputField label="Global Levy (%)" type="number" value={form.taxRate} onChange={(e: any) => setForm({ ...form, taxRate: parseInt(e.target.value) })} />
                    <InputField label="Base Currency" value={form.defaultCurrency} onChange={(e: any) => setForm({ ...form, defaultCurrency: e.target.value })} type="select">
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AED">AED (د.إ)</option>
                    </InputField>
                  </div>

                  <div className="pt-2">
                    <ModernSwitch
                      label="Granular Regional Taxation"
                      description="Dynamic tax calculation based on geo-location"
                      checked={form.multipleTaxRates}
                      onChange={(v: boolean) => setForm({ ...form, multipleTaxRates: v })}
                      icon={CreditCard}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div className="p-2 bg-[#e60000]/10 rounded-lg text-[#e60000]"><Truck size={20} /></div>
                    <h4 className="text-base font-black text-gray-900 uppercase tracking-widest leading-none">Fulfillment Logistics</h4>
                  </div>

                  <div className="space-y-6">
                    <InputField label="Shipment Corridors" value={form.shippingZones} onChange={(e: any) => setForm({ ...form, shippingZones: e.target.value })} placeholder="e.g. GCC, EU, Southeast Asia" />
                    <div className="grid grid-cols-2 gap-6">
                      <InputField label="COD Surcharge" type="number" value={form.codCharges} onChange={(e: any) => setForm({ ...form, codCharges: parseInt(e.target.value) })} />
                      <InputField label="Free Shipping Floor" type="number" value={form.freeShippingThreshold} onChange={(e: any) => setForm({ ...form, freeShippingThreshold: parseInt(e.target.value) })} />
                    </div>
                    <InputField label="Standard Transit SLA" value={form.deliveryTimeEstimate} onChange={(e: any) => setForm({ ...form, deliveryTimeEstimate: e.target.value })} placeholder="3-5 Standard Business Days" icon={Clock} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <SectionHeader title="Communications Hub" subtitle="Configure the automated propagation of transactional events" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <h4 className="text-[11px] font-black text-[#e60000] uppercase tracking-[0.2em] ml-1">Automated Channels</h4>
                  <div className="grid grid-cols-1 gap-6">
                    <ModernSwitch label="Legacy Email Service" description="High-deliverability SMTP notifications" checked={form.emailNotifications} onChange={(v: boolean) => setForm({ ...form, emailNotifications: v })} icon={Mail} />
                    <ModernSwitch label="Short Message Service (SMS)" description="Urgent high-priority status updates" checked={form.smsNotifications} onChange={(v: boolean) => setForm({ ...form, smsNotifications: v })} icon={Smartphone} />
                    <ModernSwitch label="WhatsApp Business Protocol" description="Conversational commerce via verified API" checked={form.whatsappNotifications} onChange={(v: boolean) => setForm({ ...form, whatsappNotifications: v })} icon={MessageSquare} />
                  </div>
                </div>

                <div className="space-y-8">
                  <h4 className="text-[11px] font-black text-[#e60000] uppercase tracking-[0.2em] ml-1">Command Protocols</h4>
                  <div className="space-y-6">
                    <InputField label="Security Alert Pipeline" value={form.adminChannels} onChange={(e: any) => setForm({ ...form, adminChannels: e.target.value })} type="select">
                      <option value="email">Exclusive Email Relay</option>
                      <option value="email_sms">Composite (Email + Urgent SMS)</option>
                      <option value="dashboard">Internal Operations Console Only</option>
                    </InputField>
                    <InputField label="Dispatch Cadence" value={form.notificationFrequency} onChange={(e: any) => setForm({ ...form, notificationFrequency: e.target.value as 'instant' | 'batch' })} type="select">
                      <option value="instant">Real-time Reactive Dispatch</option>
                      <option value="batch">Buffered Periodic Consolidation</option>
                    </InputField>
                    <div className="pt-2">
                      <ModernSwitch label="Vendor Sentinel" description="Monitor new business applications" checked={form.adminAlerts} onChange={(v: boolean) => setForm({ ...form, adminAlerts: v })} icon={Shield} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Save Action at the bottom of forms */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100"
              >
                <CheckCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Protocol Synchronized</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`
                  flex items-center gap-3 px-12 py-5 rounded-[22px] font-black shadow-xl transition-all
                  ${isSaving ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-gray-900 hover:bg-black text-white'}
               `}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span className="text-xs uppercase tracking-widest">Saving State...</span>
              </>
            ) : (
              <span className="text-sm uppercase tracking-widest">SAVE changes </span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
