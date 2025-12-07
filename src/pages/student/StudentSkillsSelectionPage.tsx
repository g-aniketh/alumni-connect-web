import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { SkillsAutocomplete } from "../../components/skills/SkillsAutocomplete";
import { studentAPI } from "../../lib/api";
import { UserRole } from "../../types";
import type { Student } from "../../types";

// Skills list matching backend SkillSet
const AVAILABLE_SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "PHP",
  "Rust",
  "Swift",
  "Kotlin",
  "HTML",
  "CSS",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Django",
  "Flask",
  "Spring Boot",
  "Ruby on Rails",
  "Machine Learning",
  "Data Science",
  "DevOps",
  "Cloud Computing",
  "UI/UX Design",
  "Project Management",
  "Agile Methodologies",
  "Database Management",
  "Cybersecurity",
  "Mobile App Development",
  "Game Development",
  "Blockchain",
  "Artificial Intelligence",
  "Big Data",
  "Internet of Things (IoT)",
  "Networking",
  "Software Testing",
  "Version Control (Git)",
  "Docker",
  "Continuous Integration/Continuous Deployment (CI/CD)",
  "AWS",
  "Azure",
  "Google Cloud Platform",
  "Kubernetes",
  "Object-Oriented Programming (OOP)",
  "Others",
];

const StudentSkillsSelectionPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSkipping, setIsSkipping] = useState(false);

  useEffect(() => {
    // Redirect if not a student
    if (user && user.role !== UserRole.Student) {
      navigate("/dashboard");
    }
    // If user already has skills, redirect to dashboard
    if (user && user.role === UserRole.Student) {
      const student = user as Student;
      if (student.skills && student.skills.length > 0) {
        navigate("/student/dashboard");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!user || user.role !== UserRole.Student) {
        throw new Error("Unauthorized");
      }

      // Update student profile with skills
      await studentAPI.updateProfile(user.id, {
        skills: selectedSkills,
      });

      // Refresh user data
      await refreshUser();
      navigate("/student/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save skills. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      // Navigate to dashboard without saving skills
      navigate("/student/dashboard");
    } catch (err) {
      setError("Failed to proceed. Please try again.");
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/40 py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add Your Skills</CardTitle>
          <CardDescription>
            Help us match you with relevant opportunities by adding your skills.
            You can add or update them later from your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <SkillsAutocomplete
              skills={AVAILABLE_SKILLS}
              selectedSkills={selectedSkills}
              onSkillsChange={setSelectedSkills}
              label="Skills"
            />

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                disabled={loading || isSkipping}
                className="flex-1"
              >
                {isSkipping ? "Skipping..." : "Skip for Now"}
              </Button>
              <Button
                type="submit"
                disabled={loading || isSkipping}
                className="flex-1"
              >
                {loading ? "Saving..." : "Save Skills"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSkillsSelectionPage;
