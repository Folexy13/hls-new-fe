import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, ImageIcon, Save, Upload } from 'lucide-react';
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
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/config/env';
import { getApiErrorMessage } from '@/utils/apiError';

const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
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

  useEffect(() => {
    if (!id) return;

    const loadArticle = async () => {
      setIsLoading(true);
      try {
        const article = await contentService.getPrincipalArticle(id);
        setForm({
          title: article?.title || '',
          category: article?.category || '',
          description: article?.description || '',
          excerpt: article?.excerpt || '',
          content: article?.content || '',
          imageUrl: article?.imageUrl || '',
          readTime: article?.readTime || '',
          status: (article?.status || 'published') as 'draft' | 'published' | 'archived',
        });
        setImagePreviewUrl(article?.imageUrl || '');
        setTags(article?.tags || emptyContentTags);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load article');
        navigate('/principal/articles');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id, navigate]);

  const uploadArticleImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'articles');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    return data.secure_url as string | undefined;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file.');
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.category.trim()) {
      toast.error('Please select or add a category');
      return;
    }
    setIsSaving(true);

    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        const uploadedUrl = await uploadArticleImage(imageFile);
        if (!uploadedUrl) {
          toast.error('Image upload failed. Please try again.');
          return;
        }
        imageUrl = uploadedUrl;
        setForm((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      }

      const payload = { ...form, imageUrl, tags };

      if (id) {
        await contentService.updatePrincipalArticle(id, payload);
        toast.success('Article updated');
      } else {
        await contentService.createPrincipalArticle(payload);
        toast.success('Article created');
      }
      navigate('/principal/articles');
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessage(error, imageFile ? 'Article image upload failed. Please try again.' : 'Failed to save article.'));
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
              <h1 className="text-xl font-bold text-slate-900">{isEditing ? 'Edit Article' : 'Create Article'}</h1>
              <p className="text-sm text-slate-500">{isEditing ? 'Update guidance for matching Benfek health profiles.' : 'Publish guidance for matching Benfek health profiles.'}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-5 px-4">
        {isLoading ? (
          <Card className="p-5 text-sm text-slate-500">Loading article...</Card>
        ) : (
        <>
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
            <div className="space-y-2 md:col-span-2">
              <Label>Cover Image</Label>
              <div className="grid gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 md:grid-cols-[180px,1fr]">
                <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg border bg-white">
                  {imagePreviewUrl || form.imageUrl ? (
                    <img src={imagePreviewUrl || form.imageUrl} alt="Article cover preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-slate-300" />
                  )}
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                  {form.imageUrl && !imageFile ? (
                    <p className="truncate text-xs text-slate-500">Current image: {form.imageUrl}</p>
                  ) : null}
                </div>
              </div>
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
            {isSaving ? <LoadingSpinner /> : imageFile ? <Upload className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {isSaving ? (imageFile ? 'Uploading & Saving...' : 'Saving...') : isEditing ? 'Update Article' : 'Create Article'}
          </Button>
        </div>
        </>
        )}
      </form>
    </div>
  );
};

export default CreateArticlePage;
