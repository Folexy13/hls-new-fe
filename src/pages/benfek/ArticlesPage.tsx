import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { contentService } from '@/services/contentService';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    contentService.getBenfekContent()
      .then((data) => setArticles(Array.isArray(data.articles) ? data.articles : []))
      .catch(() => setArticles([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-6 pb-28">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Articles</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Health Articles</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Browse practical health, nutrient, and supplement insights from the HLS content library.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading && (
            <div className="rounded-[28px] bg-white p-6 text-sm text-slate-500 shadow-sm">Loading articles...</div>
          )}
          {!isLoading && articles.length === 0 && (
            <div className="rounded-[28px] bg-white p-6 text-sm text-slate-500 shadow-sm">
              No articles have been matched to your profile yet.
            </div>
          )}
          {articles.map((article) => (
            <article key={article.id} className="overflow-hidden rounded-[28px] bg-white shadow-sm">
              <img
                src={article.imageUrl || '/placeholder.svg'}
                alt={article.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Recently'}</span>
                  <span>{article.readTime || 'Quick read'}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{article.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{article.excerpt || article.description}</p>
                <Link
                  to={`/blog/${article.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
