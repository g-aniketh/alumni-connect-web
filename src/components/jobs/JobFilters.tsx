import { JobType } from '../../types';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

interface JobFiltersProps {
  selectedTypes: JobType[];
  onTypeChange: (type: JobType) => void;
  salaryRange: [number, number];
  onSalaryChange: (range: [number, number]) => void;
  locationSearch: string;
  onLocationChange: (location: string) => void;
  onClearFilters: () => void;
}

export const JobFilters = ({
  selectedTypes,
  onTypeChange,
  salaryRange,
  onSalaryChange,
  locationSearch,
  onLocationChange,
  onClearFilters,
}: JobFiltersProps) => {
  return (
    <Card className="h-fit sticky top-20">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Filter */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            placeholder="City, State, or Remote"
            value={locationSearch}
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>

        {/* Job Type Filter */}
        <div className="space-y-2">
          <Label>Job Type</Label>
          <div className="space-y-2">
            {Object.values(JobType).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => onTypeChange(type)}
                />
                <Label htmlFor={type} className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Range Filter */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <Label>Min Salary (Annual)</Label>
             <span className="text-xs text-muted-foreground">${salaryRange[0].toLocaleString()}</span>
          </div>
          
          <Slider
            defaultValue={[0]}
            max={200000}
            step={5000}
            value={[salaryRange[0]]}
            onValueChange={(vals) => onSalaryChange([vals[0], salaryRange[1]])}
          />
        </div>

        <Button variant="outline" className="w-full" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
};

