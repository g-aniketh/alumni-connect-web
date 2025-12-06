import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ContributionType } from "../../types";
import { DollarSign, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { campaignsAPI } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import type { BackendCampaign } from "../../types/api";

interface DonationModalProps {
  campaign: BackendCampaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DonationModal = ({
  campaign,
  open,
  onOpenChange,
}: DonationModalProps) => {
  const { user } = useAuth();
  const [contributionType, setContributionType] = useState<ContributionType>(
    ContributionType.Financial
  );
  const [amount, setAmount] = useState("");
  const [hours, setHours] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  if (!campaign) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to contribute");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (contributionType === ContributionType.Financial) {
        await campaignsAPI.contributeFinancial({
          campaignId: campaign._id,
          amount: parseFloat(amount),
          paymentMethod,
        });
      } else {
        await campaignsAPI.contributeVolunteer({
          campaignId: campaign._id,
          hours: parseFloat(hours),
          activityDescription: `Volunteered ${hours} hours for ${campaign.title}`,
        });
      }

      alert("Contribution submitted successfully!");
      onOpenChange(false);
      setAmount("");
      setHours("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit contribution"
      );
    } finally {
      setLoading(false);
    }
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
                  <div className="font-medium">
                    {ContributionType.Financial}
                  </div>
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
                  <div className="font-medium">
                    {ContributionType.Volunteer}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {contributionType === ContributionType.Financial ? (
            <div className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !user}>
              {loading ? "Submitting..." : "Submit Contribution"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
