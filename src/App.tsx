import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Toaster } from '@/components/ui/toaster';

// Pages
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import ArtistDirectoryPage from '@/pages/ArtistDirectoryPage';
import ArtistDetailPage from '@/pages/ArtistDetailPage';
import TrainingHubPage from '@/pages/TrainingHubPage';
import LessonPage from '@/pages/LessonPage';
import TalentScorecardPage from '@/pages/TalentScorecardPage';
import LevelProgressionPage from '@/pages/LevelProgressionPage';
import LabelPortalLoginPage from '@/pages/LabelPortalLoginPage';
import LabelDashboardPage from '@/pages/LabelDashboardPage';
import MentorDirectoryPage from '@/pages/MentorDirectoryPage';
import PromotionalGuidePage from '@/pages/PromotionalGuidePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* National Music Database */}
        <Route path="/nmd" element={<ArtistDirectoryPage />} />
        <Route path="/nmd/:id" element={<ArtistDetailPage />} />

        {/* Training */}
        <Route
          path="/training"
          element={
            <ProtectedRoute>
              <TrainingHubPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <LessonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training/scorecard"
          element={
            <ProtectedRoute>
              <TalentScorecardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training/level-progression"
          element={
            <ProtectedRoute>
              <LevelProgressionPage />
            </ProtectedRoute>
          }
        />

        {/* Label Portal */}
        <Route path="/label-portal" element={<LabelPortalLoginPage />} />
        <Route path="/label-portal/dashboard" element={<LabelDashboardPage />} />
        <Route path="/label-portal/artist/:id" element={<TalentScorecardPage />} />
        <Route path="/label-portal/mentors" element={<MentorDirectoryPage />} />

        {/* Promotional Guide */}
        <Route
          path="/promotional-guide"
          element={
            <ProtectedRoute>
              <PromotionalGuidePage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
