import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { mockMentorshipRequests, mockStudents } from '../../data/mockData';
import { MentorshipStatus } from '../../types';
import { Calendar, MessageSquare, CheckCircle2, XCircle, Clock, User, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';

const AlumniMentorshipsPage = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | 'end' | null>(null);
  const [feedback, setFeedback] = useState('');

  // Get mentorship requests for current alumni (as mentor)
  const myRequests = mockMentorshipRequests.filter(req => req.alumniId === 'a1');
  
  // Get pending requests (incoming)
  const pendingRequests = myRequests.filter(req => req.status === MentorshipStatus.Pending);
  
  // Get active mentorships
  const activeMentorships = myRequests.filter(req => req.status === MentorshipStatus.Accepted);
  
  // Get completed mentorships
  const completedMentorships = myRequests.filter(req => req.status === MentorshipStatus.Completed);

  const getStatusBadge = (status: MentorshipStatus) => {
    switch (status) {
      case MentorshipStatus.Pending:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case MentorshipStatus.Accepted:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>;
      case MentorshipStatus.Completed:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case MentorshipStatus.Declined:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStudentInfo = (studentId: string) => {
    return mockStudents.find(s => s.id === studentId);
  };

  const handleAction = (requestId: string, type: 'accept' | 'reject' | 'end') => {
    setSelectedRequest(requestId);
    setActionType(type);
    setIsActionDialogOpen(true);
  };

  const handleSubmitAction = () => {
    if (selectedRequest) {
      console.log('Mentorship Action:', {
        requestId: selectedRequest,
        action: actionType,
        feedback,
        timestamp: new Date().toISOString(),
      });
      setIsActionDialogOpen(false);
      setSelectedRequest(null);
      setActionType(null);
      setFeedback('');
    }
  };

  const PendingRequestCard = ({ request }: { request: typeof myRequests[0] }) => {
    const student = getStudentInfo(request.studentId);
    if (!student) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{student.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span>{student.degree}</span>
                  <span>•</span>
                  <span>{student.department}</span>
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {request.message && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Student's Message:</p>
              <p className="text-sm">{request.message}</p>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Requested on {new Date(request.requestedOn).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => handleAction(request.id, 'accept')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1"
              onClick={() => handleAction(request.id, 'reject')}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ActiveMentorshipCard = ({ request }: { request: typeof myRequests[0] }) => {
    const student = getStudentInfo(request.studentId);
    if (!student) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{student.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span>{student.degree}</span>
                  <span>•</span>
                  <span>{student.department}</span>
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {request.updatedOn && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Started on {new Date(request.updatedOn).toLocaleDateString()}</span>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => handleAction(request.id, 'end')}
          >
            <XCircle className="h-4 w-4 mr-2" />
            End Mentorship
          </Button>
        </CardContent>
      </Card>
    );
  };

  const CompletedMentorshipCard = ({ request }: { request: typeof myRequests[0] }) => {
    const student = getStudentInfo(request.studentId);
    if (!student) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{student.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span>{student.degree}</span>
                  <span>•</span>
                  <span>{student.department}</span>
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {request.updatedOn && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Completed on {new Date(request.updatedOn).toLocaleDateString()}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mentorship Requests</h1>
        <p className="text-muted-foreground">
          Manage mentorship requests from students and track your active mentorship relationships.
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeMentorships.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedMentorships.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingRequests.map((request) => (
                <PendingRequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No pending requests</p>
                <p className="text-sm text-muted-foreground">
                  All mentorship requests have been responded to.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {activeMentorships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeMentorships.map((request) => (
                <ActiveMentorshipCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No active mentorships</p>
                <p className="text-sm text-muted-foreground">
                  You don't have any active mentorship relationships at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedMentorships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedMentorships.map((request) => (
                <CompletedMentorshipCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No completed mentorships</p>
                <p className="text-sm text-muted-foreground">
                  Completed mentorship relationships will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'accept' && 'Accept Mentorship Request'}
              {actionType === 'reject' && 'Decline Mentorship Request'}
              {actionType === 'end' && 'End Mentorship'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'accept' && 'Accept this mentorship request and start guiding the student.'}
              {actionType === 'reject' && 'Decline this mentorship request. The student will be notified.'}
              {actionType === 'end' && 'End this mentorship relationship. You can provide feedback.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {(actionType === 'end' || actionType === 'reject') && (
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Add any feedback or notes..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>
            )}
            {actionType === 'accept' && (
              <p className="text-sm text-muted-foreground">
                By accepting, you agree to mentor this student. The mentorship will become active.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsActionDialogOpen(false);
                setFeedback('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitAction}>
              {actionType === 'accept' && 'Accept Request'}
              {actionType === 'reject' && 'Decline Request'}
              {actionType === 'end' && 'End Mentorship'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlumniMentorshipsPage;

