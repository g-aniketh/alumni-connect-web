import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { type Campaign } from '../../types';
import { DollarSign, Calendar, User } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  onDonate: (campaign: Campaign) => void;
}

export const CampaignCard = ({ campaign, onDonate }: CampaignCardProps) => {
  const progressPercentage = campaign.targetAmount > 0 
    ? (campaign.totalRaised / campaign.targetAmount) * 100 
    : 0;
  const organizerName = typeof campaign.organizer === 'string' ? campaign.organizer : 'Organizer';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
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
          <CardTitle className="text-xl">{campaign.title}</CardTitle>
          <Badge variant="secondary">{campaign.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {campaign.description}
        </p>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Raised</span>
            <span className="font-semibold">{formatCurrency(campaign.totalRaised)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Target</span>
            <span className="font-semibold">{formatCurrency(campaign.targetAmount)}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {progressPercentage.toFixed(1)}% funded
          </p>
        </div>

        <div className="space-y-2 text-sm pt-2 border-t">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
          </div>
          {organizerName && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-xs">{organizerName}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onDonate(campaign)}
          disabled={campaign.status !== 'Ongoing'}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {campaign.status === 'Ongoing' 
            ? 'Donate' 
            : campaign.status === 'Upcoming' 
            ? 'Coming Soon' 
            : 'Campaign Ended'}
        </Button>
      </CardFooter>
    </Card>
  );
};

