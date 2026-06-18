import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MessageCircle, Reply, Send, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contentService, type ArticleComment, type PublicArticle } from '@/services/contentService';
import { useStore } from '@/store/useStore';
import { getApiErrorMessage } from '@/utils/apiError';

const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useStore();
  const [blog, setBlog] = useState<PublicArticle | null>(null);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [replyBodyByComment, setReplyBodyByComment] = useState<Record<number, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [submittingReplyId, setSubmittingReplyId] = useState<number | null>(null);

  const isArticleAuthor = Boolean(
    isAuthenticated &&
      user?.role === 'principal' &&
      blog?.authorId &&
      Number(user.id) === Number(blog.authorId)
  );

  const loadComments = async (articleId: string) => {
    setCommentsLoading(true);
    try {
      const nextComments = await contentService.getArticleComments(articleId);
      setComments(nextComments);
    } catch (error) {
      setComments([]);
      toast.error(getApiErrorMessage(error, 'Failed to load article comments.'));
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setBlog(null);
      setIsLoading(false);
      return;
    }

    contentService.getPublicArticle(id)
      .then(setBlog)
      .catch(() => setBlog(null))
      .finally(() => setIsLoading(false));
    loadComments(id);
  }, [id]);

  const handleSubmitComment = async () => {
    if (!id) return;
    const trimmedGuestName = guestName.trim();
    if (!isAuthenticated && trimmedGuestName.length < 2) {
      toast.error('Please enter your name before posting a comment.');
      return;
    }
    if (commentBody.trim().length < 2) {
      toast.error('Please write a comment before posting.');
      return;
    }

    setIsSubmittingComment(true);
    try {
      await contentService.createArticleComment(id, commentBody.trim(), isAuthenticated ? undefined : trimmedGuestName);
      setCommentBody('');
      if (!isAuthenticated) setGuestName('');
      toast.success('Comment posted');
      await loadComments(id);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to post your comment.'));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (commentId: number) => {
    if (!id) return;
    const replyBody = replyBodyByComment[commentId]?.trim() || '';
    if (replyBody.length < 2) {
      toast.error('Please write a reply before posting.');
      return;
    }

    setSubmittingReplyId(commentId);
    try {
      await contentService.replyToArticleComment(id, commentId, replyBody);
      setReplyBodyByComment((current) => ({ ...current, [commentId]: '' }));
      setActiveReplyId(null);
      toast.success('Reply posted');
      await loadComments(id);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to post your reply.'));
    } finally {
      setSubmittingReplyId(null);
    }
  };

  const formatCommentDate = (value?: string | null) => {
    if (!value) return 'Just now';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

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

        <section className="mt-8 rounded-lg bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4 border-b pb-5">
            <div>
              <div className="flex items-center gap-2 text-emerald-700">
                <MessageCircle className="h-5 w-5" />
                <h2 className="text-xl font-bold text-slate-950">Comments</h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">{comments.length} conversation{comments.length === 1 ? '' : 's'}</p>
            </div>
          </div>

          <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
            {isAuthenticated ? (
              <p className="mb-3 text-sm font-medium text-slate-700">Commenting as {user?.name || 'your account'}</p>
            ) : (
              <div className="mb-3 space-y-2">
                <label htmlFor="comment-name" className="text-sm font-medium text-slate-700">
                  Your name
                </label>
                <Input
                  id="comment-name"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder="Enter your name"
                  className="bg-white"
                  maxLength={100}
                />
              </div>
            )}
            <Textarea
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder="Share your thoughts on this article..."
              className="min-h-28 bg-white"
              maxLength={2000}
            />
            <div className="mt-3 flex justify-end">
              <Button onClick={handleSubmitComment} disabled={isSubmittingComment} className="bg-emerald-600 hover:bg-emerald-700">
                <Send className="mr-2 h-4 w-4" />
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>

          {commentsLoading ? (
            <p className="text-sm text-slate-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              No comments yet. Be the first to comment.
            </p>
          ) : (
            <div className="space-y-5">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                      {(comment.author || 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">{comment.author || 'User'}</p>
                        <span className="text-xs text-slate-500">{formatCommentDate(comment.createdAt)}</span>
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{comment.body}</p>

                      {isArticleAuthor ? (
                        <div className="mt-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-emerald-700 hover:text-emerald-800"
                            onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                          >
                            <Reply className="mr-2 h-4 w-4" />
                            Reply as author
                          </Button>
                        </div>
                      ) : null}

                      {activeReplyId === comment.id ? (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3">
                          <Textarea
                            value={replyBodyByComment[comment.id] || ''}
                            onChange={(event) =>
                              setReplyBodyByComment((current) => ({ ...current, [comment.id]: event.target.value }))
                            }
                            placeholder="Write an author reply..."
                            className="min-h-24 bg-white"
                            maxLength={2000}
                          />
                          <div className="mt-3 flex justify-end">
                            <Button
                              onClick={() => handleSubmitReply(comment.id)}
                              disabled={submittingReplyId === comment.id}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Send className="mr-2 h-4 w-4" />
                              {submittingReplyId === comment.id ? 'Replying...' : 'Post Reply'}
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      {comment.replies?.length ? (
                        <div className="mt-4 space-y-3 border-l-2 border-emerald-100 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="rounded-lg bg-emerald-50/60 p-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-slate-950">{reply.author || 'Author'}</p>
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                  Author
                                </span>
                                <span className="text-xs text-slate-500">{formatCommentDate(reply.createdAt)}</span>
                              </div>
                              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{reply.body}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
