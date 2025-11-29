import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockNewsletters } from '../data/mockData';
import { Plus, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const CollegeNewslettersPage = () => {
  return (
    <div className="container py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletters & Blog</h1>
          <p className="text-muted-foreground">
            Share updates, news, and stories with the alumni community.
          </p>
        </div>
        <Button asChild>
          <Link to="/college/newsletters/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockNewsletters.map((newsletter) => (
          <Card key={newsletter.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            {newsletter.coverImage && (
              <div className="h-48 w-full overflow-hidden rounded-t-lg">
                <img 
                  src={newsletter.coverImage} 
                  alt={newsletter.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl line-clamp-2">{newsletter.title}</CardTitle>
                {newsletter.tags && newsletter.tags.length > 0 && (
                  <Badge variant="secondary">{newsletter.tags[0]}</Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2">
                {newsletter.summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(newsletter.publishedOn).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">By {newsletter.author}</p>
            </CardContent>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/college/newsletters/${newsletter.id}`}>Read More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CollegeNewslettersPage;

