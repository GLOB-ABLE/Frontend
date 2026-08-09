/**
 * 로그인 후 홈 — 유학생(D-10) 대시보드
 *
 * 두 가지만 답한다.
 *   1. 지금 지원할 만한 공고와, 그 공고에 무엇을 준비해야 하는지
 *   2. 남은 요건을 채우는 데 쓸 수 있는 취업지원 프로그램
 *
 * 화면 규칙은 docs/design-system.md를 따른다.
 * - 게이트 배너(E)를 항상 상단에 놓는다
 * - 확률·매칭률·점수·순위는 어떤 형태로도 쓰지 않는다 (PR-2)
 * - 면책·출처 푸터(F)를 하단에 반복한다 (PR-5)
 */

import { DisclaimerFooter } from "@/components/ds/disclaimer-footer";
import { GateBanner } from "@/components/ds/gate-banner";
import { HomeProgramsSection } from "@/components/home/home-programs-section";
import { MatchedJobsSection } from "@/components/home/matched-jobs-section";
import { EFFECTIVE_DATE, GATE, RULE_VERSION } from "@/lib/feed/mock";
import {
  getHomeJobStrategies,
  getHomePrograms,
  HOME_USER,
  openRequirementCount,
} from "@/lib/home/select";

/** 인사 아래 한 줄 — 남은 것을 개수로만 말한다 */
function summaryLine(open: { check: number; unmet: number }): string {
  const parts: string[] = [];
  if (open.check > 0) parts.push(`확인 필요 ${open.check}개`);
  if (open.unmet > 0) parts.push(`미충족 ${open.unmet}개`);

  if (parts.length === 0) {
    return "고른 공고에 남은 요건이 없어요. 바로 지원할 수 있습니다.";
  }
  return `고른 공고 3건에 ${parts.join(" · ")}가 남았어요. 하나씩 채워 볼까요?`;
}

export function StudentHome() {
  const strategies = getHomeJobStrategies();
  const programs = getHomePrograms();
  const open = openRequirementCount(strategies);

  return (
    <div className="bg-ds-page min-h-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {/* E · 게이트 상태 배너 — 항상 상단 */}
        <GateBanner
          state={GATE.state}
          title={GATE.title}
          description={GATE.description}
          meta={`기준일 ${EFFECTIVE_DATE}`}
          actionLabel="체류 정보 보기"
        />

        <header>
          <p className="text-ds-primary text-[13px] font-extrabold">
            {HOME_USER.status}
          </p>
          <h1 className="text-ds-navy mt-2 text-2xl font-extrabold tracking-[-0.9px] sm:text-[30px]">
            {HOME_USER.name}님, 오늘은 여기까지 왔어요
          </h1>
          <p className="text-ds-body mt-2.5 text-[14.5px] leading-relaxed">
            {summaryLine(open)}
          </p>
        </header>

        <MatchedJobsSection strategies={strategies} />
        <HomeProgramsSection programs={programs} />

        {/* F · 면책·출처 푸터 */}
        <DisclaimerFooter
          ruleVersion={RULE_VERSION}
          effectiveDate={EFFECTIVE_DATE}
        />
      </div>
    </div>
  );
}
