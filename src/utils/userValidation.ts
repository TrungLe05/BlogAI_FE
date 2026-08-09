import { ChangePasswordRequest } from "@/features/auth/types/auth.types";
import { ValidationError } from "./errorFormat";

export function validationUpdateMe(data: {
  fullname?: string;
  avatarUrl: File;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data?.avatarUrl) {
    errors.push({ field: "avatarUrl", message: "Avatar is required" });
  } else {
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(data.avatarUrl.type)
    )
      errors.push({
        field: "coverImage",
        message: "Image must be JPEG, PNG or WebP",
      });
    if (data?.avatarUrl.size > 5 * 1024 * 1024)
      errors.push({
        field: "avatarUrl",
        message: "Avatar must be less than 5MB",
      });
  }

  return errors;
}

export function validateChangePassword(
  data: ChangePasswordRequest,
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data?.newPassword.trim()) {
    errors.push({ field: "newPassword", message: "New password is required" });
  }
  if (!data.currentPassword.trim()) {
    errors.push({
      field: "currentPassword",
      message: "Current password is required",
    });
  }
  if (!data.confirmPassword.trim()) {
    errors.push({
      field: "confirmPassword",
      message: "Confirm password is required",
    });
  }

  if (data.confirmPassword.trim() != data.newPassword.trim()) {
    errors.push({ field: "confirmPassword", message: "password not matches" });
  }
  return errors;
}
