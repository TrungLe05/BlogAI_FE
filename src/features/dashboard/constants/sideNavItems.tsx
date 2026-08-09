import {
  LayoutDashboard,
  PenLine,
  BarChart,
  UserCircle,
  Settings,
} from "lucide-react";
import { SideNavItem } from "../types/dashboard.types";

export const SIDE_ITEMS: SideNavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: "Home", href: "/" },
  { icon: <PenLine size={18} />, label: "Write", view: "write" },
  { icon: <BarChart size={18} />, label: "Stats", view: "stats" },
  { icon: <UserCircle size={18} />, label: "Profile", view: "profile" },
  { icon: <Settings size={18} />, label: "Settings", view: "settings" },
];