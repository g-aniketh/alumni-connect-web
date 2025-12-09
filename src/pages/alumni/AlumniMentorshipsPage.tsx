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
import type React from "react";

type ActionType = "accept" | "reject" | "end";
type StatusKey = "pending" | "active" | "completed" | "declined";

const AlumniMentorshipsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedMentorship, setSelectedMentorship] =
    useState<BackendMentorship | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionTargetId, setActionTargetId] = useState<string | null>(null);

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
      // Silently handle 403 errors for unverified users (allow them to use the app)
      const errorMessage = err instanceof Error ? err.message : "";
      const isVerificationError =
        errorMessage.includes("403") ||
        errorMessage.includes("Forbidden") ||
        errorMessage.includes("Access denied") ||
        errorMessage.includes("not verified");

      if (isVerificationError) {
        // Set empty defaults for unverified users, don't show error
        setPendingRequests([]);
        setActiveMentorships([]);
        setCompletedMentorships([]);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to load mentorships"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (mentorship: BackendMentorship, type: ActionType) => {
    if (actionLoading) return;
    setSelectedMentorship(mentorship);
    setActionType(type);
    setActionTargetId(mentorship._id);
    setIsActionDialogOpen(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedMentorship || !actionType) return;

    try {
      setError("");
      setActionLoading(true);

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
        await mentorshipsAPI.end(selectedMentorship._id);
      }

      await loadMentorships();
      setIsActionDialogOpen(false);
      setSelectedMentorship(null);
      setActionType(null);
      setActionTargetId(null);
      setFeedback("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to perform action");
    } finally {
      setActionLoading(false);
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
    <div className="bg-[#E3F2FD] min-h-screen pt-[10vh]">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1565C0]">
            Mentorships
          </h1>
          <p className="text-[#333333] mt-2">
            Manage your mentorship requests and active connections.
          </p>
        </motion.div>

        {error && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-[#1E88E5]/20">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-[#E3F2FD] data-[state=active]:text-[#1565C0]"
            >
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-[#E3F2FD] data-[state=active]:text-[#1565C0]"
            >
              Active ({activeMentorships.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-[#E3F2FD] data-[state=active]:text-[#1565C0]"
            >
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
                    actionLoading={actionLoading}
                    actionTargetId={actionTargetId}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MessageSquare className="w-12 h-12 text-[#1E88E5]/50" />}
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
                    actionLoading={actionLoading}
                    actionTargetId={actionTargetId}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<User className="w-12 h-12 text-[#1E88E5]/50" />}
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
                    actionLoading={actionLoading}
                    actionTargetId={actionTargetId}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircle2 className="w-12 h-12 text-[#1E88E5]/50" />}
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
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
};

type MentorshipCardProps = {
  mentorship: BackendMentorship;
  student: BackendStudent | null;
  onAction: (mentorship: BackendMentorship, type: ActionType) => void;
};

const MentorshipCard = ({
  mentorship,
  student,
  onAction,
  actionLoading,
  actionTargetId,
}: MentorshipCardProps & {
  actionLoading: boolean;
  actionTargetId: string | null;
}) => {
  if (!student) return null;

  const normalized = mentorship.status.toLowerCase();
  const allowedStatuses: StatusKey[] = [
    "pending",
    "active",
    "completed",
    "declined",
  ];
  const status: StatusKey =
    (allowedStatuses.find((s) => s === normalized) as StatusKey | undefined) ||
    "pending";

  return (
    <Card className="flex flex-col h-full bg-white border-[#1E88E5]/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-[#E3F2FD]">
              <AvatarImage src={student.profilePictureUrl} alt={student.name} />
              <AvatarFallback className="bg-[#E3F2FD] text-[#1565C0]">
                {student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-[#1565C0]">
                {student.name}
              </CardTitle>
              <CardDescription className="text-[#333333]/80">
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
            <p className="text-sm font-semibold mb-1 text-[#1565C0]">
              Message:
            </p>
            <p className="text-sm text-[#333333] line-clamp-3">
              {mentorship.message}
            </p>
          </div>
        )}
        <div className="text-xs text-[#333333]/60 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#1E88E5]" />
          <span>
            Requested on {new Date(mentorship.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      {status === "pending" && (
        <CardFooter className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-[#1E88E5] hover:bg-[#1565C0] text-white"
            onClick={() => onAction(mentorship, "accept")}
            disabled={actionLoading && actionTargetId === mentorship._id}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {actionLoading && actionTargetId === mentorship._id
              ? "Processing..."
              : "Accept"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
            onClick={() => onAction(mentorship, "reject")}
            disabled={actionLoading && actionTargetId === mentorship._id}
          >
            <XCircle className="h-4 w-4 mr-2" />
            {actionLoading && actionTargetId === mentorship._id
              ? "Processing..."
              : "Decline"}
          </Button>
        </CardFooter>
      )}
      {status === "active" && (
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-red-200 text-red-700 hover:bg-red-50"
            onClick={() => onAction(mentorship, "end")}
            disabled={actionLoading && actionTargetId === mentorship._id}
          >
            <XCircle className="h-4 w-4 mr-2" />
            {actionLoading && actionTargetId === mentorship._id
              ? "Ending..."
              : "End Mentorship"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

type StatusBadgeProps = { status: StatusKey | string };
type StatusMapEntry = {
  icon: React.ReactNode;
  label: string;
  className: string;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusMap: Record<StatusKey, StatusMapEntry> = {
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
  const { icon, label, className } = statusMap[status as StatusKey] ?? {
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

type ActionDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  actionType: ActionType | null;
  mentorship: BackendMentorship | null;
  onSubmit: () => void;
  feedback: string;
  setFeedback: (value: string) => void;
};

const ActionDialog = ({
  isOpen,
  onOpenChange,
  actionType,
  mentorship,
  onSubmit,
  feedback,
  setFeedback,
  actionLoading,
}: ActionDialogProps & { actionLoading: boolean }) => {
  if (!mentorship || !actionType) return null;

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
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={actionLoading}>
            {actionLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type EmptyStateProps = {
  message: string;
  icon?: React.ReactNode;
};

const EmptyState = ({ message, icon }: EmptyStateProps) => (
  <Card className="bg-white border-[#1E88E5]/30">
    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
      {icon}
      <p className="mt-4 font-medium text-[#1565C0]">{message}</p>
    </CardContent>
  </Card>
);

export default AlumniMentorshipsPage;
