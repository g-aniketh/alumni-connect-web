import { Users, BadgeCheck, Handshake, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
}

const StatsCard = ({ title, value, icon: Icon, description }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Alumni"
        value="15,231"
        icon={Users}
        description="+12% from last year"
      />
      <StatsCard
        title="Verified Alumni"
        value="12,450"
        icon={BadgeCheck}
        description="81% verification rate"
      />
      <StatsCard
        title="Active Mentorships"
        value="573"
        icon={Handshake}
        description="+24 new this month"
      />
      <StatsCard
        title="Total Donations"
        value="$2.4M"
        icon={DollarSign}
        description="Lifetime contributions"
      />
    </div>
  );
};

