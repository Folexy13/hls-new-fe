import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'The Science Behind Personalized Nutrition',
    excerpt:
      'Discover how your unique genetic makeup influences your nutritional needs and how personalized supplementation can optimize your health.',
    date: 'March 15, 2024',
    readTime: '8 min read',
    image: '/placeholder.svg',
  },
  {
    id: 2,
    title: '5 Signs You Might Need Vitamin D',
    excerpt:
      'Learn about the subtle signs of vitamin D deficiency and how proper supplementation can boost your energy and immune system.',
    date: 'March 10, 2024',
    readTime: '6 min read',
    image: '/placeholder.svg',
  },
  {
    id: 3,
    title: 'Optimizing Recovery with Magnesium',
    excerpt:
      'Understand how magnesium plays a crucial role in muscle recovery and why it is essential for active individuals.',
    date: 'March 5, 2024',
    readTime: '7 min read',
    image: '/placeholder.svg',
  },
];

const ArticlesPage: React.FC = () => {
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
          {articles.map((article) => (
            <article key={article.id} className="overflow-hidden rounded-[28px] bg-white shadow-sm">
              <img
                src={article.image}
                alt={article.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{article.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>
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
