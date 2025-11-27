import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { type Campaign, ContributionType } from '../../types';
import { DollarSign, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface DonationModalProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DonationModal = ({ campaign, open, onOpenChange }: DonationModalProps) => {
  const [contributionType, setContributionType] = useState<ContributionType>(ContributionType.Financial);
  const [amount, setAmount] = useState('');
  const [hours, setHours] = useState('');

  if (!campaign) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donationData = {
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      contributionType,
      ...(contributionType === ContributionType.Financial
        ? { amount: parseFloat(amount) }
        : { hours: parseFloat(hours) }),
    };
    console.log('Donation Submitted:', donationData);
    onOpenChange(false);
    setAmount('');
    setHours('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Support {campaign.title}</DialogTitle>
          <DialogDescription>
            Choose how you'd like to contribute to this campaign.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Contribution Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setContributionType(ContributionType.Financial)}
                className={cn(
                  "flex items-center gap-2 p-4 border rounded-md text-left transition-colors",
                  contributionType === ContributionType.Financial
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                )}
              >
                <DollarSign className="h-5 w-5" />
                <div>
                  <div className="font-medium">{ContributionType.Financial}</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setContributionType(ContributionType.Volunteer)}
                className={cn(
                  "flex items-center gap-2 p-4 border rounded-md text-left transition-colors",
                  contributionType === ContributionType.Volunteer
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                )}
              >
                <Clock className="h-5 w-5" />
                <div>
                  <div className="font-medium">{ContributionType.Volunteer}</div>
                </div>
              </button>
            </div>
          </div>

          {contributionType === ContributionType.Financial ? (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="hours">Hours to Volunteer</Label>
              <Input
                id="hours"
                type="number"
                min="1"
                step="0.5"
                placeholder="Enter hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Contribution
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

