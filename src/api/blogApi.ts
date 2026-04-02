import { ApiResponse } from "@/types/auth.types";
import axiosClient from "./axiosClient";
import {
  BlogResponse,
  CreateBlogRequest,
  TagResponse,
} from "@/types/blog.types";

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
    content: string;
    tags: string[];
    coverImage?: File | null;
  }) => {
    const formData = new FormData();
    formData.append("title", data.title);
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
      content: string;
      tags: string[];
      coverImage?: File | null;
    },
  ) => {
    const formData = new FormData();
    formData.append("title", data.title);
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
  saveAndPublishBlog: (
    data: {
      title: string;
      content: string;
      tags: string[];
      coverImage?: File | null;
    },
  ) => {
    const formData = new FormData();
    formData.append("title", data.title);
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
};

export default blogApi;
