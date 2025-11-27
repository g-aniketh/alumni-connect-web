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

const AlumniDirectoryPage = () => {
  const [skillSearch, setSkillSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const filteredAlumni = mockAlumni.filter((alumni) => {
    // Skill search - check if any skill matches (case-insensitive)
    const matchesSkill = skillSearch === '' || 
      alumni.skills.some(skill => 
        skill.toLowerCase().includes(skillSearch.toLowerCase())
      );

    // Company search (case-insensitive)
    const matchesCompany = companySearch === '' || 
      alumni.currentEmployer.toLowerCase().includes(companySearch.toLowerCase());

    return matchesSkill && matchesCompany;
  });

  const handleRequestMentorship = (alumni: Alumni) => {
    setSelectedAlumni(alumni);
    setIsRequestDialogOpen(true);
  };

  const handleSubmitRequest = () => {
    if (selectedAlumni) {
      console.log('Mentorship Request Submitted:', {
        alumniId: selectedAlumni.id,
        alumniName: selectedAlumni.name,
        timestamp: new Date().toISOString(),
      });
      setIsRequestDialogOpen(false);
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
        <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
        <p className="text-muted-foreground">
          Connect with alumni mentors and find guidance for your career journey.
        </p>
      </div>

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
              {filteredAlumni.map((alumni) => (
                <AlumniProfileCard
                  key={alumni.id}
                  alumni={alumni}
                  onRequestMentorship={handleRequestMentorship}
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

      {/* Mentorship Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>
              {selectedAlumni && (
                <>
                  Send a mentorship request to <strong>{selectedAlumni.name}</strong> at {selectedAlumni.currentEmployer}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Your request will be sent to the alumni. They will be notified and can respond to your mentorship request.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsRequestDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest}>
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlumniDirectoryPage;

