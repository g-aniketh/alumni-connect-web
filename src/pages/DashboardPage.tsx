// This page redirects to role-specific dashboards
// Keeping for backward compatibility
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case UserRole.College:
          navigate("/college/dashboard");
          break;
        case UserRole.Alumni:
          navigate("/alumni/dashboard");
          break;
        case UserRole.Student:
          navigate("/student/dashboard");
          break;
        default:
          navigate("/auth");
      }
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

  return (
    <div className="container py-10">
      <p>Redirecting...</p>
    </div>
  );
};

export default DashboardPage;
