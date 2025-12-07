import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Calendar, CheckCircle2, XCircle, Clock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { mentorshipsAPI } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import type {
  BackendMentorship,
  BackendStudent,
  BackendAlumni,
} from "../../types/api";

const AlumniMentorshipsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "accept" | "reject" | "end" | null
  >(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [, setMyMentorships] = useState<BackendMentorship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<BackendMentorship[]>(
    []
  );
  const [activeMentorships, setActiveMentorships] = useState<
    BackendMentorship[]
  >([]);
  const [completedMentorships, setCompletedMentorships] = useState<
    BackendMentorship[]
  >([]);

  useEffect(() => {
    loadMentorships();
  }, []);

  const loadMentorships = async () => {
    try {
      setLoading(true);
      setError("");

      // Get all mentorships where current user is the mentor (alumni)
      const response = await mentorshipsAPI.getMy();
      const allMentorships = response.mentorships.filter(
        (m: BackendMentorship) => {
          const mentorId =
            typeof m.mentorId === "object"
              ? (m.mentorId as BackendAlumni)._id
              : m.mentorId;
          return mentorId === user?.id;
        }
      );

      setMyMentorships(allMentorships);
      setPendingRequests(
        allMentorships.filter((m) => m.status.toLowerCase() === "pending")
      );
      setActiveMentorships(
        allMentorships.filter((m) => m.status.toLowerCase() === "active")
      );
      setCompletedMentorships(
        allMentorships.filter((m) => m.status.toLowerCase() === "completed")
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load mentorships"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "declined":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStudentInfo = (
    mentorship: BackendMentorship
  ): BackendStudent | null => {
    if (typeof mentorship.menteeId === "object") {
      return mentorship.menteeId as BackendStudent;
    }
    return null;
  };

  const handleAction = (
    requestId: string,
    type: "accept" | "reject" | "end"
  ) => {
    setSelectedRequest(requestId);
    setActionType(type);
    setIsActionDialogOpen(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      setError("");

      if (actionType === "accept") {
        await mentorshipsAPI.updateStatus(selectedRequest, {
          status: "active",
          startDate: new Date().toISOString(),
        });
      } else if (actionType === "reject") {
        await mentorshipsAPI.updateStatus(selectedRequest, {
          status: "declined",
        });
      } else if (actionType === "end") {
        await mentorshipsAPI.end(selectedRequest);
        // If feedback provided, add it
        if (feedback.trim() || rating) {
          await mentorshipsAPI.addFeedback(selectedRequest, {
            rating,
            comment: feedback.trim() || undefined,
          });
        }
      }

      await loadMentorships();
      setIsActionDialogOpen(false);
      setSelectedRequest(null);
      setActionType(null);
      setFeedback("");
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to perform action");
    }
  };

  const PendingRequestCard = ({ request }: { request: BackendMentorship }) => {
    const student = getStudentInfo(request);
    if (!student) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={student.profilePictureUrl}
                  alt={student.name}
                />
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
              <p className="text-sm text-muted-foreground mb-1">
                Student's Message:
              </p>
              <p className="text-sm">{request.message}</p>
            </div>
          )}
          {request.areasOfInterest && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Areas of Interest:
              </p>
              <p className="text-sm">
                {Array.isArray(request.areasOfInterest)
                  ? request.areasOfInterest.join(", ")
                  : request.areasOfInterest}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Requested on {new Date(request.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleAction(request._id, "accept")}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => handleAction(request._id, "reject")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ActiveMentorshipCard = ({
    request,
  }: {
    request: BackendMentorship;
  }) => {
    const student = getStudentInfo(request);
    if (!student) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={student.profilePictureUrl}
                  alt={student.name}
                />
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
          {request.startDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Started on {new Date(request.startDate).toLocaleDateString()}
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleAction(request._id, "end")}
          >
            <XCircle className="h-4 w-4 mr-2" />
            End Mentorship
          </Button>
        </CardContent>
      </Card>
    );
  };

  const CompletedMentorshipCard = ({
    request,
  }: {
    request: BackendMentorship;
  }) => {
    const student = getStudentInfo(request);
    if (!student) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={student.profilePictureUrl}
                  alt={student.name}
                />
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
          {request.endDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Completed on {new Date(request.endDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-950 dark:to-blue-900">
        <div className="container py-8">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading mentorships...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-950 dark:to-blue-900">
      <div className="container py-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Mentorship Requests
          </h1>
          <p className="text-muted-foreground">
            Manage mentorship requests from students and track your active
            mentorship relationships.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

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
                  <PendingRequestCard key={request._id} request={request} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    No pending requests
                  </p>
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
                  <ActiveMentorshipCard key={request._id} request={request} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    No active mentorships
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You don't have any active mentorship relationships at the
                    moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedMentorships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedMentorships.map((request) => (
                  <CompletedMentorshipCard
                    key={request._id}
                    request={request}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    No completed mentorships
                  </p>
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
                {actionType === "accept" && "Accept Mentorship Request"}
                {actionType === "reject" && "Decline Mentorship Request"}
                {actionType === "end" && "End Mentorship"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "accept" &&
                  "Accept this mentorship request and start guiding the student."}
                {actionType === "reject" &&
                  "Decline this mentorship request. The student will be notified."}
                {actionType === "end" &&
                  "End this mentorship relationship. You can provide feedback."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {actionType === "end" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    >
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>
                          {r} {r === 5 ? "⭐" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback (Optional)</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Add any feedback or notes..."
                      value={feedback}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFeedback(e.target.value)
                      }
                      rows={4}
                    />
                  </div>
                </>
              )}
              {actionType === "reject" && (
                <div className="space-y-2">
                  <Label htmlFor="feedback">
                    Reason for Decline (Optional)
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Add any feedback or notes..."
                    value={feedback}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFeedback(e.target.value)
                    }
                    rows={4}
                  />
                </div>
              )}
              {actionType === "accept" && (
                <p className="text-sm text-muted-foreground">
                  By accepting, you agree to mentor this student. The mentorship
                  will become active.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsActionDialogOpen(false);
                  setFeedback("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitAction}>
                {actionType === "accept" && "Accept Request"}
                {actionType === "reject" && "Decline Request"}
                {actionType === "end" && "End Mentorship"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AlumniMentorshipsPage;
