import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { type Campaign } from "../../types";
import { DollarSign, Calendar, User } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  onDonate: (campaign: Campaign) => void;
}

export const CampaignCard = ({ campaign, onDonate }: CampaignCardProps) => {
  const progressPercentage =
    campaign.targetAmount > 0
      ? (campaign.totalRaised / campaign.targetAmount) * 100
      : 0;
  const organizerName =
    typeof campaign.organizer === "string" ? campaign.organizer : "Organizer";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow bg-white border-[#1E88E5]/20">
      {campaign.image && (
        <div className="h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl text-[#1565C0]">
            {campaign.title}
          </CardTitle>
          <Badge variant="secondary" className="bg-[#E3F2FD] text-[#1565C0]">
            {campaign.status}
          </Badge>
        </div>
        <p className="text-sm text-[#333333] mt-2 line-clamp-2">
          {campaign.description}
        </p>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#333333]/80">Raised</span>
            <span className="font-semibold text-[#1565C0]">
              {formatCurrency(campaign.totalRaised)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#333333]/80">Target</span>
            <span className="font-semibold text-[#1565C0]">
              {formatCurrency(campaign.targetAmount)}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2 bg-[#E3F2FD]"
            indicatorClassName="bg-[#1E88E5]"
          />
          <p className="text-xs text-[#333333]/60 text-center">
            {progressPercentage.toFixed(1)}% funded
          </p>
        </div>

        <div className="space-y-2 text-sm pt-2 border-t border-[#E3F2FD]">
          <div className="flex items-center gap-2 text-[#333333]/80">
            <Calendar className="h-4 w-4 text-[#1E88E5]" />
            <span>
              Deadline: {new Date(campaign.deadline).toLocaleDateString()}
            </span>
          </div>
          {organizerName && (
            <div className="flex items-center gap-2 text-[#333333]/80">
              <User className="h-4 w-4 text-[#1E88E5]" />
              <span className="text-xs">{organizerName}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-[#1E88E5] hover:bg-[#1565C0] text-white"
          onClick={() => onDonate(campaign)}
          disabled={campaign.status !== "Ongoing"}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {campaign.status === "Ongoing"
            ? "Donate"
            : campaign.status === "Upcoming"
              ? "Coming Soon"
              : "Campaign Ended"}
        </Button>
      </CardFooter>
    </Card>
  );
};
