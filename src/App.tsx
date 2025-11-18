import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from '@/components/ui/toaster';

// Pages
import LandingPage from '@/pages/LandingPage';
import MusicianSignupPage from '@/pages/MusicianSignupPage';
import LabelLoginPage from '@/pages/LabelLoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ArtistDirectoryPage from '@/pages/ArtistDirectoryPage';
import ArtistDetailPage from '@/pages/ArtistDetailPage';
import TrainingHubPage from '@/pages/TrainingHubPage';
import LessonPage from '@/pages/LessonPage';
import TalentScorecardPage from '@/pages/TalentScorecardPage';
import LevelProgressionPage from '@/pages/LevelProgressionPage';
import LabelDashboardPage from '@/pages/LabelDashboardPage';
import MentorDirectoryPage from '@/pages/MentorDirectoryPage';
import PromotionalGuidePage from '@/pages/PromotionalGuidePage';
import DrillPracticePage from '@/pages/DrillPracticePage';
import MelodyTrainerPage from '@/pages/MelodyTrainerPage';

function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: 'MUSICIAN' | 'LABEL';
}) {
  const { isAuthenticated, hasRole } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/musician/signup" element={<MusicianSignupPage />} />
        <Route path="/label/login" element={<LabelLoginPage />} />

        {/* Musician Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="MUSICIAN">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training"
          element={
            <ProtectedRoute requiredRole="MUSICIAN">
              <TrainingHubPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training/lesson/:lessonId"
          element={
            <ProtectedRoute requiredRole="MUSICIAN">
              <LessonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training/scorecard"
          element={
            <ProtectedRoute requiredRole="MUSICIAN">
              <TalentScorecardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training/level-progression"
          element={
            <ProtectedRoute requiredRole="MUSICIAN">
              <LevelProgressionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training/drill-practice"
          element={
            <ProtectedRoute requiredRole="MUSICIAN">
              <DrillPracticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training/melody-trainer"
          element={
            <ProtectedRoute requiredRole="MUSICIAN">
              <MelodyTrainerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promotional-guide"
          element={
            <ProtectedRoute requiredRole="MUSICIAN">
              <PromotionalGuidePage />
            </ProtectedRoute>
          }
        />

        {/* Label Protected Routes */}
        <Route
          path="/label/dashboard"
          element={
            <ProtectedRoute requiredRole="LABEL">
              <LabelDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/label/artist/:id"
          element={
            <ProtectedRoute requiredRole="LABEL">
              <TalentScorecardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/label/mentors"
          element={
            <ProtectedRoute requiredRole="LABEL">
              <MentorDirectoryPage />
            </ProtectedRoute>
          }
        />

        {/* Public National Music Database */}
        <Route path="/nmd" element={<ArtistDirectoryPage />} />
        <Route path="/nmd/:id" element={<ArtistDetailPage />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
