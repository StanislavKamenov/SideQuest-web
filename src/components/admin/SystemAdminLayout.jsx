import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Target,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ArrowLeftRight,
  DollarSign,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

const navItems = [
  { to: '/sysadmin', icon: LayoutDashboard, label: 'OVERVIEW', end: true },
  { to: '/sysadmin/businesses', icon: Building2, label: 'BUSINESSES' },
  { to: '/sysadmin/missions', icon: Target, label: 'MISSIONS' },
  { to: '/sysadmin/players', icon: Users, label: 'PLAYERS' },
  { to: '/sysadmin/review-queue', icon: ShieldAlert, label: 'REVIEW QUEUE' },
  { to: '/sysadmin/payments', icon: DollarSign, label: 'PAYMENTS' },
];

function SidebarLink({ to, icon: Icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 font-pixel text-[8px] tracking-wider transition-all group relative ${
        active
          ? 'text-[#A663E0] bg-[#A663E0]/10 border-r-2 border-[#A663E0]'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
      {active && (
        <ChevronRight className="w-3 h-3 ml-auto" />
      )}
    </Link>
  );
}

export default function SystemAdminLayout() {
  const { user, profile, logout, isBusiness } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="SideQuest" className="w-8 h-8 object-contain" />
          <span className="font-pixel text-[9px] text-foreground tracking-tight" style={{ textShadow: '0 0 10px rgba(166, 99, 224, 0.5)' }}>
            SIDE<span className="text-[#A663E0]">QUEST</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 mt-3">
          <span className="w-1.5 h-1.5 bg-[#4EE6D0] animate-pulse" />
          <span className="font-pixel text-[6px] text-[#4EE6D0] tracking-widest">SYSTEM ADMIN</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4">
        <div className="px-4 mb-3">
          <span className="font-pixel text-[6px] text-muted-foreground/60 tracking-widest">NAVIGATION</span>
        </div>
        {navItems.map((item) => (
          <SidebarLink
            key={item.to}
            {...item}
            active={isActive(item.to, item.end)}
            onClick={() => setSidebarOpen(false)}
          />
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border">
        {isBusiness && (
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-3 bg-[#E85D4A]/10 border border-[#E85D4A]/50 font-pixel text-[7px] text-[#E85D4A] hover:bg-[#E85D4A]/20 transition-all tracking-wider"
          >
            <ArrowLeftRight className="w-3 h-3" />
            BUSINESS PANEL
          </button>
        )}

        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#A663E0]/20 border border-[#A663E0]/40 flex items-center justify-center font-pixel text-[10px] text-[#A663E0]">
            {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-pixel text-[7px] text-foreground truncate tracking-wide">
              {profile?.username || 'Admin'}
            </p>
            <p className="font-body text-[10px] text-muted-foreground truncate">
              {user?.email || 'admin@sidequest.app'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-border font-pixel text-[7px] text-muted-foreground hover:text-[#A663E0] hover:border-[#A663E0]/50 transition-all tracking-wider"
        >
          <LogOut className="w-3 h-3" />
          LOG OUT
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-card border-r border-border z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 md:hidden flex flex-col"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 md:ml-60">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SideQuest" className="w-7 h-7" />
            <span className="font-pixel text-[8px]" style={{ textShadow: '0 0 10px rgba(166, 99, 224, 0.5)' }}>
              SIDE<span className="text-[#A663E0]">QUEST</span>
            </span>
          </Link>
          <div className="w-5" /> {/* Spacer */}
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
