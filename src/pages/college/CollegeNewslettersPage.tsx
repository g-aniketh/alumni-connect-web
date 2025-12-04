import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FileText } from 'lucide-react';

const CollegeNewslettersPage = () => {
  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Newsletters & Blog</h1>
        <p className="text-muted-foreground">
          Newsletter feature is not yet implemented in the backend.
        </p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Newsletters Coming Soon</p>
            <p className="text-sm">This feature will be available in a future update.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeNewslettersPage;

