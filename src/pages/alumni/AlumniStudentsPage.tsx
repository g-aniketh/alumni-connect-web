import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { mockStudents } from '../../data/mockData';
import type { Student } from '../../types';
import { UserPlus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

const AlumniStudentsPage = () => {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = search === '' || 
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  const handleConnect = (student: Student) => {
    setSelectedStudent(student);
    setIsConnectDialogOpen(true);
  };

  const handleSubmitConnect = () => {
    if (selectedStudent) {
      console.log('Mentorship/Connection Request Submitted:', {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        timestamp: new Date().toISOString(),
      });
      setIsConnectDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          View students and connect with them for mentorship opportunities.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-3">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback className="text-lg">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {student.degree}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Roll: {student.rollNumber} | Class of {student.enrollmentYear + 4}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Department</p>
                <Badge variant="outline">{student.department}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {student.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleConnect(student)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium mb-2">No students found</p>
          <p className="text-sm">Try adjusting your search.</p>
        </div>
      )}

      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with Student</DialogTitle>
            <DialogDescription>
              {selectedStudent && (
                <>
                  Send a connection request to <strong>{selectedStudent.name}</strong> for mentorship.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Your connection request will be sent to the student. They can accept and start a mentorship relationship.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsConnectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitConnect}>
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlumniStudentsPage;

