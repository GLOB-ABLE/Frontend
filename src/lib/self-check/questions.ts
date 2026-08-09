/**
 * 내 조건 진단 — 문항·선택지 정의
 *
 * docs/내-조건-진단-문항.md 부록 "문항 요약표"와 1:1로 맞춘다.
 * 문구를 바꿀 때는 md도 함께 고친다.
 */

import type {
  AcademicStatus,
  BehaviorLevel,
  LanguageLevel,
  SelfCheckAnswers,
  VisaKind,
} from "@/lib/self-check/types";

export type Step = {
  id: 1 | 2 | 3 | 4;
  name: string;
  lead: string;
  /** 예상 소요 */
  duration: string;
};

export const STEPS: Step[] = [
  {
    id: 1,
    name: "지금 상태",
    lead: "먼저 지금 상태를 알려주세요. 쓸 수 있는 기능이 정해져요.",
    duration: "약 1분",
  },
  {
    id: 2,
    name: "내 조건",
    lead: "공고 요건과 맞춰볼 내용이에요. 증빙이 있으면 충족으로, 없으면 확인 필요로 표시돼요.",
    duration: "약 2분",
  },
  {
    id: 3,
    name: "한국어로 할 수 있는 일",
    lead: "급수만으로는 알 수 없는 게 있어요. 실제로 할 수 있는 일을 골라주세요.",
    duration: "약 1분",
  },
  {
    id: 4,
    name: "원하는 일",
    lead: "어떤 공고를 보여드릴지 정하는 데 쓸게요. 나중에 바꿀 수 있어요.",
    duration: "약 1분",
  },
];

/* ── Q1 체류자격 ── */
export const VISA_OPTIONS: {
  value: VisaKind;
  label: string;
  hint?: string;
}[] = [
  {
    value: "D-2",
    label: "D-2 (유학)",
    hint: "학교를 다니려고 받은 자격이에요",
  },
  {
    value: "D-10",
    label: "D-10 (구직)",
    hint: "졸업 후 일자리를 찾는 자격이에요",
  },
  { value: "E-7", label: "E-7 (특정활동)" },
  { value: "F", label: "F-2 · F-5 · F-6" },
  { value: "unknown", label: "그 밖이거나 잘 모르겠어요" },
];

/* ── Q2 학적 상태 ── */
export const ACADEMIC_OPTIONS: {
  value: AcademicStatus;
  label: string;
  hint?: string;
}[] = [
  { value: "enrolled", label: "재학 중이에요" },
  {
    value: "graduating",
    label: "곧 졸업해요",
    hint: "6개월 이내에 졸업할 예정",
  },
  { value: "graduated", label: "이미 졸업했어요" },
];

/* ── Q5 최종 학력 ── */
export const DEGREE_OPTIONS: NonNullable<SelfCheckAnswers["degree"]>[] = [
  "전문학사",
  "학사",
  "석사",
  "박사",
];

/* ── Q6 한국어 능력 ── */
export const TOPIK_LEVELS = [1, 2, 3, 4, 5, 6] as const;
export const KIIP_STAGES = [0, 1, 2, 3, 4, 5] as const;

/* ── Q7 그 밖의 언어 ── */
export const LANGUAGE_OPTIONS = [
  "베트남어",
  "영어",
  "중국어",
  "일본어",
  "몽골어",
  "우즈베크어",
];

export const LANGUAGE_LEVEL_OPTIONS: {
  value: LanguageLevel;
  label: string;
}[] = [
  { value: "native", label: "원어민 수준" },
  { value: "business", label: "업무 가능" },
  { value: "daily", label: "일상 대화" },
];

/* ── Q8 일 경험 ── */
export const EMPLOYMENT_OPTIONS = [
  "정규직",
  "계약직",
  "인턴",
  "아르바이트",
  "학교 프로젝트",
] as const;

/* ── Q10 한국어 업무 행동 ── */
export type Behavior = { id: string; label: string };

export const BEHAVIORS: Behavior[] = [
  { id: "phone", label: "거래처 전화를 받고 내용을 전달하기" },
  { id: "meeting", label: "회의에서 진행 상황을 말하기" },
  { id: "messenger", label: "메신저로 동료와 소통하기" },
  { id: "report", label: "짧은 보고서 쓰기" },
  { id: "customer", label: "고객 응대하기" },
];

export const BEHAVIOR_LEVELS: { value: BehaviorLevel; label: string }[] = [
  { value: 1, label: "어려워요" },
  { value: 2, label: "도움이 있으면 가능" },
  { value: 3, label: "혼자 가능" },
  { value: 4, label: "익숙해요" },
  { value: 5, label: "매우 익숙해요" },
];

/* ── STEP 4 원하는 일 ── */
export const JOB_FAMILY_OPTIONS = [
  { value: "trade", label: "해외영업·무역" },
  { value: "purchasing", label: "구매·자재" },
  { value: "production", label: "생산관리" },
  { value: "support", label: "경영지원" },
  { value: "etc", label: "그 밖" },
];

export const REGION_OPTIONS = [
  { value: "서울", label: "서울" },
  { value: "경기", label: "경기" },
  { value: "인천", label: "인천" },
  { value: "충남", label: "충남" },
  { value: "any", label: "상관없어요" },
];

export const SALARY_RANGE = { min: 2600, max: 4500, step: 100 } as const;

export const EMPLOYMENT_TYPE_OPTIONS = ["정규직", "계약직", "인턴"] as const;

/* ── 단계별 필수 항목 검사 ── */
export function isStepComplete(step: Step["id"], a: SelfCheckAnswers): boolean {
  switch (step) {
    case 1:
      // 졸업(예정)일은 "재학 중"이 아닐 때만 필수
      return Boolean(
        a.visa &&
        a.academicStatus &&
        a.visaExpiresOn &&
        (a.academicStatus === "enrolled" || a.graduationOn),
      );
    case 2:
      return Boolean(a.degree && a.major && a.koreanExam);
    case 3:
      return BEHAVIORS.every((b) => a.behaviors[b.id] !== undefined);
    case 4:
      return a.jobFamilies.length > 0;
  }
}

/** 한국어 시험 답을 화면에 쓸 한 줄로 만든다 */
export function koreanExamLabel(exam: SelfCheckAnswers["koreanExam"]): string {
  if (!exam) return "";
  switch (exam.kind) {
    case "topik":
      return `TOPIK ${exam.level}급`;
    case "kiip":
      return `사회통합프로그램 ${exam.stage}단계`;
    case "conversational":
      return "시험 없음 · 일상 대화 가능";
    case "none":
      return "아직 없음";
  }
}
