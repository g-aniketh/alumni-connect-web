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

export const AlumniSearchFilters = ({
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
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-slate-200 dark:border-slate-700">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {onNameSearchChange && (
          <div className="space-y-2">
            <Label htmlFor="name-search" className="text-slate-900 dark:text-slate-100">Search by Name</Label>
            <Input
              id="name-search"
              placeholder="e.g., John Doe"
              value={nameSearch}
              onChange={(e) => onNameSearchChange(e.target.value)}
              className="bg-white dark:bg-gray-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Search for alumni by name
            </p>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="skill-search" className="text-slate-900 dark:text-slate-100">Search by Skillset</Label>
          <Input
            id="skill-search"
            placeholder="e.g., React, Python, Machine Learning"
            value={skillSearch}
            onChange={(e) => onSkillSearchChange(e.target.value)}
            className="bg-white dark:bg-gray-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Search for specific skills or technologies
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-search" className="text-slate-900 dark:text-slate-100">Search by Company</Label>
          <Input
            id="company-search"
            placeholder="e.g., Google, Microsoft, Tesla"
            value={companySearch}
            onChange={(e) => onCompanySearchChange(e.target.value)}
            className="bg-white dark:bg-gray-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Find alumni working at specific companies
          </p>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            className="w-full border-slate-300 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400"
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
