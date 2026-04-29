export interface CreateBlogRequest {
  title: string;
  content: string;
  summary: string;
  coverImageUrl: File;
  tags: string[]
}