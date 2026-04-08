import { ApiResponse } from "@/types/auth.types";
import axiosClient from "./axiosClient";
import {
  BlogResponse,
  CreateBlogRequest,
  TagResponse,
} from "@/types/blog.types";
import axios from "axios";

const blogApi = {
  getAllBlog: () => axiosClient.get<ApiResponse<BlogResponse[]>>("/blogs"),
  getAllTag: () => axiosClient.get<ApiResponse<TagResponse[]>>("/tags"),
  getAllBlogByAuthor: () =>
    axiosClient.get<ApiResponse<BlogResponse[]>>("/blogs/author"),
  getAllBlogDraftByAuthor: () =>
    axiosClient.get<ApiResponse<BlogResponse[]>>("/blogs/draft"),
  getAllBlogPublishByAuthor: () =>
    axiosClient.get<ApiResponse<BlogResponse[]>>("/blogs/publish"),
  getBlogDetailById: (blogId: string) =>
    axiosClient.get<ApiResponse<BlogResponse>>(`/blogs/${blogId}`),
  createBlog: (data: CreateBlogRequest) =>
    axiosClient.post<ApiResponse<BlogResponse>>("/blogs", data),
  saveDraft: (data: {
    title: string;
    summary: string;
    content: string;
    tags: string[];
    coverImage?: File | null;
  }) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("summary", data.summary);
    formData.append("content", data.content);
    data.tags.forEach((tag) => formData.append("tags", tag));
    if (data.coverImage) {
      formData.append("coverImageUrl", data.coverImage);
    }
    return axiosClient.post<ApiResponse<BlogResponse>>("/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateDraft: (
    blogId: string,
    data: {
      title: string;
      summary: string;
      content: string;
      tags: string[];
      coverImage?: File | null;
    },
  ) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("summary", data.summary);
    formData.append("content", data.content);
    data.tags.forEach((tag) => formData.append("tags", tag));
    if (data.coverImage) formData.append("coverImageUrl", data.coverImage);

    return axiosClient.put<ApiResponse<BlogResponse>>(
      `/blogs/${blogId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  publishBlog: (blogId: string) =>
    axiosClient.patch<ApiResponse<void>>(`/blogs/${blogId}/publish`),

  deleteBlog: (blogId: string) =>
    axiosClient.delete<ApiResponse<void>>(`/blogs/${blogId}`),
  saveAndPublishBlog: (data: {
    title: string;
    summary: string;
    content: string;
    tags: string[];
    coverImage?: File | null;
  }) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("summary", data.summary);
    formData.append("content", data.content);
    data.tags.forEach((tag) => formData.append("tags", tag));
    if (data.coverImage) formData.append("coverImageUrl", data.coverImage);

    return axiosClient.post<ApiResponse<BlogResponse>>(
      "/blogs/publish",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },
  getRelatedBlogs: (tags: string[], currentBlogId: string) =>
    axiosClient.get<ApiResponse<BlogResponse[]>>("/blogs/related", {
      params: { tags, currentBlogId },
      paramsSerializer: { indexes: null },
    }),
  generateTitles: (content: string) =>
    axiosClient.post<ApiResponse<string[]>>("/ai/generate-titles", { content }),

  generateSummary: (content: string) =>
    axiosClient.post<ApiResponse<string>>("/ai/generate-summary", { content }),
  toggleLike: (blogId: string) =>
    axiosClient.post<ApiResponse<BlogResponse>>(`/blogs/${blogId}/like`),

  incrementView: (blogId: string) =>
    axiosClient.post<ApiResponse<number>>(`/blogs/${blogId}/view`),
  get4BlogViewest: () =>
    axiosClient.get<ApiResponse<BlogResponse[]>>("/blogs/4-viewest"),
};

export default blogApi;
