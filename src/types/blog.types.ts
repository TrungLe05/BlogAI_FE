export interface Blog {
  id: string
  title: string
  content: string
  summary?: string   // AI summary sau này
  author: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateBlogRequest {
  title: string
  content: string
}