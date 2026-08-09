import { User } from "@/features/user/types/user.types";

export interface CreateBlogRequest {
  title: string;
  content: string;
  summary: string;
  coverImageUrl: File;
  tags: string[]
}


export interface BlogResponse {
  blogId: string;
  title: string;
  content: string;
  summary?: string;
  coverImageUrl?: string; 
  author: User;
  blogStatus: "PUBLISHED" | "DRAFT" | "SCHEDULED"; 
  viewCount: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  likeCount: number;      
  likedByCurrentUser: boolean; 
}

export interface TagResponse{
  tag: string
  groupName: string
}

export interface TagStatsResponse{
    tag:string;
    count: number
}


export interface CriteriaScoreResult {
  score: number;
  suggestion: string;
}

export interface PrePublishReviewResult {
  readability: CriteriaScoreResult;
  seo: CriteriaScoreResult;
  engagement: CriteriaScoreResult;
  summaryQuality: CriteriaScoreResult;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  summary: string;
  coverImageUrl: File;
  tags: string[]
}


export interface BlogResponse {
  blogId: string;
  title: string;
  content: string;
  summary?: string;
  coverImageUrl?: string; 
  author: User;
  blogStatus: "PUBLISHED" | "DRAFT" | "SCHEDULED"; 
  viewCount: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  likeCount: number;      
  likedByCurrentUser: boolean; 
}

export interface TagResponse{
  tag: string
  groupName: string
}

export interface TagStatsResponse{
    tag:string;
    count: number
}
