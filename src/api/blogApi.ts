import { ApiResponse } from "@/types/auth.types";
import axiosClient from "./axiosClient";
import { BlogResponse, TagResponse } from "@/types/blog.types";

const blogApi = {
    getAllBlog: () => 
        axiosClient.get<ApiResponse<BlogResponse[]>>("/blogs"),
    getAllTag: () => 
        axiosClient.get<ApiResponse<TagResponse[]>>("/tags")
}

export default blogApi;