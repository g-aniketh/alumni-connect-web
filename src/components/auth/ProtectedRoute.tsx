import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole, type Alumni, type Student } from '../../types';
import { tokenService } from '../../lib/api';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Block access for unverified alumni and students - send them to dedicated page
  if (user && (user.role === UserRole.Alumni || user.role === UserRole.Student)) {
    const typedUser = user as Alumni | Student;
    const cookieVerified = tokenService.getVerificationStatus();
    const isUnverified =
      !typedUser.isVerified || cookieVerified === false;

    if (isUnverified) {
      return <Navigate to="/pending-verification" replace />;
    }
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

