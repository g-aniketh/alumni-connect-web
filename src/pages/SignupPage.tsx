import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { AlumniSignupForm } from "../components/auth/AlumniSignupForm";
import { StudentSignupForm } from "../components/auth/StudentSignupForm";
import { CollegeSignupForm } from "../components/auth/CollegeSignupForm";
import { UserRole } from "../types";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

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
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10">
      <div className="w-full max-w-md space-y-6">
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
  );
};

export default SignupPage;
