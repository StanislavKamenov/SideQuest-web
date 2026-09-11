import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard,
  CalendarDays,
  Gift,
  CreditCard,
  Receipt,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';
import ArcadeScene from '@/components/landing/3d/ArcadeScene';
import HeroArcade from '@/components/landing/3d/HeroArcade';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'OVERVIEW', end: true },
  { to: '/admin/events', icon: CalendarDays, label: 'EVENTS' },
  { to: '/admin/redemptions', icon: Gift, label: 'REDEMPTIONS' },
  { to: '/admin/payments', icon: CreditCard, label: 'PAYMENTS' },
  { to: '/admin/billing', icon: Receipt, label: 'BILLING' },
  { to: '/admin/expenses', icon: Receipt, label: 'EXPENSES' },
  { to: '/admin/settings', icon: Settings, label: 'SETTINGS' },
];

function SidebarLink({ to, icon: Icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 font-pixel text-[8px] tracking-wider transition-all group relative ${
        active
          ? 'text-[#E85D4A] bg-[#E85D4A]/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
      }`}
    >
      {/* Active indicator bar */}
      {active && (
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[#E85D4A]"
          style={{ boxShadow: '0 0 8px #E85D4A' }}
        />
      )}
      {/* Active pixel arrow */}
      {active && (
        <span className="text-[#E85D4A] text-[7px] mr-[-4px]"
          style={{ textShadow: '0 0 6px #E85D4A' }}
        >
          ▸
        </span>
      )}
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
      {active && (
        <ChevronRight className="w-3 h-3 ml-auto" />
      )}
    </Link>
  );
}

export default function AdminLayout() {
  const { user, profile, logout, isSysAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
          <span className="font-pixel text-[9px] text-foreground tracking-tight"
            style={{ textShadow: '0 0 10px rgba(232, 93, 74, 0.5)' }}
          >
            SIDE<span className="text-[#E85D4A]">QUEST</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 mt-3">
          <span className="w-1.5 h-1.5 bg-[#C8E650] animate-pulse" style={{ boxShadow: '0 0 4px #C8E650' }} />
          <span className="font-pixel text-[6px] text-[#C8E650] tracking-widest"
            style={{ textShadow: '0 0 6px #C8E65066' }}
          >
            COMMAND CENTER
          </span>
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
        {isSysAdmin && (
          <button
            onClick={() => navigate('/sysadmin')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-3 bg-[#A663E0]/10 border border-[#A663E0]/50 font-pixel text-[7px] text-[#A663E0] hover:bg-[#A663E0]/20 transition-all tracking-wider"
            style={{ textShadow: '0 0 6px #A663E066' }}
          >
            <Settings className="w-3 h-3" />
            SYS ADMIN PANEL
          </button>
        )}

        {/* Player status card */}
        <div className="crt-card p-3 mb-3">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 bg-[#E85D4A]/20 border border-[#E85D4A]/40 flex items-center justify-center font-pixel text-[10px] text-[#E85D4A]"
              style={{ boxShadow: '0 0 8px #E85D4A22' }}
            >
              {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'B'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-pixel text-[7px] text-foreground truncate tracking-wide">
                {profile?.username || 'Business'}
              </p>
              <p className="font-body text-[10px] text-muted-foreground truncate">
                {user?.email || 'admin@sidequest.app'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-border font-pixel text-[7px] text-muted-foreground hover:text-[#E85D4A] hover:border-[#E85D4A]/50 transition-all tracking-wider"
        >
          <LogOut className="w-3 h-3" />
          LOG OUT
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* 3D Ambient Layer */}
      <ArcadeScene>
        <HeroArcade scrollProgress={0.1} mousePosition={mousePosition} />
      </ArcadeScene>

      {/* Desktop Sidebar — Arcade Command Center */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 arcade-sidebar z-40">
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
              className="fixed inset-y-0 left-0 w-64 arcade-sidebar z-50 md:hidden flex flex-col"
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
      <div className="flex-1 md:ml-60 relative z-10">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 arcade-hud px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SideQuest" className="w-7 h-7" />
            <span className="font-pixel text-[8px]"
              style={{ textShadow: '0 0 10px rgba(232, 93, 74, 0.5)' }}
            >
              SIDE<span className="text-[#E85D4A]">QUEST</span>
            </span>
          </Link>
          <div className="w-5" />
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
