export interface StatChipProps {
  icon: React.ReactNode;
  label: string;
}

export interface SummaryPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: "USER" | "ADMIN";
  following?: boolean;
}