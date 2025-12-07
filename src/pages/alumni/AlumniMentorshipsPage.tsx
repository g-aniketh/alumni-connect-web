import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { motion } from "motion/react";
import AlumniMentorshipsSkeleton from "./AlumniMentorshipsSkeleton";

const AlumniMentorshipsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedMentorship, setSelectedMentorship] =
    useState<BackendMentorship | null>(null);
  const [actionType, setActionType] = useState<
    "accept" | "reject" | "end" | null
  >(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

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

      setPendingRequests(
        allMentorships.filter((m) => m.status.toLowerCase() === "pending")
      );
      setActiveMentorships(
        allMentorships.filter((m) => m.status.toLowerCase() === "active")
      );
      setCompletedMentorships(
        allMentorships.filter((m) =>
          ["completed", "declined"].includes(m.status.toLowerCase())
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load mentorships"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (
    mentorship: BackendMentorship,
    type: "accept" | "reject" | "end"
  ) => {
    setSelectedMentorship(mentorship);
    setActionType(type);
    setIsActionDialogOpen(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedMentorship || !actionType) return;

    try {
      setError("");

      if (actionType === "accept") {
        await mentorshipsAPI.updateStatus(selectedMentorship._id, {
          status: "active",
          startDate: new Date().toISOString(),
        });
      } else if (actionType === "reject") {
        await mentorshipsAPI.updateStatus(selectedMentorship._id, {
          status: "declined",
        });
      } else if (actionType === "end") {
        await mentorshipsAPI.end(selectedMentorship._id, {
          feedback: feedback || undefined,
        });
      }

      await loadMentorships();
      setIsActionDialogOpen(false);
      setSelectedMentorship(null);
      setActionType(null);
      setFeedback("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to perform action");
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

  if (loading) {
    return <AlumniMentorshipsSkeleton />;
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Mentorships
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your mentorship requests and active connections.
          </p>
        </motion.div>

        {error && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeMentorships.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              History ({completedMentorships.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingRequests.map((m) => (
                  <MentorshipCard
                    key={m._id}
                    mentorship={m}
                    student={getStudentInfo(m)}
                    onAction={handleAction}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MessageSquare className="w-12 h-12 text-gray-400" />}
                message="No pending requests."
              />
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            {activeMentorships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeMentorships.map((m) => (
                  <MentorshipCard
                    key={m._id}
                    mentorship={m}
                    student={getStudentInfo(m)}
                    onAction={handleAction}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<User className="w-12 h-12 text-gray-400" />}
                message="No active mentorships."
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedMentorships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedMentorships.map((m) => (
                  <MentorshipCard
                    key={m._id}
                    mentorship={m}
                    student={getStudentInfo(m)}
                    onAction={handleAction}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircle2 className="w-12 h-12 text-gray-400" />}
                message="No completed mentorships yet."
              />
            )}
          </TabsContent>
        </Tabs>

        <ActionDialog
          isOpen={isActionDialogOpen}
          onOpenChange={setIsActionDialogOpen}
          actionType={actionType}
          mentorship={selectedMentorship}
          onSubmit={handleSubmitAction}
          feedback={feedback}
          setFeedback={setFeedback}
        />
      </div>
    </div>
  );
};

const MentorshipCard = ({ mentorship, student, onAction }) => {
  if (!student) return null;

  const status = mentorship.status.toLowerCase();

  return (
    <Card className="flex flex-col h-full bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={student.profilePictureUrl} alt={student.name} />
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{student.name}</CardTitle>
              <CardDescription>
                {student.degree} • {student.department}
              </CardDescription>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {mentorship.message && (
          <div>
            <p className="text-sm font-semibold mb-1">Message:</p>
            <p className="text-sm text-gray-600 line-clamp-3">
              {mentorship.message}
            </p>
          </div>
        )}
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            Requested on {new Date(mentorship.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      {status === "pending" && (
        <CardFooter className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onAction(mentorship, "accept")}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onAction(mentorship, "reject")}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Decline
          </Button>
        </CardFooter>
      )}
      {status === "active" && (
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onAction(mentorship, "end")}
          >
            <XCircle className="h-4 w-4 mr-2" />
            End Mentorship
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: {
      icon: <Clock className="h-3 w-3 mr-1.5" />,
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800",
    },
    active: {
      icon: <CheckCircle2 className="h-3 w-3 mr-1.5" />,
      label: "Active",
      className: "bg-green-100 text-green-800",
    },
    completed: {
      icon: <CheckCircle2 className="h-3 w-3 mr-1.5" />,
      label: "Completed",
      className: "bg-blue-100 text-blue-800",
    },
    declined: {
      icon: <XCircle className="h-3 w-3 mr-1.5" />,
      label: "Declined",
      className: "bg-red-100 text-red-800",
    },
  };
  const { icon, label, className } = statusMap[status] || {
    icon: null,
    label: status,
    className: "",
  };
  return (
    <Badge className={className}>
      {icon}
      {label}
    </Badge>
  );
};

const ActionDialog = ({
  isOpen,
  onOpenChange,
  actionType,
  mentorship,
  onSubmit,
  feedback,
  setFeedback,
}) => {
  if (!mentorship) return null;

  const titles = {
    accept: "Accept Mentorship Request",
    reject: "Decline Mentorship Request",
    end: "End Mentorship",
  };
  const descriptions = {
    accept: "You are about to start a new mentorship.",
    reject:
      "The student will be notified that you have declined their request.",
    end: "Provide feedback for this mentorship.",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titles[actionType]}</DialogTitle>
          <DialogDescription>{descriptions[actionType]}</DialogDescription>
        </DialogHeader>
        {(actionType === "end" || actionType === "reject") && (
          <div className="py-4">
            <Label htmlFor="feedback">
              {actionType === "end"
                ? "Feedback (Optional)"
                : "Reason for Decline (Optional)"}
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-2"
              placeholder="Provide some details..."
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EmptyState = ({ message, icon }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
      {icon}
      <p className="mt-4 font-medium">{message}</p>
    </CardContent>
  </Card>
);

export default AlumniMentorshipsPage;
