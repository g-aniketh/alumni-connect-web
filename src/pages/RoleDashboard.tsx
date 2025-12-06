import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Navigate } from 'react-router-dom';

const RoleDashboard = () => {
  const { user, loading } = useAuth();

  // Wait for auth to finish loading before redirecting
  if (loading) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to role-specific dashboard
  switch (user.role) {
    case UserRole.Student:
      return <Navigate to="/student/dashboard" replace />;
    case UserRole.Alumni:
      return <Navigate to="/alumni/dashboard" replace />;
    case UserRole.College:
      return <Navigate to="/college/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleDashboard;
