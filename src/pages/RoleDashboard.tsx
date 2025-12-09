import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import { Navigate } from "react-router-dom";

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

  // Redirect to role-specific dashboard or onboarding
  switch (user.role) {
    case UserRole.Student: {
      const student = user as import("../types").Student;
      // Check if profile is incomplete (no bio or minimal fields)
      if (!student.bio || !student.skills || student.skills.length === 0) {
        return <Navigate to="/onboarding/student" replace />;
      }
      return <Navigate to="/student/dashboard" replace />;
    }
    case UserRole.Alumni: {
      const alumni = user as import("../types").Alumni;
      // Check if profile is incomplete
      // For converted alumni (students to alumni), skills are already present
      // So we only require currentEmployer and designation for new alumni signups
      // If they have skills, they're likely converted and can skip onboarding
      // Bio is optional, not required
      const hasSkills = alumni.skills && alumni.skills.length > 0;
      const hasProfessionalInfo =
        !!alumni.currentEmployer && !!alumni.designation;

      // Skip onboarding if:
      // 1. They have skills (converted from student), OR
      // 2. They have professional info (currentEmployer + designation)
      if (!hasSkills && !hasProfessionalInfo) {
        return <Navigate to="/onboarding/alumni" replace />;
      }
      return <Navigate to="/alumni/dashboard" replace />;
    }
    case UserRole.College: {
      // College profiles are typically complete after signup
      // But we can check for optional fields
      return <Navigate to="/college/dashboard" replace />;
    }
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleDashboard;
