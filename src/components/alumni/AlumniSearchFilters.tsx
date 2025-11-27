import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Search, X } from 'lucide-react';

interface AlumniSearchFiltersProps {
  skillSearch: string;
  onSkillSearchChange: (value: string) => void;
  companySearch: string;
  onCompanySearchChange: (value: string) => void;
  onClearFilters: () => void;
}

export const AlumniSearchFilters = ({
  skillSearch,
  onSkillSearchChange,
  companySearch,
  onCompanySearchChange,
  onClearFilters,
}: AlumniSearchFiltersProps) => {
  const hasActiveFilters = skillSearch || companySearch;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skill-search">Search by Skillset</Label>
          <Input
            id="skill-search"
            placeholder="e.g., React, Python, Machine Learning"
            value={skillSearch}
            onChange={(e) => onSkillSearchChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Search for specific skills or technologies
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-search">Search by Company</Label>
          <Input
            id="company-search"
            placeholder="e.g., Google, Microsoft, Tesla"
            value={companySearch}
            onChange={(e) => onCompanySearchChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Find alumni working at specific companies
          </p>
        </div>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onClearFilters}
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

