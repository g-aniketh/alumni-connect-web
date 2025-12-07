import { Outlet } from "react-router-dom";

const LandingPageLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Outlet />
    </div>
  );
};

export default LandingPageLayout;
