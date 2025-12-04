import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { mentorshipsAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import type { BackendMentorship, BackendAlumni } from '../../types/api';
import { Calendar, MessageSquare, CheckCircle2, XCircle, Clock, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
const StudentMentorshipsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [myMentorships, setMyMentorships] = useState<BackendMentorship[]>([]);
  const [selectedMentorship, setSelectedMentorship] = useState<BackendMentorship | null>(null);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  useEffect(() => {
    loadMentorships();
  }, []);

  const loadMentorships = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await mentorshipsAPI.getMy();
      // Filter mentorships where current user is the mentee
      const allMentorships = response.mentorships.filter((m: BackendMentorship) => {
        const menteeId =
          typeof m.menteeId === 'object'
            ? (m.menteeId as BackendStudent)._id ?? ''
            : m.menteeId;
        return menteeId === user?.id;
      });
      setMyMentorships(allMentorships);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mentorships');
    } finally {
      setLoading(false);
    }
  };

  // Get active mentorships
  const activeMentorships = myMentorships.filter(m => m.status.toLowerCase() === 'active');
  
  // Get pending requests
  const pendingRequests = myMentorships.filter(m => m.status.toLowerCase() === 'pending');
  
  // Get completed mentorships
  const completedMentorships = myMentorships.filter(m => m.status.toLowerCase() === 'completed');

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMentorInfo = (mentorship: BackendMentorship): BackendAlumni | null => {
    if (typeof mentorship.mentorId === 'object') {
      return mentorship.mentorId as BackendAlumni;
    }
    return null;
  };

  const handleViewFeedback = (mentorship: BackendMentorship) => {
    setSelectedMentorship(mentorship);
    setIsFeedbackDialogOpen(true);
  };

  const MentorshipCard = ({ request }: { request: BackendMentorship }) => {
    const mentor = getMentorInfo(request);
    if (!mentor) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mentor.profilePictureUrl} alt={mentor.name} />
                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{mentor.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span>{mentor.currentDesignation || 'Alumni'}</span>
                  {mentor.currentEmployer && (
                    <>
                      <span>•</span>
                      <span>{mentor.currentEmployer}</span>
                    </>
                  )}
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
          {request.areasOfInterest && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Areas of Interest:</p>
              <p className="text-sm">{Array.isArray(request.areasOfInterest) ? request.areasOfInterest.join(', ') : request.areasOfInterest}</p>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Requested on {new Date(request.createdAt).toLocaleDateString()}</span>
          </div>
          {request.startDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Started on {new Date(request.startDate).toLocaleDateString()}</span>
            </div>
          )}
          {request.status.toLowerCase() === 'completed' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleViewFeedback(request)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View Feedback
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading mentorships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Mentorships</h1>
        <p className="text-muted-foreground">
          Manage your mentorship relationships and track your progress.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

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
            {selectedMentorship?.mentorFeedback ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Mentor Feedback</p>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">Rating: </span>
                      <div className="flex">
                        {Array.from({ length: selectedMentorship.mentorFeedback.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-500">⭐</span>
                        ))}
                      </div>
                    </div>
                    {selectedMentorship.mentorFeedback.comment && (
                      <p className="text-sm">{selectedMentorship.mentorFeedback.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No feedback available yet. Feedback will be displayed here once the mentorship is completed and feedback is provided.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentMentorshipsPage;

