/**
 * 전역 메뉴 — docs/user-flow.md 3장
 *
 * 유학생이 실제로 오가는 순서 그대로 놓는다.
 *   홈 → 내 조건 진단 → 공고 → 역량 강화
 *
 * 역량 강화(/growth)는 허브다. 카드로 무엇을 할지 고른다.
 * 목록은 lib/growth/items.ts에 있다.
 *
 * /chat, /insight는 옛 국제기구 프로젝트 화면이라 메뉴에서 뺐다.
 * 라우트는 살아 있으니 주소로 직접 열 수 있다.
 * /compass(나침반)와 /profile은 삭제됐다. 각각 /self-check와 /mypage가 대신한다.
 */

import {
  Briefcase,
  ClipboardCheck,
  GraduationCap,
  Home,
  User,
  type LucideIcon,
} from "lucide-react";

import type { ShellStrings } from "@/lib/i18n";

export type NavItem = {
  href: string;
  labelKey: keyof ShellStrings;
  /** 모바일 하단 탭에서 쓸 짧은 라벨. 없으면 labelKey를 그대로 쓴다. */
  shortLabelKey?: keyof ShellStrings;
  /**
   * href 말고도 이 항목을 켤 경로들.
   * 역량 강화처럼 여러 화면을 묶는 메뉴에 쓴다.
   */
  matchPaths?: string[];
  icon: LucideIcon;
};

/** 데스크톱 사이드바. 마이페이지는 아래 계정 영역에서 따로 보여준다. */
export const nav: NavItem[] = [
  { href: "/", labelKey: "navHome", icon: Home },
  // {
  //   href: "/self-check",
  //   labelKey: "navSelfCheck",
  //   shortLabelKey: "navSelfCheckShort",
  //   icon: ClipboardCheck,
  // },
  { href: "/jobs", labelKey: "navOpportunities", icon: Briefcase },
  {
    href: "/growth",
    labelKey: "navPrograms",
    shortLabelKey: "navProgramsShort",
    // 허브 안의 화면에 있어도 메뉴는 계속 켜져 있어야 한다
    matchPaths: ["/programs", "/simulation"],
    icon: GraduationCap,
  },
];

/**
 * 모바일 하단 탭.
 * 증빙을 올리는 자리가 핵심 루프라 마이페이지를 여기에는 넣는다.
 */
export const bottomNav: NavItem[] = [
  ...nav,
  { href: "/mypage", labelKey: "navMypage", icon: User },
];
