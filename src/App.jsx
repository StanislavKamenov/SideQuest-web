import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ProofFeed from './pages/ProofFeed';
import RetroCursorTrail from '@/components/RetroCursorTrail';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminEvents from '@/pages/admin/AdminEvents';
import AdminRedemptions from '@/pages/admin/AdminRedemptions';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminExpenses from '@/pages/admin/AdminExpenses';
import AdminSettings from '@/pages/admin/AdminSettings';

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
        <Route path="expenses" element={<AdminExpenses />} />
        <Route path="settings" element={<AdminSettings />} />
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
          <AppRoutes />
        </Router>
        <Toaster />
        <RetroCursorTrail />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App