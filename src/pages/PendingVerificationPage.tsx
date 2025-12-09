import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const PendingVerificationPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/40 pt-[10vh]">
      <div className="max-w-lg w-full bg-background border rounded-xl shadow-sm p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Account Pending Verification
          </h1>
          <p className="text-sm text-muted-foreground">
            Hi {user?.name}, your account has been created but is not yet
            verified by your college. Until verification is complete, access to
            the platform features is restricted.
          </p>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">What you can do now:</p>
          <ul className="list-disc list-inside space-y-1 text-left">
            <li>
              Contact your college administration, alumni cell, or placement
              cell.
            </li>
            <li>
              Share the email you used to sign up:{" "}
              <span className="font-mono">{user?.email}</span>.
            </li>
            <li>
              Ask them to verify your account in the Alumni Connect college
              dashboard.
            </li>
          </ul>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Need to switch account?</p>
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingVerificationPage;
