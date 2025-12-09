import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { collegeAPI } from "../../lib/api";
import type { BackendStudent, BackendCollege } from "../../types/api";
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  User,
  Edit,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Github,
  Globe,
  FileText,
} from "lucide-react";
import { motion } from "motion/react";

const CollegeStudentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [student, setStudent] = useState<BackendStudent | null>(null);
  const [college, setCollege] = useState<BackendCollege | null>(null);
  const [isEditingCredits, setIsEditingCredits] = useState(false);
  const [editedCredits, setEditedCredits] = useState<number>(0);
  const [requiredCredits, setRequiredCredits] = useState<number>(0);

  useEffect(() => {
    if (id) {
      loadStudentData();
      loadCollegeProfile();
    }
  }, [id]);

  const loadStudentData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      const studentsData = await collegeAPI.getAllStudents();
      const foundStudent = studentsData.find(
        (s) => s._id === id || s.id === id
      );
      if (foundStudent) {
        setStudent(foundStudent);
        setEditedCredits(foundStudent.credits || 0);
      } else {
        setError("Student not found");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load student data"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCollegeProfile = async () => {
    try {
      const response = await collegeAPI.getProfile();
      const collegeData = response.college;
      setCollege(collegeData);
    } catch (err) {
      console.error("Failed to load college profile:", err);
    }
  };

  useEffect(() => {
    if (student && college?.degreeCredits) {
      const required = college.degreeCredits[student.degree] || 0;
      setRequiredCredits(required);
    }
  }, [student, college]);

  const handleUpdateCredits = async () => {
    if (!student || !student.rollNumber) return;

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const response = await collegeAPI.updateStudentCredits({
        rollNumber: student.rollNumber,
        credits: editedCredits,
      });

      setSuccess(
        response.converted
          ? `Credits updated successfully! Student has been converted to alumni. 🎓`
          : `Credits updated successfully! Student needs ${response.creditsRemaining || 0} more credits to graduate.`
      );

      setIsEditingCredits(false);
      await loadStudentData();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update credits");
    } finally {
      setUpdating(false);
    }
  };

  const cancelEditCredits = () => {
    if (student) {
      setEditedCredits(student.credits || 0);
    }
    setIsEditingCredits(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading Student Details...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Not Found</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/college/students")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </CardContent>
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
        <Button
          variant="ghost"
          onClick={() => navigate("/college/students")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2">
                  <AvatarImage
                    src={
                      student.profilePictureUrlOptimized ||
                      student.profilePictureUrlHD ||
                      student.profilePictureUrl
                    }
                    alt={student.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {student.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{student.name}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {student.rollNumber}
                  </CardDescription>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant={student.isVerified ? "default" : "secondary"}
                    >
                      {student.isVerified ? "Verified" : "Pending Verification"}
                    </Badge>
                    {student.isAlumni && (
                      <Badge variant="default" className="bg-green-600">
                        Alumni
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
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

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">College</Label>
                  <p className="font-medium">{student.collegeName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium">{student.department}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Degree</Label>
                  <p className="font-medium capitalize">{student.degree}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Enrollment Year
                  </Label>
                  <p className="font-medium">{student.enrollmentYear}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Graduation Year
                  </Label>
                  <p className="font-medium">{student.graduationYear}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Roll Number</Label>
                  <p className="font-medium">{student.rollNumber}</p>
                </div>
              </div>

              {/* Credits Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-lg font-semibold">Credits</Label>
                    <p className="text-sm text-muted-foreground">
                      Current credits: {student.credits || 0} /{" "}
                      {requiredCredits} required
                    </p>
                  </div>
                  {!isEditingCredits && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingCredits(true)}
                      disabled={student.isAlumni}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Credits
                    </Button>
                  )}
                </div>

                {isEditingCredits ? (
                  <div className="space-y-4 p-4 bg-muted rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="credits">Credits</Label>
                      <Input
                        id="credits"
                        type="number"
                        min="0"
                        value={editedCredits}
                        onChange={(e) =>
                          setEditedCredits(parseInt(e.target.value, 10) || 0)
                        }
                        className="w-32"
                      />
                      <p className="text-xs text-muted-foreground">
                        Required credits for {student.degree}: {requiredCredits}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdateCredits}
                        disabled={updating}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {updating ? "Updating..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelEditCredits}
                        disabled={updating}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-4 mb-2">
                        <div
                          className="bg-primary h-4 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              ((student.credits || 0) /
                                Math.max(requiredCredits, 1)) *
                                100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(student.credits || 0) >= requiredCredits
                          ? "Eligible for graduation"
                          : `${requiredCredits - (student.credits || 0)} more credits needed`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{student.email}</p>
                  </div>
                </div>
                {student.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium">{student.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {student.gender && (
                  <div>
                    <Label className="text-muted-foreground">Gender</Label>
                    <p className="font-medium capitalize">{student.gender}</p>
                  </div>
                )}
              </div>
              {student.bio && (
                <div>
                  <Label className="text-muted-foreground">Bio</Label>
                  <p className="font-medium mt-1">{student.bio}</p>
                </div>
              )}
            </div>

            {/* Skills */}
            {student.skills && student.skills.length > 0 && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Links */}
            {(student.linkedInProfile ||
              student.githubProfile ||
              student.personalWebsite ||
              student.resumeUrl) && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Professional Links</h3>
                <div className="flex flex-wrap gap-4">
                  {student.linkedInProfile && (
                    <a
                      href={student.linkedInProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {student.githubProfile && (
                    <a
                      href={student.githubProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                  {student.personalWebsite && (
                    <a
                      href={student.personalWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {student.resumeUrl && (
                    <a
                      href={student.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      Resume
                    </a>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CollegeStudentDetailPage;
