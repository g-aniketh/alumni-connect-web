import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Navigate } from 'react-router-dom';

const RoleDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
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
      return null;
  }
};

export default RoleDashboard;
