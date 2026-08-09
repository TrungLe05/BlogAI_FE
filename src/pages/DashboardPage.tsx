import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { NotificationBell } from "@/shared/components/common/NotificationBell";
import { AvatarDropdown } from "@/shared/components/common/AvatarDropdown";
import { WriteView } from "@/features/dashboard/views/WriteView";
import { ProfileView } from "@/features/dashboard/views/ProfileView";
import { DashboardSidebar } from "@/features/dashboard/components/layout/DashboardSidebar";
import { DashboardMobileNav } from "@/features/dashboard/components/layout/DashboardMobileNav";
import { ActiveView } from "@/features/dashboard/types/dashboard.types";
import SettingsView from "@/features/dashboard/views/SettingsView";
import Enable2FADialog from "@/features/auth/components/TwoFAPromptDialog";
import StatsView from "@/features/dashboard/views/StatsView";

export { initTheme } from "@/features/dashboard/utils/theme";

const VALID_VIEWS: ActiveView[] = ["write", "stats", "profile", "settings"];

function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const viewParam = searchParams.get("view") as ActiveView;
  const activeView: ActiveView = VALID_VIEWS.includes(viewParam) ? viewParam : "write";

  const goToSettings = () => setSearchParams({ view: "settings" }, { replace: true });

  return (
    <div className="bg-[#f2fbfc] dark:bg-[#0f1117] h-screen flex flex-col font-sans">
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-10 h-14 bg-white dark:bg-[#111318] border-b-[3px] border-[#0d0d0d] dark:border-[#2d3148] z-50">
        <div className="flex items-center gap-4">
          <Link to="/">
            <span className="text-lg sm:text-xl font-black text-[#0d0d0d] dark:text-white font-display">
              Blog<span className="text-[#d32f2f]">AI</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/messages")}
            title="Messages"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:text-[#0d0d0d] dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/6 transition-colors cursor-pointer"
          >
            <MessageCircle size={17} strokeWidth={1.8} />
          </button>
          <NotificationBell />
          <AvatarDropdown onSettingsClick={goToSettings} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 overflow-hidden flex flex-col pb-16 lg:pb-0">
          {activeView === "write" && <WriteView />}
          {activeView === "stats" && <StatsView />}
          {activeView === "profile" && <ProfileView />}
          {activeView === "settings" && <SettingsView />}
        </div>
      </div>

      <DashboardMobileNav />
      <Enable2FADialog />
    </div>
  );
}

export default DashboardPage;