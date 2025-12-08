import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RoleDashboard from "./pages/RoleDashboard";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentSkillsSelectionPage from "./pages/student/StudentSkillsSelectionPage";
import AlumniDashboardPage from "./pages/alumni/AlumniDashboardPage";
import CollegeDashboardPage from "./pages/college/CollegeDashboardPage";
import JobsPage from "./pages/JobsPage";
import AlumniDirectoryPage from "./pages/AlumniDirectoryPage";
import EventsCampaignsPage from "./pages/EventsCampaignsPage";
import AlumniNetworkPage from "./pages/alumni/AlumniNetworkPage";
import AlumniStudentsPage from "./pages/alumni/AlumniStudentsPage";
import ConnectedAlumniPage from "./pages/alumni/ConnectedAlumniPage";
import ConnectedStudentsPage from "./pages/alumni/ConnectedStudentsPage";
import AlumniJobCreationPage from "./pages/alumni/AlumniJobCreationPage";
import AlumniEventCreationPage from "./pages/alumni/AlumniEventCreationPage";
import CollegeAlumniPage from "./pages/college/CollegeAlumniPage";
import CollegeStudentsPage from "./pages/college/CollegeStudentsPage";
import CollegeJobCreationPage from "./pages/college/CollegeJobCreationPage";
import CollegeJobManagementPage from "./pages/college/CollegeJobManagementPage";
import CollegeJobEditPage from "./pages/college/CollegeJobEditPage";
import CollegeEventCreationPage from "./pages/college/CollegeEventCreationPage";
import CollegeEventManagementPage from "./pages/college/CollegeEventManagementPage";
import CollegeEventEditPage from "./pages/college/CollegeEventEditPage";
import CollegeCampaignCreationPage from "./pages/college/CollegeCampaignCreationPage";
import CollegeNewslettersPage from "./pages/college/CollegeNewslettersPage";
import CollegeNewsletterCreationPage from "./pages/college/CollegeNewsletterCreationPage";
import AlumniJobApplicationsPage from "./pages/alumni/AlumniJobApplicationsPage";
import CollegeJobApplicationsPage from "./pages/college/CollegeJobApplicationsPage";
import StudentApplicationsPage from "./pages/student/StudentApplicationsPage";
import StudentMentorshipsPage from "./pages/student/StudentMentorshipsPage";
import StudentEventRegistrationsPage from "./pages/student/StudentEventRegistrationsPage";
import AlumniEventRegistrationsPage from "./pages/alumni/AlumniEventRegistrationsPage";
import CollegeEventRegistrationsPage from "./pages/college/CollegeEventRegistrationsPage";
import AlumniMentorshipsPage from "./pages/alumni/AlumniMentorshipsPage";
import AlumniJobManagementPage from "./pages/alumni/AlumniJobManagementPage";
import AlumniJobEditPage from "./pages/alumni/AlumniJobEditPage";
import AlumniEventManagementPage from "./pages/alumni/AlumniEventManagementPage";
import AlumniEventEditPage from "./pages/alumni/AlumniEventEditPage";
import AlumniLinkedInFeedPage from "./pages/alumni/AlumniLinkedInFeedPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import CollegeBulkImportPage from "./pages/college/CollegeBulkImportPage";
import AlumniProfileCompletionPage from "./pages/onboarding/AlumniProfileCompletionPage";
import StudentProfileCompletionPage from "./pages/onboarding/StudentProfileCompletionPage";
import CollegeProfileCompletionPage from "./pages/onboarding/CollegeProfileCompletionPage";
import DomainExplorerPage from "./pages/DomainExplorerPage";
import SkillRadarPage from "./pages/SkillRadarPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { UserRole, type Alumni, type Student } from "./types";
import PendingVerificationPage from "./pages/PendingVerificationPage";
import { tokenService } from "./lib/api";
import "./App.css";

// Global app shell to enforce pending-verification redirect and navbar visibility
const AppShell = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Check verification both from in-memory user and from cookie so that
  // direct URL access / hard refreshes are still locked down.
  const isUnverifiedByUser =
    isAuthenticated &&
    user &&
    (user.role === UserRole.Alumni || user.role === UserRole.Student) &&
    !(user as Alumni | Student).isVerified;

  const cookieVerified = tokenService.getVerificationStatus();
  const isUnverifiedByCookie = cookieVerified === false;

  const isUnverifiedUser = isUnverifiedByUser || isUnverifiedByCookie;

  // If unverified alumni/student tries to access anything except pending-verification and onboarding,
  // force redirect to the pending verification page.
  const isOnboardingPage = location.pathname.startsWith("/onboarding");
  if (
    isUnverifiedUser &&
    location.pathname !== "/pending-verification" &&
    !isOnboardingPage
  ) {
    return <Navigate to="/pending-verification" replace />;
  }

  // Hide navbar entirely for unverified users on the pending verification flow and onboarding
  const showNavbar = !isUnverifiedUser && !isOnboardingPage;

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {showNavbar && <Navbar />}
      <Outlet />
    </div>
  );
};

import AuthLayout from "./components/layout/AuthLayout";
import LandingPageLayout from "./components/layout/LandingPageLayout";

// ... (imports remain the same)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page route */}
          <Route element={<LandingPageLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
          </Route>

          {/* Protected routes with the main app shell and navbar */}
          <Route element={<AppShell />}>
            {/* Onboarding - Profile Completion */}
            <Route
              path="/onboarding/alumni"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniProfileCompletionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/student"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Student]}>
                  <StudentProfileCompletionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/college"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeProfileCompletionPage />
                </ProtectedRoute>
              }
            />

            {/* Pending verification */}
            <Route
              path="/pending-verification"
              element={<PendingVerificationPage />}
            />

            {/* Alumni LinkedIn Feed */}
            <Route
              path="/alumni/linkedin-feed"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniLinkedInFeedPage />
                </ProtectedRoute>
              }
            />

            {/* Jobs & Events - require authentication (no public access) */}
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <JobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventsCampaignsPage />
                </ProtectedRoute>
              }
            />

            {/* Role-based Dashboards */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/skills-selection"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Student]}>
                  <StudentSkillsSelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Student]}>
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/dashboard"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/dashboard"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/alumni"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Student]}>
                  <AlumniDirectoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/applications"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Student]}>
                  <StudentApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/mentorships"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Student]}>
                  <StudentMentorshipsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/events"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Student]}>
                  <StudentEventRegistrationsPage />
                </ProtectedRoute>
              }
            />

            {/* Alumni Routes */}
            <Route
              path="/alumni/network"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniNetworkPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/students"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/connected-alumni"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <ConnectedAlumniPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/connected-students"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <ConnectedStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/jobs/create"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniJobCreationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/jobs"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniJobManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/jobs/edit/:id"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniJobEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/events/create"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniEventCreationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/events"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniEventManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/events/edit/:id"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniEventEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/mentorships"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniMentorshipsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/events/registrations"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniEventRegistrationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/jobs/applications"
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniJobApplicationsPage />
                </ProtectedRoute>
              }
            />

            {/* College Routes */}
            <Route
              path="/college/alumni"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeAlumniPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/students"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/jobs/create"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeJobCreationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/jobs"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeJobManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/jobs/edit/:id"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeJobEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/events/create"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeEventCreationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/events"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeEventManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/events/edit/:id"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeEventEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/campaigns/create"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeCampaignCreationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/newsletters"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeNewslettersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/newsletters/create"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeNewsletterCreationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/events/registrations"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeEventRegistrationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/jobs/applications"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeJobApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/college/bulk-import"
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeBulkImportPage />
                </ProtectedRoute>
              }
            />

            {/* Domain Explorer */}
            <Route path="/domain-explorer" element={<DomainExplorerPage />} />
            
            {/* Skill Radar */}
            <Route path="/skill-radar" element={<SkillRadarPage />} />

            {/* Legacy route for alumni directory (public) */}
            <Route path="/alumni" element={<AlumniDirectoryPage />} />

            {/* Profile Page */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
