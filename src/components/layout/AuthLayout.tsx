import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50 grid-pattern">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
