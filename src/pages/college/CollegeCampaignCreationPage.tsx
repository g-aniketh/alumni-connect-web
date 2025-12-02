import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { EventStatus } from '../../types';
import { useNavigate } from 'react-router-dom';

const CollegeCampaignCreationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    targetAmount: string;
    deadline: string;
    status: EventStatus;
    image: string;
  }>({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    status: EventStatus.Ongoing,
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const campaignData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      totalRaised: 0,
      organizer: 'college-id', // Would come from auth context
    };
    console.log('Campaign Created:', campaignData);
    navigate('/events');
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Fundraising Campaign</h1>
        <p className="text-muted-foreground">
          Launch a fundraising campaign to support your institution's initiatives.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Fill in the information about your fundraising campaign.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                placeholder="e.g., New Library Wing Fund"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Campaign Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of the campaign, how funds will be used, and the impact..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount ($) *</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  min="1"
                  placeholder="500000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Campaign Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as EventStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EventStatus).map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Campaign Image URL (Optional)</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/campaign-image.jpg"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/events')}>
                Cancel
              </Button>
              <Button type="submit">Create Campaign</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeCampaignCreationPage;

