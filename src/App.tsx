import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import RoleDashboard from './pages/RoleDashboard';
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import AlumniDashboardPage from './pages/alumni/AlumniDashboardPage';
import CollegeDashboardPage from './pages/college/CollegeDashboardPage';
import JobsPage from './pages/JobsPage';
import AlumniDirectoryPage from './pages/AlumniDirectoryPage';
import EventsCampaignsPage from './pages/EventsCampaignsPage';
import AlumniNetworkPage from './pages/alumni/AlumniNetworkPage';
import AlumniStudentsPage from './pages/alumni/AlumniStudentsPage';
import AlumniJobCreationPage from './pages/alumni/AlumniJobCreationPage';
import AlumniEventCreationPage from './pages/alumni/AlumniEventCreationPage';
import CollegeAlumniPage from './pages/college/CollegeAlumniPage';
import CollegeStudentsPage from './pages/college/CollegeStudentsPage';
import CollegeJobCreationPage from './pages/college/CollegeJobCreationPage';
import CollegeEventCreationPage from './pages/college/CollegeEventCreationPage';
import CollegeCampaignCreationPage from './pages/college/CollegeCampaignCreationPage';
import CollegeNewslettersPage from './pages/college/CollegeNewslettersPage';
import CollegeNewsletterCreationPage from './pages/college/CollegeNewsletterCreationPage';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentMentorshipsPage from './pages/student/StudentMentorshipsPage';
import AlumniMentorshipsPage from './pages/alumni/AlumniMentorshipsPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { UserRole } from './types';
import './App.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            
            {/* Public Pages */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/events" element={<EventsCampaignsPage />} />
            
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
            
            {/* College Dashboard (legacy - redirects to role dashboard) */}
            <Route 
              path="/college/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <DashboardPage />
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
              path="/alumni/jobs/create" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniJobCreationPage />
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
              path="/alumni/mentorships" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.Alumni]}>
                  <AlumniMentorshipsPage />
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
              path="/college/events/create" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.College]}>
                  <CollegeEventCreationPage />
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
