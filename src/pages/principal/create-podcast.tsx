import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Mic, Save, UploadCloud } from 'lucide-react';
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

type PodcastMediaKind = 'audio' | 'video';

const CreatePodcastPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState('');
  const [mediaKind, setMediaKind] = useState<PodcastMediaKind | null>(null);
  const [mediaDuration, setMediaDuration] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState('');
  const [tags, setTags] = useState<ContentTags>(emptyContentTags);
  const [form, setForm] = useState({
    title: '',
    description: '',
    host: '',
    category: '',
    status: 'published' as 'draft' | 'published' | 'scheduled' | 'archived',
    scheduledAt: '',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.category.trim()) {
      toast.error('Please select or add a category');
      return;
    }
    if (!mediaFile) {
      toast.error('Please choose an audio or video file');
      return;
    }
    if (form.status === 'scheduled' && !form.scheduledAt) {
      toast.error('Please choose when this podcast should go live');
      return;
    }
    setIsSaving(true);

    try {
      const detectedDuration = mediaDuration || (await getMediaDurationFromFile(mediaFile, mediaKind));
      const mediaUpload = await uploadToCloudinary(mediaFile, 'auto', `principal-podcasts/${mediaKind || 'media'}`);
      const thumbnailUpload = thumbnailFile
        ? await uploadToCloudinary(thumbnailFile, 'image', 'principal-podcasts/thumbnails')
        : null;
      const uploadDuration =
        mediaUpload.duration && Number.isFinite(Number(mediaUpload.duration))
          ? `${Math.floor(Number(mediaUpload.duration) / 60)}:${String(Math.round(Number(mediaUpload.duration) % 60)).padStart(2, '0')}`
          : '';

      await contentService.createPrincipalPodcast({
        ...form,
        audioUrl: mediaUpload.secure_url,
        thumbnailUrl: thumbnailUpload?.secure_url || '',
        duration: detectedDuration || uploadDuration,
        scheduledAt: form.status === 'scheduled' ? new Date(form.scheduledAt).toISOString() : null,
        tags,
      });
      toast.success('Podcast created');
      navigate('/principal/podcasts');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create podcast. Please check the selected files and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const uploadToCloudinary = async (file: File, resourceType: 'auto' | 'image', folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok || !data.secure_url) throw new Error(data?.error?.message || 'Upload failed');
    return data as { secure_url: string; duration?: number };
  };

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '';
    const totalSeconds = Math.round(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    return hours
      ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
      : `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const getMediaDurationFromFile = (file: File, kind: PodcastMediaKind | null) =>
    new Promise<string>((resolve) => {
      if (!kind) {
        resolve('');
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const media = document.createElement(kind);
      media.preload = 'metadata';
      media.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(formatDuration(media.duration));
      };
      media.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve('');
      };
      media.src = objectUrl;
    });

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    const nextMediaKind: PodcastMediaKind | null = file.type.startsWith('audio/')
      ? 'audio'
      : file.type.startsWith('video/')
        ? 'video'
        : null;

    if (!nextMediaKind) {
      toast.error('Please choose a valid audio or video file.');
      return;
    }
    setMediaFile(file);
    setMediaKind(nextMediaKind);
    setMediaDuration('');
    setMediaPreviewUrl(URL.createObjectURL(file));
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file.');
      return;
    }
    setThumbnailFile(file);
    setThumbnailPreviewUrl(URL.createObjectURL(file));
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
            {form.status === 'scheduled' ? (
              <div className="space-y-2">
                <Label>Publish date and time</Label>
                <Input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm((prev) => ({ ...prev, scheduledAt: e.target.value }))}
                  required
                />
              </div>
            ) : null}
            <div className="space-y-2 md:col-span-2">
              <Label>Podcast media upload</Label>
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">Upload podcast audio or video</p>
                    <p className="text-xs text-slate-500">
                      {mediaFile ? mediaFile.name : 'MP3, M4A, WAV, MP4, MOV, WEBM, or another browser-supported media file.'}
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    <UploadCloud className="h-4 w-4" />
                    Choose File
                    <input
                      type="file"
                      accept="audio/*,video/*"
                      className="hidden"
                      disabled={isSaving}
                      onChange={handleMediaChange}
                    />
                  </label>
                </div>
                {mediaPreviewUrl && mediaKind === 'audio' ? (
                  <audio
                    className="mt-4 w-full"
                    controls
                    src={mediaPreviewUrl}
                    onLoadedMetadata={(event) => setMediaDuration(formatDuration(event.currentTarget.duration))}
                  >
                    Your browser does not support audio playback.
                  </audio>
                ) : null}
                {mediaPreviewUrl && mediaKind === 'video' ? (
                  <video
                    className="mt-4 max-h-[360px] w-full rounded-lg bg-black"
                    controls
                    src={mediaPreviewUrl}
                    onLoadedMetadata={(event) => setMediaDuration(formatDuration(event.currentTarget.duration))}
                  >
                    Your browser does not support video playback.
                  </video>
                ) : null}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Thumbnail upload</Label>
              <div className="grid gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 md:grid-cols-[180px,1fr]">
                <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg border bg-white">
                  {thumbnailPreviewUrl ? (
                    <img src={thumbnailPreviewUrl} alt="Podcast thumbnail preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-slate-300" />
                  )}
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Upload podcast thumbnail</p>
                    <p className="text-xs text-slate-500">{thumbnailFile ? thumbnailFile.name : 'JPG, PNG, WEBP, or another browser-supported image file.'}</p>
                  </div>
                  <Input type="file" accept="image/*" onChange={handleThumbnailChange} disabled={isSaving} />
                </div>
              </div>
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
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving ? <LoadingSpinner /> : <Save className="h-4 w-4" />}
            {isSaving ? 'Uploading and saving...' : 'Create Podcast'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePodcastPage;
