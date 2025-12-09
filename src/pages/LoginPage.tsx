import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { LoginForm } from "../components/auth/LoginForm";
import { UserRole } from "../types";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { EyeAnimation } from "../components/ui/EyeAnimation";
import { LoginBackground } from "../components/auth/LoginBackground";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const roleParam = searchParams.get("role");
  const defaultTab =
    roleParam === "alumni"
      ? "alumni"
      : roleParam === "college"
        ? "college"
        : "student";

  const handleTabChange = (value: string) => {
    setIsLoginFailed(false);
    setIsLoginSuccess(false);
    navigate(`/login?role=${value}`, { replace: true });
  };

  const handleLoginSuccess = () => {
    setIsLoginSuccess(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 2200);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pt-[10vh]">
      <LoginBackground />
      <div className="container py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Eye Animation */}
          <div className="hidden lg:block sticky top-24 h-[600px]">
            <EyeAnimation isSad={isLoginFailed} isSuccess={isLoginSuccess} />
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img
                  src="https://res.cloudinary.com/dj6i0b4q2/image/upload/v1765264961/image-removebg-preview_4_rc5dsk.png"
                  alt="Alumni Connect Logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold">Welcome to Alumni Connect</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Log in to continue
              </p>
            </div>

            <Tabs
              value={defaultTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="alumni">Alumni</TabsTrigger>
                <TabsTrigger value="college">College</TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <LoginForm
                  role={UserRole.Student}
                  onLoginError={setIsLoginFailed}
                  onLoginSuccess={handleLoginSuccess}
                />
                <div className="mt-4 text-center text-sm">
                  <span className="text-muted-foreground">
                    Don't have an account?{" "}
                  </span>
                  <Link
                    to="/signup?role=student"
                    className="underline hover:text-primary font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="alumni">
                <LoginForm
                  role={UserRole.Alumni}
                  onLoginError={setIsLoginFailed}
                  onLoginSuccess={handleLoginSuccess}
                />
                <div className="mt-4 text-center text-sm">
                  <span className="text-muted-foreground">
                    Don't have an account?{" "}
                  </span>
                  <Link
                    to="/signup?role=alumni"
                    className="underline hover:text-primary font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="college">
                <LoginForm
                  role={UserRole.College}
                  onLoginError={setIsLoginFailed}
                  onLoginSuccess={handleLoginSuccess}
                />
                <div className="mt-4 text-center text-sm">
                  <span className="text-muted-foreground">
                    Don't have an account?{" "}
                  </span>
                  <Link
                    to="/signup?role=college"
                    className="underline hover:text-primary font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
