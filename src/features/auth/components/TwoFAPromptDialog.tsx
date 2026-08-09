import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAuthStore from "@/features/auth/stores/authStore";
import { authApi } from "@/features/auth/api/authApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

export function Enable2FADialog() {
  const [open, setOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const { user } = useAuthStore.getState();
        const key = `2fa-dialog-seen-${user?.id}`;
        if (localStorage.getItem(key) === "true") return;
        const { data } = await authApi.get2FAStatus();
        if (!data.result) setOpen(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetch2FAStatus();
  }, []);

  const markSeen = () => {
    const { user } = useAuthStore.getState();
    localStorage.setItem(`2fa-dialog-seen-${user?.id}`, "true");
  };

  const dismiss = () => {
    markSeen();
    setOpen(false);
  };

  const enable = () => {
    markSeen();
    setOpen(false);
    setSearchParams({ view: "settings" }, { replace: true });
  };

  return (
    <Dialog open={open} onOpenChange={dismiss}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bật bảo mật 2 lớp</DialogTitle>
          <DialogDescription>
            Tài khoản của bạn chưa bật xác thực 2 bước (2FA). Điều này giúp bảo
            vệ tài khoản tốt hơn.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={dismiss}>
            Để sau
          </Button>
          <Button onClick={enable}>Bật ngay</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Enable2FADialog;
