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
  Instagram,
  Twitter,
  Facebook,
  Youtube,
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
  Home,
  ExternalLink,
  QrCode
} from "lucide-react";
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
  getDocs,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocFromServer,
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

      <div className={`w-64 bg-white h-screen fixed left-0 top-0 flex flex-col p-4 overflow-y-auto z-50 transition-transform duration-300 border-r border-slate-200 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col items-center mb-8 cursor-pointer" onClick={() => { setActivePage('new-order'); setIsOpen(false); }}>
          <div className="w-16 h-16 mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600 fill-current">
              <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10 Z M50 20 C65 20 75 30 75 45 C75 60 65 70 50 70 C35 70 25 60 25 45 C25 30 35 20 50 20 Z" />
              <path d="M45 40 L55 40 L50 50 Z" />
            </svg>
          </div>
          <div className="text-center">
            <span className="text-smm-dark font-black text-xs tracking-tighter block uppercase">lombardiservices</span>
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
          
          <a 
            href="https://wa.me/message/XRM6CMEHIU5EP1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="sidebar-item sidebar-item-inactive mt-4 text-emerald-600 hover:bg-emerald-50"
          >
            <MessageCircle size={18} />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>
    </>
  );
};

const Header = ({ balance, onLogout, onMenuClick, setActivePage }: { balance: string, onLogout: () => void, onMenuClick: () => void, setActivePage: (p: Page) => void }) => {
  return (
    <div className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 py-1 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-[10px] font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-[10px] font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>
      <div className="h-16 flex items-center justify-between lg:justify-end px-4 lg:px-8">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-smm-dark bg-slate-100 rounded-lg">
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-4 lg:gap-6">
        <a 
          href="https://wa.me/message/XRM6CMEHIU5EP1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold border border-emerald-100 hover:bg-emerald-100 transition-all"
        >
          <MessageCircle size={14} />
          Support
        </a>
        <div 
          onClick={() => setActivePage('add-funds')}
          className="bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold cursor-pointer border border-blue-100 hover:bg-blue-100 transition-all"
        >
          <Wallet size={14} className="text-blue-600" />
          <span className="text-blue-600">${balance}</span>
          <Plus size={14} className="text-blue-400" />
        </div>
        <button 
          onClick={() => setActivePage('profile')}
          className="text-sm font-bold text-slate-500 hover:text-smm-primary transition-colors hidden sm:flex items-center gap-2"
        >
          <User size={16} />
          Account
        </button>
        <button 
          onClick={onLogout}
          className="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2"
        >
          <LogIn size={16} className="rotate-180" />
          Logout
        </button>
      </div>
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
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

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

const MassOrder = ({ services, uid, balance, totalSpent, showToast }: { services: Service[], uid: string, balance: string, totalSpent: string, showToast: (m: string, t: 'success' | 'error') => void }) => {
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
      showToast(`Insufficient balance. Total charge for these orders is $${totalCharge.toFixed(2)}`, 'error');
      setLoading(false);
      return;
    }

    console.log("Placing mass orders:", { count: ordersToPlace.length, totalCharge, uid, balance });

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

      showToast(`${ordersToPlace.length} orders placed successfully!`, 'success');
      setText('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders/mass');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

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
          className="w-full py-4 bg-smm-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

const Updates = ({ updates }: { updates: any[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUpdates = updates.filter(u => 
    u.service?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id?.toString().includes(searchTerm) ||
    u.update?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="bg-smm-primary text-white px-4 py-2 rounded-lg text-xs font-bold">All</div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Updates" 
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
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
              {filteredUpdates.length > 0 ? (
                filteredUpdates.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">{u.id}</span>
                        <span className="font-semibold">{u.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.createdAt instanceof Timestamp ? u.createdAt.toDate().toLocaleDateString() : u.date || 'N/A'}
                    </td>
                    <td className="px-6 py-4">{u.update}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">No updates found</td>
                </tr>
              )}
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

const NewOrder = ({ setActivePage, balance, totalSpent, services, username, uid, orders, showToast }: { setActivePage: (p: Page) => void, balance: string, totalSpent: string, services: Service[], username: string, uid: string, orders: any[], showToast: (m: string, t: 'success' | 'error') => void }) => {
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
      showToast('Please fill all fields', 'error');
      return;
    }
    
    const qty = parseInt(quantity);
    const rate = parseFloat(selectedService.rate.replace('$', ''));
    const charge = parseFloat((rate * qty / 1000).toFixed(2));
    
    const orderId = Math.floor(10000000 + Math.random() * 90000000).toString();
    console.log("Placing order:", { orderId, uid, serviceId: selectedService.id, charge, balance });

    if (parseFloat(balance) < charge) {
      showToast('Insufficient balance. Please add funds.', 'error');
      return;
    }

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
      
      // Redirect to orders page after a short delay
      setTimeout(() => {
        setShowSuccess(false);
        setActivePage('orders');
      }, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

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
            <SocialIcon icon={<Instagram size={20} />} color="#ec4899" onClick={() => setSelectedCategory('Instagram Followers [Guaranteed♻️]')} />
            <SocialIcon icon={<Music size={20} />} color="#10b981" onClick={() => setSelectedCategory('Tiktok Followers')} />
            <SocialIcon icon={<Youtube size={20} />} color="#ef4444" onClick={() => setSelectedCategory('Real Ads YouTube Views ❤️‍🔥🔥')} />
            <SocialIcon icon={<Facebook size={20} />} color="#1d4ed8" onClick={() => setSelectedCategory('Facebook Page Likes+Followers')} />
            <SocialIcon icon={<Twitter size={20} />} color="#000000" onClick={() => setSelectedCategory('🐥Twitter Follower')} />
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
              className="w-full py-4 bg-smm-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Submit Order
            </button>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl h-full">
            <h3 className="text-smm-text-dark font-bold text-lg mb-4">lombardiservices</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              <span className="font-black">lombardiservices</span> is used to access Social Networks, and making use of it for profits. You can use <span className="font-black">lombardiservices</span> to get your marketing move on to the next stage of developing plans for your product or services. The social media used includes Facebook, twitter, Instagram, YouTube, LinkedIn and more. With <span className="font-black">lombardiservices</span> you can grow your business rapidly. Buy Best lombardiservices from us and grow your business. <span className="font-black">lombardiservices</span> is the best and most reliable service provider in the market.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = ({ setActivePage, orders, uid, showToast }: { setActivePage: (p: Page) => void, orders: any[], uid: string, showToast: (m: string, t: 'success' | 'error') => void }) => {
  console.log("Orders Component Rendered. Orders Count:", orders.length, "UID:", uid);
  const tabs = ["All", "Pending", "In progress", "Completed", "Partial", "Processing", "Canceled"];
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      (o.id?.toString().toLowerCase().includes(search) ?? false) ||
      (o.link?.toLowerCase().includes(search) ?? false) ||
      (o.service?.toLowerCase().includes(search) ?? false);
    return matchesTab && matchesSearch;
  });

  const handleRefill = async (order: any) => {
    if (order.status !== 'Completed') {
      showToast('Only completed orders can be refilled.', 'error');
      return;
    }

    const refillId = Math.floor(1000000 + Math.random() * 9000000).toString();
    console.log("Submitting refill request:", { refillId, orderId: order.id, uid });
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
      showToast('Refill request submitted successfully!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `refills/${refillId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

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
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-smm-primary text-white' : 'bg-white text-smm-text-dark border border-slate-200 hover:bg-slate-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID, Link or Service" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
            />
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
                <th className="px-6 py-4">Tracking</th>
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
                      {(row.status === 'Pending' || row.status === 'In progress') ? (
                        row.trackingUrl ? (
                          <a 
                            href={row.trackingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={12} />
                            <span>Track Order</span>
                          </a>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-500 italic text-[10px]">
                              {row.trackingInfo || 'Processing tracking...'}
                            </span>
                            <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="w-1/2 h-full bg-blue-500"
                              />
                            </div>
                          </div>
                        )
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {row.status === 'Completed' && (
                        <button 
                          onClick={() => handleRefill(row)}
                          className="bg-smm-primary text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-blue-700 transition-colors"
                        >
                          Refill
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400 italic">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Tickets = ({ tickets, uid, showToast }: { tickets: any[], uid: string, showToast: (m: string, t: 'success' | 'error') => void }) => {
  const [subject, setSubject] = useState('Auto Support [AI 🤖]');
  const [subcategory, setSubcategory] = useState('Speed Up');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const filteredTickets = tickets.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    const ticketId = Math.floor(10000 + Math.random() * 90000).toString();
    console.log("Submitting ticket:", { ticketId, uid, subject: subcategory || subject, message });
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
      showToast('Ticket submitted successfully!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

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
            className="w-full py-4 bg-smm-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all"
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
                  <React.Fragment key={i}>
                    <tr 
                      onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
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
                    {selectedTicket?.id === ticket.id && (
                      <tr className="bg-slate-50/30">
                        <td colSpan={4} className="px-6 py-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</span>
                              {ticket.orderId && (
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Order ID: {ticket.orderId}</span>
                              )}
                            </div>
                            <p className="text-slate-600 whitespace-pre-wrap">{ticket.message}</p>
                            {ticket.adminReply && (
                              <div className="mt-4 pt-4 border-t border-slate-100">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Admin Reply</span>
                                <p className="text-slate-600 whitespace-pre-wrap">{ticket.adminReply}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

const Subscriptions = ({ subscriptions }: { subscriptions: any[] }) => {
  const tabs = ["All", "Pending", "Active", "Completed", "Canceled", "Expired"];
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-smm-primary text-white' : 'bg-white text-smm-text-dark border border-slate-200 hover:bg-slate-50'}`}
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
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-smm-primary text-white' : 'bg-white text-smm-text-dark border border-slate-200 hover:bg-slate-50'}`}
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
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

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
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

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
  showToast
}: { 
  uid: string, 
  showToast: (m: string, t: 'success' | 'error') => void
}) => {
  const [method, setMethod] = useState<'crypto' | 'paypal' | 'paytm'>('paytm');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleCryptoPayment = async () => {
    if (!amount || parseFloat(amount) < 5) {
      showToast('Minimum amount is $5', 'error');
      return;
    }

    setLoading(true);
    console.log("Adding funds via crypto:", { amount, uid });
    try {
      // Simulate crypto payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const tId = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Add transaction record
      await addDoc(collection(db, 'transactions'), {
        uid,
        amount: parseFloat(amount),
        method: 'crypto',
        status: 'Completed',
        id: tId,
        createdAt: serverTimestamp()
      });

      // Update user balance
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const currentBalance = Number(userDoc.data().balance) || 0;
        await updateDoc(userRef, {
          balance: parseFloat((currentBalance + parseFloat(amount)).toFixed(4))
        });
      }

      showToast(`Successfully added $${amount} to your balance via Crypto!`, 'success');
      setAmount('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'transactions');
    } finally {
      setLoading(false);
    }
  };

  const handlePaytmPayment = async () => {
    if (!amount || !transactionId) {
      showToast('Please fill all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      // Add transaction record as pending for admin approval
      await addDoc(collection(db, 'transactions'), {
        uid,
        amount: parseFloat(amount),
        method: 'paytm',
        status: 'Pending',
        id: transactionId,
        createdAt: serverTimestamp()
      });

      showToast('Payment submitted for verification. Balance will be updated soon.', 'success');
      setAmount('');
      setTransactionId('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'transactions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 mb-8 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <h2 className="text-smm-text-dark font-black text-2xl mb-8 text-center uppercase tracking-tight">Add Funds</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button 
            onClick={() => setMethod('paytm')}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'paytm' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}
          >
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
              <QrCode size={24} />
            </div>
            <span className="text-smm-text-dark font-bold text-xs uppercase tracking-widest">PayTM/UPI</span>
          </button>

          <button 
            onClick={() => setMethod('crypto')}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'crypto' ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}
          >
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500">
              <Bitcoin size={24} />
            </div>
            <span className="text-smm-text-dark font-bold text-xs uppercase tracking-widest">Crypto</span>
          </button>

          <button 
            onClick={() => setMethod('paypal')}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}
          >
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500">
              <CreditCard size={24} />
            </div>
            <span className="text-smm-text-dark font-bold text-xs uppercase tracking-widest">PayPal</span>
          </button>
        </div>

        {method === 'paytm' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Transaction ID (UTR)</label>
                <input 
                  type="text" 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter 12 digit UTR number" 
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20 font-bold" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00" 
                    className="w-full pl-8 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20 font-bold" 
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handlePaytmPayment}
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Submit Payment
                </>
              )}
            </button>
          </div>
        )}

        {method === 'crypto' && (
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

            <button 
              onClick={handleCryptoPayment}
              disabled={loading}
              className="w-full py-5 bg-smm-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-smm-text-dark font-black text-xs uppercase tracking-widest mb-3">Instructions:</h4>
              <ul className="text-[11px] text-slate-500 font-bold space-y-2 uppercase tracking-wide">
                <li>• Funds are added automatically after payment confirmation.</li>
                <li>• Crypto payments require 3 network confirmations.</li>
                <li>• Contact support if funds are not added within 1 hour.</li>
              </ul>
            </div>
          </div>
        )}

        {method === 'paypal' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                <CreditCard size={40} />
              </div>
              <h3 className="text-blue-900 font-black text-xl mb-3 uppercase tracking-tight">Pay with PayPal</h3>
              <p className="text-blue-700 text-sm font-bold mb-8 uppercase tracking-widest leading-relaxed">
                Send your payment directly via PayPal.me<br/>
                Include your username in the payment note
              </p>
              <a 
                href="https://www.paypal.me/CARDIEGO" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all hover:scale-105"
              >
                <ExternalLink size={20} />
                Go to PayPal.me/CARDIEGO
              </a>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-smm-text-dark font-black text-xs uppercase tracking-widest mb-3">Instructions:</h4>
              <ul className="text-[11px] text-slate-500 font-bold space-y-2 uppercase tracking-wide">
                <li>• Click the link above to open PayPal.me/CARDIEGO.</li>
                <li>• Enter the amount you wish to add to your balance.</li>
                <li>• <span className="text-blue-600">IMPORTANT:</span> Add your username or email in the payment note.</li>
                <li>• Funds will be added manually to your account within 1-12 hours.</li>
                <li>• Send a ticket with your transaction ID for faster processing.</li>
              </ul>
            </div>
          </div>
        )}
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
  subscriptions,
  updates,
  transactions,
  showToast
}: { 
  services: Service[], 
  orders: any[],
  tickets: any[],
  refills: any[],
  users: any[],
  subscriptions: any[],
  updates: any[],
  transactions: any[],
  showToast: (msg: string, type: 'success' | 'error') => void
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'orders' | 'tickets' | 'refills' | 'users' | 'subscriptions' | 'updates' | 'transactions'>('dashboard');
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState('');
  const [newMin, setNewMin] = useState('');
  const [newMax, setNewMax] = useState('');
  const [newCategory, setNewCategory] = useState('Instagram Followers');
  const [newDescription, setNewDescription] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [newUpdateServiceId, setNewUpdateServiceId] = useState('');
  const [newUpdateServiceName, setNewUpdateServiceName] = useState('');
  const [newUpdateText, setNewUpdateText] = useState('');

  const totalRevenue = orders.reduce((acc, curr) => acc + parseFloat(curr.charge || 0), 0).toFixed(2);

  const handleAddAdminFunds = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { balance: 5000 });
      showToast("Admin balance set to $5000.00", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users/' + user.uid);
    }
  };

  const [serviceSearch, setServiceSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || 
    s.id.toString().includes(serviceSearch) ||
    (s.category && s.category.toLowerCase().includes(serviceSearch.toLowerCase()))
  );

  const filteredUsers = (users || []).filter(u => {
    const search = (userSearch || "").toLowerCase();
    const username = (u.username || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const id = (u.id || "").toLowerCase();
    return username.includes(search) || email.includes(search) || id.includes(search);
  });

  const [newUser, setNewUser] = useState({ username: '', email: '', balance: 0, uid: '' });
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email) return;
    
    setIsAddingUser(true);
    try {
      // Use provided UID or create a dummy one for manually added users
      const finalUid = newUser.uid.trim() || 'manual_' + Math.random().toString(36).substring(2, 15);
      await setDoc(doc(db, 'users', finalUid), {
        username: newUser.username,
        email: newUser.email,
        balance: newUser.balance,
        role: 'user',
        totalSpent: 0,
        createdAt: serverTimestamp(),
        uid: finalUid
      });
      setNewUser({ username: '', email: '', balance: 0, uid: '' });
      showToast("User profile created successfully!", "success");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleBulkAddFunds = async () => {
    const amountStr = window.prompt("Enter amount to add to ALL users:");
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return;

    if (window.confirm(`Are you sure you want to add $${amount.toFixed(2)} to ALL ${users.length} users?`)) {
      showToast(`Adding funds to ${users.length} users...`, "success");
      let successCount = 0;
      for (const u of users) {
        try {
          await updateUserBalance(u.id, (u.balance || 0) + amount, amount);
          successCount++;
        } catch (err) {
          console.error(`Failed to update balance for user ${u.id}`, err);
        }
      }
      showToast(`Successfully added funds to ${successCount} users!`, "success");
    }
  };

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
      const result = await seedBulkServices();
      if (result.success) {
        showToast(`Successfully seeded ${result.count} services!`, 'success');
      } else {
        showToast(`Seeding failed: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      showToast('Failed to seed services. Check console for details.', 'error');
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRate || !newMin || !newMax) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const minVal = parseInt(newMin);
    const maxVal = parseInt(newMax);
    const rateVal = parseFloat(newRate);

    if (isNaN(minVal) || isNaN(maxVal) || isNaN(rateVal)) {
      showToast('Please enter valid numbers for Rate, Min, and Max', 'error');
      return;
    }

    const serviceId = Math.floor(1000 + Math.random() * 9000).toString();
    const newService = {
      id: parseInt(serviceId),
      name: newName,
      rate: `$${rateVal.toFixed(2)}`,
      min: minVal,
      max: maxVal,
      category: newCategory,
      description: newDescription,
      createdAt: serverTimestamp()
    };

    console.log("Attempting to add service:", newService);

    try {
      await setDoc(doc(db, 'services', serviceId), newService);
      setNewName('');
      setNewRate('');
      setNewMin('');
      setNewMax('');
      setNewDescription('');
      showToast('Service added successfully!', 'success');
    } catch (error) {
      console.error("Error adding service:", error);
      handleFirestoreError(error, OperationType.WRITE, `services/${serviceId}`);
    }
  };

  const handleDeleteService = async (id: string | number) => {
    console.log("Attempting to delete service:", id);
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', id.toString()));
        showToast('Service deleted successfully!', 'success');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
      }
    }
  };

  const [editingServiceId, setEditingServiceId] = useState<string | number | null>(null);
  const [editingServiceData, setEditingServiceData] = useState<Partial<Service>>({});

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserData, setEditingUserData] = useState<any>({});

  const [editingUpdateId, setEditingUpdateId] = useState<string | null>(null);
  const [editingUpdateData, setEditingUpdateData] = useState<any>({});

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editingOrderData, setEditingOrderData] = useState<any>({});

  const updateService = async (serviceId: string | number) => {
    if (!editingServiceData.rate && !editingServiceData.name) return;
    console.log("Attempting to update service:", { serviceId, editingServiceData });
    
    const updates: any = { ...editingServiceData };
    if (updates.rate && !updates.rate.startsWith('$')) {
      updates.rate = `$${updates.rate}`;
    }

    try {
      await updateDoc(doc(db, 'services', serviceId.toString()), updates);
      showToast('Service updated successfully!', 'success');
      setEditingServiceId(null);
      setEditingServiceData({});
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `services/${serviceId}`);
    }
  };

  const updateUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), editingUserData);
      showToast('User updated successfully!', 'success');
      setEditingUserId(null);
      setEditingUserData({});
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const updateUpdate = async (updateId: string) => {
    try {
      await updateDoc(doc(db, 'updates', updateId), editingUpdateData);
      showToast('Update modified successfully!', 'success');
      setEditingUpdateId(null);
      setEditingUpdateData({});
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `updates/${updateId}`);
    }
  };

  const updateOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), editingOrderData);
      showToast('Order updated successfully!', 'success');
      setEditingOrderId(null);
      setEditingOrderData({});
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    console.log("Admin updating order status:", { orderId, newStatus });
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      showToast(`Order ${orderId} status updated to ${newStatus}`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    console.log("Admin updating ticket status:", { ticketId, newStatus });
    try {
      await updateDoc(doc(db, 'tickets', ticketId), { status: newStatus });
      showToast(`Ticket ${ticketId} status updated to ${newStatus}`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tickets/${ticketId}`);
    }
  };

  const updateRefillStatus = async (refillId: string, newStatus: string) => {
    console.log("Admin updating refill status:", { refillId, newStatus });
    try {
      await updateDoc(doc(db, 'refills', refillId), { status: newStatus });
      showToast(`Refill ${refillId} status updated to ${newStatus}`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `refills/${refillId}`);
    }
  };

  const updateSubscriptionStatus = async (subId: string, newStatus: string) => {
    console.log("Admin updating subscription status:", { subId, newStatus });
    try {
      await updateDoc(doc(db, 'subscriptions', subId), { status: newStatus });
      showToast(`Subscription ${subId} status updated to ${newStatus}`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `subscriptions/${subId}`);
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateServiceId || !newUpdateServiceName || !newUpdateText) {
      showToast('Please fill all update fields', 'error');
      return;
    }
    console.log("Admin adding update:", { serviceId: newUpdateServiceId, serviceName: newUpdateServiceName, update: newUpdateText });
    try {
      await addDoc(collection(db, 'updates'), {
        id: parseInt(newUpdateServiceId),
        service: newUpdateServiceName,
        update: newUpdateText,
        createdAt: serverTimestamp()
      });
      setNewUpdateServiceId('');
      setNewUpdateServiceName('');
      setNewUpdateText('');
      showToast('Update added successfully!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'updates');
    }
  };

  const updateUserBalance = async (userId: string, newBalance: number, addedAmount?: number) => {
    console.log("Admin updating user balance:", { userId, newBalance, addedAmount });
    try {
      await updateDoc(doc(db, 'users', userId), { balance: newBalance });
      
      if (addedAmount !== undefined) {
        // Add a transaction record for the balance update
        await addDoc(collection(db, 'transactions'), {
          uid: userId,
          amount: addedAmount,
          method: 'Admin Adjustment',
          status: 'Completed',
          createdAt: serverTimestamp(),
          type: addedAmount >= 0 ? 'deposit' : 'withdrawal',
          id: Math.random().toString(36).substring(2, 10).toUpperCase()
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
    if (window.confirm('Are you sure you want to delete this refill?')) {
      try {
        await deleteDoc(doc(db, 'refills', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `refills/${id}`);
      }
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteDoc(doc(db, 'subscriptions', id));
        showToast('Subscription deleted successfully!', 'success');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `subscriptions/${id}`);
      }
    }
  };

  const approveTransaction = async (txId: string, uid: string, amount: number) => {
    console.log("Admin approving transaction:", { txId, uid, amount });
    try {
      // Find the transaction document by its 'id' field
      const q = query(collection(db, 'transactions'), where('id', '==', txId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        showToast('Transaction not found', 'error');
        return;
      }

      const txDoc = querySnapshot.docs[0];
      
      // Update transaction status
      await updateDoc(doc(db, 'transactions', txDoc.id), { status: 'Completed' });

      // Update user balance
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const currentBalance = Number(userDoc.data().balance) || 0;
        await updateDoc(userRef, {
          balance: parseFloat((currentBalance + amount).toFixed(4))
        });
      }

      showToast(`Transaction ${txId} approved and $${amount} added to user balance!`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `transactions`);
    }
  };

  const rejectTransaction = async (txId: string) => {
    console.log("Admin rejecting transaction:", { txId });
    try {
      const q = query(collection(db, 'transactions'), where('id', '==', txId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        showToast('Transaction not found', 'error');
        return;
      }

      const txDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'transactions', txDoc.id), { status: 'Rejected' });
      showToast(`Transaction ${txId} rejected`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `transactions`);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.id?.toLowerCase().includes(transactionSearch.toLowerCase()) || 
    t.uid?.toLowerCase().includes(transactionSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl py-3 overflow-hidden shadow-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>

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
          <button 
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'subscriptions' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Subscriptions
          </button>
          <button 
            onClick={() => setActiveTab('updates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'updates' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Updates
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'transactions' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Transactions
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
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
              <button 
                onClick={handleAddAdminFunds}
                className="px-2 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded hover:bg-blue-700 transition-colors"
              >
                Add $5000 to Me
              </button>
            </div>
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
                      <td className="px-6 py-4">
                        {editingServiceId === s.id ? (
                          <input 
                            type="text" 
                            value={editingServiceData.name ?? s.name}
                            onChange={(e) => setEditingServiceData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        ) : (
                          <span className="font-semibold">{s.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingServiceId === s.id ? (
                          <select 
                            value={editingServiceData.category ?? s.category}
                            onChange={(e) => setEditingServiceData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="Instagram Followers">Instagram Followers</option>
                            <option value="TikTok Followers">TikTok Followers</option>
                            <option value="YouTube Views">YouTube Views</option>
                            <option value="Facebook Likes">Facebook Likes</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600">{s.category || 'Other'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative flex items-center">
                            <span className="absolute left-2 text-slate-400 font-bold">$</span>
                            <input 
                              type="text" 
                              value={editingServiceId === s.id ? (editingServiceData.rate ?? s.rate.replace('$', '')) : s.rate.replace('$', '')}
                              readOnly={editingServiceId !== s.id}
                              onChange={(e) => {
                                if (editingServiceId === s.id) {
                                  setEditingServiceData(prev => ({ ...prev, rate: e.target.value }));
                                }
                              }}
                              className={`w-24 pl-5 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500/20 ${editingServiceId !== s.id ? 'cursor-default' : ''}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingServiceId === s.id ? (
                          <div className="flex gap-2">
                            <input 
                              type="number" 
                              value={editingServiceData.min ?? s.min}
                              onChange={(e) => setEditingServiceData(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                              className="w-16 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <span className="text-slate-400">/</span>
                            <input 
                              type="number" 
                              value={editingServiceData.max ?? s.max}
                              onChange={(e) => setEditingServiceData(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                              className="w-20 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        ) : (
                          <span>{s.min} / {s.max}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {editingServiceId === s.id ? (
                            <>
                              <button 
                                onClick={() => updateService(s.id)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Save Changes"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button 
                                onClick={() => {
                                  setEditingServiceId(null);
                                  setEditingServiceData({});
                                }}
                                className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => {
                                  setNewUpdateServiceId(s.id.toString());
                                  setNewUpdateServiceName(s.name);
                                  setActiveTab('updates');
                                }}
                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Add Update for this Service"
                              >
                                <Bell size={18} />
                              </button>
                              <button 
                                onClick={() => {
                                  setEditingServiceId(s.id);
                                  setEditingServiceData({
                                    name: s.name,
                                    rate: s.rate.replace('$', ''),
                                    min: s.min,
                                    max: s.max,
                                    category: s.category,
                                    description: s.description
                                  });
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Service"
                              >
                                <Settings size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteService(s.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Service"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
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
                  <th className="px-6 py-4">Tracking</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">{o.id}</td>
                      <td className="px-6 py-4 truncate max-w-[200px]">{o.service}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">
                        {editingOrderId === o.id ? (
                          <input 
                            type="text" 
                            value={editingOrderData.charge || ''} 
                            onChange={(e) => setEditingOrderData({...editingOrderData, charge: e.target.value})}
                            className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                          />
                        ) : (
                          `$${o.charge}`
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingOrderId === o.id ? (
                          <select 
                            value={editingOrderData.status || ''} 
                            onChange={(e) => setEditingOrderData({...editingOrderData, status: e.target.value})}
                            className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In progress">In progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                            <option value="Partial">Partial</option>
                            <option value="Processing">Processing</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            o.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                            o.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                            o.status === 'Canceled' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {o.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingOrderId === o.id ? (
                          <div className="flex flex-col gap-2">
                            <input 
                              type="text" 
                              placeholder="Tracking URL"
                              value={editingOrderData.trackingUrl || ''} 
                              onChange={(e) => setEditingOrderData({...editingOrderData, trackingUrl: e.target.value})}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-[10px]"
                            />
                            <input 
                              type="text" 
                              placeholder="Tracking Info"
                              value={editingOrderData.trackingInfo || ''} 
                              onChange={(e) => setEditingOrderData({...editingOrderData, trackingInfo: e.target.value})}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-[10px]"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {o.trackingUrl && <span className="text-blue-600 truncate max-w-[100px]">{o.trackingUrl}</span>}
                            {o.trackingInfo && <span className="text-slate-500 italic text-[10px]">{o.trackingInfo}</span>}
                            {!o.trackingUrl && !o.trackingInfo && <span className="text-slate-400">—</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        {editingOrderId === o.id ? (
                          <>
                            <button onClick={() => updateOrder(o.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Save"><CheckCircle2 size={16} /></button>
                            <button onClick={() => { setEditingOrderId(null); setEditingOrderData({}); }} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg" title="Cancel"><X size={16} /></button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                setEditingOrderId(o.id);
                                setEditingOrderData({ 
                                  charge: o.charge, 
                                  status: o.status,
                                  trackingUrl: o.trackingUrl || '',
                                  trackingInfo: o.trackingInfo || ''
                                });
                              }} 
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" 
                              title="Edit"
                            >
                              <Settings size={16} />
                            </button>
                            <button onClick={() => updateOrderStatus(o.id, 'Completed')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Complete"><CheckCircle2 size={16} /></button>
                            <button onClick={() => updateOrderStatus(o.id, 'Pending')} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Pending"><Clock size={16} /></button>
                            <button onClick={() => updateOrderStatus(o.id, 'Canceled')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Cancel"><XCircle size={16} /></button>
                            <button onClick={() => handleDeleteOrder(o.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={16} /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No orders found</td>
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
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-blue-900 mb-1 uppercase tracking-tight">Why are some users missing?</h4>
                <p className="text-sm text-blue-700 leading-relaxed font-medium">
                  Users only appear in this list once they have a <span className="font-bold underline">Firestore profile</span>. 
                  Profiles are created automatically when a user logs in for the first time. 
                  If you see a user in the <span className="font-bold">Firebase Console (Authentication)</span> but not here, it's because they haven't logged into the app yet. 
                  You can manually create their profile below using their <span className="font-bold">UID</span> from the Firebase Console if you need to set their balance before they log in.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-smm-text-dark font-black uppercase tracking-widest text-sm">Add New User Profile</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                <ShieldCheck size={14} className="text-blue-600" />
                <span className="text-[10px] font-black text-slate-500 uppercase">Admin Mode Active</span>
              </div>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Username</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Initial Balance ($)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={newUser.balance}
                    onChange={(e) => setNewUser({...newUser, balance: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Firebase UID (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Paste UID from Console" 
                    value={newUser.uid}
                    onChange={(e) => setNewUser({...newUser, uid: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-[10px]"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={isAddingUser}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isAddingUser ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create User Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-smm-text-dark font-bold">Manage Users ({filteredUsers.length})</h3>
                <button 
                  onClick={handleBulkAddFunds}
                  className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-emerald-200 transition-colors"
                >
                  Bulk Add Funds
                </button>
              </div>
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
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-medium">
                        No users found. Try adjusting your search or add a new user.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold">
                          {editingUserId === u.id ? (
                            <input 
                              type="text" 
                              value={editingUserData.username || ''} 
                              onChange={(e) => setEditingUserData({...editingUserData, username: e.target.value})}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                            />
                          ) : (
                            u.username
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {editingUserId === u.id ? (
                            <input 
                              type="email" 
                              value={editingUserData.email || ''} 
                              onChange={(e) => setEditingUserData({...editingUserData, email: e.target.value})}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                            />
                          ) : (
                            u.email
                          )}
                        </td>
                        <td className="px-6 py-4 font-black text-blue-600">
                          {editingUserId === u.id ? (
                            <input 
                              type="number" 
                              value={editingUserData.balance || 0} 
                              onChange={(e) => setEditingUserData({...editingUserData, balance: parseFloat(e.target.value)})}
                              className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                            />
                          ) : (
                            `$${(u.balance || 0).toFixed(2)}`
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            {editingUserId === u.id ? (
                              <>
                                <button onClick={() => updateUser(u.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Save"><CheckCircle2 size={16} /></button>
                                <button onClick={() => { setEditingUserId(null); setEditingUserData({}); }} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg" title="Cancel"><X size={16} /></button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => {
                                    setEditingUserId(u.id);
                                    setEditingUserData({ username: u.username, email: u.email, balance: u.balance });
                                  }} 
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" 
                                  title="Edit Profile"
                                >
                                  <Settings size={16} />
                                </button>
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-smm-text-dark font-bold">Manage Subscriptions ({subscriptions.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
                {subscriptions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold">{s.id}</td>
                    <td className="px-6 py-4">{s.username || s.uid}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{s.service}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        s.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 
                        s.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <select 
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px]"
                        value={s.status}
                        onChange={(e) => updateSubscriptionStatus(s.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Expired">Expired</option>
                      </select>
                      <button 
                        onClick={() => handleDeleteSubscription(s.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Subscription"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'updates' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h3 className="text-smm-text-dark font-black text-xl uppercase tracking-tight mb-6 flex items-center gap-2">
              <Plus className="text-blue-600" size={20} />
              Add New Update
            </h3>
            <form onSubmit={handleAddUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Service (Quick Fill)</label>
                <select 
                  onChange={(e) => {
                    const selected = services.find(s => s.id.toString() === e.target.value);
                    if (selected) {
                      setNewUpdateServiceId(selected.id.toString());
                      setNewUpdateServiceName(selected.name);
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- Choose a Service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service ID</label>
                <input 
                  type="number" 
                  value={newUpdateServiceId}
                  onChange={(e) => setNewUpdateServiceId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                  placeholder="e.g. 4133"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Name</label>
                <input 
                  type="text" 
                  value={newUpdateServiceName}
                  onChange={(e) => setNewUpdateServiceName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                  placeholder="e.g. TikTok Followers"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Description</label>
                <input 
                  type="text" 
                  value={newUpdateText}
                  onChange={(e) => setNewUpdateText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                  placeholder="e.g. Rate increased from $1 to $2"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button 
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                >
                  Post Update
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-smm-text-dark font-bold">Recent Updates ({updates.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Update</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
                  {updates.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">{u.id}</span>
                          {editingUpdateId === u.id ? (
                            <input 
                              type="text" 
                              value={editingUpdateData.service || ''} 
                              onChange={(e) => setEditingUpdateData({...editingUpdateData, service: e.target.value})}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                            />
                          ) : (
                            <span className="font-semibold">{u.service}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.createdAt instanceof Timestamp ? u.createdAt.toDate().toLocaleDateString() : u.date || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {editingUpdateId === u.id ? (
                          <textarea 
                            value={editingUpdateData.update || ''} 
                            onChange={(e) => setEditingUpdateData({...editingUpdateData, update: e.target.value})}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs min-h-[60px]"
                          />
                        ) : (
                          u.update
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        {editingUpdateId === u.id ? (
                          <>
                            <button onClick={() => updateUpdate(u.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Save"><CheckCircle2 size={16} /></button>
                            <button onClick={() => { setEditingUpdateId(null); setEditingUpdateData({}); }} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg" title="Cancel"><X size={16} /></button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                setEditingUpdateId(u.id);
                                setEditingUpdateData({ service: u.service, update: u.update });
                              }} 
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" 
                              title="Edit Update"
                            >
                              <Settings size={16} />
                            </button>
                            <button 
                              onClick={async () => {
                                if (window.confirm('Delete this update?')) {
                                  try {
                                    await deleteDoc(doc(db, 'updates', u.id));
                                    showToast('Update deleted', 'success');
                                  } catch (error) {
                                    handleFirestoreError(error, OperationType.DELETE, `updates/${u.id}`);
                                  }
                                }
                              }}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-smm-text-dark font-bold">Manage Transactions ({filteredTransactions.length})</h3>
            <div className="flex items-center gap-2 w-full sm:max-w-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-smm-text-dark outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">TX ID / UTR</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-smm-text-dark text-xs font-medium">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold">{t.id}</td>
                      <td className="px-6 py-4 text-[10px] font-bold text-slate-500">{t.uid}</td>
                      <td className="px-6 py-4 font-black text-blue-600">${t.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-widest">{t.method}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          t.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                          t.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        {t.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => approveTransaction(t.id, t.uid, t.amount)} 
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" 
                              title="Approve"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button 
                              onClick={() => rejectTransaction(t.id)} 
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" 
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={async () => {
                            if (window.confirm('Delete this transaction record?')) {
                              try {
                                const q = query(collection(db, 'transactions'), where('id', '==', t.id));
                                const querySnapshot = await getDocs(q);
                                if (!querySnapshot.empty) {
                                  await deleteDoc(doc(db, 'transactions', querySnapshot.docs[0].id));
                                  showToast('Transaction deleted', 'success');
                                }
                              } catch (error) {
                                handleFirestoreError(error, OperationType.DELETE, `transactions`);
                              }
                            }
                          }} 
                          className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const LandingPage = ({ onLogin, showToast, services }: { onLogin: () => void, showToast: (msg: string, type: 'success' | 'error') => void, services: Service[] }) => {
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
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: <User size={24} />, title: "Sign up", desc: "Register into our panel, fill in all the necessary data and get ready to be famous." },
    { icon: <Wallet size={24} />, title: "Add funds", desc: "Add money to your account and be ready to rise like a star and give your business a new height." },
    { icon: <ShoppingCart size={24} />, title: "Choose service", desc: "Select a service and place an order and get ready to start receiving more publicity on social media." },
    { icon: <CheckCircle2 size={24} />, title: "Enjoy popularity", desc: "We will create and proceed with an order and inform you once done. Enjoy and stay with us." }
  ];

  const features = [
    { icon: <ShieldCheck size={24} />, title: "Great quality", desc: "The quality of our lombardiservices will pleasantly surprise you." },
    { icon: <CreditCard size={24} />, title: "Multiple payment systems", desc: "Great variety of payment methods for you to choose from." },
    { icon: <Bitcoin size={24} />, title: "Really cheap", desc: "lombardiservices that we offer on our panel are extremely cheap." },
    { icon: <Clock size={24} />, title: "Extra quick delivery", desc: "Customer orders on our panel are processed very fast." }
  ];

  const faqs = [
    { q: "lombardiservices — what is it?", a: "lombardiservices is an online store that sells various social media marketing services." },
    { q: "What kinds of services can I buy here?", a: "On our panel you can find different social media services: followers, likes, views, etc." },
    { q: "Is it safe to buy services on this panel?", a: "Sure! Our services are safe to use, you won't get banned or anything like that." },
    { q: "What is the mass order feature for?", a: "Using mass orders, it's easy to place several orders with different links at the same time." }
  ];

  const reviews = [
    { name: "Roberto Santos", text: "lombardiservices I got here did exactly what I expected them to do — they helped my business get more attention and increased my sales. Thank you!" },
    { name: "Brian Delaney", text: "This lombardiservices panel is incredible! All services are so cheap and yet their quality doesn't disappoint. I'm now your regular customer." },
    { name: "Adam Lim", text: "Using this panel helped me save a TON on social media services. I was just a beginner small business owner so I didn't have lots of money to spend on professional online promos." }
  ];

  const [showPublicServices, setShowPublicServices] = useState(false);

  const stats = [
    { label: "Total Orders", value: "1.2M+" },
    { label: "Happy Clients", value: "50K+" },
    { label: "Services", value: "1.5K+" },
    { label: "Support", value: "24/7" }
  ];

  const sampleServices = [
    { title: "Instagram Followers", price: "$7", icon: <Instagram size={20} />, color: "#ec4899" },
    { title: "TikTok Followers", price: "$8", icon: <Music size={20} />, color: "#10b981" },
    { title: "YouTube Views", price: "$6", icon: <Youtube size={20} />, color: "#ef4444" },
    { title: "Facebook Likes", price: "$1", icon: <Facebook size={20} />, color: "#1d4ed8" }
  ];

  if (showPublicServices) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowPublicServices(false)}>
              <div className="w-10 h-10">
                <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600 fill-current">
                  <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10 Z M50 20 C65 20 75 30 75 45 C75 60 65 70 50 70 C35 70 25 60 25 45 C25 30 35 20 50 20 Z" />
                  <path d="M45 40 L55 40 L50 50 Z" />
                </svg>
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">lombardiservices</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowPublicServices(false)} className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600">Back to Home</button>
              <button onClick={() => { setShowPublicServices(false); setIsRegistering(true); }} className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Sign up</button>
            </div>
          </div>
        </nav>
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-black tracking-tighter uppercase mb-4">Our Services</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Browse our full list of high-quality lombardiservices</p>
            </div>
            <Services services={services} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 py-3 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
          <span className="text-sm font-black text-smm-primary uppercase tracking-[0.2em] px-8">
            LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST • LOMBARDI SERVICES IS THE CHEAPEST
          </span>
        </div>
      </div>
      {/* Top Bar */}
      <div className="hidden lg:block bg-slate-900 text-white py-2 text-[10px] font-black uppercase tracking-[0.2em]">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Mail size={12} className="text-blue-500" /> support@lombardiservices.com</span>
            <span className="flex items-center gap-2"><MessageCircle size={12} className="text-emerald-500" /> +91 9999999999</span>
          </div>
          <div className="flex items-center gap-4">
            <span>lombardiservices is the cheapest</span>
            <div className="w-px h-3 bg-white/20" />
            <span>24/7 SUPPORT AVAILABLE</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 lg:top-8 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 lg:mx-6 lg:rounded-2xl lg:shadow-xl lg:border-none">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10">
              <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600 fill-current">
                <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10 Z M50 20 C65 20 75 30 75 45 C75 60 65 70 50 70 C35 70 25 60 25 45 C25 30 35 20 50 20 Z" />
                <path d="M45 40 L55 40 L50 50 Z" />
              </svg>
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">lombardiservices</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-500">
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            <a href="#reviews" className="hover:text-blue-600 transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsRegistering(false)} className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600">Sign in</button>
            <button onClick={() => setIsRegistering(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Sign up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 lg:pt-52 pb-20 px-6 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Official Main Provider Panel
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
              lombardi <br />
              services <br />
              is the <br />
              cheapest
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-lg leading-relaxed">
              lombardiservices is the cheapest. We provide high-quality services for Instagram, TikTok, YouTube, and more.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {["Main Supplier of lombardiservices", "WhatsApp Support ⚡", "We beat any price/any quality !", "Best Support in the market !"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600 uppercase tracking-tight">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-white" size={12} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button onClick={() => setIsRegistering(true)} className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1">Get Started Now</button>
              <button onClick={() => setShowPublicServices(true)} className="w-full sm:w-auto bg-white text-slate-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all text-center border border-slate-200 shadow-sm">View Services</button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs uppercase tracking-widest rotate-12 shadow-xl">
              Cheap<br/>Prices
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-black tracking-tighter uppercase">{isRegistering ? 'Create Account' : 'Sign In'}</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Access the best lombardiservices</p>
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
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" 
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
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" 
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
                  showToast(`Google login failed: ${error.message}`, 'error');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full py-4 bg-white border-2 border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
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
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-4xl lg:text-5xl font-black text-blue-600 mb-2">{stat.value}</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Our Best Services</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Quality services at unbeatable prices</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sampleServices.map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:scale-105 transition-transform">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${service.color}15`, color: service.color }}>
                  {service.icon}
                </div>
                <h3 className="font-black text-lg mb-2">{service.title}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Starting from</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-blue-600">{service.price}</span>
                  <button onClick={() => setIsRegistering(true)} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600">Order Now</button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => setShowPublicServices(true)} className="bg-slate-100 text-slate-600 px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-slate-200 transition-all">View All 1500+ Services</button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter uppercase">How It Works?</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest mt-2">Start boosting your social media in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Register Account", desc: "Create your account in seconds and join our community of successful resellers.", icon: <User size={24} /> },
              { title: "Add Funds", desc: "Add funds to your balance using our secure payment methods like PayTM, UPI, or Crypto.", icon: <Wallet size={24} /> },
              { title: "Select Service", desc: "Choose from over 1500+ high-quality services for all major social platforms.", icon: <ListOrdered size={24} /> },
              { title: "Enjoy Results", desc: "Sit back and watch your social media presence grow with our lightning-fast delivery.", icon: <CheckCircle2 size={24} /> }
            ].map((step, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl hover:-translate-y-2 transition-all border border-slate-100 group">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <div className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4">Step {i + 1}</div>
                <h3 className="text-xl font-black tracking-tighter uppercase mb-4">{step.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-6">Why Choose <span className="text-blue-600">lombardiservices?</span></h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">We are the #1 lombardiservices provider for resellers worldwide. Our platform is built for speed, reliability, and affordability.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { title: "Cheapest Prices", desc: "We offer the lowest rates in the market, guaranteed.", icon: <CreditCard size={20} /> },
                { title: "Lightning Fast", desc: "Most orders start instantly and complete within minutes.", icon: <Clock size={20} /> },
                { title: "24/7 Support", desc: "Our dedicated support team is always here to help you.", icon: <MessageCircle size={20} /> },
                { title: "Secure Payments", desc: "Your transactions are protected with top-tier security.", icon: <ShieldCheck size={20} /> }
              ].map((feature, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-widest mb-2">{feature.title}</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-blue-600 rounded-[3.5rem] p-12 text-white space-y-8 relative overflow-hidden shadow-2xl shadow-blue-200">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
              <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight">The Most Trusted lombardiservices for Professionals</h3>
              <p className="text-blue-100 text-lg leading-relaxed font-medium">
                lombardiservices has been serving thousands of resellers for years. We understand the market and provide the tools you need to succeed in your social media marketing business.
              </p>
              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-black">99.9%</div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-blue-200">Uptime</div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <div className="text-3xl font-black">24/7</div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-blue-200">Support</div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <div className="text-3xl font-black">1.2M+</div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-blue-200">Orders</div>
                </div>
              </div>
              <button onClick={() => setIsRegistering(true)} className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg">Join Us Today</button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-slate-900 text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Customer Reviews</h2>
            <p className="text-blue-400 font-bold uppercase tracking-widest mt-2">What our clients say about us</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <CheckCircle2 key={i} size={16} className="text-blue-500" />)}
                </div>
                <p className="text-slate-300 italic mb-6 leading-relaxed">"{review.text}"</p>
                <h4 className="font-black text-sm uppercase tracking-widest text-blue-400">{review.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter uppercase">FAQ</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest mt-2">Common questions answered</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-black text-sm uppercase tracking-widest">
                  {faq.q}
                  <ChevronDown className="group-open:rotate-180 transition-transform text-blue-600" size={20} />
                </summary>
                <div className="px-6 pb-6 text-slate-500 text-sm font-medium leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Get In Touch</h2>
            <p className="text-slate-500 text-lg font-medium">Have questions? Our support team is available 24/7 to help you with any issues or queries.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest mb-1">Email Support</h4>
                  <p className="text-slate-500 text-sm font-medium">shaikhmubasshir875@gmail.com</p>
                </div>
              </div>
              <a href="https://wa.me/message/XRM6CMEHIU5EP1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:bg-slate-50 p-2 rounded-2xl transition-colors">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest mb-1">WhatsApp Support</h4>
                  <p className="text-slate-500 text-sm font-medium">Click to Chat</p>
                </div>
              </a>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showToast('Message sent successfully!', 'success'); }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" required />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Message</label>
                <textarea rows={4} placeholder="Your message here..." className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" required></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600 fill-current">
                <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10 Z M50 20 C65 20 75 30 75 45 C75 60 65 70 50 70 C35 70 25 60 25 45 C25 30 35 20 50 20 Z" />
                <path d="M45 40 L55 40 L50 50 Z" />
              </svg>
            </div>
            <span className="font-black text-lg tracking-tighter uppercase">lombardiservices</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 lombardiservices. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
          </div>
        </div>
      </footer>
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
  const [email, setEmail] = useState<string | null>(null);
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
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Firestore connection test successful.");
      } catch (error) {
        console.error("Firestore connection test error:", error);
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      let displayMsg = event.message;
      try {
        // Check if message is JSON (from handleFirestoreError)
        const errObj = JSON.parse(event.message);
        if (errObj.error) {
          displayMsg = errObj.error;
          if (displayMsg.includes('insufficient permissions')) {
            displayMsg = "Permission denied. Your account might be restricted.";
          }
        }
      } catch (e) {
        // Not JSON, use original message
      }
      showToast(`System Error: ${displayMsg}`, "error");
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      let displayMsg = event.reason instanceof Error ? event.reason.message : String(event.reason);
      try {
        const errObj = JSON.parse(displayMsg);
        if (errObj.error) {
          displayMsg = errObj.error;
          if (displayMsg.includes('insufficient permissions')) {
            displayMsg = "Permission denied. Your account might be restricted.";
          }
        }
      } catch (e) {
        // Not JSON
      }
      showToast(`System Error: ${displayMsg}`, "error");
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  useEffect(() => {
    console.log("Initializing Auth Listener...");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed. User:", user ? user.email : "None");
      if (user) {
        console.log("User email from auth:", user.email);
        console.log("User UID from auth:", user.uid);
      }
      try {
        if (user) {
          setUid(user.uid);
          setEmail(user.email);
          
          // Set initial username from auth object immediately
          const initialUsername = user.displayName || user.email?.split('@')[0] || 'User';
          setUsername(initialUsername);
          
          // Immediate admin check for UI responsiveness
          const userEmail = user.email?.toLowerCase() || '';
          const isUserAdmin = (userEmail === 'shaikhmubasshir76@gmail.com' || userEmail === 'shaikhmubasshir875@gmail.com' || userEmail === 'lombardiraffaelo6@gmail.com');
          if (isUserAdmin) {
            setIsAdmin(true);
          }

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
                role: isUserAdmin ? 'admin' : 'user',
                balance: isUserAdmin ? 5000 : 0,
                totalSpent: 0,
                createdAt: Timestamp.now()
              };
              await setDoc(userDocRef, newUser);
              setIsAdmin(newUser.role === 'admin');
              setUsername(newUser.username);
              setBalance(newUser.balance.toFixed(4));
              setTotalSpent('0.0000');
              showToast(`Welcome to lombardiservices, ${newUser.username}!`, 'success');
            } else {
            console.log("User profile found.");
            let userData = userDoc.data();
            
            // Ensure admin role is set if email matches
            let role = userData.role;
            if (isUserAdmin && role !== 'admin') {
              console.log("Updating role to admin...");
              try {
                await updateDoc(userDocRef, { role: 'admin' });
                role = 'admin';
              } catch (err) {
                console.error("Failed to update role to admin in Firestore, but user is admin by email.", err);
                role = 'admin'; // Force role to admin for UI state
              }
            }

            // Ensure admin balance is at least $5000
            let currentBalance = userData.balance || 0;
            if (isUserAdmin) {
              if (currentBalance < 5000) {
                console.log("Updating admin balance to $5000...");
                updateDoc(userDocRef, { balance: 5000 }).catch(err => {
                  console.error("Failed to update admin balance in Firestore.", err);
                });
                currentBalance = 5000; // Force it for the UI even if update fails
              }
            }
            
            setIsAdmin(isUserAdmin || role === 'admin');
            console.log("Is Admin set to:", isUserAdmin || role === 'admin');
            
            // If the stored username is generic but we have a display name from Google, update it
            let currentUsername = userData.username || 'User';
            if ((currentUsername === 'User' || currentUsername === 'Guest') && user.displayName) {
              currentUsername = user.displayName;
              updateDoc(userDocRef, { username: currentUsername }).catch(e => console.error("Update username failed", e));
            }
            
            setUsername(currentUsername);
            setBalance(typeof currentBalance === 'number' ? currentBalance.toFixed(4) : '5000.0000');
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
    console.log("Setting up data listeners. UID:", uid, "IsAdmin:", isAdmin);

    // Real-time services
    const servicesUnsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const servicesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setServices(servicesList);
    }, (error) => {
      console.error("Services snapshot error", error);
      handleFirestoreError(error, OperationType.GET, 'services');
    });

    // Real-time orders (if admin see all, if user see only own)
    const ordersQuery = isAdmin 
      ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'orders'), where('uid', '==', uid));
    
    const ordersUnsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      console.log(`Orders snapshot received. Count: ${snapshot.size}`);
      const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      // Sort in memory if not sorted by Firestore
      if (!isAdmin) {
        ordersList.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
      }
      console.log("Setting orders state with:", ordersList.length, "orders");
      setOrders(ordersList);
    }, (error) => {
      console.error("Orders snapshot error", error);
      handleFirestoreError(error, OperationType.GET, 'orders');
    });

    // Real-time tickets
    const ticketsQuery = isAdmin
      ? query(collection(db, 'tickets'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'tickets'), where('uid', '==', uid));

    const ticketsUnsubscribe = onSnapshot(ticketsQuery, (snapshot) => {
      const ticketsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      if (!isAdmin) {
        ticketsList.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
      }
      setTickets(ticketsList);
    }, (error) => {
      console.error("Tickets snapshot error", error);
      handleFirestoreError(error, OperationType.GET, 'tickets');
    });

    // Real-time refills
    const refillsQuery = isAdmin
      ? query(collection(db, 'refills'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'refills'), where('uid', '==', uid));

    const refillsUnsubscribe = onSnapshot(refillsQuery, (snapshot) => {
      const refillsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      if (!isAdmin) {
        refillsList.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
      }
      setRefills(refillsList);
    }, (error) => {
      console.error("Refills snapshot error", error);
      handleFirestoreError(error, OperationType.GET, 'refills');
    });

    // Real-time users (admin only)
    let usersUnsubscribe = () => {};
    if (isAdmin) {
      usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        setUsers(usersList);
      }, (error) => {
        console.error("Users snapshot error", error);
        handleFirestoreError(error, OperationType.GET, 'users');
      });
    }

    // Real-time balance and totalSpent update
    const userUnsubscribe = onSnapshot(doc(db, 'users', uid!), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const userEmail = email?.toLowerCase() || '';
        const isUserAdmin = (userEmail === 'shaikhmubasshir76@gmail.com' || userEmail === 'shaikhmubasshir875@gmail.com' || userEmail === 'lombardiraffaelo6@gmail.com');
        let currentBalance = typeof data.balance === 'number' ? data.balance : 0;
        if (isUserAdmin && currentBalance < 5000) currentBalance = 5000;
        
        setBalance(currentBalance.toFixed(4));
        setTotalSpent(typeof data.totalSpent === 'number' ? data.totalSpent.toFixed(4) : '0.0000');
        if (data.username) setUsername(data.username);
      }
    }, (error) => {
      console.error("User profile snapshot error", error);
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    });

    // Real-time transactions
    const transactionsQuery = isAdmin
      ? query(collection(db, 'transactions'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'transactions'), where('uid', '==', uid));
    
    const transactionsUnsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      if (!isAdmin) {
        transactionsList.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
      }
      setTransactions(transactionsList);
    }, (error) => {
      console.error("Transactions snapshot error", error);
      handleFirestoreError(error, OperationType.GET, 'transactions');
    });

    // Real-time subscriptions
    const subscriptionsQuery = isAdmin 
      ? collection(db, 'subscriptions')
      : query(collection(db, 'subscriptions'), where('uid', '==', uid));
    const subscriptionsUnsubscribe = onSnapshot(subscriptionsQuery, (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'subscriptions'));

    // Real-time updates
    const updatesUnsubscribe = onSnapshot(query(collection(db, 'updates'), orderBy('createdAt', 'desc')), (snapshot) => {
      setUpdates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'updates'));

    return () => {
      servicesUnsubscribe();
      ordersUnsubscribe();
      ticketsUnsubscribe();
      refillsUnsubscribe();
      transactionsUnsubscribe();
      subscriptionsUnsubscribe();
      updatesUnsubscribe();
      usersUnsubscribe();
      userUnsubscribe();
    };
  }, [isLoggedIn, isAdmin, uid, isProfileLoaded, email]);

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
      <div className="min-h-screen bg-white">
        <LandingPage onLogin={handleLogin} showToast={showToast} services={services} />
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
      case 'new-order': return <NewOrder setActivePage={setActivePage} balance={balance} totalSpent={totalSpent} services={services} username={username} uid={uid!} orders={orders} showToast={showToast} />;
      case 'orders': return <Orders setActivePage={setActivePage} orders={orders} uid={uid!} showToast={showToast} />;
      case 'tickets': return <Tickets tickets={tickets} uid={uid!} showToast={showToast} />;
      case 'subscriptions': return <Subscriptions subscriptions={subscriptions} />;
      case 'refill': return <Refill refills={refills} />;
      case 'add-funds': return <AddFunds uid={uid!} showToast={showToast} />;
      case 'transactions': return <Transactions transactions={transactions} />;
      case 'profile': return <Profile username={username} uid={uid!} balance={balance} totalSpent={totalSpent} memberSince={memberSince} />;
      case 'services': return <Services services={services} />;
      case 'mass-order': return <MassOrder services={services} uid={uid!} balance={balance} totalSpent={totalSpent} showToast={showToast} />;
      case 'updates': return <Updates updates={updates} />;
      case 'admin': return (
        <AdminDashboard 
          services={services} 
          orders={orders} 
          tickets={tickets}
          refills={refills}
          users={users}
          subscriptions={subscriptions}
          updates={updates}
          transactions={transactions}
          showToast={showToast}
        />
      );
      default: return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid size={32} />
          </div>
          <h3 className="font-black text-sm uppercase tracking-[0.2em]">lombardiservices</h3>
          <p className="text-xs font-bold mt-2 uppercase tracking-widest opacity-60">This section is being updated</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-smm-bg text-smm-text-dark font-sans">
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
      <a 
        href="https://wa.me/message/XRM6CMEHIU5EP1" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer hover:scale-110 transition-transform z-50"
      >
        <MessageCircle size={32} />
      </a>

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
