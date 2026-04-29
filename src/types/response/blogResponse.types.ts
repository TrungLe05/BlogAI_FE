import { User } from "./authResponse.type";

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
