import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Save, UploadCloud } from 'lucide-react';
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

const CreatePodcastPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [tags, setTags] = useState<ContentTags>(emptyContentTags);
  const [form, setForm] = useState({
    title: '',
    description: '',
    host: '',
    category: '',
    duration: '',
    audioUrl: '',
    thumbnailUrl: '',
    status: 'published' as 'draft' | 'published' | 'scheduled' | 'archived',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.category.trim()) {
      toast.error('Please select or add a category');
      return;
    }
    if (!form.audioUrl.trim()) {
      toast.error('Please upload an audio file or provide an audio URL');
      return;
    }
    setIsSaving(true);

    try {
      await contentService.createPrincipalPodcast({ ...form, tags });
      toast.success('Podcast created');
      navigate('/principal/podcasts');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create podcast');
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAudioToCloudinary = async (file: File) => {
    setIsUploadingAudio(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'principal-podcasts');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.secure_url) throw new Error(data?.error?.message || 'Upload failed');
      setForm((prev) => ({
        ...prev,
        audioUrl: data.secure_url,
        duration: prev.duration || (data.duration ? `${Math.floor(data.duration / 60)}:${String(Math.round(data.duration % 60)).padStart(2, '0')}` : prev.duration),
      }));
      toast.success('Audio uploaded');
    } catch (error) {
      console.error(error);
      toast.error('Audio upload failed');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-[168px]">
      <div className="fixed left-0 right-0 top-[64px] z-30 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <BackToDashboardButton className="text-black/90 hover:text-black/80" />
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Create Podcast</h1>
              <p className="text-sm text-slate-500">Publish audio or video guidance for selected Benfeks.</p>
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
              <Label>Host</Label>
              <Input value={form.host} onChange={(e) => setForm((prev) => ({ ...prev, host: e.target.value }))} placeholder="Dr. Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <CreatableCategorySelect
                value={form.category}
                onChange={(category) => setForm((prev) => ({ ...prev, category }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input value={form.duration} onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))} placeholder="15:30" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as typeof form.status }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Audio upload</Label>
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">Upload podcast audio</p>
                    <p className="text-xs text-slate-500">MP3, M4A, WAV, or another browser-supported audio file.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    {isUploadingAudio ? <LoadingSpinner /> : <UploadCloud className="h-4 w-4" />}
                    {isUploadingAudio ? 'Uploading...' : 'Choose File'}
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      disabled={isUploadingAudio}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadAudioToCloudinary(file);
                      }}
                    />
                  </label>
                </div>
                {form.audioUrl ? (
                  <audio className="mt-4 w-full" controls src={form.audioUrl}>
                    Your browser does not support audio playback.
                  </audio>
                ) : null}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Audio URL</Label>
              <Input value={form.audioUrl} onChange={(e) => setForm((prev) => ({ ...prev, audioUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Thumbnail URL</Label>
              <Input value={form.thumbnailUrl} onChange={(e) => setForm((prev) => ({ ...prev, thumbnailUrl: e.target.value }))} placeholder="/placeholder.svg" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea className="min-h-36" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Benfek health tags</h2>
          <p className="mt-1 text-sm text-slate-500">Leave tags empty to show this podcast to all Benfeks you added.</p>
          <div className="mt-4">
            <ContentTagBuilder tags={tags} onChange={setTags} />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving || isUploadingAudio} className="gap-2">
            {isSaving || isUploadingAudio ? <LoadingSpinner /> : <Save className="h-4 w-4" />}
            {isUploadingAudio ? 'Uploading audio...' : isSaving ? 'Saving...' : 'Create Podcast'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePodcastPage;
