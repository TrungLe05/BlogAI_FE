import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";

export async function downloadFile(fileUrl: string, fileName: string): Promise<void> {
  const toastId = toast.loading(`Đang tải ${fileName}...`);
  try {
    const response = await axiosClient.get("/messages/download", {
      params: { url: fileUrl, fileName },
      responseType: "blob",
    });

    const blobUrl = URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Delay revoke để đảm bảo browser kịp trigger download
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

    toast.success("Tải xuống thành công", { id: toastId });
  } catch {
    toast.error("Không thể tải file", { id: toastId });
  }
}