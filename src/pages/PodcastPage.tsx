
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, Play, Pause, Volume2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface PodcastPost {
  id: number;
  title: string;
  description: string;
  duration: string;
  author: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  audioUrl: string;
  thumbnail: string;
  category: string;
}

const PodcastPage = () => {
  const [posts, setPosts] = useState<PodcastPost[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  
  // Mock data for health-focused podcast posts
  const mockPosts: PodcastPost[] = [
    {
      id: 1,
      title: "5 Minutes to Better Sleep",
      description: "Quick tips and techniques to improve your sleep quality tonight. Learn about sleep hygiene and natural remedies.",
      duration: "5:32",
      author: "Dr. Sarah Chen",
      likes: 324,
      comments: 42,
      isLiked: false,
      audioUrl: "#",
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
      audioUrl: "#",
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
      audioUrl: "#",
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
      audioUrl: "#",
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
      audioUrl: "#",
      thumbnail: "/placeholder.svg",
      category: "Supplements"
    }
  ];

  useEffect(() => {
    // Simulate loading posts
    setPosts(mockPosts);
  }, []);

  const handleLike = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handlePlay = (postId: number) => {
    if (currentlyPlaying === postId) {
      setCurrentlyPlaying(null);
      toast.info('Paused');
    } else {
      setCurrentlyPlaying(postId);
      toast.success('Playing audio');
    }
  };

  const handleShare = (post: PodcastPost) => {
    toast.success('Link copied to clipboard!');
  };

  const handleComment = (postId: number) => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Health Podcasts</h1>
          <p className="text-gray-600">Discover bite-sized health content tailored for you</p>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Post Header */}
              <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Volume2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{post.author}</p>
                      <p className="text-sm text-gray-500">{post.duration}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{post.description}</p>

                {/* Audio Player Mockup */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlay(post.id)}
                      className="flex-shrink-0"
                    >
                      {currentlyPlaying === post.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: currentlyPlaying === post.id ? '35%' : '0%' }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 flex-shrink-0">
                      {currentlyPlaying === post.id ? '2:15' : '0:00'} / {post.duration}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 ${post.isLiked ? 'text-red-500' : 'text-gray-600'}`}
                    >
                      <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleComment(post.id)}
                      className="flex items-center space-x-2 text-gray-600"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(post)}
                    className="flex items-center space-x-2 text-gray-600"
                  >
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Load More */}
        <div className="text-center py-8">
          <Button variant="outline" onClick={() => toast.info('Loading more content...')}>
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PodcastPage;
