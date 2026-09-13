import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ProofFeed from './pages/ProofFeed';
import ArcadeLoader from '@/components/ArcadeLoader';
import RetroCursorTrail from '@/components/RetroCursorTrail';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminEvents from '@/pages/admin/AdminEvents';
import AdminRedemptions from '@/pages/admin/AdminRedemptions';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminBilling from '@/pages/admin/AdminBilling';
import AdminSettings from '@/pages/admin/AdminSettings';

// SysAdmin components
import SystemAdminLayout from '@/components/admin/SystemAdminLayout';
import SysAdminDashboard from '@/pages/sysadmin/SysAdminDashboard';
import SysAdminBusinesses from '@/pages/sysadmin/SysAdminBusinesses';
import SysAdminMissions from '@/pages/sysadmin/SysAdminMissions';
import SysAdminPlayers from '@/pages/sysadmin/SysAdminPlayers';
import SysAdminPayments from '@/pages/sysadmin/SysAdminPayments';
import SysAdminReviewQueue from '@/pages/sysadmin/SysAdminReviewQueue';
import SysAdminReports from '@/pages/sysadmin/SysAdminReports';
import SysAdminAuditLog from '@/pages/sysadmin/SysAdminAuditLog';

// Protected route wrapper for business-only access
function BusinessRoute({ children }) {
  const { isAuthenticated, isBusiness, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#E85D4A]/30 border-t-[#E85D4A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-pixel text-[8px] text-muted-foreground tracking-widest">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isBusiness) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Protected route wrapper for system admin access
function SysAdminRoute({ children }) {
  const { isAuthenticated, isSysAdmin, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#A663E0]/30 border-t-[#A663E0] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-pixel text-[8px] text-muted-foreground tracking-widest">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isSysAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/proof" element={<ProofFeed />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/login" element={<Login />} />

      {/* Admin routes — business only */}
      <Route
        path="/admin"
        element={
          <BusinessRoute>
            <AdminLayout />
          </BusinessRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="redemptions" element={<AdminRedemptions />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="billing" element={<AdminBilling />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* System Admin routes */}
      <Route
        path="/sysadmin"
        element={
          <SysAdminRoute>
            <SystemAdminLayout />
          </SysAdminRoute>
        }
      >
        <Route index element={<SysAdminDashboard />} />
        <Route path="businesses" element={<SysAdminBusinesses />} />
        <Route path="missions" element={<SysAdminMissions />} />
        <Route path="players" element={<SysAdminPlayers />} />
        <Route path="payments" element={<SysAdminPayments />} />
        <Route path="review-queue" element={<SysAdminReviewQueue />} />
        <Route path="reports" element={<SysAdminReports />} />
        <Route path="audit-log" element={<SysAdminAuditLog />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <ArcadeLoader isLoading={false} />
          <AppRoutes />
        </Router>
        <Toaster />
        <RetroCursorTrail />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App