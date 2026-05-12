import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Save } from 'lucide-react';
import BackToDashboardButton from '@/components/BackToDashboardButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { contentService, ContentTags } from '@/services/contentService';
import { emptyContentTags } from './contentOptions';
import ContentTagBuilder from './ContentTagBuilder';
import CreatableCategorySelect from './CreatableCategorySelect';
import { toast } from 'sonner';

const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [tags, setTags] = useState<ContentTags>(emptyContentTags);
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    readTime: '',
    status: 'published' as 'draft' | 'published' | 'archived',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.category.trim()) {
      toast.error('Please select or add a category');
      return;
    }
    setIsSaving(true);

    try {
      await contentService.createPrincipalArticle({ ...form, tags });
      toast.success('Article created');
      navigate('/principal/articles');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create article');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-[168px]">
      <div className="fixed left-0 right-0 top-[64px] z-30 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <BackToDashboardButton className="text-black/90 hover:text-black/80" />
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Create Article</h1>
              <p className="text-sm text-slate-500">Publish guidance for matching Benfek health profiles.</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-5 px-4">
        <Card className="p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <CreatableCategorySelect
                value={form.category}
                onChange={(category) => setForm((prev) => ({ ...prev, category }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as typeof form.status }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Read Time</Label>
              <Input value={form.readTime} onChange={(e) => setForm((prev) => ({ ...prev, readTime: e.target.value }))} placeholder="8 min read" />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))} placeholder="/placeholder.svg" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))} placeholder="Short list-card summary" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Article Content</Label>
              <Textarea className="min-h-56" value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} required />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Benfek health tags</h2>
          <p className="mt-1 text-sm text-slate-500">Leave tags empty to show this article to all Benfeks you added.</p>
          <div className="mt-4">
            <ContentTagBuilder tags={tags} onChange={setTags} />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving ? <LoadingSpinner /> : <Save className="h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Create Article'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticlePage;
