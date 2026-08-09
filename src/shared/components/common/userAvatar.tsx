import useAuthStore from "@/features/auth/stores/authStore";

/** Avatar tròn nhỏ ở góc phải — ảnh thật hoặc initials */
function UserAvatar() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  const initials =
    user.fullName
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div
      // to={`/profile/${user.id}`}
      className="shrink-0 w-8 h-8 rounded-full overflow-hidden
                 ring-1 ring-black/10 dark:ring-white/10
                 hover:ring-2 hover:ring-black/20 dark:hover:ring-white/20
                 transition-all"
      title={user.fullName}
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-[#d32f2f] flex items-center justify-center">
          <span className="text-white text-[11px] font-bold select-none">
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}

export default UserAvatar;
