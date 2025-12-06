import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { authAPI } from "../lib/api";
import { Mail, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [userType, setUserType] = useState<string>("alumni");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (token) {
      handleVerify();
    }
  }, [token]);

  const handleVerify = async () => {
    if (!token) {
      setError("Invalid or missing verification token");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authAPI.verifyEmail(token, userType);
      setVerified(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-muted/40">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Email Verified</CardTitle>
            <CardDescription>
              Your email address has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-950 rounded-md">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              You can now access all features of the platform.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Email Address</CardTitle>
          <CardDescription>
            {token
              ? "Verifying your email address..."
              : "Enter your verification token to verify your email address."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {token ? (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Verifying...</p>
                </div>
              ) : error ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-6 bg-red-50 dark:bg-red-950 rounded-md">
                    <XCircle className="h-12 w-12 text-red-600" />
                  </div>
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 rounded-md">
                    {error}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userType">Account Type</Label>
                    <Select value={userType} onValueChange={setUserType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alumni">Alumni</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="college">College</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleVerify}
                    className="w-full"
                    disabled={loading}
                  >
                    Retry Verification
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-6 bg-blue-50 dark:bg-blue-950 rounded-md">
                <Mail className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Please check your email for the verification link. If you didn't
                receive it, you can request a new one from your profile
                settings.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;
