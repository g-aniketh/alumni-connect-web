import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { mockMentorshipRequests, mockAlumni } from '../../data/mockData';
import { MentorshipStatus } from '../../types';
import { Calendar, MessageSquare, CheckCircle2, XCircle, Clock, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
const StudentMentorshipsPage = () => {
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  // Get mentorship requests for current student
  const myRequests = mockMentorshipRequests.filter(req => req.studentId === 's1');
  
  // Get active mentorships
  const activeMentorships = myRequests.filter(req => req.status === MentorshipStatus.Accepted);
  
  // Get pending requests
  const pendingRequests = myRequests.filter(req => req.status === MentorshipStatus.Pending);
  
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

  const getMentorInfo = (alumniId: string) => {
    return mockAlumni.find(a => a.id === alumniId);
  };

  const handleViewFeedback = (_requestId: string) => {
    setIsFeedbackDialogOpen(true);
  };

  const MentorshipCard = ({ request }: { request: typeof myRequests[0] }) => {
    const mentor = getMentorInfo(request.alumniId);
    if (!mentor) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mentor.avatar} alt={mentor.name} />
                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{mentor.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span>{mentor.designation}</span>
                  <span>•</span>
                  <span>{mentor.currentEmployer}</span>
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {request.message && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Message:</p>
              <p className="text-sm">{request.message}</p>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Requested on {new Date(request.requestedOn).toLocaleDateString()}</span>
          </div>
          {request.updatedOn && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated on {new Date(request.updatedOn).toLocaleDateString()}</span>
            </div>
          )}
          {request.status === MentorshipStatus.Completed && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleViewFeedback(request.id)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View Feedback
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Mentorships</h1>
        <p className="text-muted-foreground">
          Manage your mentorship relationships and track your progress.
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="active">
            Active ({activeMentorships.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedMentorships.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeMentorships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeMentorships.map((request) => (
                <MentorshipCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No active mentorships</p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  You don't have any active mentorship relationships yet. Browse alumni to find a mentor.
                </p>
                <Button asChild className="mt-4">
                  <a href="/student/alumni">Browse Alumni</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingRequests.map((request) => (
                <MentorshipCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No pending requests</p>
                <p className="text-sm text-muted-foreground">
                  All your mentorship requests have been responded to.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedMentorships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedMentorships.map((request) => (
                <MentorshipCard key={request.id} request={request} />
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

      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mentorship Feedback</DialogTitle>
            <DialogDescription>
              View feedback from your completed mentorship relationship.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Feedback details will be displayed here once the mentorship is completed and feedback is provided.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentMentorshipsPage;

