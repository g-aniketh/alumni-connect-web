import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Building2, Briefcase, GraduationCap, MapPin } from "lucide-react";
import { Department, type Alumni } from "../../types";
import { OnlinePresenceSection } from "./OnlinePresenceSection";
import type { AlumniFormData } from "../../types/profile";
import { SkillsAutocomplete } from "../skills/SkillsAutocomplete";

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

interface AlumniProfileSectionProps {
  user: Alumni;
  isEditing: boolean;
  formData: AlumniFormData;
  onFormDataChange: (data: AlumniFormData) => void;
}

export const AlumniProfileSection = ({
  user,
  isEditing,
  formData,
  onFormDataChange,
}: AlumniProfileSectionProps) => {
  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Professional Information</CardTitle>
          <CardDescription>
            Your career and professional details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="currentEmployer" className="text-sm font-semibold">
                Current Company
              </Label>
              {isEditing ? (
                <Input
                  id="currentEmployer"
                  value={formData.currentEmployer || ""}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      currentEmployer: e.target.value,
                    })
                  }
                  className="h-11"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">
                    {user.currentEmployer || (
                      <span className="text-muted-foreground italic">Not specified</span>
                    )}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="designation" className="text-sm font-semibold">
                Designation
              </Label>
              {isEditing ? (
                <Input
                  id="designation"
                  value={formData.designation || ""}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      designation: e.target.value,
                    })
                  }
                  className="h-11"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">
                    {user.designation || (
                      <span className="text-muted-foreground italic">Not specified</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="graduationYear" className="text-sm font-semibold">
                Graduation Year
              </Label>
              {isEditing ? (
                <Input
                  id="graduationYear"
                  type="number"
                  value={formData.graduationYear || ""}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      graduationYear: e.target.value,
                    })
                  }
                  className="h-11"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">
                    {user.graduationYear || (
                      <span className="text-muted-foreground italic">Not specified</span>
                    )}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="degree" className="text-sm font-semibold">
                Degree
              </Label>
              {isEditing ? (
                <Input
                  id="degree"
                  value={formData.degree || ""}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, degree: e.target.value })
                  }
                  className="h-11"
                />
              ) : (
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm font-medium">
                  {user.degree || (
                    <span className="text-muted-foreground italic">Not specified</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="department" className="text-sm font-semibold">
              Department
            </Label>
            {isEditing ? (
              <Select
                value={formData.department || ""}
                onValueChange={(value) =>
                  onFormDataChange({ ...formData, department: value })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Department).map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm font-medium">
                {user.department || (
                  <span className="text-muted-foreground italic">Not specified</span>
                )}
              </div>
            )}
          </div>
          <div className="space-y-3">
            {isEditing ? (
              <SkillsAutocomplete
                skills={AVAILABLE_SKILLS}
                selectedSkills={
                  formData.skills
                    ? Array.isArray(formData.skills)
                      ? formData.skills
                      : []
                    : []
                }
                onSkillsChange={(skills) =>
                  onFormDataChange({ ...formData, skills })
                }
                label="Skills"
              />
            ) : (
              <div>
                <Label className="text-sm font-semibold mb-3 block">Skills</Label>
                <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/50 border border-border/50 min-h-[3rem]">
                  {(user.skills || []).length > 0 ? (
                    (user.skills || []).map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs py-1 px-2">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      No skills added yet
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="bio" className="text-sm font-semibold">
              Bio
            </Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) =>
                  onFormDataChange({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                rows={4}
                className="resize-none"
              />
            ) : (
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm leading-relaxed min-h-[4rem]">
                {user.bio || (
                  <span className="text-muted-foreground italic">Not specified</span>
                )}
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="location" className="text-sm font-semibold">
              Location
            </Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) =>
                  onFormDataChange({ ...formData, location: e.target.value })
                }
                placeholder="e.g., San Francisco, CA"
                className="h-11"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  {user.location || (
                    <span className="text-muted-foreground italic">Not specified</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <OnlinePresenceSection
        user={user}
        isEditing={isEditing}
        formData={formData}
        onFormDataChange={(data) => onFormDataChange(data as AlumniFormData)}
      />
    </>
  );
};
