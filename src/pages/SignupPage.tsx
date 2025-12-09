import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { AlumniSignupForm } from "../components/auth/AlumniSignupForm";
import { StudentSignupForm } from "../components/auth/StudentSignupForm";
import { CollegeSignupForm } from "../components/auth/CollegeSignupForm";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { EyeAnimation } from "../components/ui/EyeAnimation";

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roleParam = searchParams.get("role");
  const defaultTab =
    roleParam === "alumni"
      ? "alumni"
      : roleParam === "college"
        ? "college"
        : "student";

  const handleTabChange = (value: string) => {
    navigate(`/signup?role=${value}`, { replace: true });
  };

  return (
    <div className="container min-h-[calc(100vh-4rem)] py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side - Eye Animation */}
        <div className="hidden lg:block sticky top-24 h-[600px]">
          <EyeAnimation />
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome to Alumni Connect</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Select your role to join
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
              <StudentSignupForm />
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login?role=student"
                  className="underline hover:text-primary font-medium"
                >
                  Log in
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="alumni">
              <AlumniSignupForm />
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login?role=alumni"
                  className="underline hover:text-primary font-medium"
                >
                  Log in
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="college">
              <CollegeSignupForm />
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login?role=college"
                  className="underline hover:text-primary font-medium"
                >
                  Log in
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
