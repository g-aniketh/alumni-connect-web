import { Card, CardContent, CardDescription, CardTitle } from '../../components/ui/card';
import { GraduationCap } from 'lucide-react';

const AlumniStudentsPage = () => {
  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          View students from your college. Students can request mentorships from you through the Alumni Directory.
        </p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <CardTitle className="mb-2">Student Directory</CardTitle>
            <CardDescription>
              Students can request mentorships from alumni through the Alumni Directory page.
              <br />
              To view all students, please use the College dashboard.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniStudentsPage;

