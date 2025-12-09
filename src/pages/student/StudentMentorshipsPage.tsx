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
import { mentorshipsAPI } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import type {
  BackendMentorship,
  BackendAlumni,
  BackendStudent,
} from "../../types/api";
import {
  Calendar,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Building2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
const StudentMentorshipsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [myMentorships, setMyMentorships] = useState<BackendMentorship[]>([]);
  const [selectedMentorship, setSelectedMentorship] =
    useState<BackendMentorship | null>(null);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  useEffect(() => {
    loadMentorships();
  }, []);

  const loadMentorships = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await mentorshipsAPI.getMy();
      // Filter mentorships where current user is the mentee
      const allMentorships = response.mentorships.filter(
        (m: BackendMentorship) => {
          const menteeId =
            typeof m.menteeId === "object"
              ? ((m.menteeId as BackendStudent)._id ?? "")
              : m.menteeId;
          return menteeId === user?.id;
        }
      );
      setMyMentorships(allMentorships);
    } catch (err) {
      // Silently handle 403 errors for unverified users (allow them to use the app)
      const errorMessage = err instanceof Error ? err.message : "";
      const isVerificationError =
        errorMessage.includes("403") ||
        errorMessage.includes("Forbidden") ||
        errorMessage.includes("Access denied") ||
        errorMessage.includes("not verified");

      if (isVerificationError) {
        // Set empty defaults for unverified users, don't show error
        setMyMentorships([]);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to load mentorships"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Get active mentorships
  const activeMentorships = myMentorships.filter(
    (m) => m.status.toLowerCase() === "active"
  );

  // Get pending requests
  const pendingRequests = myMentorships.filter(
    (m) => m.status.toLowerCase() === "pending"
  );

  // Get completed mentorships
  const completedMentorships = myMentorships.filter(
    (m) => m.status.toLowerCase() === "completed"
  );

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

  const getMentorInfo = (
    mentorship: BackendMentorship
  ): BackendAlumni | null => {
    if (typeof mentorship.mentorId === "object") {
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

    const designation = mentor.currentDesignation || "";
    const employer = mentor.currentEmployer || "";
    const roleText =
      designation && employer
        ? `${designation} at ${employer}`
        : designation || employer || "Alumni";

    // Get gradient based on status
    const getCardGradient = () => {
      return "bg-white border-[#1E88E5]/30";
    };

    return (
      <Card
        className={`hover:shadow-xl transition-all ${getCardGradient()} border hover:scale-[1.02] duration-300`}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-14 w-14 border-2 border-[#E3F2FD] ring-2 ring-[#E3F2FD]">
                <AvatarImage
                  src={
                    mentor.profilePictureUrlOptimized ||
                    mentor.profilePictureUrlHD ||
                    mentor.profilePictureUrl
                  }
                  alt={mentor.name}
                />
                <AvatarFallback className="bg-[#E3F2FD] text-[#1565C0]">
                  {mentor.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg text-[#1565C0]">
                  {mentor.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1 text-[#333333]/80">
                  <Building2 className="h-3 w-3 text-[#1E88E5]" />
                  <span className="truncate">{roleText}</span>
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {request.message && (
            <div className="p-3 bg-[#E3F2FD]/30 rounded-lg border border-[#1E88E5]/20">
              <p className="text-xs font-medium text-[#1565C0] mb-1">
                Your Message:
              </p>
              <p className="text-sm text-[#333333]">{request.message}</p>
            </div>
          )}
          {request.areasOfInterest && request.areasOfInterest.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#1565C0] mb-2">
                Areas of Interest:
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(request.areasOfInterest)
                  ? request.areasOfInterest.map((area, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-[#E3F2FD] border-[#1E88E5]/30 text-[#1565C0]"
                      >
                        {area}
                      </Badge>
                    ))
                  : null}
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-[#333333]/60 pt-2 border-t border-[#E3F2FD]">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-[#1E88E5]" />
              <span>
                Requested {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
            {request.startDate && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-[#1E88E5]" />
                <span>
                  Started {new Date(request.startDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          {request.status.toLowerCase() === "completed" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:bg-[#E3F2FD] border-[#1E88E5]/30 text-[#1565C0]"
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
      <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5] mx-auto mb-4"></div>
          <p className="text-[#1565C0]">Loading mentorships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3F2FD]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#1565C0]">
            My Mentorships
          </h1>
          <p className="text-[#333333]">
            Manage your mentorship relationships and track your progress.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border-2 border-red-200 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-white/80 backdrop-blur-sm border border-[#1E88E5]/20">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-[#E3F2FD] data-[state=active]:text-[#1565C0]"
            >
              Active ({activeMentorships.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-[#E3F2FD] data-[state=active]:text-[#1565C0]"
            >
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-[#E3F2FD] data-[state=active]:text-[#1565C0]"
            >
              Completed ({completedMentorships.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {activeMentorships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeMentorships.map((request) => (
                  <MentorshipCard key={request._id} request={request} />
                ))}
              </div>
            ) : (
              <Card className="bg-white border-[#1E88E5]/30">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-16 w-16 text-[#1E88E5]/50 mb-4" />
                  <p className="text-lg font-semibold text-[#1565C0] mb-2">
                    No active mentorships
                  </p>
                  <p className="text-sm text-[#333333] text-center max-w-md mb-4">
                    You don't have any active mentorship relationships yet.
                    Browse alumni to find a mentor.
                  </p>
                  <Button
                    asChild
                    className="bg-[#1E88E5] hover:bg-[#1565C0] text-white"
                  >
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
                  <MentorshipCard key={request._id} request={request} />
                ))}
              </div>
            ) : (
              <Card className="bg-white border-[#1E88E5]/30">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-16 w-16 text-[#1E88E5]/50 mb-4" />
                  <p className="text-lg font-semibold text-[#1565C0] mb-2">
                    No pending requests
                  </p>
                  <p className="text-sm text-[#333333]">
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
                  <MentorshipCard key={request._id} request={request} />
                ))}
              </div>
            ) : (
              <Card className="bg-white border-[#1E88E5]/30">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-[#1E88E5]/50 mb-4" />
                  <p className="text-lg font-semibold text-[#1565C0] mb-2">
                    No completed mentorships
                  </p>
                  <p className="text-sm text-[#333333]">
                    Completed mentorship relationships will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Dialog
          open={isFeedbackDialogOpen}
          onOpenChange={setIsFeedbackDialogOpen}
        >
          <DialogContent className="bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-slate-100">
                Mentorship Feedback
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                View feedback from your completed mentorship relationship.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedMentorship?.mentorFeedback ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">
                      Mentor Feedback
                    </p>
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Rating:{" "}
                        </span>
                        <div className="flex">
                          {Array.from({
                            length: selectedMentorship.mentorFeedback.rating,
                          }).map((_, i) => (
                            <span key={i} className="text-yellow-500 text-lg">
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedMentorship.mentorFeedback.comment && (
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {selectedMentorship.mentorFeedback.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No feedback available yet. Feedback will be displayed here
                  once the mentorship is completed and feedback is provided.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentMentorshipsPage;
