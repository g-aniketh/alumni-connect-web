import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";

interface AlumniSearchFiltersProps {
  nameSearch?: string;
  onNameSearchChange?: (value: string) => void;
  skillSearch: string;
  onSkillSearchChange: (value: string) => void;
  companySearch: string;
  onCompanySearchChange: (value: string) => void;
  onClearFilters: () => void;
}

export const AlumniSearchFilters = React.memo(
  ({
    nameSearch = "",
    onNameSearchChange,
    skillSearch,
    onSkillSearchChange,
    companySearch,
    onCompanySearchChange,
    onClearFilters,
  }: AlumniSearchFiltersProps) => {
    const hasActiveFilters = nameSearch || skillSearch || companySearch;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter Network
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {onNameSearchChange && (
            <div className="space-y-2">
              <Label htmlFor="name-search">Name</Label>
              <Input
                id="name-search"
                placeholder="e.g., John Doe"
                value={nameSearch}
                onChange={(e) => onNameSearchChange(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="skill-search">Skillset</Label>
            <Input
              id="skill-search"
              placeholder="e.g., React, Python"
              value={skillSearch}
              onChange={(e) => onSkillSearchChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-search">Company</Label>
            <Input
              id="company-search"
              placeholder="e.g., Google, Microsoft"
              value={companySearch}
              onChange={(e) => onCompanySearchChange(e.target.value)}
            />
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
  }
);
