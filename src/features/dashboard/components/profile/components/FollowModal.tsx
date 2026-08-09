import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { User } from "@/features/user/types/user.types";

interface FollowModalProps {
  mode: "followers" | "following" | null;
  followers: User[];
  following: User[];
  onClose: () => void;
  onUnfollow: (id: string) => void;
}

function FollowModal({
  mode,
  followers,
  following,
  onClose,
  onUnfollow,
}: FollowModalProps) {
  const list = mode === "followers" ? followers : following;

  return (
    <Dialog open={mode !== null} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle className="font-black uppercase tracking-widest font-display text-sm sm:text-base">
            {mode === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 max-h-[60vh] sm:max-h-96 overflow-y-auto py-2">
          {list.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: "#888" }}>
              {mode === "followers"
                ? "No followers yet"
                : "Not following anyone yet"}
            </p>
          ) : (
            list.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 transition-colors"
                style={{ border: "2px solid #0d0d0d" }}
              >
                <img
                  src={
                    u.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=d32f2f&color=fff`
                  }
                  alt={u.fullName}
                  className="w-9 h-9 sm:w-10 sm:h-10 object-cover shrink-0"
                  style={{ border: "2px solid #0d0d0d" }}
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/user/${u.id}`}>
                    <p className="font-black text-xs sm:text-sm truncate font-display">
                      {u.fullName}
                    </p>
                  </Link>
                  <p
                    className="text-[11px] sm:text-xs truncate"
                    style={{ color: "#888" }}
                  >
                    {u.email}
                  </p>
                </div>
                {mode === "following" && (
                  <button
                    className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all cursor-pointer font-display flex-shrink-0"
                    style={{
                      background: "white",
                      color: "#0d0d0d",
                      border: "2px solid #0d0d0d",
                      boxShadow: "2px 2px 0 #0d0d0d",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#d32f2f";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#0d0d0d";
                    }}
                    onClick={() => onUnfollow(u.id)}
                  >
                    Unfollow
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FollowModal;
