import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { contentService } from '@/services/contentService';

const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    contentService.getBenfekContent()
      .then((data) => {
        const article = (data.articles || []).find((item: any) => String(item.id) === String(id));
        setBlog(article || null);
      })
      .catch(() => setBlog(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8 pb-28 text-center text-slate-500">Loading article...</div>;
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-28">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
          <Link to="/blog" className="text-emerald-600 hover:text-emerald-700">
            Back to article list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to article list
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img src={blog.imageUrl || '/placeholder.svg'} alt={blog.title} className="w-full h-64 sm:h-80 object-cover" />

          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{blog.author || 'Principal'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recently'}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{blog.readTime || 'Quick read'}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none whitespace-pre-line text-gray-700 leading-relaxed" style={{ lineHeight: '1.8' }}>
              {blog.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPage;
