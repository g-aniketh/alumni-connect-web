import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { mockAlumni } from '../../data/mockData';
import { Department } from '../../types';
import { Search } from 'lucide-react';

const CollegeAlumniPage = () => {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  const years = Array.from(new Set<number>(mockAlumni.map(a => a.graduationYear))).sort(
    (a, b) => b - a,
  );

  const filteredAlumni = mockAlumni.filter((alumni) => {
    const matchesSearch = search === '' || 
      alumni.name.toLowerCase().includes(search.toLowerCase()) ||
      alumni.currentEmployer.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === 'all' || alumni.department === departmentFilter;
    const matchesYear = yearFilter === 'all' || alumni.graduationYear.toString() === yearFilter;

    return matchesSearch && matchesDept && matchesYear;
  });

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
        <p className="text-muted-foreground">
          View and manage all registered alumni from your institution.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {Object.values(Department).map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Graduation Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumni</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Current Company</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlumni.map((alumni) => (
                <TableRow key={alumni.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={alumni.avatar} alt={alumni.name} />
                        <AvatarFallback>{alumni.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{alumni.name}</div>
                        <div className="text-sm text-muted-foreground">{alumni.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{alumni.graduationYear}</TableCell>
                  <TableCell>{alumni.department}</TableCell>
                  <TableCell>{alumni.currentEmployer}</TableCell>
                  <TableCell>{alumni.designation}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">
                      Verified
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAlumni.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No alumni found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CollegeAlumniPage;

