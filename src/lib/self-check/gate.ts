/**
 * 체류자격 게이트 판정 — PRD 6장 · MVP-00
 *
 * ⚠️ 시스템은 체류자격을 판정하지 않는다. 사용자가 신고한 정보와 증빙을 근거로
 *    4개 상태 중 하나로 **분류**할 뿐이다. 발급 가능·불가를 단정하지 않는다 (PR-2).
 *
 * 차단은 화면 숨김이 아니라 서버에서 강제해야 한다. 이 함수는 화면 표시용이며,
 * 실제 API가 붙으면 동일한 규칙을 Supabase RLS와 API 검사에도 넣어야 한다.
 */

import type {
  GateResult,
  PendingProof,
  SelfCheckAnswers,
} from "@/lib/self-check/types";

/** 만료가 이 일수 안으로 남으면 확인 필요로 본다 */
const EXPIRY_WARNING_DAYS = 90;

const ALL_FEATURES = {
  selfCheck: "내 조건 진단",
  profile: "프로필·증빙 정리",
  browse: "맞춤 공고 보기",
  apply: "공고 지원",
  mission: "실무미션",
  residence: "체류정보 사전점검",
  program: "대학 프로그램 연결",
} as const;

function daysUntil(dateStr: string, today: Date): number | null {
  if (!dateStr) return null;
  const target = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const base = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
  return Math.round((target.getTime() - base) / 86_400_000);
}

/**
 * STEP 1 응답으로 게이트 상태를 분류한다.
 *
 * 판정 순서 (앞에서 걸리면 뒤는 보지 않는다)
 *   1. 필수 입력이 비어 있으면            → VG-D
 *   2. 체류 만료가 지났거나 3개월 이내면    → VG-D
 *   3. D-10 · E-7 · F 계열                → VG-A
 *   4. D-2 + 재학                        → VG-C
 *   5. D-2 + 졸업(예정)                   → VG-B
 *   6. 그 밖                             → VG-D
 */
export function evaluateGate(
  answers: SelfCheckAnswers,
  now: Date = new Date(),
): GateResult {
  const { visa, academicStatus, visaExpiresOn } = answers;

  // 1. 필수 입력 누락
  if (!visa || !academicStatus || !visaExpiresOn) {
    return {
      state: "VG-D",
      title: "아직 확인하지 못한 정보가 있어요",
      description: "체류자격과 만료일을 알려주시면 상태를 확인해 드려요.",
      reasons: [
        !visa ? "체류자격을 고르지 않았습니다." : null,
        !academicStatus ? "학적 상태를 고르지 않았습니다." : null,
        !visaExpiresOn ? "체류 만료일을 적지 않았습니다." : null,
      ].filter((r): r is string => r !== null),
      allowed: [ALL_FEATURES.selfCheck, ALL_FEATURES.residence],
      blocked: [ALL_FEATURES.browse, ALL_FEATURES.apply],
      canBrowseJobs: false,
      canApply: false,
    };
  }

  // 2. 체류 만료 임박·경과
  const remaining = daysUntil(visaExpiresOn, now);
  if (remaining !== null && remaining < EXPIRY_WARNING_DAYS) {
    const passed = remaining < 0;
    return {
      state: "VG-D",
      title: passed
        ? "체류 만료일이 지났어요"
        : `체류 만료가 ${remaining}일 남았어요`,
      description: passed
        ? "연장이나 전환을 먼저 확인해 주세요. 그동안 공고는 열리지 않아요."
        : "연장이나 전환을 먼저 확인해 주세요. 지원은 잠시 멈춰둘게요.",
      reasons: [
        `적어주신 만료일은 ${visaExpiresOn}입니다.`,
        passed
          ? "만료일이 지나 지원 기능을 열지 않습니다."
          : `만료까지 ${EXPIRY_WARNING_DAYS}일이 남지 않아 지원 기능을 열지 않습니다.`,
      ],
      allowed: [
        ALL_FEATURES.selfCheck,
        ALL_FEATURES.residence,
        ALL_FEATURES.program,
      ],
      blocked: [ALL_FEATURES.browse, ALL_FEATURES.apply, ALL_FEATURES.mission],
      canBrowseJobs: false,
      canApply: false,
    };
  }

  const expiryLabel = visaExpiresOn.replace(/-/g, ".");

  // 3. 취업활동 가능 자격
  if (visa === "D-10" || visa === "E-7" || visa === "F") {
    return {
      state: "VG-A",
      title: `이용 가능 · ${visa} · 만료 ${expiryLabel}`,
      description: "확인이 필요한 항목이 없습니다. 모든 기능을 쓸 수 있어요.",
      reasons: [
        `${visa}는 취업활동을 할 수 있는 체류자격입니다.`,
        `만료일까지 ${remaining ?? "-"}일 남았습니다.`,
      ],
      allowed: Object.values(ALL_FEATURES),
      blocked: [],
      canBrowseJobs: true,
      canApply: true,
    };
  }

  // 4. D-2 재학 — 취업활동 불가
  if (visa === "D-2" && academicStatus === "enrolled") {
    return {
      state: "VG-C",
      title: "지금은 지원을 열 수 없어요",
      description:
        "졸업이 가까워지면 다시 열립니다. 그동안 할 수 있는 준비를 알려드릴게요.",
      reasons: [
        "D-2(유학)는 취업활동을 할 수 있는 체류자격이 아닙니다.",
        "재학 중이라고 답하셨습니다.",
        "자격이 없는 상태에서는 공고를 추천하지 않습니다.",
      ],
      allowed: [
        ALL_FEATURES.selfCheck,
        ALL_FEATURES.profile,
        ALL_FEATURES.mission,
        ALL_FEATURES.residence,
        ALL_FEATURES.program,
      ],
      blocked: [ALL_FEATURES.browse, ALL_FEATURES.apply],
      canBrowseJobs: false,
      canApply: false,
    };
  }

  // 5. D-2 졸업(예정) — 전환 준비 중
  if (visa === "D-2") {
    return {
      state: "VG-B",
      title: "공고는 볼 수 있어요 · 지원은 아직이에요",
      description:
        "D-10으로 바꾸면 지원이 열립니다. 지금은 조건을 맞춰두는 시간이에요.",
      reasons: [
        "D-2(유학)는 취업활동을 할 수 있는 체류자격이 아닙니다.",
        academicStatus === "graduating"
          ? "곧 졸업한다고 답하셨습니다."
          : "이미 졸업했다고 답하셨습니다.",
        "D-10으로 바꾸면 지원 기능이 열립니다.",
      ],
      allowed: [
        ALL_FEATURES.selfCheck,
        ALL_FEATURES.profile,
        ALL_FEATURES.browse,
        ALL_FEATURES.mission,
        ALL_FEATURES.residence,
        ALL_FEATURES.program,
      ],
      blocked: [ALL_FEATURES.apply],
      canBrowseJobs: true,
      canApply: false,
    };
  }

  // 6. 알 수 없음
  return {
    state: "VG-D",
    title: "체류자격을 확인하지 못했어요",
    description: "외국인등록증을 올리면 상태를 확인해 드려요.",
    reasons: [
      "고르신 체류자격으로는 취업활동 가능 여부를 판단할 수 없습니다.",
      "전문가 검토로 넘기면 정확히 확인할 수 있습니다.",
    ],
    allowed: [ALL_FEATURES.selfCheck, ALL_FEATURES.residence],
    blocked: [ALL_FEATURES.browse, ALL_FEATURES.apply],
    canBrowseJobs: false,
    canApply: false,
  };
}

/**
 * 증빙이 없어 "확인 필요"로 남는 항목을 모은다.
 *
 * 자기 기입값이 있어도 증빙이 없으면 충족으로 바꾸지 않는다 (PR-1).
 */
export function collectPendingProofs(
  answers: SelfCheckAnswers,
): PendingProof[] {
  const pending: PendingProof[] = [];

  if (!answers.residenceCardName) {
    pending.push({
      id: "residence-card",
      label: "외국인등록증",
      reason: "사본이 올라오지 않았습니다.",
      effect: "올리면 체류 정보가 확인됨으로 바뀝니다.",
    });
  }

  if (answers.degree && !answers.diplomaName) {
    pending.push({
      id: "diploma",
      label: "졸업(예정)증명서",
      reason: `${answers.degree} 학위를 적으셨지만 증명서가 없습니다.`,
      effect: "올리면 학력 요건이 충족으로 바뀝니다.",
    });
  }

  const exam = answers.koreanExam;
  const hasKoreanScore =
    exam?.kind === "topik" || exam?.kind === "kiip" ? true : false;
  if (hasKoreanScore && !answers.koreanProofName) {
    pending.push({
      id: "korean-score",
      label: "한국어 성적표",
      reason: "성적을 적으셨지만 성적표가 없습니다.",
      effect: "올리면 한국어 요건이 충족으로 바뀝니다.",
    });
  }

  for (const lang of answers.languages) {
    if (!lang.proofName) {
      pending.push({
        id: `language-${lang.language}`,
        label: `${lang.language} 증빙`,
        reason: "수준을 적으셨지만 증빙이 없습니다.",
        effect: "올리면 업무언어 요건이 충족으로 바뀝니다.",
      });
    }
  }

  for (const exp of answers.experiences) {
    if (!exp.proofName) {
      pending.push({
        id: `experience-${exp.id}`,
        label: `${exp.org || "경력"} 증명서`,
        reason: "경험을 적으셨지만 증명서가 없습니다.",
        effect: "올리면 경력 요건이 충족으로 바뀝니다.",
      });
    }
  }

  for (const cert of answers.certificates) {
    if (!cert.proofName) {
      pending.push({
        id: `certificate-${cert.id}`,
        label: `${cert.name || "자격증"} 사본`,
        reason: "자격증을 적으셨지만 사본이 없습니다.",
        effect: "올리면 자격 요건이 충족으로 바뀝니다.",
      });
    }
  }

  return pending;
}
