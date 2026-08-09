/**
 * 역량 강화 프로그램 목데이터 로더
 *
 * data.json은 공공데이터 5종(취업역량·일학습병행·청년정책·채용행사·K-MOOC)을
 * 흉내 낸 가상 데이터다. 분류마다 필드가 달라서 여기서 ProgramItem으로 편다.
 *
 * 실제 API가 붙으면 이 파일의 normalize 함수만 갈아끼우면 된다.
 */

import raw from "@/lib/programs/data.json";
import {
  type EligibilityStatus,
  type Period,
  type ProgramCategory,
  type ProgramFact,
  type ProgramItem,
} from "@/lib/programs/types";

/* ── 페르소나 ── */

const persona = raw.metadata.target_persona;

export const LEARNER = {
  /** 화면에 쓰는 한글 이름. 원본은 영문 표기라 따로 둔다. */
  name: "응우옌 티 민 안",
  legalName: persona.name,
  region: persona.region,
  major: persona.major,
  visa: persona.visa_type,
  visaPlan: persona.visa_transition_plan,
  careerGoals: persona.career_goal,
  graduation: persona.graduation_status,
} as const;

/** 목데이터임을 밝히는 문구 — 화면 하단에 그대로 쓴다 (PR-5) */
export const DATASET_DISCLAIMER = raw.metadata.disclaimer;
export const DATASET_GENERATED_AT = raw.metadata.generated_at;

/* ── 판정 매핑 ── */

const ELIGIBILITY: Record<string, EligibilityStatus> = {
  ELIGIBLE: "met",
  CONFIRM_REQUIRED: "check",
  NOT_ELIGIBLE: "unmet",
};

function toEligibility(code: string): EligibilityStatus {
  return ELIGIBILITY[code] ?? "check";
}

const DELIVERY_LABEL: Record<string, string> = {
  ONLINE: "온라인",
  OFFLINE: "오프라인",
  HYBRID: "온·오프라인",
};

/* ── 분류별 정규화 ── */

type Base = {
  id: string;
  title: string;
  provider: string;
  application_period: Period;
  eligibility_status: string;
  requirements: string[];
  recommendation_reason: string;
  recommendation_score: number;
  verification_note: string;
};

function base(item: Base, category: ProgramCategory) {
  return {
    id: item.id,
    category,
    title: item.title,
    provider: item.provider,
    applicationPeriod: item.application_period,
    eligibility: toEligibility(item.eligibility_status),
    verificationNote: item.verification_note,
    requirements: item.requirements,
    reason: item.recommendation_reason,
    rank: item.recommendation_score,
  };
}

function competency(): ProgramItem[] {
  return raw.employment_competency_programs.map((item) => ({
    ...base(item, "competency"),
    summary: item.summary,
    region: item.region,
    activePeriod: item.program_period,
    activePeriodLabel: "교육 기간",
    highlights: item.skills_improved,
    highlightsLabel: "이런 걸 배워요",
    feeKrw: item.fee_krw,
    facts: [
      { label: "형태", value: DELIVERY_LABEL[item.delivery_mode] ?? "미표기" },
      { label: "정원", value: `${item.capacity}명` },
    ] satisfies ProgramFact[],
  }));
}

function workStudy(): ProgramItem[] {
  return raw.work_study_programs.map((item) => ({
    ...base(item, "workStudy"),
    summary: `${item.ncs_name} 분야 · ${item.partner_company}`,
    region: item.region,
    activePeriod: item.program_period,
    activePeriodLabel: "훈련 기간",
    highlights: item.skills_improved,
    highlightsLabel: "이런 걸 배워요",
    facts: [
      { label: "형태", value: DELIVERY_LABEL[item.delivery_mode] ?? "미표기" },
      { label: "훈련시간", value: `${item.training_hours}시간` },
      { label: "NCS", value: item.ncs_name },
    ] satisfies ProgramFact[],
  }));
}

function policy(): ProgramItem[] {
  return raw.youth_policies.map((item) => ({
    ...base(item, "policy"),
    summary: item.support_summary,
    region: item.region,
    activePeriod: item.support_period,
    activePeriodLabel: "지원 기간",
    highlights: item.benefits,
    highlightsLabel: "이런 걸 받아요",
    facts: [{ label: "유형", value: item.policy_type }] satisfies ProgramFact[],
  }));
}

function events(): ProgramItem[] {
  return raw.recruitment_events.map((item) => ({
    ...base(item, "event"),
    summary: `${item.venue} · ${item.target_jobs.join(" · ")}`,
    region: item.region,
    activePeriod: item.event_period,
    activePeriodLabel: "행사일",
    highlights: item.benefits,
    highlightsLabel: "이런 걸 할 수 있어요",
    facts: [
      { label: "참여기업", value: `${item.participating_company_count}곳` },
      { label: "장소", value: item.venue },
    ] satisfies ProgramFact[],
  }));
}

function courses(): ProgramItem[] {
  return raw.kmooc_courses.map((item) => ({
    ...base(item, "course"),
    summary: `${item.field} · ${item.language}`,
    activePeriod: item.course_period,
    activePeriodLabel: "수강 기간",
    highlights: item.skills_improved,
    highlightsLabel: "이런 걸 배워요",
    // K-MOOC은 원본에 비용 필드가 없지만 무료 공개강좌다
    feeKrw: 0,
    facts: [
      { label: "기간", value: `${item.weeks}주` },
      {
        label: "수료증",
        value: item.certificate_available ? "발급" : "없음",
      },
    ] satisfies ProgramFact[],
  }));
}

/* ── 전체 목록 ── */

/**
 * 추천 순서로 정렬해 둔다.
 *
 * 1. 신청이 어려운 것(미충족)은 맨 아래로 — 감추지는 않는다
 * 2. 그 위는 rank 높은 순
 * 3. rank가 같으면 마감이 가까운 순 (동점이 5건 있다)
 */
export const PROGRAMS: ProgramItem[] = [
  ...competency(),
  ...workStudy(),
  ...policy(),
  ...events(),
  ...courses(),
].sort((a, b) => {
  const aUnmet = a.eligibility === "unmet" ? 1 : 0;
  const bUnmet = b.eligibility === "unmet" ? 1 : 0;
  if (aUnmet !== bUnmet) return aUnmet - bUnmet;
  if (a.rank !== b.rank) return b.rank - a.rank;
  return a.applicationPeriod.end.localeCompare(b.applicationPeriod.end);
});

/**
 * 지금 채워야 할 것 — 추천 상위 프로그램이 다루는 역량에서 뽑는다.
 * 목록 상단에 "무엇을 근거로 골랐는지"를 밝히는 자리다 (PR-1).
 */
export const FOCUS_SKILLS: string[] = Array.from(
  new Set(
    PROGRAMS.filter((p) => p.eligibility === "met")
      .slice(0, 6)
      .flatMap((p) => p.highlights),
  ),
).slice(0, 5);

export function programsByCategory(
  category: ProgramCategory | "all",
): ProgramItem[] {
  if (category === "all") return PROGRAMS;
  return PROGRAMS.filter((item) => item.category === category);
}
