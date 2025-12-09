import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { Users } from "lucide-react";
import { AlumniProfileCard } from "../../components/alumni/AlumniProfileCard";
import type { BackendAlumni } from "../../types/api";
import { type Alumni, UserRole } from "../../types";

const ConnectedAlumniPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [connectedAlumni, setConnectedAlumni] = useState<BackendAlumni[]>([]);

  useEffect(() => {
    loadConnectedAlumni();
  }, []);

  const loadConnectedAlumni = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend implements alumni connections
      // const connections = await alumniAPI.getConnections();
      // For now, show empty state
      setConnectedAlumni([]);
    } catch (err) {
      console.error("Error loading connected alumni:", err);
    } finally {
      setLoading(false);
    }
  };

  const transformAlumni = (backendAlumni: BackendAlumni): Alumni => {
    return {
      id: backendAlumni._id,
      name: backendAlumni.name,
      email: backendAlumni.email,
      avatar:
        backendAlumni.profilePictureUrlOptimized ||
        backendAlumni.profilePictureUrlHD ||
        backendAlumni.profilePictureUrl ||
        "",
      role: UserRole.Alumni,
      isVerified: backendAlumni.isVerified,
      designation: backendAlumni.currentDesignation || "",
      currentEmployer: backendAlumni.currentEmployer || "",
      graduationYear: backendAlumni.graduationYear,
      degree: backendAlumni.degree,
      department:
        backendAlumni.department as unknown as import("../../types").Department,
      skills: backendAlumni.skills || [],
      mentorshipAvailable: true,
    };
  };

  const handleConnect = (alumni: Alumni) => {
    // Handle connection action
    console.log("Connect with:", alumni);
  };

  if (loading) {
    return (
      <div className="container pt-[10vh] pb-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading connected alumni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-[10vh] pb-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Connected Alumni</h1>
        <p className="text-muted-foreground">
          View alumni you have connected with from your institution.
        </p>
      </div>

      {connectedAlumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {connectedAlumni.map((backendAlumni) => {
            const alumni = transformAlumni(backendAlumni);
            return (
              <AlumniProfileCard
                key={backendAlumni._id}
                alumni={alumni}
                onConnect={handleConnect}
                viewerRole={user?.role}
              />
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <CardTitle className="mb-2">No Connected Alumni</CardTitle>
              <CardDescription>
                You haven't connected with any alumni yet.
                <br />
                Visit the{" "}
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="/alumni/network">Alumni Network</a>
                </Button>{" "}
                to start connecting.
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConnectedAlumniPage;
