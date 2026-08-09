/**
 * 공고 피드 목 데이터
 *
 * 해커톤 시연용 시드 데이터다 (PRD 15장 · MVP-12).
 * 실제 API가 붙으면 이 파일만 교체하면 되도록 컴포넌트는 타입에만 의존한다.
 */

import type { FilterOption, GateState, JobPosting } from "./types";

/** 규칙 버전과 적용 기준일 — 모든 판정 화면에 표시한다 (PR-5) */
export const RULE_VERSION = "규칙 v1.2";
export const EFFECTIVE_DATE = "2026.03.01";

/** 로그인 사용자의 체류자격 게이트 상태 */
export const GATE: {
  state: GateState;
  title: string;
  description: string;
  expiresAt: string;
} = {
  state: "VG-A",
  title: "재학 중 · D-2-2 · 졸업 후 D-10 전환 예정",
  description:
    "취업활동 가능 체류자격은 졸업 후 확인됩니다. 공고와 프로그램은 지금도 볼 수 있어요.",
  expiresAt: "2027.02.28",
};

export const JOB_FAMILY_OPTIONS: FilterOption[] = [
  { value: "trade", label: "해외영업·무역" },
  { value: "purchasing", label: "구매·자재" },
  { value: "production", label: "생산관리" },
  { value: "support", label: "경영지원" },
];

export const REGION_OPTIONS: FilterOption[] = [
  { value: "부산", label: "부산" },
  { value: "경남", label: "경남" },
  { value: "울산", label: "울산" },
  { value: "서울", label: "서울" },
];

export const WORK_LANGUAGE_OPTIONS: FilterOption[] = [
  { value: "베트남어 응대", label: "베트남어 응대" },
  { value: "영어 문서 작성", label: "영어 문서 작성" },
  { value: "한국어 회의 참여", label: "한국어 회의 참여" },
  { value: "중국어 응대", label: "중국어 응대" },
];

export const SALARY_RANGE = { min: 2600, max: 4500 } as const;

const BASE_EVIDENCE: JobPosting["evidence"] = [
  { label: "근거 보기", tone: "action" },
  { label: RULE_VERSION, tone: "meta" },
];

export const JOB_POSTINGS: JobPosting[] = [
  {
    id: "daesung-overseas-sales",
    logoText: "대성",
    logoTone: "navy",
    title: "해외영업 담당 (신입)",
    company: "대성정밀공업",
    headcount: 45,
    location: "부산 사상구",
    salaryLabel: "3,000~3,400만원",
    salaryMin: 3000,
    employmentType: "정규직",
    deadline: "2026-03-20",
    readiness: "ready",
    workTags: ["베트남어 응대", "한국어 회의 참여", "수출 서류 작성"],
    jobFamily: "trade",
    gap: { met: 2, check: 2, unmet: 1, na: 1 },
    matchRate: 92,
    matchReasons: ["베트남 시장 수출 업무", "부산 소재 기업"],
    evidence: BASE_EVIDENCE,
  },
  {
    id: "hanyoung-export-docs",
    logoText: "한영",
    logoTone: "sub",
    title: "수출 서류 담당",
    company: "한영테크",
    headcount: 38,
    location: "부산 강서구",
    salaryLabel: "2,900~3,200만원",
    salaryMin: 2900,
    employmentType: "정규직",
    deadline: "2026-03-28",
    readiness: "ready",
    workTags: ["영어 문서 작성", "한국어 회의 참여"],
    jobFamily: "trade",
    gap: { met: 3, check: 3, unmet: 0, na: 0 },
    matchRate: 88,
    matchReasons: ["수출 서류 업무 중심", "부산 소재 기업"],
    evidence: BASE_EVIDENCE,
  },
  {
    id: "samyang-purchasing",
    logoText: "삼양",
    logoTone: "navy",
    title: "구매·자재 담당",
    company: "삼양기계",
    headcount: 52,
    location: "부산 사하구",
    salaryLabel: "3,100~3,500만원",
    salaryMin: 3100,
    employmentType: "정규직",
    deadline: "2026-04-03",
    readiness: "partial",
    workTags: ["베트남어 응대", "한국어 회의 참여"],
    jobFamily: "purchasing",
    gap: { met: 2, check: 3, unmet: 1, na: 0 },
    matchRate: 81,
    matchReasons: ["베트남 공장 자재 업무", "부산 소재 기업"],
    evidence: BASE_EVIDENCE,
  },
  {
    id: "dongbo-partner-management",
    logoText: "동보",
    logoTone: "sub",
    title: "해외 거래처 관리",
    company: "동보산업",
    headcount: 41,
    location: "경남 김해",
    salaryLabel: "3,000~3,300만원",
    salaryMin: 3000,
    employmentType: "정규직",
    deadline: "2026-04-10",
    readiness: "partial",
    workTags: ["베트남어 응대", "영어 문서 작성", "전화 응대"],
    jobFamily: "trade",
    gap: { met: 1, check: 5, unmet: 0, na: 0 },
    matchRate: 76,
    matchReasons: ["베트남 시장 수출 업무", "부산 소재 기업"],
    evidence: [
      { label: "증빙 없음", tone: "warn" },
      { label: RULE_VERSION, tone: "meta" },
    ],
    actionHint: "증빙 4개를 올리면 상태가 바뀝니다.",
  },
  {
    id: "woojin-trade-office",
    logoText: "우진",
    logoTone: "navy",
    title: "무역사무 담당",
    company: "우진글로벌",
    headcount: 33,
    location: "부산 동래구",
    salaryLabel: "2,900~3,100만원",
    salaryMin: 2900,
    employmentType: "정규직",
    deadline: "2026-04-15",
    readiness: "ready",
    workTags: ["영어 문서 작성", "수출 서류 작성"],
    jobFamily: "trade",
    gap: { met: 3, check: 2, unmet: 0, na: 1 },
    matchRate: 85,
    matchReasons: ["수출 서류 업무 중심", "부산 소재 기업"],
    evidence: [
      { label: "근거 보기", tone: "action" },
      { label: `기준일 ${EFFECTIVE_DATE}`, tone: "meta" },
    ],
  },
  {
    id: "shinheung-sales-support",
    logoText: "신흥",
    logoTone: "sub",
    title: "해외영업 지원",
    company: "신흥소재",
    headcount: 47,
    location: "부산 해운대구",
    salaryLabel: "3,200~3,600만원",
    salaryMin: 3200,
    employmentType: "정규직",
    deadline: "2026-04-22",
    readiness: "ready",
    workTags: ["베트남어 응대", "한국어 회의 참여", "출장 동행"],
    jobFamily: "trade",
    gap: { met: 4, check: 2, unmet: 0, na: 0 },
    matchRate: 94,
    matchReasons: ["베트남 시장 수출 업무", "부산 소재 기업"],
    evidence: BASE_EVIDENCE,
  },
];

/** 필터 항목 옆에 붙는 건수. 목 데이터에서는 고정값을 쓴다. */
export const FILTER_COUNTS: Record<string, number> = {
  trade: 12,
  purchasing: 6,
  production: 5,
  support: 4,
  부산: 9,
  경남: 5,
  울산: 4,
  서울: 3,
  "베트남어 응대": 8,
  "영어 문서 작성": 11,
  "한국어 회의 참여": 14,
  "중국어 응대": 4,
};

/** 필터를 걸지 않았을 때 헤더에 표시하는 전체 건수 */
export const TOTAL_POSTING_COUNT = 12;
