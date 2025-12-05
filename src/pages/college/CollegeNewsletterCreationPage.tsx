import { Card, CardContent, CardDescription, CardTitle } from '../../components/ui/card';
import { FileText } from 'lucide-react';

const CollegeNewsletterCreationPage = () => {

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Newsletter/Blog Post</h1>
        <p className="text-muted-foreground">
          Newsletter feature is not yet implemented in the backend.
        </p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <CardTitle className="mb-2">Newsletters Coming Soon</CardTitle>
            <CardDescription>
              This feature will be available in a future update.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeNewsletterCreationPage;

