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
  tags: ContentTags;
};

export const contentService = {
  async getPrincipalArticles() {
    const response = await apiClient.get("/api/v2/content/principal/articles");
    return response.data?.data?.articles ?? [];
  },

  async createPrincipalArticle(payload: PrincipalArticlePayload) {
    const response = await apiClient.post("/api/v2/content/principal/articles", payload);
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
