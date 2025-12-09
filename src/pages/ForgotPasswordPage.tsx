import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { authAPI } from "../lib/api";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<string>("alumni");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.requestPasswordReset(email, userType);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send password reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-muted/40 pt-[10vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-950 rounded-md">
              <Mail className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Please check your email inbox and click on the password reset link
              to create a new password. The link will expire in 1 hour.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="flex-1"
              >
                Send Another Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/40 pt-[10vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
