import { ValidationError } from "./errorFormat";


export function validateCreateBlog(data: {
  title: string;
  content: string;
  summary: string;
  coverImage: File | null;
  tags: string[];
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title?.trim())
    errors.push({ field: "title", message: "Title is required" });

  if (!data.content?.trim())
    errors.push({ field: "content", message: "Content is required" });

  if (!data.tags?.length)
    errors.push({ field: "tags", message: "At least one tag is required" });

  if (!data.coverImage) {
    errors.push({ field: "coverImage", message: "Cover image is required" });
  } else {
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(data.coverImage.type)
    )
      errors.push({
        field: "coverImage",
        message: "Image must be JPEG, PNG or WebP",
      });
    if (data.coverImage.size > 5 * 1024 * 1024)
      errors.push({
        field: "coverImage",
        message: "Image must be less than 5MB",
      });
  }

  return errors;
}

export function validateUpdateBlog(data: {
  title: string;
  summary: string;
  content: string;
  coverImage: File | null;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title?.trim())
    errors.push({ field: "title", message: "Title is required" });

  if (!data.content?.trim())
    errors.push({ field: "content", message: "Content is required" });

  if (data.coverImage) {
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(data.coverImage.type)
    )
      errors.push({
        field: "coverImage",
        message: "Image must be JPEG, PNG or WebP",
      });
    if (data.coverImage.size > 2 * 1024 * 1024)
      errors.push({
        field: "coverImage",
        message: "Image must be less than 2MB",
      });
  }

  return errors;
}
