import { Link, useSearchParams } from "react-router-dom";
import { SIDE_ITEMS } from "@/features/dashboard/constants/sideNavItems";
import { ActiveView } from "../../types/dashboard.types";

const VALID_VIEWS: ActiveView[] = ["write", "stats", "profile", "settings"];

export function DashboardMobileNav() {
  const [searchParams, setSearchParams] = useSearchParams();

  const viewParam = searchParams.get("view") as ActiveView;
  const activeView: ActiveView = VALID_VIEWS.includes(viewParam) ? viewParam : "write";

  const goToView = (view: ActiveView) => setSearchParams({ view }, { replace: true });

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex bg-[#0d0d0d] dark:bg-[#070809] border-t-[3px] border-[#0d0d0d] dark:border-[#2d3148]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {SIDE_ITEMS.map((item) => {
        const isActive = item.view ? activeView === item.view : false;
        const content = (
          <div className={`flex flex-col items-center justify-center gap-1 py-2 flex-1 transition-colors ${isActive ? "text-[#d32f2f]" : "text-white/60"}`}>
            {item.icon}
            <span className="text-[9px] font-black uppercase tracking-wider font-display">{item.label}</span>
          </div>
        );
        return item.href ? (
          <Link to={item.href} key={item.label} className="flex-1">{content}</Link>
        ) : (
          <button key={item.label} onClick={() => goToView(item.view!)} className="flex-1 cursor-pointer">
            {content}
          </button>
        );
      })}
    </nav>
  );
}

export default DashboardMobileNav;