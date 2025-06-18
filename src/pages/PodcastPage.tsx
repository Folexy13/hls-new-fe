
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'react-toastify';

interface PodcastVideo {
  id: number;
  title: string;
  description: string;
  duration: string;
  author: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  videoUrl: string;
  thumbnail: string;
  category: string;
}

const PodcastPage = () => {
  const [videos, setVideos] = useState<PodcastVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Mock data for health-focused podcast videos
  const mockVideos: PodcastVideo[] = [
    {
      id: 1,
      title: "5 Minutes to Better Sleep",
      description: "Quick tips and techniques to improve your sleep quality tonight. Learn about sleep hygiene and natural remedies.",
      duration: "5:32",
      author: "Dr. Sarah Chen",
      likes: 324,
      comments: 42,
      isLiked: false,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "/placeholder.svg",
      category: "Sleep Health"
    },
    {
      id: 2,
      title: "Nutrition Myths Debunked",
      description: "Separating fact from fiction in the world of nutrition. What the science really says about popular diet trends.",
      duration: "8:15",
      author: "Nutritionist Mike Ross",
      likes: 567,
      comments: 89,
      isLiked: true,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "/placeholder.svg",
      category: "Nutrition"
    },
    {
      id: 3,
      title: "Morning Meditation for Energy",
      description: "Start your day with this guided meditation designed to boost your energy and focus naturally.",
      duration: "10:00",
      author: "Meditation Master Lisa",
      likes: 432,
      comments: 67,
      isLiked: false,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "/placeholder.svg",
      category: "Mental Health"
    },
    {
      id: 4,
      title: "Quick Desk Exercises",
      description: "Combat desk job fatigue with these simple exercises you can do anywhere. Perfect for office workers.",
      duration: "6:45",
      author: "Fitness Coach Tom",
      likes: 289,
      comments: 34,
      isLiked: false,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail: "/placeholder.svg",
      category: "Fitness"
    },
    {
      id: 5,
      title: "Understanding Vitamins",
      description: "A comprehensive guide to essential vitamins, their benefits, and how to ensure you're getting enough.",
      duration: "12:30",
      author: "Dr. Amanda Green",
      likes: 678,
      comments: 123,
      isLiked: true,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnail: "/placeholder.svg",
      category: "Supplements"
    }
  ];

  useEffect(() => {
    setVideos(mockVideos);
  }, []);

  useEffect(() => {
    // Auto-play current video
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      if (isPlaying) {
        currentVideo.play().catch(console.error);
      }
    }

    // Pause other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentVideoIndex) {
        video.pause();
      }
    });
  }, [currentVideoIndex, isPlaying]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const videoWidth = window.innerWidth;
      const newIndex = Math.round(scrollLeft / videoWidth);
      
      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
        setCurrentVideoIndex(newIndex);
      }
    }
  };

  const handleLike = (videoId: number) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              isLiked: !video.isLiked,
              likes: video.isLiked ? video.likes - 1 : video.likes + 1
            }
          : video
      )
    );
  };

  const handlePlayPause = () => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
      } else {
        currentVideo.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleShare = (video: PodcastVideo) => {
    toast.success('Link copied to clipboard!');
  };

  const handleComment = (videoId: number) => {
    toast.info('Comments feature coming soon!');
  };

  const getCategoryColor = (category: string) => {
    const colors: {[key: string]: string} = {
      'Sleep Health': 'bg-purple-100 text-purple-800',
      'Nutrition': 'bg-green-100 text-green-800',
      'Mental Health': 'bg-blue-100 text-blue-800',
      'Fitness': 'bg-orange-100 text-orange-800',
      'Supplements': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
        onScroll={handleScroll}
      >
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="relative w-screen h-full flex-shrink-0 snap-center"
          >
            {/* Video Player */}
            <video
              ref={(el) => videoRefs.current[index] = el}
              src={video.videoUrl}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
              {/* Top Header */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                <h1 className="text-white text-lg font-semibold">Health Reels</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(video.category)}`}>
                  {video.category}
                </span>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-black/30 text-white hover:bg-black/50"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Author and Title */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                      <Volume2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{video.author}</p>
                      <p className="text-gray-300 text-sm">{video.duration}</p>
                    </div>
                  </div>
                  <h2 className="text-white text-lg font-semibold mb-2">{video.title}</h2>
                  <p className="text-gray-300 text-sm leading-relaxed">{video.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(video.id)}
                      className={`flex items-center space-x-2 text-white hover:text-red-400 ${
                        video.isLiked ? 'text-red-500' : ''
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${video.isLiked ? 'fill-current' : ''}`} />
                      <span>{video.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleComment(video.id)}
                      className="flex items-center space-x-2 text-white hover:text-blue-400"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>{video.comments}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(video)}
                      className="flex items-center space-x-2 text-white hover:text-green-400"
                    >
                      <Share className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMute}
                    className="text-white hover:text-yellow-400"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center mt-4 space-x-2">
                  {videos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentVideoIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PodcastPage;
