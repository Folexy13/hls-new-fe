import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Headphones } from 'lucide-react';
import { contentService } from '@/services/contentService';

const PodcastPage: React.FC = () => {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    contentService.getBenfekContent()
      .then((data) => setPodcasts(Array.isArray(data.podcasts) ? data.podcasts : []))
      .catch(() => setPodcasts([]))
      .finally(() => setIsLoading(false));
  }, []);

  const currentVideoData = podcasts[currentVideo];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setAudioDuration(0);
    }
  }, [currentVideo]);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = async () => {
    if (!audioRef.current || !currentVideoData?.audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    await audioRef.current.play();
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);
    if (!audioRef.current || !Number.isFinite(nextTime)) return;
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const nextVideo = () => {
    if (!podcasts.length) return;
    setCurrentVideo((prev) => (prev + 1) % podcasts.length);
  };

  const prevVideo = () => {
    if (!podcasts.length) return;
    setCurrentVideo((prev) => (prev - 1 + podcasts.length) % podcasts.length);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 p-8 text-center text-white">Loading podcasts...</div>;
  }

  if (!currentVideoData) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-center text-white">
        No podcasts have been matched to your profile yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Health & Wellness Podcasts</h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-300">Educational content selected for your health profile</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl mb-6 sm:mb-8">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
            <div className="relative aspect-video bg-slate-800">
              <img
                src={currentVideoData.thumbnailUrl || '/placeholder.svg'}
                alt={currentVideoData.title}
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button type="button" onClick={togglePlay} className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30">
                  {isPlaying ? <Pause className="h-9 w-9" /> : <Play className="h-9 w-9 translate-x-0.5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between p-5 sm:p-7">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <Headphones className="h-3.5 w-3.5" />
                  {currentVideoData.category || 'Podcast'}
                </div>
                <h2 className="mt-4 text-2xl font-bold">{currentVideoData.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{currentVideoData.description}</p>
                <p className="mt-3 text-xs text-slate-400">
                  Duration: {formatTime(currentTime)}/{audioDuration ? formatTime(audioDuration) : currentVideoData.duration || 'Not set'}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <audio
                  ref={audioRef}
                  className="hidden"
                  onEnded={() => {
                    setIsPlaying(false);
                    nextVideo();
                  }}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onLoadedMetadata={(event) => setAudioDuration(event.currentTarget.duration || 0)}
                  onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
                  preload="metadata"
                  src={currentVideoData.audioUrl || undefined}
                >
                  Your browser does not support audio playback.
                </audio>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={audioDuration || 0}
                    step={1}
                    value={Math.min(currentTime, audioDuration || currentTime)}
                    onChange={handleSeek}
                    disabled={!audioDuration}
                    aria-label="Podcast playback position"
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: audioDuration
                        ? `linear-gradient(to right, rgb(52 211 153) ${(currentTime / audioDuration) * 100}%, rgba(255,255,255,0.15) ${(currentTime / audioDuration) * 100}%)`
                        : undefined,
                    }}
                  />
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{audioDuration ? formatTime(audioDuration) : currentVideoData.duration || '0:00'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <button type="button" onClick={prevVideo} className="p-2 sm:p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                  <SkipBack className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>
                  <button type="button" onClick={togglePlay} className="p-3 sm:p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                  {isPlaying ? <Pause className="h-6 w-6 sm:h-8 sm:w-8" /> : <Play className="h-6 w-6 sm:h-8 sm:w-8" />}
                </button>
                  <button type="button" onClick={nextVideo} className="p-2 sm:p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                  <SkipForward className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>
                  <button type="button" onClick={toggleMute} className="p-2 sm:p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                  {isMuted ? <VolumeX className="h-4 w-4 sm:h-6 sm:w-6" /> : <Volume2 className="h-4 w-4 sm:h-6 sm:w-6" />}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {podcasts.map((podcast, index) => (
            <button
              type="button"
              key={podcast.id}
              onClick={() => setCurrentVideo(index)}
              className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer text-left transition-all hover:bg-gray-700 ${
                index === currentVideo ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="aspect-video bg-gray-700 flex items-center justify-center relative">
                <img src={podcast.thumbnailUrl || '/placeholder.svg'} alt={podcast.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Play className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">{podcast.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-2 line-clamp-2">{podcast.description}</p>
                <span className="text-xs text-gray-500">{podcast.duration || podcast.category || 'Podcast'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastPage;
