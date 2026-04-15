import { User } from "./auth.types";

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



export interface CreateBlogRequest {
  title: string;
  content: string;
  summary: string;
  coverImageUrl: File;
  tags: string[]
}

export interface TagResponse{
  tag: string
  groupName: string
}