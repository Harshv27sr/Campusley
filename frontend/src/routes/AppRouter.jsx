// src/routes/AppRouter.jsx
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'

// Public Pages
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ExploreNotesPage from '../pages/ExploreNotesPage'
import NoteDetailPage from '../pages/NoteDetailPage'
import PreviousYearPapersPage from '../pages/PreviousYearPapersPage'
import NotFoundPage from '../pages/NotFoundPage'

// Protected Pages
import DashboardPage from '../pages/DashboardPage'
import UploadNotesPage from '../pages/UploadNotesPage'
import UserProfilePage from '../pages/UserProfilePage'
import BookmarksPage from '../pages/BookmarksPage'
import NotificationsPage from '../pages/NotificationsPage'
import SettingsPage from '../pages/SettingsPage'

// Admin Pages
import AdminDashboardPage from '../pages/AdminDashboardPage'

// Verification Page
import VerifyPendingPage from '../pages/VerifyPendingPage'

// AI Study Portal Page
import AIEnginePage from '../pages/AIEnginePage'

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Core Pages */}
      <Route path="/explore" element={<ProtectedRoute><ExploreNotesPage /></ProtectedRoute>} />
      <Route path="/notes/:id" element={<ProtectedRoute><NoteDetailPage /></ProtectedRoute>} />
      <Route path="/papers" element={<ProtectedRoute><PreviousYearPapersPage /></ProtectedRoute>} />

      {/* Protected */}
      <Route path="/verify-pending" element={<ProtectedRoute><VerifyPendingPage /></ProtectedRoute>} />
      <Route path="/ai-companion" element={<ProtectedRoute><AIEnginePage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadNotesPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/notes" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
