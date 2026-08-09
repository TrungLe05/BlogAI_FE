import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ActiveView } from "../../types/dashboard.types";
import { SIDE_ITEMS } from "../../constants/sideNavItems";


const VALID_VIEWS: ActiveView[] = ["write", "stats", "profile", "settings"];

function SideItem({ icon, label, active, onClick, expanded }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; expanded: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={!expanded ? label : undefined}
      className={`flex items-center w-full transition-all cursor-pointer border-b-2 border-white/6 overflow-hidden whitespace-nowrap
        ${active ? "bg-[#d32f2f] text-white" : "bg-transparent text-[#5b403d] dark:text-slate-400 hover:bg-white/5"}
        ${expanded ? "gap-3 px-4.5 py-3.25 justify-start" : "gap-0 px-0 py-4 justify-center"}`}
    >
      <span className="shrink-0">{icon}</span>
      <span
        className="font-black uppercase tracking-[0.12em] transition-all text-[0.7rem] font-display"
        style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 120 : 0, transition: "opacity 0.2s, max-width 0.25s" }}
      >
        {label}
      </span>
    </button>
  );
}

export function DashboardSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const viewParam = searchParams.get("view") as ActiveView;
  const activeView: ActiveView = VALID_VIEWS.includes(viewParam) ? viewParam : "write";

  const goToView = (view: ActiveView) => setSearchParams({ view }, { replace: true });

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="hidden lg:flex shrink-0 flex-col border-r-[3px] border-[#0d0d0d] dark:border-[#2d3148] bg-[#0d0d0d] dark:bg-[#070809] z-40 overflow-hidden transition-[width] duration-250 ease-in-out"
      style={{ width: expanded ? 180 : 60 }}
    >
      <div
        className="flex items-center border-b-2 border-white/8 transition-[padding] duration-250 overflow-hidden whitespace-nowrap"
        style={{ padding: expanded ? "14px 18px" : "14px 0", justifyContent: expanded ? "flex-start" : "center" }}
      >
        <span className="font-black text-base text-white shrink-0 font-display">B<span className="text-[#d32f2f]">.</span></span>
        <span
          className="font-black text-[0.75rem] text-white/50 pl-1.5 overflow-hidden transition-[opacity,max-width] duration-250 font-display"
          style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 120 : 0 }}
        >
          log<span className="text-[#d32f2f]">AI</span>
        </span>
      </div>

      {SIDE_ITEMS.map((item) =>
        item.href ? (
          <Link to={item.href} key={item.label}>
            <SideItem icon={item.icon} label={item.label} active={false} onClick={() => {}} expanded={expanded} />
          </Link>
        ) : (
          <SideItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeView === item.view}
            onClick={() => goToView(item.view!)}
            expanded={expanded}
          />
        ),
      )}
    </div>
  );
}

export default DashboardSidebar;