/**
 * Shell-level copy for the global app layout (header / sidebar / bottom nav).
 * Korean-only. Per-screen copy lives with each screen.
 *
 * 메뉴 구성 근거: docs/user-flow.md
 */
export const shellStrings = {
  tagline: "외국인 취업 플랫폼",
  // 유학생 플로우 순서대로 — 진단 → 공고 → 프로그램
  navHome: "홈",
  navSelfCheck: "내 조건 진단",
  navOpportunities: "공고",
  navPrograms: "역량 강화",
  // 모바일 하단 탭용 짧은 라벨 — 10px 5칸에 긴 이름이 들어가지 않는다
  navSelfCheckShort: "진단",
  navProgramsShort: "역량 강화",
  navNotif: "알림",
  navMypage: "마이페이지",
  navLogin: "시작하기",
  // aria
  notifAria: "알림",
  mypageAria: "마이페이지",
  // live-data card
  liveData: "LIVE DATA",
  dataSource: "외교부 공공데이터 포털 실시간 연동",
} as const;

export type ShellStrings = typeof shellStrings;
