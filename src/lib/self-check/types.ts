/**
 * 내 조건 진단 — 응답 스키마
 *
 * 문항 정의: docs/내-조건-진단-문항.md
 * 근거: docs/prd.md (MVP-00 체류자격 게이트 · MVP-02 진단)
 *
 * 원칙
 * - 국적을 조건으로 받지 않는다. 언어·업무 행동으로 받는다 (PR-7).
 * - 증빙 없이 충족으로 처리하지 않는다 (PR-1).
 * - 점수·확률로 말하지 않는다 (PR-2).
 */

import type { GateState } from "@/lib/feed/types";

/** Q1 체류자격 */
export type VisaKind = "D-2" | "D-10" | "E-7" | "F" | "unknown";

/** Q2 학적 상태 */
export type AcademicStatus = "enrolled" | "graduating" | "graduated";

/** Q6 한국어 시험 */
export type KoreanExam =
  | { kind: "topik"; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { kind: "kiip"; stage: 0 | 1 | 2 | 3 | 4 | 5 }
  | { kind: "conversational" }
  | { kind: "none" };

/** Q7 언어 수준 */
export type LanguageLevel = "native" | "business" | "daily";

export type LanguageSkill = {
  language: string;
  level: LanguageLevel;
  /** 어학 성적표 파일명. 파일 자체는 프로토타입에서 저장하지 않는다. */
  proofName?: string;
};

/** Q8 일 경험 */
export type WorkExperience = {
  id: string;
  org: string;
  task: string;
  startedAt: string;
  endedAt: string;
  employment: "정규직" | "계약직" | "인턴" | "아르바이트" | "학교 프로젝트";
  proofName?: string;
};

/** Q9 자격증 */
export type Certificate = {
  id: string;
  name: string;
  acquiredAt: string;
  proofName?: string;
};

/**
 * Q10 한국어 업무 행동 — 5단계
 * 급수만으로는 알 수 없는 것을 행동 단위로 받는다.
 * 공고의 "한국어 능통" 요건과 이 값을 나란히 비교한다.
 */
export type BehaviorLevel = 1 | 2 | 3 | 4 | 5;

export type SelfCheckAnswers = {
  /* STEP 1 · 지금 상태 */
  visa: VisaKind | null;
  academicStatus: AcademicStatus | null;
  /** 졸업(예정)일 — YYYY-MM */
  graduationOn: string;
  /** 체류 만료일 — YYYY-MM-DD */
  visaExpiresOn: string;
  /** 외국인등록증 파일명 (선택) */
  residenceCardName?: string;

  /* STEP 2 · 내 조건 */
  degree: "전문학사" | "학사" | "석사" | "박사" | null;
  major: string;
  school: string;
  diplomaName?: string;

  koreanExam: KoreanExam | null;
  koreanProofName?: string;

  languages: LanguageSkill[];
  experiences: WorkExperience[];
  certificates: Certificate[];

  /* STEP 3 · 한국어로 할 수 있는 일 */
  behaviors: Record<string, BehaviorLevel | undefined>;

  /* STEP 4 · 원하는 일 */
  jobFamilies: string[];
  regions: string[];
  salaryMin: number;
  employmentType: "정규직" | "계약직" | "인턴" | null;
};

export const EMPTY_ANSWERS: SelfCheckAnswers = {
  visa: null,
  academicStatus: null,
  graduationOn: "",
  visaExpiresOn: "",
  degree: null,
  major: "",
  school: "",
  koreanExam: null,
  languages: [],
  experiences: [],
  certificates: [],
  behaviors: {},
  jobFamilies: [],
  regions: [],
  salaryMin: 2900,
  employmentType: null,
};

/* ────────────────────────────────────────────
 * 게이트 판정 결과
 * ──────────────────────────────────────────── */

export type GateResult = {
  state: GateState;
  title: string;
  description: string;
  /** 왜 이 상태인지 — 판정에는 반드시 근거가 붙는다 (PR-1) */
  reasons: string[];
  /** 지금 쓸 수 있는 기능 */
  allowed: string[];
  /** 지금 쓸 수 없는 기능 */
  blocked: string[];
  /** 공고 목록으로 갈 수 있는가 */
  canBrowseJobs: boolean;
  /** 공고에 지원할 수 있는가 */
  canApply: boolean;
};

/**
 * 진단으로 확인이 필요해진 항목.
 * 자기 기입값은 있는데 증빙이 없는 경우가 여기 들어온다 (PR-1).
 */
export type PendingProof = {
  id: string;
  label: string;
  /** 무엇이 없어서 확인 필요인지 */
  reason: string;
  /** 올리면 무엇이 바뀌는지 */
  effect: string;
};
