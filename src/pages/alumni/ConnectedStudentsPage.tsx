import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { GraduationCap } from "lucide-react";
import type { BackendStudent } from "../../types/api";

const ConnectedStudentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [connectedStudents, setConnectedStudents] = useState<BackendStudent[]>(
    []
  );

  useEffect(() => {
    loadConnectedStudents();
  }, []);

  const loadConnectedStudents = async () => {
    try {
      setLoading(true);
      // Get students from active mentorships
      const { mentorshipsAPI } = await import("../../lib/api");
      const mentorships = await mentorshipsAPI.getMy("active");

      // Extract students from active mentorships
      const students: BackendStudent[] = mentorships.mentorships
        .map((m) => {
          if (typeof m.menteeId === "object" && m.menteeId !== null) {
            return m.menteeId as BackendStudent;
          }
          return null;
        })
        .filter((student): student is BackendStudent => student !== null);

      setConnectedStudents(students);
    } catch (err) {
      // Silently handle 403 errors for unverified users (allow them to use the app)
      const errorMessage = err instanceof Error ? err.message : "";
      const isVerificationError = 
        errorMessage.includes("403") || 
        errorMessage.includes("Forbidden") || 
        errorMessage.includes("Access denied") ||
        errorMessage.includes("not verified");
      
      if (!isVerificationError) {
        // Only log non-verification errors
        console.error("Error loading connected students:", err);
      }
      setConnectedStudents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading connected students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Connected Students
        </h1>
        <p className="text-muted-foreground">
          View students you are mentoring or have mentored.
        </p>
      </div>

      {connectedStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {connectedStudents.map((student) => (
            <Card
              key={student._id || student.id || Math.random()}
              className="flex flex-col h-full"
            >
              <CardHeader className="text-center pb-3">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.rollNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Class of {student.graduationYear}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Department
                  </p>
                  <p className="text-sm">{student.department}</p>
                </div>
                {student.skills && student.skills.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-1 bg-muted rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <CardTitle className="mb-2">No Connected Students</CardTitle>
              <CardDescription>
                You don't have any active mentorship connections with students
                yet.
                <br />
                Students can request mentorship from you through the Alumni
                Directory.
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConnectedStudentsPage;
