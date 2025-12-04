import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { EventCard } from '../components/events/EventCard';
import { CampaignCard } from '../components/events/CampaignCard';
import { DonationModal } from '../components/events/DonationModal';
import { mockCampaigns } from '../data/mockData';
import { type AlumniEvent, type Campaign } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { eventsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { BackendEvent } from '../types/api';

const EventsCampaignsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BackendEvent | null>(null);
  const [isRSVPDialogOpen, setIsRSVPDialogOpen] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get filtered events (college context if authenticated, or all if not)
      if (user) {
        const response = await eventsAPI.getFiltered({ upcoming: true });
        const eventsList = Array.isArray(response) ? response : response.events || [];
        setEvents(eventsList);
      } else {
        const allEvents = await eventsAPI.getAll();
        // Filter for upcoming events
        const now = new Date();
        const upcoming = allEvents.filter(e => new Date(e.eventDate) >= now);
        setEvents(upcoming);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const ongoingCampaigns = mockCampaigns.filter(c => c.status === 'Ongoing' as any);

  // Transform BackendEvent to AlumniEvent for components
  const transformEvent = (backendEvent: BackendEvent): AlumniEvent => {
    const organizerName = typeof backendEvent.organizedBy.organizerId === 'object' 
      ? backendEvent.organizedBy.organizerId.name 
      : 'Organizer';
    
    return {
      id: backendEvent._id,
      title: backendEvent.title,
      description: backendEvent.description,
      date: backendEvent.eventDate,
      location: backendEvent.location,
      organizer: organizerName,
      status: 'Upcoming' as any, // Assuming upcoming since we filtered for it
      image: backendEvent.eventBannerUrl || '',
    };
  };

  const handleRSVP = (event: AlumniEvent) => {
    setSelectedEvent(event);
    setIsRSVPDialogOpen(true);
  };

  const handleDonate = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDonationModalOpen(true);
  };

  const handleRSVPSubmit = async () => {
    if (!selectedEvent || !user) return;

    try {
      setError('');
      await eventsAPI.register({ eventId: selectedEvent._id });
      setIsRSVPDialogOpen(false);
      setSelectedEvent(null);
      alert('Successfully registered for the event!');
      // Reload events to update registration status
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register for event');
    }
  };

  if (loading) {
    return (
      <div className="container py-8 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Events & Campaigns</h1>
        <p className="text-muted-foreground">
          Stay connected through events and support fundraising initiatives.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="campaigns">Fundraising Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((backendEvent) => {
                const event = transformEvent(backendEvent);
                return (
                  <EventCard 
                    key={backendEvent._id} 
                    event={event} 
                    onRSVP={() => {
                      setSelectedEvent(backendEvent);
                      setIsRSVPDialogOpen(true);
                    }} 
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No upcoming events</p>
              <p className="text-sm">Check back later for new events.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          {ongoingCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingCampaigns.map((campaign) => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  onDonate={handleDonate} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No active campaigns</p>
              <p className="text-sm">Check back later for new fundraising initiatives.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* RSVP Dialog */}
      <Dialog open={isRSVPDialogOpen} onOpenChange={setIsRSVPDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RSVP to Event</DialogTitle>
            <DialogDescription>
              {selectedEvent && (
                <>
                  Confirm your attendance for <strong>{selectedEvent.title}</strong>.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && (
              <div className="mb-4 p-3 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            {!user ? (
              <p className="text-sm text-muted-foreground">
                Please log in as a student to register for events.
              </p>
            ) : user.role !== 'Student' ? (
              <p className="text-sm text-muted-foreground">
                Only students can register for events.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your registration will be recorded. You will receive a confirmation email shortly.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRSVPDialogOpen(false);
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRSVPSubmit}
              disabled={!user || user.role !== 'Student'}
            >
              Confirm Registration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Donation Modal */}
      <DonationModal
        campaign={selectedCampaign}
        open={isDonationModalOpen}
        onOpenChange={setIsDonationModalOpen}
      />
    </div>
  );
};

export default EventsCampaignsPage;

