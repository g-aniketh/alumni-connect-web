import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../../components/ui/card";
import { GraduationCap, Users, BookOpen } from "lucide-react";

const AlumniStudentsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900 pt-[10vh]">
      <div className="container py-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-muted-foreground">
            View students from your college. Students can request mentorships
            from you through the Alumni Directory.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all">
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="mb-2 text-blue-900 dark:text-blue-100">
                Student Directory
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Students can request mentorships from alumni through the Alumni
                Directory page
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all">
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="mb-2 text-purple-900 dark:text-purple-100">
                Mentorship Requests
              </CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                Manage mentorship requests from students in your mentorship
                dashboard
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all">
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="mb-2 text-orange-900 dark:text-orange-100">
                View All Students
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                To view the complete student list, please use the College
                dashboard
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlumniStudentsPage;
