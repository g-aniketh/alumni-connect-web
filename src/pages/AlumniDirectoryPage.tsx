import { useState, useEffect } from 'react';
import { AlumniProfileCard } from '../components/alumni/AlumniProfileCard';
import { AlumniSearchFilters } from '../components/alumni/AlumniSearchFilters';
import { type Alumni, UserRole } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { mentorshipsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { BackendAlumni } from '../types/api';

const AlumniDirectoryPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [alumni, setAlumni] = useState<BackendAlumni[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<BackendAlumni | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      setLoading(true);
      setError('');
      const mentors = await mentorshipsAPI.getMentors();
      // Filter out current user if they're an alumni
      const filtered = mentors.filter((a: BackendAlumni) => a._id !== user?.id);
      setAlumni(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alumni');
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((alumni) => {
    // Skill search - check if any skill matches (case-insensitive)
    const matchesSkill = skillSearch === '' || 
      (alumni.skills && alumni.skills.some(skill => 
        skill.toLowerCase().includes(skillSearch.toLowerCase())
      ));

    // Company search (case-insensitive)
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
      role: UserRole.Alumni,
      isVerified: backendAlumni.isVerified,
      designation: backendAlumni.currentDesignation || '',
      currentEmployer: backendAlumni.currentEmployer || '',
      graduationYear: backendAlumni.graduationYear,
      degree: backendAlumni.degree,
      department: backendAlumni.department as unknown as import('../types').Department,
      skills: backendAlumni.skills || [],
      mentorshipAvailable: true, // Available mentors are shown
    };
  };

  const handleRequestMentorship = (alumni: Alumni) => {
    // Find the backend alumni by matching id
    const backendAlumni = filteredAlumni.find(a => a._id === alumni.id);
    if (backendAlumni) {
      setSelectedAlumni(backendAlumni);
      setIsRequestDialogOpen(true);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedAlumni || !user) return;

    try {
      setSubmitting(true);
      setError('');

      const requestData = {
        mentorId: selectedAlumni._id,
        message: requestMessage.trim() || undefined,
        areasOfInterest: areasOfInterest.trim() ? areasOfInterest.split(',').map(a => a.trim()) : undefined,
      };

      await mentorshipsAPI.createRequest(requestData);
      
      setIsRequestDialogOpen(false);
      setSelectedAlumni(null);
      setRequestMessage('');
      setAreasOfInterest('');
      alert('Mentorship request sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send mentorship request');
    } finally {
      setSubmitting(false);
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
          <p className="text-muted-foreground">Loading alumni directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
        <p className="text-muted-foreground">
          Connect with alumni mentors and find guidance for your career journey.
        </p>
      </div>

      {error && !isRequestDialogOpen && (
        <div className="mb-4 p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Search & Filters Sidebar */}
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

        {/* Alumni Cards Grid */}
        <div className="lg:col-span-3">
          {filteredAlumni.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAlumni.map((backendAlumni) => {
                const alumni = transformAlumni(backendAlumni);
                return (
                  <AlumniProfileCard
                    key={backendAlumni._id}
                    alumni={alumni}
                    onRequestMentorship={handleRequestMentorship}
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

      {/* Mentorship Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={(open) => {
        setIsRequestDialogOpen(open);
        if (!open) {
          setRequestMessage('');
          setAreasOfInterest('');
          setError('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>
              {selectedAlumni && (
                <>
                  Send a mentorship request to <strong>{selectedAlumni.name}</strong> {selectedAlumni.currentEmployer ? `at ${selectedAlumni.currentEmployer}` : ''}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {error && (
              <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            {!user ? (
              <p className="text-sm text-muted-foreground">
                Please log in as a student to request mentorship.
              </p>
            ) : user.role !== 'Student' ? (
              <p className="text-sm text-muted-foreground">
                Only students can request mentorship.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell the mentor why you're interested in their guidance..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="areasOfInterest">Areas of Interest (Optional)</Label>
                  <Textarea
                    id="areasOfInterest"
                    placeholder="e.g., Career guidance, Technical skills, Industry insights (comma-separated)"
                    value={areasOfInterest}
                    onChange={(e) => setAreasOfInterest(e.target.value)}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter areas where you'd like mentorship, separated by commas
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRequestDialogOpen(false);
                setRequestMessage('');
                setAreasOfInterest('');
                setError('');
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitRequest}
              disabled={!user || user.role !== 'Student' || submitting}
            >
              {submitting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlumniDirectoryPage;

