import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Sparkles,
  GraduationCap,
  TrendingUp,
  Users,
  MessageSquare,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";
import { recommendationsAPI, collegeAPI } from "../../lib/api";
import type { StudentRecommendationsResponse } from "../../lib/api";
import type { BackendStudent } from "../../types/api";
import { motion } from "motion/react";

const AlumniRecommendedStudentsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState<string>("");
  const [students, setStudents] = useState<BackendStudent[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [recommendations, setRecommendations] =
    useState<StudentRecommendationsResponse | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await collegeAPI.getAllStudents();
      setStudents(response);
    } catch (err) {
      console.error("Failed to load students:", err);
      setError("Failed to load students. Please try again later.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (selectedStudentIds.length === 0) {
      setError("Please select at least one student");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await recommendationsAPI.getRecommendedStudents(
        selectedStudentIds
      );
      setRecommendations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get student recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 55) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-[10vh]">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Recommended Students
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            AI-powered student recommendations based on your expertise and
            mentoring capacity
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Student Selection */}
        {!recommendations && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Students to Evaluate</CardTitle>
              <CardDescription>
                Choose students you want to find mentorship matches with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingStudents ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Loading students...
                  </p>
                </div>
              ) : students.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {students.map((student) => (
                      <Card
                        key={student._id || student.id}
                        className={`cursor-pointer transition-all ${
                          selectedStudentIds.includes(
                            student._id || student.id || ""
                          )
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "hover:border-blue-300"
                        }`}
                        onClick={() =>
                          toggleStudentSelection(student._id || student.id || "")
                        }
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={
                                  student.profilePictureUrlOptimized ||
                                  student.profilePictureUrlHD ||
                                  student.profilePictureUrl
                                }
                              />
                              <AvatarFallback>
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {student.name}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                {student.department}
                              </p>
                            </div>
                            {selectedStudentIds.includes(
                              student._id || student.id || ""
                            ) && (
                              <Badge variant="default" className="bg-blue-600">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button
                    onClick={handleGetRecommendations}
                    disabled={selectedStudentIds.length === 0 || loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get Recommendations ({selectedStudentIds.length}{" "}
                        selected)
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <p className="text-center py-8 text-slate-600 dark:text-slate-400">
                  No students available
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recommendations Results */}
        {recommendations && recommendations.alumni && (
          <Card className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Recommendations for {recommendations.alumni.name}
                  </p>
                  {recommendations.alumni.skills &&
                    recommendations.alumni.skills.length > 0 && (
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Your Skills:{" "}
                        {recommendations.alumni.skills.join(", ")}
                      </p>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {recommendations &&
        recommendations.recommendations &&
        recommendations.recommendations.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recommended Students</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setRecommendations(null);
                  setSelectedStudentIds([]);
                }}
              >
                Select Different Students
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.recommendations.map((student) => (
                <motion.div
                  key={student.student_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-12 w-12 border-2 border-blue-200">
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {student.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">
                              {student.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <GraduationCap className="h-3 w-3" />
                              <span className="truncate">
                                {student.department}
                                {student.year && ` • Year ${student.year}`}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          className={`${getScoreColor(
                            student.match_score
                          )} text-white`}
                        >
                          {student.match_score}% match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {student.skills && student.skills.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Skills
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {student.skills.slice(0, 5).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {student.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{student.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {student.interests && student.interests.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Interests
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {student.interests.map((interest, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-purple-50"
                              >
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-900 dark:text-blue-100">
                            {student.match_reasoning}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => navigate(`/alumni/students`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          !loading &&
          recommendations &&
          recommendations.recommendations.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-slate-400 mb-4" />
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No recommendations found
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md">
                  We couldn't find matching student recommendations. Try
                  selecting different students.
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default AlumniRecommendedStudentsPage;
