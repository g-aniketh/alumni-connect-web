import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { collegeAPI } from "../../lib/api";
import { GraduationCap, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const DEGREES = [
  { value: "bachelors", label: "Bachelors", defaultCredits: 160 },
  { value: "masters", label: "Masters", defaultCredits: 80 },
  { value: "phd", label: "PhD", defaultCredits: 120 },
  { value: "diploma", label: "Diploma", defaultCredits: 60 },
  { value: "other", label: "Other", defaultCredits: 100 },
] as const;

const CollegeDegreeCreditsPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [degreeCredits, setDegreeCredits] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    loadCollegeProfile();
  }, []);

  const loadCollegeProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await collegeAPI.getProfile();
      const collegeData = response.college;

      const initialCredits: Record<string, number> = {};
      DEGREES.forEach((degree) => {
        if (collegeData.degreeCredits?.[degree.value]) {
          initialCredits[degree.value] =
            collegeData.degreeCredits[degree.value];
        } else {
          initialCredits[degree.value] = degree.defaultCredits;
        }
      });
      setDegreeCredits(initialCredits);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load college profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreditsChange = (degree: string, value: string): void => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setDegreeCredits({
        ...degreeCredits,
        [degree]: numValue,
      });
      setSuccess("");
      setError("");
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await collegeAPI.updateDegreeCredits(degreeCredits);

      setSuccess("Degree credits updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update degree credits"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = (): void => {
    const defaults: Record<string, number> = {};
    DEGREES.forEach((degree) => {
      defaults[degree.value] = degree.defaultCredits;
    });
    setDegreeCredits(defaults);
    setSuccess("");
    setError("");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Degree Credits Management</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <CardTitle>Degree Credits Management</CardTitle>
            </div>
            <CardDescription>
              Set the required number of credits for each degree programme.
              Students will be automatically converted to alumni when they reach
              the required credits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  {success}
                </p>
              </motion.div>
            )}

            <div className="space-y-4">
              {DEGREES.map((degree) => (
                <motion.div
                  key={degree.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: DEGREES.indexOf(degree) * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <Label
                      htmlFor={degree.value}
                      className="text-base font-medium"
                    >
                      {degree.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Default: {degree.defaultCredits} credits
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      id={degree.value}
                      type="number"
                      min="0"
                      value={
                        degreeCredits[degree.value] || degree.defaultCredits
                      }
                      onChange={(e) =>
                        handleCreditsChange(degree.value, e.target.value)
                      }
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">
                      credits
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Credits"}
              </Button>
              <Button
                variant="outline"
                onClick={handleResetToDefaults}
                disabled={saving}
              >
                Reset to Defaults
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                How it works:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>
                  Set the minimum credits required for each degree programme
                </li>
                <li>
                  When you sync student credits from your college database, the
                  system will automatically check if students have reached the
                  required credits
                </li>
                <li>
                  Students who meet the credit requirement will be automatically
                  converted to alumni
                </li>
                <li>
                  You can also manually check eligibility and process
                  graduations from the Credits Sync page
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CollegeDegreeCreditsPage;
