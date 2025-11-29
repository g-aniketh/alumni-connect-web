import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useNavigate } from 'react-router-dom';

const CollegeNewsletterCreationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Newsletter',
    image: '',
  });

  const categories = ['Newsletter', 'Blog', 'Announcement', 'Magazine'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newsletterData = {
      title: formData.title,
      summary: formData.excerpt,
      content: formData.content,
      author: 'college-id', // Would come from auth context
      publishedOn: new Date().toISOString().split('T')[0],
      coverImage: formData.image || undefined,
      tags: [formData.category],
    };
    console.log('Newsletter Created:', newsletterData);
    navigate('/college/newsletters');
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Newsletter/Blog Post</h1>
        <p className="text-muted-foreground">
          Share updates and stories with the alumni community.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>Fill in the information for your post.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Alumni Success Stories - 2024 Edition"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt/Summary *</Label>
              <Textarea
                id="excerpt"
                placeholder="Brief summary that will appear in the card..."
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your full article content here..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Featured Image URL (Optional)</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/college/newsletters')}>
                Cancel
              </Button>
              <Button type="submit">Publish Post</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeNewsletterCreationPage;

