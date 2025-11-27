import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { EventCard } from '../components/events/EventCard';
import { CampaignCard } from '../components/events/CampaignCard';
import { DonationModal } from '../components/events/DonationModal';
import { mockEvents, mockCampaigns } from '../data/mockData';
import { type AlumniEvent, type Campaign, EventStatus } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';

const EventsCampaignsPage = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AlumniEvent | null>(null);
  const [isRSVPDialogOpen, setIsRSVPDialogOpen] = useState(false);

  const upcomingEvents = mockEvents.filter(e => e.status === EventStatus.Upcoming);
  const ongoingCampaigns = mockCampaigns.filter(c => c.status === EventStatus.Ongoing);

  const handleRSVP = (event: AlumniEvent) => {
    setSelectedEvent(event);
    setIsRSVPDialogOpen(true);
  };

  const handleDonate = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDonationModalOpen(true);
  };

  const handleRSVPSubmit = () => {
    if (selectedEvent) {
      console.log('RSVP Submitted:', {
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        timestamp: new Date().toISOString(),
      });
      setIsRSVPDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Events & Campaigns</h1>
        <p className="text-muted-foreground">
          Stay connected through events and support fundraising initiatives.
        </p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="campaigns">Fundraising Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
              ))}
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
            <p className="text-sm text-muted-foreground">
              Your RSVP has been recorded. You will receive a confirmation email shortly.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsRSVPDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRSVPSubmit}>
              Confirm RSVP
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

