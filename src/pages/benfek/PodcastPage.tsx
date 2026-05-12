import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { contentService } from '@/services/contentService';

const PodcastPage: React.FC = () => {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    contentService.getBenfekContent()
      .then((data) => setPodcasts(Array.isArray(data.podcasts) ? data.podcasts : []))
      .catch(() => setPodcasts([]))
      .finally(() => setIsLoading(false));
  }, []);

  const currentVideoData = podcasts[currentVideo];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [currentVideo]);

  const togglePlay = async () => {
    if (!videoRef.current || !currentVideoData?.audioUrl) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }

    await videoRef.current.play();
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
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
    return <div className="min-h-screen bg-black p-8 text-center text-white">Loading podcasts...</div>;
  }

  if (!currentVideoData) {
    return (
      <div className="min-h-screen bg-black p-8 text-center text-white">
        No podcasts have been matched to your profile yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Health & Wellness Podcasts</h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-300">Educational content selected for your health profile</p>
        </div>

        <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6 sm:mb-8">
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black"
              onEnded={() => {
                setIsPlaying(false);
                nextVideo();
              }}
              playsInline
              preload="metadata"
              poster={currentVideoData.thumbnailUrl || '/placeholder.svg'}
            >
              {currentVideoData.audioUrl && <source src={currentVideoData.audioUrl} />}
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <button type="button" onClick={prevVideo} className="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all">
                  <SkipBack className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>
                <button type="button" onClick={togglePlay} className="p-3 sm:p-4 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all">
                  {isPlaying ? <Pause className="h-6 w-6 sm:h-8 sm:w-8" /> : <Play className="h-6 w-6 sm:h-8 sm:w-8" />}
                </button>
                <button type="button" onClick={nextVideo} className="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all">
                  <SkipForward className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>
                <button type="button" onClick={toggleMute} className="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all">
                  {isMuted ? <VolumeX className="h-4 w-4 sm:h-6 sm:w-6" /> : <Volume2 className="h-4 w-4 sm:h-6 sm:w-6" />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{currentVideoData.title}</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-2">{currentVideoData.description}</p>
            <span className="text-xs sm:text-sm text-gray-400">Duration: {currentVideoData.duration || 'Not set'}</span>
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
