import React, {
  Suspense,
  lazy,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout
  from "@/app/layouts/MainLayout";

import ProtectedRoute
  from "@/routes/ProtectedRoute";

import RoleRoute
  from "@/routes/RoleRoute";

/* Loading */
import PageLoader
  from "@/components/loaders/PageLoader";

/* Lazy Pages */
const Dashboard = lazy(() =>
  import("@/pages/Dashboard")
);

const OpenTrades = lazy(() =>
  import("@/pages/OpenTrades")
);

const Journal = lazy(() =>
  import("@/pages/Journal")
);

const NewTrade = lazy(() =>
  import("@/pages/NewTrade")
);

const CreateTrade = lazy(() =>
  import("@/pages/CreateTrade")
);

const Analytics = lazy(() =>
  import("@/pages/Analytics")
);

const Calendar = lazy(() =>
  import("@/pages/Calendar")
);

const AIInsights = lazy(() =>
  import("@/pages/AIInsights")
);

const Strategies = lazy(() =>
  import("@/pages/Strategies")
);

const Settings = lazy(() =>
  import("@/pages/Settings")
);

const Login = lazy(() =>
  import("@/pages/Login")
);

const Register = lazy(() =>
  import("@/pages/Register")
);

const NotFound = lazy(() =>
  import("@/pages/NotFound")
);

export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Suspense
        fallback={<PageLoader />}
      >

        <Routes>

          {/* Dashboard */}
          <Route
            path="/"
            element={

              <ProtectedRoute>

                <MainLayout>

                  <Dashboard />

                </MainLayout>

              </ProtectedRoute>
            }
          />

          {/* Open Trades */}
          <Route
            path="/open-trades"
            element={

              <ProtectedRoute>

                <MainLayout>

                  <OpenTrades />

                </MainLayout>

              </ProtectedRoute>
            }
          />

          {/* Journal */}
          <Route
            path="/journal"
            element={

              <ProtectedRoute>

                <MainLayout>

                  <Journal />

                </MainLayout>

              </ProtectedRoute>
            }
          />

          {/* New Trade */}
          <Route
            path="/new-trade"
            element={

              <ProtectedRoute>

                <MainLayout>

                  <NewTrade />

                </MainLayout>

              </ProtectedRoute>
            }
          />

          {/* Create Trade */}
          <Route
            path="/create-trade"
            element={

              <ProtectedRoute>

                <MainLayout>

                  <CreateTrade />

                </MainLayout>

              </ProtectedRoute>
            }
          />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={

              <ProtectedRoute>

                <RoleRoute
                  allowedRoles={[
                    "TRADER",
                    "ADMIN",
                    "ANALYST",
                  ]}
                >

                  <MainLayout>

                    <Analytics />

                  </MainLayout>

                </RoleRoute>

              </ProtectedRoute>
            }
          />

          {/* Calendar */}
          <Route
            path="/calendar"
            element={

              <ProtectedRoute>

                <MainLayout>

                  <Calendar />

                </MainLayout>

              </ProtectedRoute>
            }
          />

          {/* AI Insights */}
          <Route
            path="/ai-insights"
            element={

              <ProtectedRoute>

                <MainLayout>

                  <AIInsights />

                </MainLayout>

              </ProtectedRoute>
            }
          />

          {/* Strategies */}
          <Route
            path="/strategies"
            element={

              <ProtectedRoute>

                <MainLayout>

                  <Strategies />

                </MainLayout>

              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={

              <ProtectedRoute>

                <MainLayout>

                  <Settings />

                </MainLayout>

              </ProtectedRoute>
            }
          />

          {/* Auth */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </Suspense>

    </BrowserRouter>
  );
}