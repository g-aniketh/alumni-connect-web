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
      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
          <CardDescription>
            Your academic and enrollment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
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
                />
              ) : (
                <div className="text-sm">
                  {user.rollNumber || "Not specified"}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentYear">Enrollment Year</Label>
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
                />
              ) : (
                <div className="text-sm">
                  {user.enrollmentYear || "Not specified"}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              {isEditing ? (
                <Input
                  id="degree"
                  value={formData.degree || ""}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, degree: e.target.value })
                  }
                />
              ) : (
                <div className="text-sm">{user.degree || "Not specified"}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              {isEditing ? (
                <Select
                  value={formData.department || ""}
                  onValueChange={(value) =>
                    onFormDataChange({ ...formData, department: value })
                  }
                >
                  <SelectTrigger>
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
                <div className="text-sm">
                  {user.department || "Not specified"}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
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
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(user.skills || []).length > 0 ? (
                    (user.skills || []).map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No skills added yet
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) =>
                  onFormDataChange({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                rows={3}
              />
            ) : (
              <div className="text-sm">{user.bio || "Not specified"}</div>
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
