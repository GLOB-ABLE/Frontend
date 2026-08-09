import {
  Briefcase,
  Compass,
  MessageCircle,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

import type { ShellStrings } from "@/lib/i18n";

export type NavItem = {
  href: string;
  labelKey: keyof ShellStrings;
  icon: LucideIcon;
};

export const nav: NavItem[] = [
  { href: "/chat", labelKey: "navChat", icon: MessageCircle },
  // 나침반 → 내 조건 진단으로 교체 (docs/내-조건-진단-문항.md).
  // 기존 /compass 화면은 지우지 않았으므로 주소로 직접 열 수 있다.
  { href: "/self-check", labelKey: "navCompass", icon: Compass },
  { href: "/jobs", labelKey: "navOpportunities", icon: Briefcase },
  { href: "/insight", labelKey: "navInsight", icon: Newspaper },
];

export const bottomNav: NavItem[] = [
  // 나침반 → 내 조건 진단으로 교체 (docs/내-조건-진단-문항.md).
  // 기존 /compass 화면은 지우지 않았으므로 주소로 직접 열 수 있다.
  { href: "/self-check", labelKey: "navCompass", icon: Compass },
  { href: "/jobs", labelKey: "navOpportunities", icon: Briefcase },
  { href: "/insight", labelKey: "navInsight", icon: Newspaper },
  { href: "/chat", labelKey: "navChat", icon: MessageCircle },
];
