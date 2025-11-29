import { useState } from 'react';
import { AlumniProfileCard } from '../components/alumni/AlumniProfileCard';
import { AlumniSearchFilters } from '../components/alumni/AlumniSearchFilters';
import { mockAlumni } from '../data/mockData';
import { type Alumni } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

const AlumniNetworkPage = () => {
  const { user } = useAuth();
  const [skillSearch, setSkillSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

  // Filter out current user from the list
  const filteredAlumni = mockAlumni.filter((alumni) => {
    if (user && alumni.id === user.id) return false;
    
    const matchesSkill = skillSearch === '' || 
      alumni.skills.some(skill => 
        skill.toLowerCase().includes(skillSearch.toLowerCase())
      );

    const matchesCompany = companySearch === '' || 
      alumni.currentEmployer.toLowerCase().includes(companySearch.toLowerCase());

    return matchesSkill && matchesCompany;
  });

  const handleConnect = (alumni: Alumni) => {
    setSelectedAlumni(alumni);
    setIsConnectDialogOpen(true);
  };

  const handleSubmitConnect = () => {
    if (selectedAlumni) {
      console.log('Connection Request Submitted:', {
        fromAlumniId: user?.id,
        toAlumniId: selectedAlumni.id,
        toAlumniName: selectedAlumni.name,
        timestamp: new Date().toISOString(),
      });
      setIsConnectDialogOpen(false);
      setSelectedAlumni(null);
    }
  };

  const handleClearFilters = () => {
    setSkillSearch('');
    setCompanySearch('');
  };

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Alumni Network</h1>
        <p className="text-muted-foreground">
          Connect with fellow alumni from your institution and expand your professional network.
        </p>
      </div>

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
              {filteredAlumni.map((alumni) => (
                <AlumniProfileCard
                  key={alumni.id}
                  alumni={alumni}
                  onRequestMentorship={handleConnect}
                />
              ))}
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
                  Send a connection request to <strong>{selectedAlumni.name}</strong> at {selectedAlumni.currentEmployer}.
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

