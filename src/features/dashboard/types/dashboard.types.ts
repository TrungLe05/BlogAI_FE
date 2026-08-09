export type ActiveView = "write" | "stats" | "profile" | "settings";

export interface SideNavItem {
  icon: React.ReactNode;
  label: string;
  view?: ActiveView;
  href?: string;
}