import { useState, useEffect } from 'react';
import { AlumniProfileCard } from '../../components/alumni/AlumniProfileCard';
import { AlumniSearchFilters } from '../../components/alumni/AlumniSearchFilters';
import type { Alumni } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { mentorshipsAPI } from '../../lib/api';
import type { BackendAlumni } from '../../types/api';

const AlumniNetworkPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [alumni, setAlumni] = useState<BackendAlumni[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<BackendAlumni | null>(null);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      setLoading(true);
      setError('');
      const mentors = await mentorshipsAPI.getMentors();
      // Filter out current user
      const filtered = mentors.filter((a: BackendAlumni) => a._id !== user?.id);
      setAlumni(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alumni');
    } finally {
      setLoading(false);
    }
  };

  // Filter alumni based on search criteria
  const filteredAlumni = alumni.filter((alumni) => {
    const matchesSkill = skillSearch === '' || 
      (alumni.skills && alumni.skills.some(skill => 
        skill.toLowerCase().includes(skillSearch.toLowerCase())
      ));

    const matchesCompany = companySearch === '' || 
      (alumni.currentEmployer && alumni.currentEmployer.toLowerCase().includes(companySearch.toLowerCase()));

    return matchesSkill && matchesCompany;
  });

  // Transform BackendAlumni to Alumni for the component
  const transformAlumni = (backendAlumni: BackendAlumni): Alumni => {
    return {
      id: backendAlumni._id,
      name: backendAlumni.name,
      email: backendAlumni.email,
      avatar: backendAlumni.profilePictureUrl || '',
      role: 'Alumni' as any,
      designation: backendAlumni.currentDesignation || '',
      currentEmployer: backendAlumni.currentEmployer || '',
      graduationYear: backendAlumni.graduationYear,
      degree: backendAlumni.degree,
      department: backendAlumni.department,
      skills: backendAlumni.skills || [],
      mentorshipAvailable: true, // Default to true for available mentors
    };
  };

  const handleConnect = (alumni: Alumni) => {
    // Find the backend alumni by matching id
    const backendAlumni = filteredAlumni.find(a => a._id === alumni.id);
    if (backendAlumni) {
      setSelectedAlumni(backendAlumni);
      setIsConnectDialogOpen(true);
    }
  };

  const handleSubmitConnect = () => {
    // Alumni-to-alumni connection feature is not yet implemented in the backend
    // This would require a separate connection/network request system
    if (selectedAlumni) {
      alert('Alumni-to-alumni connection feature is coming soon!');
      setIsConnectDialogOpen(false);
      setSelectedAlumni(null);
    }
  };

  const handleClearFilters = () => {
    setSkillSearch('');
    setCompanySearch('');
  };

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading alumni network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Alumni Network</h1>
        <p className="text-muted-foreground">
          Connect with fellow alumni from your institution and expand your professional network.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <AlumniSearchFilters
              skillSearch={skillSearch}
              onSkillSearchChange={setSkillSearch}
              companySearch={companySearch}
              onCompanySearchChange={setCompanySearch}
              onClearFilters={handleClearFilters}
            />
          </div>
        </aside>

        <div className="lg:col-span-3">
          {filteredAlumni.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAlumni.map((backendAlumni) => {
                const alumni = transformAlumni(backendAlumni);
                return (
                  <AlumniProfileCard
                    key={backendAlumni._id}
                    alumni={alumni}
                    onRequestMentorship={handleConnect}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No alumni found</p>
              <p className="text-sm">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with Alumni</DialogTitle>
            <DialogDescription>
              {selectedAlumni && (
                <>
                  Send a connection request to <strong>{selectedAlumni.name}</strong> {selectedAlumni.currentEmployer ? `at ${selectedAlumni.currentEmployer}` : ''}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Your connection request will be sent. They will be notified and can accept your request.
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

export default AlumniNetworkPage;

