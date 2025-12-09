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
import { Department, type Student } from "../../types";
import { OnlinePresenceSection } from "./OnlinePresenceSection";
import type { StudentFormData } from "../../types/profile";
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

interface StudentProfileSectionProps {
  user: Student;
  isEditing: boolean;
  formData: StudentFormData;
  onFormDataChange: (data: StudentFormData) => void;
}

export const StudentProfileSection = ({
  user,
  isEditing,
  formData,
  onFormDataChange,
}: StudentProfileSectionProps) => {
  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Academic Information</CardTitle>
          <CardDescription>
            Your academic and enrollment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="rollNumber" className="text-sm font-semibold">
                Roll Number
              </Label>
              {isEditing ? (
                <Input
                  id="rollNumber"
                  value={formData.rollNumber || ""}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      rollNumber: e.target.value,
                    })
                  }
                  className="h-11"
                />
              ) : (
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm font-medium">
                  {user.rollNumber || (
                    <span className="text-muted-foreground italic">Not specified</span>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="enrollmentYear" className="text-sm font-semibold">
                Enrollment Year
              </Label>
              {isEditing ? (
                <Input
                  id="enrollmentYear"
                  type="number"
                  value={formData.enrollmentYear || ""}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      enrollmentYear: e.target.value,
                    })
                  }
                  className="h-11"
                />
              ) : (
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm font-medium">
                  {user.enrollmentYear || (
                    <span className="text-muted-foreground italic">Not specified</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </CardContent>
      </Card>

      <OnlinePresenceSection
        user={user}
        isEditing={isEditing}
        formData={formData}
        onFormDataChange={(data) => onFormDataChange(data as StudentFormData)}
      />
    </>
  );
};
