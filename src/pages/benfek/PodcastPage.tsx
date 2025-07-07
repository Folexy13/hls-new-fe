
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

const PodcastPage: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    {
      id: 1,
      title: "Understanding Nutrition Basics",
      description: "Learn the fundamentals of nutrition and how it affects your daily life",
      duration: "15:30",
      thumbnail: "/placeholder.svg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
    },
    {
      id: 2,
      title: "Supplement Safety Guidelines",
      description: "Important safety considerations when choosing and using supplements",
      duration: "12:45",
      thumbnail: "/placeholder.svg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
    },
    {
      id: 3,
      title: "Healthy Lifestyle Habits",
      description: "Building sustainable habits for long-term health and wellness",
      duration: "18:20",
      thumbnail: "/placeholder.svg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4"
    }
  ];

  const currentVideoData = videos[currentVideo];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [currentVideo]);

  const togglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing video:', error);
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    nextVideo();
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Health & Wellness Podcasts</h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-300">Educational content for your health journey</p>
        </div>

        {/* Main Video Player */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6 sm:mb-8">
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black"
              onEnded={handleVideoEnded}
              onError={handleVideoError}
              onLoadStart={() => console.log('Video loading started')}
              onCanPlay={() => console.log('Video can play')}
              playsInline
              preload="metadata"
            >
              <source src={currentVideoData.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevVideo}
                  className="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <SkipBack className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="p-3 sm:p-4 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 sm:h-8 sm:w-8" />
                  ) : (
                    <Play className="h-6 w-6 sm:h-8 sm:w-8" />
                  )}
                </button>
                
                <button
                  onClick={nextVideo}
                  className="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <SkipForward className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>
                
                <button
                  onClick={toggleMute}
                  className="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 sm:h-6 sm:w-6" />
                  ) : (
                    <Volume2 className="h-4 w-4 sm:h-6 sm:w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Video Info */}
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{currentVideoData.title}</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-2">{currentVideoData.description}</p>
            <span className="text-xs sm:text-sm text-gray-400">Duration: {currentVideoData.duration}</span>
          </div>
        </div>

        {/* Video Playlist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              onClick={() => setCurrentVideo(index)}
              className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all hover:bg-gray-700 ${
                index === currentVideo ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="aspect-video bg-gray-700 flex items-center justify-center relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Play className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                </div>
                {index === currentVideo && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    Now Playing
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-2 line-clamp-2">{video.description}</p>
                <span className="text-xs text-gray-500">{video.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastPage;
