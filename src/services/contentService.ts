import { apiClient } from "@/config/axios";

export type ContentTags = {
  allergies?: string[];
  scares?: string[];
  familyCondition?: string[];
  medications?: string[];
  currentConditions?: string[];
  lifestyle?: string[];
  preferences?: string[];
};

export type PrincipalArticlePayload = {
  title: string;
  category: string;
  description: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  readTime?: string;
  status: "draft" | "published" | "archived";
  tags: ContentTags;
};

export type PrincipalPodcastPayload = {
  title: string;
  description: string;
  host?: string;
  category: string;
  duration?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  status: "draft" | "published" | "scheduled" | "archived";
  scheduledAt?: string | null;
  tags: ContentTags;
};

export type PublicArticle = {
  id: number;
  authorId?: number | null;
  title: string;
  category?: string | null;
  description?: string | null;
  excerpt?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  readTime?: string | null;
  createdAt?: string | null;
  author?: string | null;
  tags?: ContentTags;
};

export type ArticleComment = {
  id: number;
  body: string;
  articleId: number;
  userId?: number | null;
  guestName?: string | null;
  parentId?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  author?: string | null;
  authorRole?: string | null;
  isGuest?: boolean;
  replies?: ArticleComment[];
};

export const contentService = {
  async getPublicArticles(): Promise<PublicArticle[]> {
    const response = await apiClient.get("/api/v2/content/public/articles");
    return response.data?.data?.articles ?? [];
  },

  async getPublicArticle(id: number | string): Promise<PublicArticle | null> {
    const response = await apiClient.get(`/api/v2/content/public/articles/${id}`);
    return response.data?.data?.article ?? null;
  },

  async getArticleComments(articleId: number | string): Promise<ArticleComment[]> {
    const response = await apiClient.get(`/api/v2/content/public/articles/${articleId}/comments`);
    return response.data?.data?.comments ?? [];
  },

  async createArticleComment(articleId: number | string, body: string, guestName?: string) {
    const response = await apiClient.post(`/api/v2/content/public/articles/${articleId}/comments`, { body, guestName });
    return response.data?.data;
  },

  async replyToArticleComment(articleId: number | string, commentId: number | string, body: string) {
    const response = await apiClient.post(`/api/v2/content/principal/articles/${articleId}/comments/${commentId}/replies`, { body });
    return response.data?.data;
  },

  async getPrincipalArticles() {
    const response = await apiClient.get("/api/v2/content/principal/articles");
    return response.data?.data?.articles ?? [];
  },

  async createPrincipalArticle(payload: PrincipalArticlePayload) {
    const response = await apiClient.post("/api/v2/content/principal/articles", payload);
    return response.data?.data;
  },

  async getPrincipalArticle(id: number | string) {
    const response = await apiClient.get(`/api/v2/content/principal/articles/${id}`);
    return response.data?.data?.article;
  },

  async updatePrincipalArticle(id: number | string, payload: PrincipalArticlePayload) {
    const response = await apiClient.patch(`/api/v2/content/principal/articles/${id}`, payload);
    return response.data?.data;
  },

  async deletePrincipalArticle(id: number | string) {
    const response = await apiClient.delete(`/api/v2/content/principal/articles/${id}`);
    return response.data?.data;
  },

  async getPrincipalPodcasts() {
    const response = await apiClient.get("/api/v2/content/principal/podcasts");
    return response.data?.data?.podcasts ?? [];
  },

  async createPrincipalPodcast(payload: PrincipalPodcastPayload) {
    const response = await apiClient.post("/api/v2/content/principal/podcasts", payload);
    return response.data?.data;
  },

  async getBenfekContent() {
    const response = await apiClient.get("/api/v2/content/benfek");
    return response.data?.data ?? { articles: [], podcasts: [] };
  },
};
