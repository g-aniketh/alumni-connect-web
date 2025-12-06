import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { AuthForm } from "../components/auth/AuthForm";
import { UserRole } from "../types";
import { useLocation } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Alumni Connect</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isLogin ? "Log in to continue" : "Select your role to join"}
          </p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="alumni">Alumni</TabsTrigger>
            <TabsTrigger value="college">College</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <AuthForm role={UserRole.Student} isLoginDefault={isLogin} />
          </TabsContent>

          <TabsContent value="alumni">
            <AuthForm role={UserRole.Alumni} isLoginDefault={isLogin} />
          </TabsContent>

          <TabsContent value="college">
            <AuthForm role={UserRole.College} isLoginDefault={isLogin} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
