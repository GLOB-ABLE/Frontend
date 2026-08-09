/**
 * 로그인 후 홈 데이터 선택 — PRD MVP-03 / MVP-10
 *
 * 홈 전용 시드를 새로 만들지 않는다. 공고 피드(lib/feed)와 프로그램(lib/programs)의
 * 같은 데이터를 그대로 쓰고, 여기서는 "무엇을 먼저 보여줄지"만 고른다.
 * 홈 → 목록 → 상세로 넘어갈 때 판정이 달라지지 않게 하기 위함이다.
 *
 * 확률·점수·순위는 어떤 형태로도 만들지 않는다 (PR-2).
 */

import { getJobDetail } from "@/lib/feed/detail-mock";
import { JOB_POSTINGS } from "@/lib/feed/mock";
import type {
  GapSummary,
  HighlightItem,
  JobPostingDetail,
  RequirementRow,
} from "@/lib/feed/types";
import { LEARNER, PROGRAMS } from "@/lib/programs/mock";
import type { ProgramItem } from "@/lib/programs/types";

/** 홈에 올리는 개수 — 나머지는 목록 화면에서 본다 */
export const HOME_JOB_LIMIT = 3;
export const HOME_PROGRAM_LIMIT = 3;

/** 지금 로그인한 사용자 — 프로그램 목데이터의 페르소나를 그대로 쓴다 */
export const HOME_USER = {
  name: LEARNER.name,
  status: `${LEARNER.visa} · ${LEARNER.region} · ${LEARNER.graduation}`,
} as const;

/**
 * 홈의 공고별 지원 전략.
 * 값은 모두 공고 상세에서 가져온다. 홈에서 새로 판정하지 않는다.
 */
export type HomeJobStrategy = {
  job: JobPostingDetail;
  strengths: HighlightItem[];
  toFill: HighlightItem[];
  /** 지원 전 할 일 한 가지 — 남은 요건 중 첫 번째 행동 */
  nextStep: {
    /** 어떤 요건 때문에 생긴 일인지 */
    requirement: string;
    label: string;
    href?: string;
  } | null;
};

/**
 * 목록과 같은 정렬을 쓴다 — 확인 필요가 적은 순, 그다음 미충족이 적은 순.
 * 홈이라고 다른 순서를 쓰면 사용자가 두 화면을 다른 결과로 읽는다.
 */
function byFewestChecks(a: GapSummary, b: GapSummary): number {
  if (a.check !== b.check) return a.check - b.check;
  if (a.unmet !== b.unmet) return a.unmet - b.unmet;
  return b.met - a.met;
}

/** 남은 요건(확인 필요·미충족) 중 행동이 붙어 있는 첫 항목 */
function firstOpenAction(requirements: RequirementRow[]) {
  const open = requirements.find(
    (row) =>
      (row.status === "check" || row.status === "unmet") && row.action != null,
  );
  if (!open?.action) return null;
  return {
    requirement: open.label,
    label: open.action.label,
    href: open.action.href,
  };
}

/**
 * 홈에 올릴 공고와 그 전략.
 * 상세 시드가 없는 공고는 강점·보완 항목을 지어내지 않고 그대로 비워 둔다.
 */
export function getHomeJobStrategies(): HomeJobStrategy[] {
  return [...JOB_POSTINGS]
    .sort((a, b) => byFewestChecks(a.gap, b.gap))
    .slice(0, HOME_JOB_LIMIT)
    .map((posting) => getJobDetail(posting.id))
    .filter((detail): detail is JobPostingDetail => detail !== null)
    .map((job) => ({
      job,
      strengths: job.strengths,
      toFill: job.toFill,
      nextStep: firstOpenAction(job.requirements),
    }));
}

/**
 * 홈에 올릴 프로그램.
 *
 * 목록은 이미 추천 순서로 정렬돼 있다 (lib/programs/mock.ts).
 * 홈에서는 바로 신청할 수 있는 것만 올린다 — 확인이 필요한 것까지 첫 화면에
 * 올리면 무엇부터 해야 할지 흐려진다. 나머지는 목록 화면에서 본다.
 */
export function getHomePrograms(): ProgramItem[] {
  const ready = PROGRAMS.filter((item) => item.eligibility === "met");
  const list = ready.length >= HOME_PROGRAM_LIMIT ? ready : PROGRAMS;
  return list.slice(0, HOME_PROGRAM_LIMIT);
}

/** 홈에 올린 공고들에 남아 있는 요건 개수 — 인사 문구에 쓴다 */
export function openRequirementCount(strategies: HomeJobStrategy[]): {
  check: number;
  unmet: number;
} {
  return strategies.reduce(
    (acc, { job }) => ({
      check: acc.check + job.gap.check,
      unmet: acc.unmet + job.gap.unmet,
    }),
    { check: 0, unmet: 0 },
  );
}
