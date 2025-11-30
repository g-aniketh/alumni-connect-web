import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';

export const ActionArea = () => {
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  const [isJobOpen, setIsJobOpen] = useState(false);

  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating Campaign...');
    setIsCampaignOpen(false);
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Posting Job...');
    setIsJobOpen(false);
  };

  return (
    <div className="flex items-center gap-4">
      <Dialog open={isCampaignOpen} onOpenChange={setIsCampaignOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Launch a fundraising campaign or event.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCampaignSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input id="title" placeholder="Scholarship Fund 2025" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target">Target Amount ($)</Label>
              <Input id="target" type="number" placeholder="50000" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" placeholder="Brief description..." required />
            </div>
            <Button type="submit">Create Campaign</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isJobOpen} onOpenChange={setIsJobOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Post Job
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Post a Job Opportunity</DialogTitle>
            <DialogDescription>
              Share a job opening with the alumni network.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleJobSubmit} className="grid gap-4 py-4">
             <div className="grid gap-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" placeholder="Senior Engineer" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Tech Corp" required />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Remote / City" required />
            </div>
            <Button type="submit">Post Job</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

