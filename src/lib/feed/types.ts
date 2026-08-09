/**
 * 공고 피드 도메인 타입
 *
 * 디자인 시스템 v1.2 · docs/design-system.md
 * PRD MVP-03 (맞춤 공고 추천 · 4상태 갭 분석) · docs/prd.md
 *
 * 판정은 확률·점수가 아니라 4개 상태로만 표현한다 (PR-2).
 * 증빙이 없으면 충족이 아니라 "확인 필요"다 (PR-1).
 */

/** 요건별 4상태 판정 */
export type GapStatus = "met" | "unmet" | "check" | "na";

/** 체류자격 게이트 상태 — PRD 6.2 */
export type GateState = "VG-A" | "VG-B" | "VG-C" | "VG-D";

/** 기업의 외국인 채용 준비도 */
export type CompanyReadiness = "ready" | "partial" | "unknown";

/** 요건별 판정 개수. 합계가 총 요건 수가 된다. */
export type GapSummary = Record<GapStatus, number>;

/** 근거 칩 — 모든 판정 옆에 붙는다 (PR-1, 디자인 시스템 C) */
export type EvidenceChip = {
  label: string;
  /** action: 파란 액션형 · meta: 회색 메타형 · warn: 증빙 없음 · stale: 기준일 지남 */
  tone: "action" | "meta" | "warn" | "stale";
  href?: string;
};

export type JobPosting = {
  id: string;
  /** 카드 로고 자리에 들어가는 2글자 약칭 */
  logoText: string;
  /** 로고 배경 — navy | sub */
  logoTone: "navy" | "sub";
  title: string;
  company: string;
  /** 임직원 수 */
  headcount: number;
  location: string;
  /** "3,000~3,400만원" 형태의 표시용 문자열 */
  salaryLabel: string;
  /** 급여 필터용 하한 (만원) */
  salaryMin: number;
  employmentType: "정규직" | "계약직" | "인턴";
  /** 마감일 (ISO) */
  deadline: string;
  readiness: CompanyReadiness;
  /**
   * 업무 언어·행동 태그.
   * 국적을 조건으로 받지 않고 언어·시장 요건으로 치환한 결과다 (PR-7).
   */
  workTags: string[];
  /** 직무 카테고리 (필터 키) */
  jobFamily: string;
  gap: GapSummary;
  /**
   * 목록 카드에 표시하는 매칭률(%).
   *
   * ⚠️ 디자인 시스템 2장은 매칭률 표기를 금지한다(금지 패턴 1).
   *    목록 화면에서만 예외로 쓰기로 했고, 상세 화면은 4상태를 그대로 쓴다.
   *    근거를 댈 수 있는 값이 아니므로 목데이터에 직접 적어 둔다.
   */
  matchRate: number;
  /** 이 공고가 추천된 이유. 판정이 아니라 사실만 적는다. */
  matchReasons: string[];
  /** 판정에 붙는 근거 칩 */
  evidence: EvidenceChip[];
  /**
   * 확인 필요 항목이 많을 때 노출하는 안내.
   * "증빙 N개를 올리면 상태가 바뀝니다." 형태.
   */
  actionHint?: string;
};

/** 사이드바 필터 상태 */
export type FeedFilters = {
  /** 확인 필요 항목이 적은 순으로 정렬 */
  sortByFewestChecks: boolean;
  jobFamilies: string[];
  regions: string[];
  workLanguages: string[];
  employmentType: JobPosting["employmentType"];
  /** 급여 하한 (만원) */
  salaryMin: number;
};

export type FilterOption = {
  value: string;
  label: string;
};

/* ────────────────────────────────────────────
 * 공고 상세 — PRD MVP-03 / MVP-04
 * ──────────────────────────────────────────── */

/** 요건 한 줄. 판정에는 반드시 근거가 붙는다 (PR-1). */
export type RequirementRow = {
  id: string;
  /** 요건 이름 (예: "한국어") */
  label: string;
  /** 공고가 요구하는 것 */
  required: string;
  /** 내 데이터에 있는 것 */
  mine: string;
  /** 내 데이터 옆에 붙는 보조 문구 (예: "성적표 미제출") */
  mineNote?: string;
  status: GapStatus;
  /** 판정 근거 — 사실만 적는다. 판정만 있고 근거가 없는 행은 만들지 않는다. */
  reasons: string[];
  /** 이 요건을 해결하기 위한 다음 행동 */
  action?: { label: string; href?: string };
  evidence: EvidenceChip[];
};

/** 강점 / 채워야 할 것 카드 */
export type HighlightItem = {
  title: string;
  detail: string;
  /** 채워야 할 것에만 붙는 상태 배지 */
  status?: Extract<GapStatus, "check" | "unmet">;
};

/** 공고 원문 */
export type PostingSource = {
  mainTasks: string[];
  qualifications: string[];
  /** 외국인 지원자 안내 — 기업이 제공하는 지원 내용 */
  foreignerNote: string;
  /** 공고 등록일 */
  postedAt: string;
  sourceLabel: string;
};

/** 무료 취업지원 서비스 연계 — 공식 기관만 싣는다 (PR-5) */
export type SupportSite = {
  name: string;
  description: string;
  href: string;
  /** 전화 상담 등 링크가 아닌 경우 */
  contact?: string;
};

/**
 * 책임 주체 — 디자인 시스템 D
 * 장애요인마다 누가 움직여야 하는지 붙인다 (PRD 10.2).
 */
export type ActionOwner = "student" | "company" | "joint" | "expert";

/**
 * 최소 해결경로 한 단계 — PRD MVP-05
 * 미충족·확인 필요 항목마다 최소 1개 행동을 담당·기한과 함께 만든다.
 */
export type ActionStep = {
  id: string;
  owner: ActionOwner;
  /** "3일", "2주" 등 예상 소요 */
  duration: string;
  title: string;
  description: string;
  cta: { label: string; primary?: boolean };
};

/** 지원 준비 체크리스트 (사이드바) */
export type ApplyChecklistItem = {
  label: string;
  done: boolean;
};

/** 체류자격 전환 안내 — 발급 가능 여부를 단정하지 않는다 (PR-2) */
export type VisaGuide = {
  from: string;
  to: string;
  note: string;
  facts: { label: string; value: string }[];
};

/** 유사 공고 카드 (상세 하단) */
export type SimilarJob = Pick<
  JobPosting,
  "id" | "logoText" | "logoTone" | "title" | "company" | "gap"
> & {
  /** "서울 · 2,900~3,100만원" 형태 */
  metaLabel: string;
};

export type JobPostingDetail = JobPosting & {
  /** 브레드크럼 (예: ["맞춤 공고", "해외영업·무역"]) */
  breadcrumb: string[];
  /** 회사 한 줄 소개 */
  companyNote: string;
  /** 이 공고를 추천하는 이유 — 판정이 아니라 사실만 적는다 */
  recommendReasons: string[];
  /** 기업 준비도 근거 — "상위 N%" 순위를 대체한다 */
  readinessNotes: string[];
  requirements: RequirementRow[];
  strengths: HighlightItem[];
  toFill: HighlightItem[];
  /**
   * 아래 3개는 이번 화면에서 렌더하지 않는다.
   * 이후 단계(최소 해결경로 · 지원 준비 · 체류 전환 안내)를 붙일 때 쓰려고 타입만 남겨둔다.
   */
  actionPlan?: ActionStep[];
  applyChecklist?: ApplyChecklistItem[];
  visa?: VisaGuide;
  /** 무료 취업지원 서비스 연계 (사이드바) */
  supportSites: SupportSite[];
  source: PostingSource;
  similar: SimilarJob[];
};

/** 상태별 표시 규칙 — 전 화면에서 동일해야 한다 */
export const GAP_META: Record<
  GapStatus,
  { label: string; glyph: string; order: number }
> = {
  met: { label: "충족", glyph: "✓", order: 0 },
  check: { label: "확인 필요", glyph: "?", order: 1 },
  unmet: { label: "미충족", glyph: "✕", order: 2 },
  na: { label: "해당 없음", glyph: "–", order: 3 },
};

/** 요약 바 칸 순서 고정: 충족 → 확인 필요 → 미충족 → 해당 없음 */
export const GAP_ORDER: GapStatus[] = ["met", "check", "unmet", "na"];

export function totalRequirements(gap: GapSummary): number {
  return GAP_ORDER.reduce((sum, key) => sum + gap[key], 0);
}

/**
 * "충족 4 · 확인 필요 2" 형태의 라벨을 만든다.
 * % 기호와 소수점은 쓰지 않는다 (PR-2).
 */
export function gapLabel(gap: GapSummary): string {
  return GAP_ORDER.filter((key) => gap[key] > 0)
    .map((key) => `${GAP_META[key].label} ${gap[key]}`)
    .join(" · ");
}
