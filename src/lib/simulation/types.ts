/**
 * 직장 시뮬레이션 도메인 타입 — docs/simulation.md
 *
 * 원본 프로토타입은 결과를 `92/100` 점수로 말했다.
 * 여기서는 공고·프로그램과 같은 4상태로 말한다 (PR-2 · 디자인 시스템 2장 금지 패턴 1).
 */

import type { GapStatus } from "@/lib/feed/types";

/** 화면 번호 — 원본 프로토타입의 screens[0..9]와 같은 순서 */
export type SceneId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** 상단 스텝바에 표시하는 5단계 */
export type StepId = 1 | 2 | 3 | 4 | 5;

export type Step = {
  id: StepId;
  label: string;
};

/** 말하는 사람 */
export type Speaker = {
  name: string;
  role: string;
  /** public 기준 경로 */
  image: string;
};

/** 인물 + 대사로 이루어진 화면 */
export type SceneCopy = {
  speaker: Speaker;
  /** 좌상단 태그 (예: "1단계 · 업무 지시") */
  tag: string;
  title: string;
  /** 큰따옴표 안에 들어가는 대사. 줄바꿈은 배열로 나눈다. */
  speech: string[];
  /** 대사 아래 노란 안내 박스 */
  note: string;
  /** 다음으로 가는 버튼 문구 */
  action: string;
};

/** 2단계 선택지 */
export type Choice = {
  id: "A" | "B";
  title: string;
  /** 고른 뒤 직접 말해볼 문장 */
  sentence: string;
  /**
   * 말했는지 확인할 핵심 낱말.
   * 발음을 채점하지 않는다. 꼭 필요한 말이 들어갔는지만 본다.
   */
  keywords: string[];
  correct: boolean;
};

/** 3단계 웹캠 미션 */
export type HandMission = {
  tag: string;
  title: string;
  description: string;
  /** 우측 가이드 목록 */
  guide: string[];
  /** 카메라 관련 면책 */
  privacyNote: string;
};

/**
 * 결과 한 줄.
 * 점수를 쓰지 않는다. 상태와 사실 문장으로만 말한다.
 */
export type ResultRow = {
  id: string;
  label: string;
  /** 이 항목에서 실제로 무슨 일이 있었는지. 사실만 적는다. */
  detail: string;
  status: Extract<GapStatus, "met" | "check" | "unmet">;
};

/** 완료 개수 라벨 — "4개 중 3개를 해냈어요" */
export function doneLabel(rows: ResultRow[]): string {
  const done = rows.filter((r) => r.status === "met").length;
  return `${rows.length}개 중 ${done}개를 해냈어요`;
}

/** 다시 연습할 항목 */
export function retryRows(rows: ResultRow[]): ResultRow[] {
  return rows.filter((r) => r.status !== "met");
}
