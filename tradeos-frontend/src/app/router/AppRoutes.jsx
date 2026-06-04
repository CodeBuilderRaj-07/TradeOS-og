import { Suspense, lazy, useEffect } from "react";

import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import MainLayout from "@/app/layouts/MainLayout";
import AdminLayout from "@/app/layouts/AdminLayout";

import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";
import { ROLES } from "@/app/config/roles";

/* Loading */
import PageLoader from "@/components/loaders/PageLoader";

import PageErrorBoundary from "@/components/common/PageErrorBoundary";

/* Lazy Pages */
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const OpenTrades = lazy(() => import("@/pages/OpenTrades"));
const Journal = lazy(() => import("@/pages/Journal"));
const NewTrade = lazy(() => import("@/pages/NewTrade"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const AIInsights = lazy(() => import("@/pages/AIInsights"));
const Strategies = lazy(() => import("@/pages/Strategies"));
const Settings = lazy(() => import("@/pages/Settings"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const TradeDetail = lazy(() => import("@/pages/TradeDetail"));
const AlgoTrading = lazy(() => import("@/pages/AlgoTrading"));
const AlgoBuilder = lazy(() => import("@/pages/AlgoBuilder"));
const CreateTrade = lazy(() => import("@/pages/CreateTrade"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const pageVariants = {
  initial: { opacity: 0, scale: 0.97, y: 16, filter: "blur(4px)" },
  animate: {
    opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 26, mass: 0.7 },
  },
  exit: {
    opacity: 0, scale: 0.96, y: -10, filter: "blur(6px)",
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => navigate(e.detail, { replace: true });
    window.addEventListener("app-navigate", handler);
    return () => window.removeEventListener("app-navigate", handler);
  }, [navigate]);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: "transform, opacity, filter" }}
      >
        <Routes location={location}>

          {/* Dashboard */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <Dashboard />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Open Trades */}
          <Route path="/trades/open" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <OpenTrades />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Journal */}
          <Route path="/journal" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <Journal />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* New Trade */}
          <Route path="/new-trade" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <NewTrade />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Algo Trading */}
          <Route path="/algo-trading" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <AlgoTrading />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/algo/new" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <AlgoBuilder />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/algo/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <AlgoBuilder />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Analytics */}
          <Route path="/analytics" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <Analytics />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Calendar */}
          <Route path="/calendar" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <Calendar />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* AI Insights */}
          <Route path="/ai-insights" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <AIInsights />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Strategies */}
          <Route path="/strategies" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <Strategies />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Settings */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <Settings />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Trade Detail */}
          <Route path="/trade/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <TradeDetail />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Create Trade */}
          <Route path="/trades/new" element={
            <ProtectedRoute>
              <MainLayout>
                <PageErrorBoundary>
                  <CreateTrade />
                </PageErrorBoundary>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout>
                  <PageErrorBoundary>
                    <AdminDashboard />
                  </PageErrorBoundary>
                </AdminLayout>
              </RoleRoute>
            </ProtectedRoute>
          } />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
