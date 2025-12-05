import { useState } from "react";
import { UserRole } from "../../types";
import { LoginForm } from "./LoginForm";
import { AlumniSignupForm } from "./AlumniSignupForm";
import { StudentSignupForm } from "./StudentSignupForm";
import { CollegeSignupForm } from "./CollegeSignupForm";

interface AuthFormProps {
  role: UserRole;
  isLoginDefault?: boolean;
}

export const AuthForm = ({ role, isLoginDefault = false }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(isLoginDefault);

  if (isLogin) {
    return (
      <>
        <LoginForm role={role} />
        <div className="mt-4 text-center text-sm">
          <button
            type="button"
            className="underline hover:text-primary"
            onClick={() => setIsLogin(false)}
          >
            Don't have an account? Sign up
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {role === UserRole.Alumni && <AlumniSignupForm />}
      {role === UserRole.Student && <StudentSignupForm />}
      {role === UserRole.College && <CollegeSignupForm />}
      <div className="mt-4 text-center text-sm">
        <button
          type="button"
          className="underline hover:text-primary"
          onClick={() => setIsLogin(true)}
        >
          Already have an account? Log in
        </button>
      </div>
    </>
  );
};
