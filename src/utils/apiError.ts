export function extractApiError(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as any).response?.data;
    if (response?.message) return response.message;
  }
  return "An unexpected error occurred";
}