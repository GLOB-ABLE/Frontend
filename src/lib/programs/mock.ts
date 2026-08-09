/**
 * 추천 프로그램 목 데이터 — PRD MVP-10
 *
 * 요건 id는 lib/feed/detail-mock.ts의 요건과 맞춘다.
 * 프로그램을 마치면 어떤 판정이 바뀌는지 화면에서 이어 보이게 하기 위함이다.
 */

import type { Program, ProgramTarget } from "./types";

/** 이 사용자에게 지금 필요한 것 — 공고 상세의 확인 필요·미충족 항목에서 온다 */
export const NEEDS: ProgramTarget[] = [
  {
    requirementId: "korean-meeting",
    label: "한국어 회의 참여",
    currentStatus: "check",
  },
  {
    requirementId: "job-experience",
    label: "수출 서류 업무 경험",
    currentStatus: "unmet",
  },
  {
    requirementId: "trade-certificate",
    label: "무역 자격증",
    currentStatus: "unmet",
  },
];

export const LEARNER_NAME = "호앙 안";

export const PROGRAMS: Program[] = [
  {
    id: "topik-5-evening",
    logoText: "한국어",
    logoTone: "navy",
    title: "TOPIK 5급 집중반 (야간)",
    provider: "서울글로벌센터",
    formatLabel: "12주 · 주 3회 · 온라인 가능 · 정원 20명",
    reason: "지금 4급이면 12주 안에 5급까지 갈 수 있어요.",
    cost: { kind: "free" },
    intake: { kind: "deadline", daysLeft: 4 },
    targets: [NEEDS[0]],
    featured: true,
  },
  {
    id: "trade-docs-bootcamp",
    logoText: "무역",
    logoTone: "sub",
    title: "수출입 서류 실무 부트캠프",
    provider: "한국무역협회 무역아카데미",
    formatLabel: "8주 · 주 3회 · 강남 오프라인 · 실습 과제 2건",
    reason: "인보이스와 통관 서류를 직접 만들어 봅니다.",
    cost: { kind: "subsidized", label: "국비 지원" },
    intake: { kind: "deadline", daysLeft: 16 },
    targets: [NEEDS[1]],
  },
  {
    id: "trade-license-prep",
    logoText: "자격",
    logoTone: "navy",
    title: "국제무역사 자격증 대비반",
    provider: "한국무역협회 인증 학원",
    formatLabel: "4주 · 주 2회 · 온라인 · 수강료 18만원",
    reason: "무역사무 공고에서 자주 요구하는 자격증이에요.",
    cost: { kind: "paid", label: "18만원" },
    intake: { kind: "exam", date: "3월 14일" },
    targets: [NEEDS[2]],
  },
  {
    id: "mentoring-1on1",
    logoText: "멘토",
    logoTone: "sub",
    title: "외국인 취업 멘토링 1:1",
    provider: "Globable 멘토단",
    formatLabel: "6주 · 주 1회 · 온라인 · 이력서 첨삭 포함",
    reason: "먼저 취업한 선배가 면접 준비를 같이 해줘요.",
    cost: { kind: "free" },
    intake: { kind: "always" },
    targets: [],
    supportNote: "면접 준비에 도움",
  },
];
