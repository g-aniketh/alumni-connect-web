import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { alumniAPI } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import type { Alumni } from "../../types";

// Skills data matching backend SkillSet
const SkillSet: string[] = [
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

const AlumniProfileCompletionPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");

  // Professional info
  const [currentDesignation, setCurrentDesignation] = useState("");
  const [currentEmployer, setCurrentEmployer] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Links
  const [linkedInProfile, setLinkedInProfile] = useState("");
  const [githubProfile, setGithubProfile] = useState("");
  const [personalWebsite, setPersonalWebsite] = useState("");

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Pre-populate form with existing user data (for converted alumni)
  useEffect(() => {
    if (user && user.role === "Alumni") {
      const alumni = user as Alumni;

      // Pre-populate skills if they exist
      if (alumni.skills && alumni.skills.length > 0) {
        setSkills(alumni.skills);
      }

      // Pre-populate bio if it exists
      if (alumni.bio) {
        setBio(alumni.bio);
      }

      // Pre-populate professional info if it exists
      if (alumni.designation) {
        setCurrentDesignation(alumni.designation);
      }
      if (alumni.currentEmployer) {
        setCurrentEmployer(alumni.currentEmployer);
      }
      if (alumni.location) {
        setLocation(alumni.location);
      }

      // Pre-populate social links if they exist
      if (alumni.linkedInProfile) {
        setLinkedInProfile(alumni.linkedInProfile);
      }
      if (alumni.githubProfile) {
        setGithubProfile(alumni.githubProfile);
      }
      if (alumni.personalWebsite) {
        setPersonalWebsite(alumni.personalWebsite);
      }
    }
  }, [user]);

  const handleSkillToggle = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipForNow = () => {
    navigate("/alumni/dashboard");
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const updateData = {
        ...(gender && { gender }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(phoneNumber && { phoneNumber }),
        ...(bio && { bio }),
        ...(currentDesignation && { currentDesignation }),
        ...(currentEmployer && { currentEmployer }),
        ...(location && { location }),
        ...(skills.length > 0 && { skills }),
        ...(linkedInProfile && { linkedInProfile }),
        ...(githubProfile && { githubProfile }),
        ...(personalWebsite && { personalWebsite }),
      };

      await alumniAPI.updateProfile(user.id, updateData);
      await refreshUser();
      navigate("/alumni/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 pt-[10vh] pb-12 px-4">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to Alumni Connect! 🎓
          </h1>
          <p className="text-muted-foreground">
            Let's complete your profile to help you connect better
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
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Professional Details"}
              {currentStep === 3 && "Skills & Social Links"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us a bit about yourself"}
              {currentStep === 2 && "Share your professional experience"}
              {currentStep === 3 && "Add your skills and connect your profiles"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+91 1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentDesignation">Current Job Title</Label>
                  <Input
                    id="currentDesignation"
                    placeholder="e.g., Software Engineer"
                    value={currentDesignation}
                    onChange={(e) => setCurrentDesignation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentEmployer">Current Company</Label>
                  <Input
                    id="currentEmployer"
                    placeholder="e.g., Google"
                    value={currentEmployer}
                    onChange={(e) => setCurrentEmployer(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Bangalore, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Skills & Social Links */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Skills (Select at least 3)</Label>
                  <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {SkillSet.map((skill: string) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className={`px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                            skills.includes(skill)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background hover:bg-accent"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {skills.length} skill{skills.length !== 1 ? "s" : ""}{" "}
                    selected
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedInProfile">LinkedIn Profile</Label>
                  <Input
                    id="linkedInProfile"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={linkedInProfile}
                    onChange={(e) => setLinkedInProfile(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubProfile">GitHub Profile</Label>
                  <Input
                    id="githubProfile"
                    type="url"
                    placeholder="https://github.com/yourusername"
                    value={githubProfile}
                    onChange={(e) => setGithubProfile(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalWebsite">Personal Website</Label>
                  <Input
                    id="personalWebsite"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={personalWebsite}
                    onChange={(e) => setPersonalWebsite(e.target.value)}
                  />
                </div>
              </div>
            )}
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
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfileCompletionPage;
