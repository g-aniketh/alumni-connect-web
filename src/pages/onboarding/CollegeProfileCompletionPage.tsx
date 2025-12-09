import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { CheckCircle } from "lucide-react";
import { collegeAPI } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const CollegeProfileCompletionPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const currentStep = 1;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [linkedInProfile, setLinkedInProfile] = useState("");

  const totalSteps = 1;
  const progress = (currentStep / totalSteps) * 100;

  const handleSkipForNow = () => {
    navigate("/college/dashboard");
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const updateData = {
        ...(website && { website }),
        ...(contactEmail && { contactEmail }),
        ...(contactPhone && { contactPhone }),
        ...(linkedInProfile && { linkedInProfile }),
      };

      await collegeAPI.updateProfile(updateData);
      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to Alumni Connect! 🏫
          </h1>
          <p className="text-muted-foreground">
            Let's complete your college profile to get started
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Social Information</CardTitle>
            <CardDescription>
              Add contact details and connect your social profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">College Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourcollege.edu"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@yourcollege.edu"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+91 1234567890"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedInProfile">LinkedIn Profile</Label>
                <Input
                  id="linkedInProfile"
                  type="url"
                  placeholder="https://linkedin.com/company/yourcollege"
                  value={linkedInProfile}
                  onChange={(e) => setLinkedInProfile(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleSkipForNow}
            className="text-muted-foreground"
          >
            Do this later
          </Button>

          <div className="flex gap-3">
            <Button onClick={handleComplete} disabled={loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Complete Setup"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfileCompletionPage;
