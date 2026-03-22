/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useCallback, Component } from "react";
import { 
  LogOut,
  ShoppingCart, 
  ListOrdered, 
  Ticket as TicketIcon, 
  LayoutGrid, 
  Repeat, 
  RefreshCw, 
  Wallet, 
  Undo2, 
  Code2, 
  Layers, 
  Bell,
  ChevronDown,
  AlertTriangle,
  AlertCircle,
  User,
  BarChart3,
  CreditCard,
  Plus,
  Search,
  MessageCircle,
  Send,
  Music,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Youtube as YoutubeIcon,
  Twitch,
  Ghost,
  Play,
  Cloud,
  Share2,
  Apple,
  Radio,
  Gamepad2,
  HandMetal,
  Menu,
  Globe,
  Lock,
  Mail,
  Paperclip,
  Bitcoin,
  Settings,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  LogIn,
  X,
  Database,
  Home
} from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { seedServices as seedBulkServices } from "./services/bulkServices";
import { 
  auth, 
  db, 
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logout as firebaseLogout, 
  handleFirestoreError, 
  OperationType 
} from "./firebase";
import { 
  onAuthStateChanged, 
  User as FirebaseUser 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

type Page = 'new-order' | 'orders' | 'tickets' | 'services' | 'subscriptions' | 'refill' | 'add-funds' | 'mass-order' | 'updates' | 'admin' | 'profile' | 'transactions';

interface Service {
  id: number;
  name: string;
  rate: string;
  min: number;
  max: number;
  category?: string;
  description?: string;
}

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 font-bold text-sm uppercase tracking-widest ${
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}
  >
    {type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
    {message}
    <button onClick={onClose} className="ml-4 hover:opacity-70"><X size={16} /></button>
  </motion.div>
);

const Sidebar = ({ activePage, setActivePage, isAdmin, isOpen, setIsOpen }: { activePage: Page, setActivePage: (p: Page) => void, isAdmin: boolean, isOpen: boolean, setIsOpen: (o: boolean) => void }) => {
  const menuItems: { icon: React.ReactNode, label: string, id: Page }[] = [
    { icon: <Home size={18} />, label: "Home", id: 'new-order' },
    { icon: <ShoppingCart size={18} />, label: "New order", id: 'new-order' },
    { icon: <ListOrdered size={18} />, label: "Orders", id: 'orders' },
    { icon: <TicketIcon size={18} />, label: "Ticket [AI Support] 🤖", id: 'tickets' },
    { icon: <LayoutGrid size={18} />, label: "Services", id: 'services' },
    { icon: <Repeat size={18} />, label: "Subscriptions", id: 'subscriptions' },
    { icon: <RefreshCw size={18} />, label: "Refill", id: 'refill' },
    { icon: <Layers size={18} />, label: "Mass order", id: 'mass-order' },
    { icon: <Wallet size={18} />, label: "Add funds", id: 'add-funds' },
    { icon: <CreditCard size={18} />, label: "Transactions", id: 'transactions' },
    { icon: <Bell size={18} />, label: "Updates", id: 'updates' },
  ];

  if (isAdmin) {
    menuItems.push({ icon: <ShieldCheck size={18} />, label: "Admin Panel", id: 'admin' });
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`w-64 bg-smm-sidebar h-screen fixed left-0 top-0 flex flex-col p-4 overflow-y-auto z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col items-center mb-8 cursor-pointer" onClick={() => { setActivePage('new-order'); setIsOpen(false); }}>
          <div className="w-16 h-16 mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500 fill-current">
              <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10 Z M50 20 C65 20 75 30 75 45 C75 60 65 70 50 70 C35 70 25 60 25 45 C25 30 35 20 50 20 Z" />
              <path d="M45 40 L55 40 L50 50 Z" />
            </svg>
          </div>
          <div className="text-center">
            <span className="text-white font-black text-xs tracking-tighter block">LOMBARDI</span>
            <span className="text-blue-400 font-bold text-[10px] tracking-widest uppercase">SERVICES</span>
          </div>
        </div>

        <div className="space-y-1">
          {menuItems.map((item, i) => (
            <div 
              key={i} 
              onClick={() => { setActivePage(item.id); setIsOpen(false); }}
              className={`sidebar-item ${activePage === item.id ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const Header = ({ balance, onLogout, onMenuClick, setActivePage }: { balance: string, onLogout: () => void, onMenuClick: () => void, setActivePage: (p: Page) => void }) => {
  return (
    <div className="fixed top-0 right-0 left-0 lg:left-64 h-16 flex items-center justify-between lg:justify-end px-4 lg:px-8 z-40 bg-smm-bg/50 backdrop-blur-sm">
      <button onClick={onMenuClick} className="lg:hidden p-2 text-white bg-smm-sidebar rounded-lg">
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-4 lg:gap-6">
        <div 
          onClick={() => setActivePage('add-funds')}
          className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium cursor-pointer border border-white/10 hover:bg-white/20 transition-all"
        >
          <Wallet size={14} className="text-emerald-400" />
          <span className="text-white">${balance}</span>
          <Plus size={14} className="text-slate-400" />
        </div>
        <button 
          onClick={() => setActivePage('profile')}
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:flex items-center gap-2"
        >
          <User size={16} />
          Account
        </button>
        <button 
          onClick={onLogout}
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2"
        >
          <LogIn size={16} className="rotate-180" />
          Logout
        </button>
      </div>
    </div>
  );
};

const Services = ({ services }: { services: Service[] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toString().includes(searchTerm) ||
    (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Services" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Rate per 1000</th>
                <th className="px-6 py-4">Min order</th>
                <th className="px-6 py-4">Max order</th>
                <th className="px-6 py-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
              {filteredServices.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold">{s.id}</td>
                  <td className="px-6 py-4 font-semibold">{s.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600">{s.category || 'Other'}</span>
                  </td>
                  <td className="px-6 py-4 text-blue-600 font-bold">{s.rate}</td>
                  <td className="px-6 py-4">{s.min}</td>
                  <td className="px-6 py-4">{s.max}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MassOrder = ({ services, uid, balance, totalSpent }: { services: Service[], uid: string, balance: string, totalSpent: string }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length === 0) return;

    setLoading(true);
    let totalCharge = 0;
    const ordersToPlace = [];

    for (const line of lines) {
      const [serviceId, link, quantity] = line.split('|').map(s => s.trim());
      const service = services.find(s => s.id === parseInt(serviceId));
      if (!service || !link || !quantity) continue;

      const qty = parseInt(quantity);
      const rate = parseFloat(service.rate.replace('$', ''));
      const charge = parseFloat((rate * qty / 1000).toFixed(2));
      totalCharge += charge;

      ordersToPlace.push({
        id: Math.floor(10000000 + Math.random() * 90000000).toString(),
        uid,
        serviceId: service.id,
        service: `${service.id} — ${service.name}`,
        link,
        quantity: qty,
        charge: charge.toFixed(2),
        status: "Pending",
        createdAt: serverTimestamp()
      });
    }

    if (parseFloat(balance) < totalCharge) {
      alert(`Insufficient balance. Total charge for these orders is $${totalCharge.toFixed(2)}`);
      setLoading(false);
      return;
    }

    try {
      // Place orders
      for (const order of ordersToPlace) {
        await setDoc(doc(db, 'orders', order.id), order);
      }

      // Deduct balance and update totalSpent
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        balance: parseFloat((parseFloat(balance) - totalCharge).toFixed(4)),
        totalSpent: parseFloat((parseFloat(totalSpent) + totalCharge).toFixed(4))
      });

      alert(`${ordersToPlace.length} orders placed successfully!`);
      setText('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders/mass');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <label className="block text-smm-text-dark font-bold text-sm mb-4">One order per line in format</label>
        <textarea 
          rows={10} 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="service_id | link | quantity"
          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm mb-6"
        />
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-smm-sidebar text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

const Updates = () => {
  const updates = [
    { id: 4133, service: "Tiktok Followers [Speed : 30k/D] [High Quality] [Cancel Button] [Non Drop] [30Day Refill ♻️]", date: "2026-03-20", update: "Rate increased from $183.73 to $189.80" },
    { id: 2970, service: "Threads Shares [Real] [Refill: No] [Max: 500] [Start Time: 0-3 Hours] [Speed: Up to 500/Day]", date: "2026-03-20", update: "Rate decreased from $3820.99 to $748.57" },
    { id: 2967, service: "Threads Reshare [Refill: 30D] [Max: 5K] [Start Time: 0-3 Hours] [Speed: Up to 5K/Day]", date: "2026-03-20", update: "Rate increased from $1247.41 to $1247.62" },
    { id: 2967, service: "Threads Reshare [Refill: 30D] [Max: 5K] [Start Time: 0-3 Hours] [Speed: Up to 5K/Day]", date: "2026-03-20", update: "Service enabled" },
    { id: 2962, service: "Threads Likes [Refill: 30D] [Max: 50K] [Start Time: 0-3 Hours] [Speed: Up to 50K/Day]", date: "2026-03-20", update: "Service enabled" },
    { id: 2966, service: "Threads Followers [Refill: 30D] [Max: 10K] [Start Time: 0-3 Hours] [Speed: Up to 10K/Day]", date: "2026-03-20", update: "Service enabled" },
    { id: 3343, service: "Instagram Followers [R365♻️] [Speed - 100K+/Day🚀🔥] [Quality - Good ⭐] [Refill Button Working]", date: "2026-03-20", update: "Rate increased from $94.06 to $94.35" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="bg-smm-sidebar text-white px-4 py-2 rounded-lg text-xs font-bold">All</div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none" />
          </div>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"><Search size={18} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
              {updates.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">{u.id}</span>
                      <span className="font-semibold">{u.service}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.date}</td>
                  <td className="px-6 py-4">{u.update}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon, color, onClick }: { icon: React.ReactNode, color: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform border border-slate-200 bg-white shadow-sm`} 
    style={{ color }}
  >
    {icon}
  </div>
);

const NewOrder = ({ setActivePage, balance, totalSpent, services, username, uid, orders }: { setActivePage: (p: Page) => void, balance: string, totalSpent: string, services: Service[], username: string, uid: string, orders: any[] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(services[0]?.category || 'Instagram Followers');
  const [selectedService, setSelectedService] = useState<Service | null>(services.find(s => s.category === selectedCategory) || services[0] || null);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = Array.from(new Set(services.map(s => s.category || 'Other')));

  const filteredServices = services.filter(s => 
    s.category === selectedCategory && 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toString().includes(searchTerm))
  );

  useEffect(() => {
    const firstServiceInCategory = services.find(s => s.category === selectedCategory);
    if (firstServiceInCategory) {
      setSelectedService(firstServiceInCategory);
    }
  }, [selectedCategory, services]);

  const handleSubmit = async () => {
    if (!selectedService || !link || !quantity) {
      alert('Please fill all fields');
      return;
    }
    
    const qty = parseInt(quantity);
    const rate = parseFloat(selectedService.rate.replace('$', ''));
    const charge = parseFloat((rate * qty / 1000).toFixed(2));

    if (parseFloat(balance) < charge) {
      alert('Insufficient balance. Please add funds.');
      return;
    }

    const orderId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const path = 'orders';
    
    try {
      await setDoc(doc(db, path, orderId), {
        id: orderId,
        uid: uid,
        serviceId: selectedService.id,
        service: `${selectedService.id} — ${selectedService.name}`,
        link,
        quantity: qty,
        charge,
        status: "Pending",
        createdAt: serverTimestamp()
      });

      // Deduct balance and update totalSpent
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        balance: parseFloat((parseFloat(balance) - charge).toFixed(4)),
        totalSpent: parseFloat((parseFloat(totalSpent) + charge).toFixed(4))
      });

      setLastOrderId(orderId);
      setShowSuccess(true);
      setLink('');
      setQuantity('');
      
      // Auto hide success after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold tracking-tight inline-flex items-center gap-2 border-b-2 border-white pb-1">
          🤝 OUR BELIEVE - QUALITY OVER QUANTITY 🤝
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 flex items-center gap-6 shadow-xl">
          <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-smm-text-dark">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-smm-text-dark font-black text-2xl leading-none mb-1">{username}</h3>
            <p className="text-slate-500 text-sm font-medium">Welcome to panel!</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 flex items-center gap-6 shadow-xl">
          <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-smm-text-dark">
            <BarChart3 size={32} />
          </div>
          <div>
            <h3 className="text-smm-text-dark font-black text-2xl leading-none mb-1">${totalSpent}</h3>
            <p className="text-slate-500 text-sm font-medium">Spent balance</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 flex items-center gap-6 shadow-xl">
          <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-smm-text-dark">
            <CreditCard size={32} />
          </div>
          <div>
            <h3 className="text-smm-text-dark font-black text-2xl leading-none mb-1">${balance}</h3>
            <p className="text-slate-500 text-sm font-medium">To Add more Fund <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => setActivePage('add-funds')}>CLICK HERE</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-8 flex items-center justify-between shadow-lg cursor-pointer hover:bg-slate-50 transition-colors">
        <span className="text-red-600 font-black text-xs tracking-widest uppercase">THINGS TO BE KNOWN BEFORE PLACING ORDER</span>
        <Plus size={20} className="text-smm-text-dark" />
      </div>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500 text-white p-4 rounded-2xl mb-8 flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} />
            <div>
              <p className="font-black text-sm uppercase tracking-tight">Order Placed Successfully!</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Order ID: {lastOrderId}</p>
            </div>
          </div>
          <button onClick={() => setShowSuccess(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 lg:p-8 shadow-2xl">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 lg:gap-4 mb-8">
            <SocialIcon icon={<InstagramIcon size={20} />} color="#ec4899" onClick={() => setSelectedCategory('Instagram Followers [Guaranteed♻️]')} />
            <SocialIcon icon={<Music size={20} />} color="#10b981" onClick={() => setSelectedCategory('Tiktok Followers')} />
            <SocialIcon icon={<YoutubeIcon size={20} />} color="#ef4444" onClick={() => setSelectedCategory('Real Ads YouTube Views ❤️‍🔥🔥')} />
            <SocialIcon icon={<FacebookIcon size={20} />} color="#1d4ed8" onClick={() => setSelectedCategory('Facebook Page Likes+Followers')} />
            <SocialIcon icon={<TwitterIcon size={20} />} color="#000000" onClick={() => setSelectedCategory('🐥Twitter Follower')} />
            <SocialIcon icon={<Send size={20} />} color="#38bdf8" onClick={() => setSelectedCategory('TELEGRAM MEMBERS [NON DROP]✅')} />
            <SocialIcon icon={<Menu size={20} />} color="#6366f1" onClick={() => setSelectedCategory('Other')} />
          </div>

          <div className="space-y-6">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search services in this category..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
              </div>
              <button 
                onClick={() => {
                  // Trigger search (already real-time, but good for UX)
                  const input = document.querySelector('input[placeholder="Search services in this category..."]') as HTMLInputElement;
                  if (input) input.focus();
                }}
                className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Search size={16} />
                Search
              </button>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold appearance-none"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  value={selectedCategory}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Service</label>
              <div className="relative group">
                <select 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold appearance-none"
                  onChange={(e) => {
                    const s = services.find(serv => serv.id === parseInt(e.target.value));
                    if (s) setSelectedService(s);
                  }}
                  value={selectedService?.id || ''}
                >
                  {filteredServices.length > 0 ? (
                    filteredServices.map(s => (
                      <option key={s.id} value={s.id}>{s.id} - {s.name} - {s.rate}</option>
                    ))
                  ) : (
                    <option disabled>No services found in this category</option>
                  )}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              {services.length === 0 && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold uppercase tracking-tight flex items-center gap-3">
                  <AlertTriangle size={18} />
                  <span>No services found. If you are an admin, please go to Admin Panel &gt; Services and click "Seed Bulk Services".</span>
                </div>
              )}
            </div>
            {selectedService && (
              <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Service Details</p>
                <div className="text-sm text-blue-900 font-medium leading-relaxed whitespace-pre-line">
                  {selectedService.description || `Min: ${selectedService.min} | Max: ${selectedService.max} | Rate: ${selectedService.rate} per 1000`}
                </div>
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Link</label>
              <input 
                type="text" 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://www.instagram.com/username" 
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Quantity</label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Min: ${selectedService?.min || 0} - Max: ${selectedService?.max || 0}`} 
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
              />
            </div>
            <button 
              onClick={handleSubmit}
              className="w-full py-4 bg-smm-sidebar text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Submit Order
            </button>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl h-full">
            <h3 className="text-smm-text-dark font-bold text-lg mb-4">What is SMM Panel?</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              <span className="font-black">SMM Panel</span> is used to access Social Networks, and making use of it for profits. You can use the <span className="font-black">SMM Panel</span> to get your marketing move on to the next stage of developing plans for your product or services. The social media used includes Facebook, twitter, Instagram, YouTube, LinkedIn and more. With <span className="font-black">Lombardi Services</span> you can grow your business rapidly. Buy Best SMM Panel Services from us and grow your business. <span className="font-black">Lombardi Services</span> is the best and most reliable SMM panel in the market.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = ({ setActivePage, orders, uid }: { setActivePage: (p: Page) => void, orders: any[], uid: string }) => {
  const tabs = ["All", "Pending", "In progress", "Completed", "Partial", "Processing", "Canceled"];
  const [activeTab, setActiveTab] = useState("All");

  const filteredOrders = activeTab === "All" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const handleRefill = async (order: any) => {
    if (order.status !== 'Completed') {
      alert('Only completed orders can be refilled.');
      return;
    }

    const refillId = Math.floor(1000000 + Math.random() * 9000000).toString();
    const refillData = {
      id: refillId,
      uid: uid,
      orderId: order.id,
      service: order.service,
      link: order.link,
      status: 'Pending',
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'refills', refillId), refillData);
      alert('Refill request submitted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `refills/${refillId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-xl flex items-center justify-center">
        <span className="text-smm-text-dark font-black text-sm tracking-tight">
          HAVING ANY ISSUE IN ORDERS? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => setActivePage('tickets')}>CLICK HERE TO SEND TICKET</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-smm-sidebar text-white' : 'bg-white text-smm-text-dark border border-slate-200 hover:bg-slate-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Link</th>
                <th className="px-6 py-4">Charge</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">{row.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.createdAt instanceof Timestamp ? row.createdAt.toDate().toLocaleString() : row.createdAt?.toString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-blue-600 truncate max-w-[150px]">{row.link}</td>
                    <td className="px-6 py-4 text-blue-600 font-bold">${row.charge}</td>
                    <td className="px-6 py-4">{row.quantity}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate">{row.service}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        row.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                        row.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                        row.status === 'Canceled' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {row.status === 'Completed' && (
                        <button 
                          onClick={() => handleRefill(row)}
                          className="bg-smm-sidebar text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-blue-700 transition-colors"
                        >
                          Refill
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Tickets = ({ tickets, uid }: { tickets: any[], uid: string }) => {
  const [subject, setSubject] = useState('Auto Support [AI 🤖]');
  const [subcategory, setSubcategory] = useState('Speed Up');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    const ticketId = Math.floor(10000 + Math.random() * 90000).toString();
    const path = 'tickets';
    
    try {
      await setDoc(doc(db, path, ticketId), {
        id: ticketId,
        uid: uid,
        subject: subcategory || subject,
        message,
        orderId,
        status: "Open",
        createdAt: serverTimestamp()
      });
      
      setMessage('');
      setOrderId('');
      alert('Ticket submitted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold appearance-none"
            >
              <option>Auto Support [AI 🤖]</option>
              <option>Order</option>
              <option>Payment</option>
              <option>Service</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Subcategory</label>
            <select 
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold appearance-none"
            >
              <option>Speed Up</option>
              <option>Refill</option>
              <option>Cancellation</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Order Id</label>
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Message</label>
            <textarea 
              rows={6} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" 
            />
          </div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold cursor-pointer hover:underline">
            <Paperclip size={14} />
            <span>Attach files</span>
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full py-4 bg-smm-sidebar text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Submit ticket
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none" 
            />
          </div>
          <button 
            onClick={() => {
              const input = document.querySelector('input[placeholder="Search tickets..."]') as HTMLInputElement;
              if (input) input.focus();
            }}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last update</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-smm-text-dark">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">{ticket.id}</td>
                    <td className="px-6 py-4">{ticket.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-700' : 
                        ticket.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {ticket.createdAt instanceof Timestamp ? ticket.createdAt.toDate().toLocaleString() : ticket.createdAt?.toString() || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center py-12">
                  <td colSpan={4} className="py-12 text-slate-400 text-sm font-medium italic">No tickets found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Subscriptions = () => {
  const tabs = ["All", "Pending", "Active", "Completed", "Canceled", "Expired"];
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState('');

  const subscriptions = [
    { id: "58293", date: "2026-03-18 10:22:45", service: "4680 — Instagram Followers [Refill - 30Days ♻️]", link: "https://instagram.com/user", quantity: "100", posts: "0/10", status: "Active" },
    { id: "58112", date: "2026-03-15 14:10:12", service: "4569 — TikTok Followers [OPEN LIVE STREAM]", link: "https://tiktok.com/@user", quantity: "500", posts: "5/5", status: "Completed" },
  ];

  const filteredSubscriptions = (activeTab === "All" 
    ? subscriptions 
    : subscriptions.filter(s => s.status === activeTab)
  ).filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.link.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-smm-sidebar text-white' : 'bg-white text-smm-text-dark border border-slate-200 hover:bg-slate-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Link</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Posts</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">{row.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate">{row.service}</td>
                    <td className="px-6 py-4 text-blue-600 truncate max-w-[150px]">{row.link}</td>
                    <td className="px-6 py-4">{row.quantity}</td>
                    <td className="px-6 py-4">{row.posts}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        row.status === 'Active' ? 'bg-blue-100 text-blue-600' : 
                        row.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">No subscriptions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Refill = ({ refills }: { refills: any[] }) => {
  const tabs = ["All", "Pending", "In progress", "Completed", "Rejected", "Error"];
  const [activeTab, setActiveTab] = useState("All");

  const filteredData = activeTab === "All" 
    ? refills 
    : refills.filter(r => r.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-smm-sidebar text-white' : 'bg-white text-smm-text-dark border border-slate-200 hover:bg-slate-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Link</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
              {filteredData.length > 0 ? (
                filteredData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">{row.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.createdAt instanceof Timestamp ? row.createdAt.toDate().toLocaleString() : row.createdAt?.toString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-blue-600 font-bold">{row.orderId}</td>
                    <td className="px-6 py-4 text-blue-600 truncate max-w-[150px]">{row.link}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate">{row.service}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        row.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                        row.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                        row.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No refill history found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Transactions = ({ transactions }: { transactions: any[] }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <h2 className="text-smm-text-dark font-black text-2xl mb-8 uppercase tracking-tight">Transaction History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
              {transactions.length > 0 ? (
                transactions.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-blue-600">{t.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {t.createdAt instanceof Timestamp ? t.createdAt.toDate().toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-600">+${t.amount?.toFixed(2)}</td>
                    <td className="px-6 py-4 uppercase tracking-widest text-[10px] font-black">{t.method}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded text-[10px] font-bold">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Profile = ({ username, uid, balance, totalSpent, memberSince }: { username: string, uid: string, balance: string, totalSpent: string, memberSince: string }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-black">
            {username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-smm-text-dark font-black text-2xl uppercase tracking-tight">{username}</h2>
            <p className="text-slate-400 font-bold">{auth.currentUser?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Balance</p>
            <h4 className="text-3xl font-black text-blue-600">${balance}</h4>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Spent</p>
            <h4 className="text-3xl font-black text-emerald-600">${totalSpent}</h4>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <h3 className="text-smm-text-dark font-black text-lg uppercase tracking-tight border-b border-slate-100 pb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
              <input type="text" readOnly value={username} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input type="text" readOnly value={auth.currentUser?.email || ''} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Member Since</label>
              <input type="text" readOnly value={memberSince} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Timezone</label>
              <input type="text" readOnly value="UTC" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const AddFunds = ({ 
  uid, 
  showToast,
  paypalError
}: { 
  uid: string, 
  showToast: (m: string, t: 'success' | 'error') => void,
  paypalError: boolean
}) => {
  const [method, setMethod] = useState<'paypal' | 'crypto'>('paypal');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCryptoPayment = async () => {
    if (!amount || parseFloat(amount) < 5) {
      showToast('Minimum amount is $5', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulate crypto payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transactionId = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Add transaction record
      await addDoc(collection(db, 'transactions'), {
        uid,
        amount: parseFloat(amount),
        method: 'crypto',
        status: 'Completed',
        id: transactionId,
        createdAt: serverTimestamp()
      });

      // Update user balance
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const currentBalance = userDoc.data().balance || 0;
        await updateDoc(userRef, {
          balance: currentBalance + parseFloat(amount)
        });
      }

      showToast(`Successfully added $${amount} to your balance via Crypto!`, 'success');
      setAmount('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'transactions');
      showToast('Payment failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onPayPalSuccess = async (details: any) => {
    try {
      const amountPaid = details.purchase_units[0].amount.value;
      const transactionId = details.id;

      // Add transaction record
      await addDoc(collection(db, 'transactions'), {
        uid,
        amount: parseFloat(amountPaid),
        method: 'paypal',
        status: 'Completed',
        id: transactionId,
        createdAt: serverTimestamp()
      });

      // Update user balance
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const currentBalance = userDoc.data().balance || 0;
        await updateDoc(userRef, {
          balance: currentBalance + parseFloat(amountPaid)
        });
      }

      showToast(`Successfully added $${amountPaid} to your balance via PayPal!`, 'success');
      setAmount('');
    } catch (error) {
      console.error("PayPal processing error", error);
      showToast('Failed to update balance. Please contact support.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <h2 className="text-smm-text-dark font-black text-2xl mb-8 text-center uppercase tracking-tight">Add Funds</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setMethod('paypal')}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${method === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
              <CreditCard size={28} />
            </div>
            <span className="text-smm-text-dark font-bold">PayPal</span>
          </button>
          <button 
            onClick={() => setMethod('crypto')}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${method === 'crypto' ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500">
              <Bitcoin size={28} />
            </div>
            <span className="text-smm-text-dark font-bold">Crypto</span>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" 
                className="w-full pl-8 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-lg" 
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 ml-1 font-bold uppercase tracking-widest">Minimum deposit: $5.00</p>
          </div>

          {method === 'paypal' ? (
            <div className="mt-4">
              {paypalError ? (
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                  <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
                  <h4 className="text-red-600 font-black text-xs uppercase tracking-widest mb-2">PayPal Error</h4>
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">
                    The PayPal payment system failed to load. This is likely due to an invalid PayPal Client ID. 
                    Please contact support or use Crypto instead.
                  </p>
                </div>
              ) : (!amount || parseFloat(amount) < 5) ? (
                <button 
                  disabled
                  className="w-full py-5 bg-slate-200 text-slate-400 font-black text-sm uppercase tracking-widest rounded-2xl cursor-not-allowed"
                >
                  Enter amount to pay with PayPal
                </button>
              ) : (
                <PayPalButtons 
                  style={{ layout: "vertical", shape: "rect", label: "pay" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: amount,
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    const details = await actions.order?.capture();
                    onPayPalSuccess(details);
                  }}
                  onError={(err) => {
                    console.error("PayPal Error", err);
                    showToast("PayPal checkout failed. Please try again.", "error");
                  }}
                />
              )}
            </div>
          ) : (
            <button 
              onClick={handleCryptoPayment}
              disabled={loading}
              className="w-full py-5 bg-smm-sidebar text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Bitcoin size={20} />
                  Pay with Crypto
                </>
              )}
            </button>
          )}

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-smm-text-dark font-black text-xs uppercase tracking-widest mb-3">Instructions:</h4>
            <ul className="text-[11px] text-slate-500 font-bold space-y-2 uppercase tracking-wide">
              <li>• Funds are added automatically after payment confirmation.</li>
              <li>• PayPal payments may take up to 5 minutes to reflect.</li>
              <li>• Crypto payments require 3 network confirmations.</li>
              <li>• Contact support if funds are not added within 1 hour.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ 
  services, 
  orders, 
  tickets,
  refills,
  users,
  showToast
}: { 
  services: Service[], 
  orders: any[],
  tickets: any[],
  refills: any[],
  users: any[],
  showToast: (msg: string, type: 'success' | 'error') => void
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'orders' | 'tickets' | 'refills' | 'users'>('dashboard');
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState('');
  const [newMin, setNewMin] = useState('');
  const [newMax, setNewMax] = useState('');
  const [newCategory, setNewCategory] = useState('Instagram Followers');
  const [newDescription, setNewDescription] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const totalRevenue = orders.reduce((acc, curr) => acc + parseFloat(curr.charge || 0), 0).toFixed(2);

  const [serviceSearch, setServiceSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || 
    s.id.toString().includes(serviceSearch) ||
    (s.category && s.category.toLowerCase().includes(serviceSearch.toLowerCase()))
  );

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.id?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
    o.service.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.status.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredTickets = tickets.filter(t => 
    t.id.toLowerCase().includes(ticketSearch.toLowerCase()) || 
    t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
    t.status.toLowerCase().includes(ticketSearch.toLowerCase())
  );

  const handleSeedBulk = async () => {
    setIsSeeding(true);
    try {
      await seedBulkServices();
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRate || !newMin || !newMax) return;

    const serviceId = Math.floor(1000 + Math.random() * 9000).toString();
    const newService = {
      id: parseInt(serviceId),
      name: newName,
      rate: `$${newRate}`,
      min: parseInt(newMin),
      max: parseInt(newMax),
      category: newCategory,
      description: newDescription,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'services', serviceId), newService);
      setNewName('');
      setNewRate('');
      setNewMin('');
      setNewMax('');
      setNewDescription('');
      alert('Service added successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `services/${serviceId}`);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', id.toString()));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
      }
    }
  };

  const updateServiceRate = async (serviceId: number, newRate: string) => {
    if (!newRate) return;
    const formattedRate = newRate.startsWith('$') ? newRate : `$${newRate}`;
    try {
      await updateDoc(doc(db, 'services', serviceId.toString()), { rate: formattedRate });
      alert('Price updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `services/${serviceId}`);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tickets/${ticketId}`);
    }
  };

  const updateRefillStatus = async (refillId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'refills', refillId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `refills/${refillId}`);
    }
  };

  const updateUserBalance = async (userId: string, newBalance: number, addedAmount?: number) => {
    try {
      await updateDoc(doc(db, 'users', userId), { balance: newBalance });
      
      if (addedAmount !== undefined) {
        // Add a transaction record for the balance update
        await addDoc(collection(db, 'transactions'), {
          uid: userId,
          amount: addedAmount,
          method: 'Admin Adjustment',
          status: 'completed',
          createdAt: serverTimestamp(),
          type: addedAmount >= 0 ? 'deposit' : 'withdrawal'
        });
      }
      
      showToast(addedAmount !== undefined ? `Added $${addedAmount.toFixed(2)} to user balance!` : 'User balance updated!', "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteDoc(doc(db, 'orders', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `orders/${id}`);
      }
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteDoc(doc(db, 'tickets', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `tickets/${id}`);
      }
    }
  };

  const handleDeleteRefill = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this refill request?')) {
      try {
        await deleteDoc(doc(db, 'refills', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `refills/${id}`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-3xl shadow-xl gap-4">
        <h2 className="text-smm-text-dark font-black text-2xl uppercase tracking-tight">Admin Control Center</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleSeedBulk}
            disabled={isSeeding}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest flex items-center gap-2 ${isSeeding ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg hover:shadow-xl'}`}
          >
            {isSeeding ? (
              <>
                <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Seeding...
              </>
            ) : (
              <>
                <Database size={14} />
                Seed Bulk Services
              </>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'services' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Services
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'tickets' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Tickets
          </button>
          <button 
            onClick={() => setActiveTab('refills')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'refills' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Refills
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Users
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-blue-500">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Orders</p>
            <h4 className="text-3xl font-black text-smm-text-dark">{orders.length}</h4>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-emerald-500">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue</p>
            <h4 className="text-3xl font-black text-smm-text-dark">${totalRevenue}</h4>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-orange-500">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Tickets</p>
            <h4 className="text-3xl font-black text-smm-text-dark">{tickets.filter(t => t.status === 'Pending').length}</h4>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-purple-500">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Services</p>
            <h4 className="text-3xl font-black text-smm-text-dark">{services.length}</h4>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <>
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-smm-text-dark font-black text-lg mb-6 uppercase tracking-tight">Add New Service</h3>
            <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Service Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Instagram Followers"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Instagram Followers">Instagram Followers</option>
                  <option value="TikTok Followers">TikTok Followers</option>
                  <option value="YouTube Views">YouTube Views</option>
                  <option value="Facebook Likes">Facebook Likes</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Rate per 1000 ($)</label>
                <input 
                  type="text" 
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="e.g. 15.50"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Min</label>
                  <input 
                    type="number" 
                    value={newMin}
                    onChange={(e) => setNewMin(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Max</label>
                  <input 
                    type="number" 
                    value={newMax}
                    onChange={(e) => setNewMax(e.target.value)}
                    placeholder="10000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Service Description</label>
                <textarea 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter service details, quality, speed, etc."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" 
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:col-span-4">
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                >
                  Add Service
                </button>
                <button 
                  type="button"
                  onClick={handleSeedBulk}
                  disabled={isSeeding}
                  className={`flex-1 py-4 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${isSeeding ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {isSeeding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Seeding...
                    </>
                  ) : (
                    <>
                      <Database size={16} />
                      Seed Bulk Services
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-smm-text-dark font-bold">Current Services ({filteredServices.length})</h3>
              <div className="flex items-center gap-2 w-full sm:max-w-xs">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search services..." 
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </div>
                <button 
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Search services..."]') as HTMLInputElement;
                    if (input) input.focus();
                  }}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Rate</th>
                    <th className="px-6 py-4">Min/Max</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
                  {filteredServices.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold">{s.id}</td>
                      <td className="px-6 py-4 font-semibold">{s.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600">{s.category || 'Other'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative flex items-center">
                            <span className="absolute left-2 text-slate-400 font-bold">$</span>
                            <input 
                              type="text" 
                              id={`rate-${s.id}`}
                              defaultValue={s.rate.replace('$', '')}
                              className="w-24 pl-5 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const input = document.getElementById(`rate-${s.id}`) as HTMLInputElement;
                              updateServiceRate(s.id, input.value);
                            }}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Save Price"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">{s.min} / {s.max}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteService(s.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-smm-text-dark font-bold">Manage Orders ({filteredOrders.length})</h3>
            <div className="flex items-center gap-2 w-full sm:max-w-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
              </div>
              <button 
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Search orders..."]') as HTMLInputElement;
                  if (input) input.focus();
                }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Charge</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">{o.id}</td>
                      <td className="px-6 py-4 truncate max-w-[200px]">{o.service}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">${o.charge}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          o.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                          o.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                          o.status === 'Canceled' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => updateOrderStatus(o.id, 'Completed')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Complete"><CheckCircle2 size={16} /></button>
                        <button onClick={() => updateOrderStatus(o.id, 'Pending')} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Pending"><Clock size={16} /></button>
                        <button onClick={() => updateOrderStatus(o.id, 'Canceled')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Cancel"><XCircle size={16} /></button>
                        <button onClick={() => handleDeleteOrder(o.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-smm-text-dark font-bold">Manage Tickets ({filteredTickets.length})</h3>
            <div className="flex items-center gap-2 w-full sm:max-w-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
              </div>
              <button 
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Search tickets..."]') as HTMLInputElement;
                  if (input) input.focus();
                }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">{t.id}</td>
                    <td className="px-6 py-4">{t.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        t.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => updateTicketStatus(t.id, 'Closed')} className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg" title="Close"><XCircle size={16} /></button>
                      <button onClick={() => updateTicketStatus(t.id, 'Pending')} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Pending"><Clock size={16} /></button>
                      <button onClick={() => handleDeleteTicket(t.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No tickets found</td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'refills' && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-smm-text-dark font-bold mb-4">Manage Refills</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Link</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
                {refills.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold">{r.id}</td>
                    <td className="px-6 py-4 text-blue-600 font-bold">{r.orderId}</td>
                    <td className="px-6 py-4 truncate max-w-[200px]">{r.link}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        r.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                        r.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                        r.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => updateRefillStatus(r.id, 'Completed')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Complete"><CheckCircle2 size={16} /></button>
                      <button onClick={() => updateRefillStatus(r.id, 'In progress')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="In progress"><Clock size={16} /></button>
                      <button onClick={() => updateRefillStatus(r.id, 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Reject"><XCircle size={16} /></button>
                      <button onClick={() => handleDeleteRefill(r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-smm-text-dark font-bold">Manage Users ({filteredUsers.length})</h3>
            <div className="flex items-center gap-2 w-full sm:max-w-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
              </div>
              <button 
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Search users..."]') as HTMLInputElement;
                  if (input) input.focus();
                }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold">{u.username}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4 font-black text-blue-600">${(u.balance || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] text-slate-400 uppercase font-black">Add Funds</span>
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              placeholder="Amount"
                              className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] outline-none focus:ring-1 focus:ring-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = (e.target as HTMLInputElement).value;
                                  if (val) {
                                    const amount = parseFloat(val);
                                    updateUserBalance(u.id, (u.balance || 0) + amount, amount);
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }
                              }}
                            />
                            <button 
                              onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                const val = input.value;
                                if (val) {
                                  const amount = parseFloat(val);
                                  updateUserBalance(u.id, (u.balance || 0) + amount, amount);
                                  input.value = '';
                                }
                              }}
                              className="p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                              title="Add Funds"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="h-8 w-px bg-slate-100 mx-1" />
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] text-slate-400 uppercase font-black">Set Total</span>
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              placeholder="New Total"
                              className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] outline-none focus:ring-1 focus:ring-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = (e.target as HTMLInputElement).value;
                                  if (val) {
                                    updateUserBalance(u.id, parseFloat(val));
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }
                              }}
                            />
                            <button 
                              onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                if (input.value) {
                                  updateUserBalance(u.id, parseFloat(input.value));
                                  input.value = '';
                                }
                              }}
                              className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              title="Set Balance"
                            >
                              <CheckCircle2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const LoginPanel = ({ onLogin, showToast }: { onLogin: () => void, showToast: (msg: string, type: 'success' | 'error') => void }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onLogin();
    } catch (error: any) {
      console.error("Auth failed", error);
      let msg = "Authentication failed. Please try again.";
      if (error.code === 'auth/user-not-found') msg = "User not found. Please register.";
      if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (error.code === 'auth/email-already-in-use') msg = "Email already in use.";
      if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      if (error.code === 'auth/invalid-email') msg = "Invalid email address.";
      if (error.code === 'auth/operation-not-allowed') msg = "Email/Password login is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.";
      if (error.code === 'auth/unauthorized-domain') {
        msg = "This domain is not authorized. Please add these to 'Authorized domains' in Firebase Console: " + 
              window.location.hostname + ", lombardiservice.netlify.app";
      }
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-smm-bg flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500 fill-current">
              <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10 Z M50 20 C65 20 75 30 75 45 C75 60 65 70 50 70 C35 70 25 60 25 45 C25 30 35 20 50 20 Z" />
              <path d="M45 40 L55 40 L50 50 Z" />
            </svg>
          </div>
          <h1 className="text-smm-text-dark font-black text-3xl tracking-tighter uppercase">LOMBARDI SMM</h1>
          <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mt-1">v4.1 - ENHANCED AUTH FLOW</p>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">{isRegistering ? 'Create an account' : 'Welcome back'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                required
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              isRegistering ? 'Sign Up' : 'Sign In'
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
            <span className="bg-white px-4 text-slate-400">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={async () => {
            setLoading(true);
            try {
              await loginWithGoogle();
              onLogin();
            } catch (error: any) {
              console.error("Google login failed", error);
              let msg = `Google login failed: ${error.code || error.message}`;
              if (error.code === 'auth/popup-blocked') msg = "Popup blocked. Please allow popups for this site.";
              if (error.code === 'auth/unauthorized-domain') {
                msg = "This domain is not authorized. Please add these to 'Authorized domains' in Firebase Console: " + 
                      window.location.hostname + ", lombardiservice.netlify.app";
              }
              showToast(msg, 'error');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full py-4 bg-white border-2 border-slate-100 text-smm-text-dark font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const ArrowRight = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [uid, setUid] = useState<string | null>(null);
  const [balance, setBalance] = useState('0.00');
  const [totalSpent, setTotalSpent] = useState('0.00');
  const [memberSince, setMemberSince] = useState('N/A');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page>('new-order');
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [refills, setRefills] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [paypalError, setPaypalError] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      showToast(`System Error: ${event.message}`, "error");
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    console.log("Initializing Auth Listener...");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed. User:", user ? user.email : "None");
      try {
        if (user) {
          setUid(user.uid);
          
          // Set initial username from auth object immediately
          const initialUsername = user.displayName || user.email?.split('@')[0] || 'User';
          setUsername(initialUsername);
          
          // Immediate admin check for UI responsiveness
          const isUserAdmin = (user.email === 'shaikhmubasshir875@gmail.com' || user.email === 'shaikhmubasshir76@gmail.com');
          if (isUserAdmin) setIsAdmin(true);

          // Check if user exists in Firestore, if not create
          const userDocRef = doc(db, 'users', user.uid);
          console.log("Fetching user profile for:", user.uid);
          const userDoc = await getDoc(userDocRef);
          
            if (!userDoc.exists()) {
              console.log("Creating new user profile...");
              const newUser = {
                uid: user.uid,
                email: user.email,
                username: user.displayName || user.email?.split('@')[0] || 'User',
                role: (user.email === 'shaikhmubasshir875@gmail.com' || user.email === 'shaikhmubasshir76@gmail.com') ? 'admin' : 'user',
                balance: 0,
                totalSpent: 0,
                createdAt: Timestamp.now()
              };
              await setDoc(userDocRef, newUser);
              setIsAdmin(newUser.role === 'admin');
              setUsername(newUser.username);
              setBalance('0.0000');
              setTotalSpent('0.0000');
              showToast(`Welcome to Lombardi SMM, ${newUser.username}!`, 'success');
            } else {
            console.log("User profile found.");
            const userData = userDoc.data();
            
            // Ensure admin role is set if email matches
            let role = userData.role;
            if ((user.email === 'shaikhmubasshir875@gmail.com' || user.email === 'shaikhmubasshir76@gmail.com') && role !== 'admin') {
              console.log("Updating role to admin...");
              role = 'admin';
              await updateDoc(userDocRef, { role: 'admin' });
            }
            
            setIsAdmin(role === 'admin');
            
            // If the stored username is generic but we have a display name from Google, update it
            let currentUsername = userData.username || 'User';
            if ((currentUsername === 'User' || currentUsername === 'Guest') && user.displayName) {
              currentUsername = user.displayName;
              await updateDoc(userDocRef, { username: currentUsername });
            }
            
            setUsername(currentUsername);
            setBalance(typeof userData.balance === 'number' ? userData.balance.toFixed(4) : '0.0000');
            setTotalSpent(typeof userData.totalSpent === 'number' ? userData.totalSpent.toFixed(4) : '0.0000');
            setMemberSince(userData.createdAt instanceof Timestamp ? userData.createdAt.toDate().toLocaleDateString() : 'N/A');
          }

          setIsLoggedIn(true);
          setIsProfileLoaded(true);
        } else {
          console.log("No user session found.");
          setIsLoggedIn(false);
          setIsAdmin(false);
          setUid(null);
          setUsername('Guest');
          setBalance('0.0000');
          setTotalSpent('0.0000');
          setIsProfileLoaded(false);
        }
      } catch (error: any) {
        console.error("Auth state change error", error);
        let msg = "Something went wrong during login. Please refresh.";
        if (error.message?.includes('insufficient permissions')) {
          msg = "Permission denied. Your account might be restricted.";
        }
        showToast(msg, 'error');
        // If we have a user but profile fetch failed, we might still want to show the app
        if (user) {
          setIsLoggedIn(true);
          setIsProfileLoaded(true);
          // Username was already set to initialUsername above
        }
      } finally {
        setIsAuthReady(true);
      }
    });

    // Safety timeout for loading state
    const timeout = setTimeout(() => {
      setIsAuthReady(current => {
        if (!current) {
          console.warn("Auth initialization timed out. Forcing ready state.");
          return true;
        }
        return current;
      });
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !isProfileLoaded) return;

    // Real-time services
    const servicesUnsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const servicesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setServices(servicesList);
    }, (error) => {
      console.error("Services snapshot error", error);
      showToast("Failed to load services. Please check your connection.", "error");
    });

    // Real-time orders (if admin see all, if user see only own)
    const ordersQuery = isAdmin 
      ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'orders'), where('uid', '==', uid), orderBy('createdAt', 'desc'));
    
    const ordersUnsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setOrders(ordersList);
    }, (error) => {
      console.error("Orders snapshot error", error);
      showToast("Failed to load orders.", "error");
    });

    // Real-time tickets
    const ticketsQuery = isAdmin
      ? query(collection(db, 'tickets'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'tickets'), where('uid', '==', uid), orderBy('createdAt', 'desc'));

    const ticketsUnsubscribe = onSnapshot(ticketsQuery, (snapshot) => {
      const ticketsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTickets(ticketsList);
    }, (error) => {
      console.error("Tickets snapshot error", error);
      showToast("Failed to load tickets.", "error");
    });

    // Real-time refills
    const refillsQuery = isAdmin
      ? query(collection(db, 'refills'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'refills'), where('uid', '==', uid), orderBy('createdAt', 'desc'));

    const refillsUnsubscribe = onSnapshot(refillsQuery, (snapshot) => {
      const refillsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setRefills(refillsList);
    }, (error) => {
      console.error("Refills snapshot error", error);
      showToast("Failed to load refills.", "error");
    });

    // Real-time users (admin only)
    let usersUnsubscribe = () => {};
    if (isAdmin) {
      usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        setUsers(usersList);
      }, (error) => {
        console.error("Users snapshot error", error);
        showToast("Failed to load users list.", "error");
      });
    }

    // Real-time balance and totalSpent update
    const userUnsubscribe = onSnapshot(doc(db, 'users', uid!), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setBalance(typeof data.balance === 'number' ? data.balance.toFixed(4) : '0.0000');
        setTotalSpent(typeof data.totalSpent === 'number' ? data.totalSpent.toFixed(4) : '0.0000');
        if (data.username) setUsername(data.username);
      }
    }, (error) => {
      console.error("User profile snapshot error", error);
      showToast("Failed to sync profile data.", "error");
    });

    // Real-time transactions
    const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', uid), orderBy('createdAt', 'desc'));
    const transactionsUnsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTransactions(transactionsList);
    }, (error) => {
      console.error("Transactions snapshot error", error);
      showToast("Failed to load transactions.", "error");
    });

    return () => {
      servicesUnsubscribe();
      ordersUnsubscribe();
      ticketsUnsubscribe();
      refillsUnsubscribe();
      transactionsUnsubscribe();
      usersUnsubscribe();
      userUnsubscribe();
    };
  }, [isLoggedIn, isAdmin, uid]);

  // Auto-seed services if admin and empty
  useEffect(() => {
    if (isAdmin && isLoggedIn && isAuthReady && services.length === 0) {
      console.log("Admin detected and no services found. Auto-seeding...");
      seedBulkServices();
    }
  }, [isAdmin, isLoggedIn, isAuthReady, services.length]);

  const handleLogin = () => {
    // Handled by onAuthStateChanged
  };

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      setActivePage('new-order');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-smm-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-smm-bg">
        <LoginPanel onLogin={handleLogin} showToast={showToast} />
        <AnimatePresence>
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'new-order': return <NewOrder setActivePage={setActivePage} balance={balance} totalSpent={totalSpent} services={services} username={username} uid={uid!} orders={orders} />;
      case 'orders': return <Orders setActivePage={setActivePage} orders={orders} uid={uid!} />;
      case 'tickets': return <Tickets tickets={tickets} uid={uid!} />;
      case 'subscriptions': return <Subscriptions />;
      case 'refill': return <Refill refills={refills} />;
      case 'add-funds': return <AddFunds uid={uid!} showToast={showToast} paypalError={paypalError} />;
      case 'transactions': return <Transactions transactions={transactions} />;
      case 'profile': return <Profile username={username} uid={uid!} balance={balance} totalSpent={totalSpent} memberSince={memberSince} />;
      case 'services': return <Services services={services} />;
      case 'mass-order': return <MassOrder services={services} uid={uid!} balance={balance} totalSpent={totalSpent} />;
      case 'updates': return <Updates />;
      case 'admin': return (
        <AdminDashboard 
          services={services} 
          orders={orders} 
          tickets={tickets}
          refills={refills}
          users={users}
          showToast={showToast}
        />
      );
      default: return <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">Coming Soon: {activePage}</div>;
    }
  };

  return (
    <PayPalScriptProvider 
      options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test" }}
      onError={(err) => {
        console.error("PayPal SDK failed to load", err);
        setPaypalError(true);
      }}
    >
      <div className="min-h-screen bg-smm-bg text-white font-sans">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isAdmin={isAdmin} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header 
          balance={balance} 
          onLogout={handleLogout} 
          onMenuClick={() => setIsSidebarOpen(true)}
          setActivePage={setActivePage}
        />
        
        <main className="flex-1 p-4 lg:p-8 pt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* WhatsApp FAB */}
      <div className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer hover:scale-110 transition-transform z-50">
        <MessageCircle size={32} />
      </div>

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
    </PayPalScriptProvider>
  );
}
