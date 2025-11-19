import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound";

// Auth Pages
import Register from "@/pages/auth/register";
import Login from "@/pages/auth/login";

import type { UserRole } from "./types/models.types";
import { CustomCursor } from "@/components/CustomCursor";
import { ThreeBackground } from "@/components/ThreeBackground";
import { AppLayout } from "@/layouts/app-layout";

// Dashboards
import ArtistDashboard from "@/pages/artist/dashboard";
import SponsorDashboard from "@/pages/sponsor/dashboard";
import TrainingHubPage from "./pages/artist/dashboard/training/index";
import LessonPage from "./pages/artist/dashboard/training/lesson/show";
import TalentScorecardPage from "./pages/artist/dashboard/training/scorecard";
import LevelProgressionPage from "./pages/LevelProgressionPage";
import DrillPracticePage from "./pages/artist/dashboard/training/drill-practice";
import MelodyTrainerPage from "./pages/artist/dashboard/training/melody-trainer.tsx";
import PromotionalGuidePage from "./pages/artist/dashboard/promotion-guide";
import LabelDashboardPage from "./pages/sponsor/dashboard";
import ArtistDirectoryPage from "./pages/artist/dashboard/nmd/index";
import ArtistDetailPage from "./pages/artist/dashboard/nmd/show";

function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
}) {
  const { isAuthenticated, hasRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect users without required role to their dashboard
    if (hasRole("artist")) return <Navigate to="/artist-dashboard" replace />;
    if (hasRole("sponsor")) return <Navigate to="/sponsor-dashboard" replace />;

    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, hasRole } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CustomCursor />
        <ThreeBackground />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Root Route Redirect */}
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <Navigate to="/login" replace />
                ) : hasRole("artist") ? (
                  <Navigate to="/artist-dashboard" replace />
                ) : hasRole("sponsor") ? (
                  <Navigate to="/sponsor-dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Public Auth Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* artist dashboard */}
            <Route
              path="artist-dashboard"
              element={
                <ProtectedRoute requiredRole="artist">
                  <AppLayout>
                    <Outlet />
                  </AppLayout>
                </ProtectedRoute>
              }
            >
              <Route index element={<ArtistDashboard />} />
              <Route path="training">
                <Route index element={<TrainingHubPage />} />
                <Route path="lesson/:lessonId" element={<LessonPage />} />
                <Route path="scorecard" element={<TalentScorecardPage />} />
                <Route
                  path="level-progression"
                  element={<LevelProgressionPage />}
                />
                <Route path="drill-practice" element={<DrillPracticePage />} />
                <Route path="melody-trainer" element={<MelodyTrainerPage />} />
              </Route>
              <Route
                path="promotional-guide"
                element={<PromotionalGuidePage />}
              />

              <Route path="nmd">
                <Route index element={<ArtistDirectoryPage />} />
                <Route path=":id" element={<ArtistDetailPage />} />
              </Route>
            </Route>

            <Route path="mentors" />
            <Route path="sponsor-dashboard">
              <Route
                index
                element={
                  <ProtectedRoute requiredRole="sponsor">
                    <LabelDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="artist/:id" />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
