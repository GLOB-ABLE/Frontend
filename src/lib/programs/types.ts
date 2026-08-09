/**
 * 역량 강화 프로그램 도메인 타입 — PRD MVP-10
 *
 * 원본 데이터(data.json)는 공공데이터 5종을 흉내 낸 목데이터라 분류마다 필드가 다르다.
 * 화면에서 그 차이를 매번 분기하지 않도록 여기서 하나의 ProgramItem으로 펴서 쓴다.
 *
 * 지켜야 할 것
 * - `recommendation_score`(15~100)는 화면에 쓰지 않는다. 정렬에만 쓴다 (PR-2).
 * - `eligibility_status`는 공고 요건과 같은 4상태로 옮긴다.
 * - 모든 판정에 근거가 붙는다. `verification_note`가 그 자리다 (PR-1).
 */

import type { GapStatus } from "@/lib/feed/types";

/** 원본 JSON의 5개 배열 */
export type ProgramCategory =
  | "competency"
  | "workStudy"
  | "policy"
  | "event"
  | "course";

export const CATEGORY_LABEL: Record<ProgramCategory, string> = {
  competency: "취업역량",
  workStudy: "일학습병행",
  policy: "청년정책",
  event: "채용행사",
  course: "온라인 강좌",
};

/** 목록 상단 칩 — 전체가 맨 앞 */
export const CATEGORY_CHIPS: { key: ProgramCategory | "all"; label: string }[] =
  [
    { key: "all", label: "전체" },
    { key: "competency", label: CATEGORY_LABEL.competency },
    { key: "workStudy", label: CATEGORY_LABEL.workStudy },
    { key: "policy", label: CATEGORY_LABEL.policy },
    { key: "event", label: CATEGORY_LABEL.event },
    { key: "course", label: CATEGORY_LABEL.course },
  ];

/**
 * 신청 자격 판정.
 * ELIGIBLE → met · CONFIRM_REQUIRED → check · NOT_ELIGIBLE → unmet
 */
export type EligibilityStatus = Extract<GapStatus, "met" | "check" | "unmet">;

export const ELIGIBILITY_HEADLINE: Record<EligibilityStatus, string> = {
  met: "신청할 수 있어요",
  check: "확인이 필요해요",
  unmet: "지금은 신청이 어려워요",
};

export type Period = { start: string; end: string };

/** 카드에 한 줄로 붙는 부가 정보 (정원, 훈련시간, 참여기업 수 등) */
export type ProgramFact = { label: string; value: string };

/** 분류가 달라도 화면은 이 모양 하나만 안다 */
export type ProgramItem = {
  id: string;
  category: ProgramCategory;
  title: string;
  provider: string;
  /** 한 줄 소개 */
  summary: string;
  region?: string;
  /** 신청 기간 */
  applicationPeriod: Period;
  /** 실제 진행 기간 — 분류마다 필드명이 달라 여기서 하나로 모은다 */
  activePeriod?: Period;
  /** 진행 기간의 이름 (교육 기간 / 지원 기간 / 행사일 …) */
  activePeriodLabel?: string;
  eligibility: EligibilityStatus;
  /** 판정의 근거. 판정만 있고 근거가 없는 카드는 만들지 않는다 (PR-1) */
  verificationNote: string;
  requirements: string[];
  /** 얻는 것 — skills_improved · benefits · target_jobs를 한 자리로 */
  highlights: string[];
  highlightsLabel: string;
  /** 왜 추천하는지. 사실만 적는다 */
  reason: string;
  facts: ProgramFact[];
  /** 무료·유료. 원본에 값이 있는 분류에만 들어온다 */
  feeKrw?: number;
  /**
   * 정렬 순위. 원본 recommendation_score를 그대로 담는다.
   * ⚠️ 화면에 표시하지 않는다 (PR-2 · 디자인 시스템 2장 금지 패턴 1).
   */
  rank: number;
};

/** 목록 정렬 기준 */
export type ProgramSort = "recommended" | "deadline" | "freeOnly";

export const PROGRAM_SORTS: { key: ProgramSort; label: string }[] = [
  { key: "recommended", label: "추천순" },
  { key: "deadline", label: "마감임박순" },
  { key: "freeOnly", label: "무료만" },
];

/** 원본에 비용이 없는 분류가 많다. 없으면 "비용 미표기"로 둔다. */
export function isFree(item: ProgramItem): boolean {
  return item.feeKrw === 0;
}

export function feeLabel(item: ProgramItem): string {
  if (item.feeKrw === undefined) return "비용 미표기";
  return item.feeKrw === 0 ? "무료" : `${item.feeKrw.toLocaleString()}원`;
}

/** 신청 마감까지 남은 일수. 지난 것은 음수가 된다. */
export function daysLeft(item: ProgramItem, today: Date = new Date()): number {
  const end = new Date(`${item.applicationPeriod.end}T23:59:59`);
  const base = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
  return Math.ceil((end.getTime() - base) / 86_400_000);
}

export function deadlineLabel(item: ProgramItem, today?: Date): string {
  const left = daysLeft(item, today);
  if (left < 0) return "신청 마감";
  if (left === 0) return "오늘 마감";
  return `마감 D-${left}`;
}

/** "2026-08-27" → "8월 27일" */
export function formatDate(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}

export function formatPeriod(period: Period): string {
  if (period.start === period.end) return formatDate(period.start);
  return `${formatDate(period.start)} ~ ${formatDate(period.end)}`;
}
