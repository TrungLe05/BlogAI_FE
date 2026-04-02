export interface BlogResponse {
  blogId: string;
  title: string;
  content: string;
  summary?: string;
  coverImageUrl?: string; 
  author: Author;
  blogStatus: "PUBLISHED" | "DRAFT" | "SCHEDULED"; 
  viewCount: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Author {
  email: string;
  fullName: string;
  avatarUrl: string;
  role: "USER" | "ADMIN";
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