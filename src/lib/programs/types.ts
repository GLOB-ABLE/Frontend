/**
 * 추천 프로그램 도메인 타입 — PRD MVP-10 (부족 역량 기반 프로그램 배정)
 *
 * 프로그램은 "매칭도 96%"가 아니라 "어떤 요건을 해결하는가"로 말한다.
 * 확률·점수·순위는 쓰지 않는다 (PR-2 · 디자인 시스템 2장 금지 패턴 1·5).
 */

import type { GapStatus } from "@/lib/feed/types";

/** 비용 유형 */
export type ProgramCost =
  | { kind: "free" }
  | { kind: "subsidized"; label: string }
  | { kind: "paid"; label: string };

/** 모집 상태 — 마감일이 없는 상시 모집도 있다 */
export type ProgramIntake =
  | { kind: "deadline"; daysLeft: number }
  | { kind: "exam"; date: string }
  | { kind: "always" };

/**
 * 이 프로그램이 해결하는 요건.
 * 공고 상세의 요건 id와 같은 값을 써서 "어떤 판정이 바뀌는지" 이어지게 한다.
 */
export type ProgramTarget = {
  requirementId: string;
  /** 요건 이름 (예: "한국어 회의 참여") */
  label: string;
  /** 현재 상태 — 이 프로그램을 마치면 met으로 바뀔 수 있는 항목 */
  currentStatus: Extract<GapStatus, "check" | "unmet">;
};

export type Program = {
  id: string;
  /** 카드 로고 자리 문구 (예: "한국어") */
  logoText: string;
  logoTone: "navy" | "sub";
  title: string;
  /** 운영 기관 */
  provider: string;
  /** "12주 · 주 3회 · 온라인 가능 · 정원 20명" */
  formatLabel: string;
  /** 이 프로그램이 왜 도움이 되는지. 사실만 적는다. */
  reason: string;
  cost: ProgramCost;
  intake: ProgramIntake;
  /** 해결하는 요건. 비어 있으면 요건과 직접 연결되지 않는 보조 프로그램이다. */
  targets: ProgramTarget[];
  /** 요건과 직접 연결되지 않을 때 쓰는 문구 (예: "면접 준비에 도움") */
  supportNote?: string;
  /** 목록에서 가장 위로 올리는 항목 */
  featured?: boolean;
  /** 신청 링크 */
  href?: string;
};

export type ProgramSort = "recommended" | "deadline" | "freeOnly";

/** 정렬 칩 라벨 */
export const PROGRAM_SORTS: { key: ProgramSort; label: string }[] = [
  { key: "recommended", label: "추천순" },
  { key: "deadline", label: "마감임박순" },
  { key: "freeOnly", label: "무료만" },
];

export function isFree(cost: ProgramCost): boolean {
  return cost.kind === "free" || cost.kind === "subsidized";
}

/** 마감까지 남은 일수. 상시·시험 일정은 정렬에서 뒤로 보낸다. */
export function intakeOrder(intake: ProgramIntake): number {
  return intake.kind === "deadline" ? intake.daysLeft : Number.MAX_SAFE_INTEGER;
}

/**
 * "확인 필요 1개가 충족으로 바뀝니다" 형태의 문구.
 * 퍼센트를 대체하는 자리다.
 */
export function targetLabel(program: Program): string {
  if (program.targets.length === 0) {
    return program.supportNote ?? "준비에 도움이 됩니다";
  }
  const check = program.targets.filter(
    (t) => t.currentStatus === "check",
  ).length;
  const unmet = program.targets.filter(
    (t) => t.currentStatus === "unmet",
  ).length;

  return [
    check > 0 ? `확인 필요 ${check}개` : null,
    unmet > 0 ? `미충족 ${unmet}개` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
