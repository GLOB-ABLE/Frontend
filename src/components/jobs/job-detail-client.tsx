/**
 * 공고 상세 — PRD MVP-03 (공고 해석 · 4상태 갭 분석) / MVP-04 (장애요인)
 *
 * 화면 규칙은 docs/design-system.md를 따른다.
 * - 확률·매칭률·순위·별점을 쓰지 않는다 (금지 패턴 1·5)
 * - 모든 판정에 근거를 붙인다
 * - 게이트 배너와 면책 푸터를 항상 넣는다
 */

import { notFound } from "next/navigation";

import { DisclaimerFooter } from "@/components/ds/disclaimer-footer";
import { GateBanner } from "@/components/ds/gate-banner";
import { DetailHeader } from "@/components/jobs/detail/detail-header";
import { PostingSource } from "@/components/jobs/detail/posting-source";
import { RequirementDisclosure } from "@/components/jobs/detail/requirement-disclosure";
import { SimilarJobs } from "@/components/jobs/detail/similar-jobs";
import { SupportSidebar } from "@/components/jobs/detail/support-sidebar";
import { VerdictSummary } from "@/components/jobs/detail/verdict-summary";
import { getJobDetail } from "@/lib/feed/detail-mock";
import { EFFECTIVE_DATE, GATE, RULE_VERSION } from "@/lib/feed/mock";

export function JobDetailClient({ id }: { id: string }) {
  const job = getJobDetail(id);
  if (!job) notFound();

  /** 이 공고에서 아직 확인되지 않은 항목 수 — 게이트 배너 문구에 쓴다 */
  const openCount = job.gap.check + job.gap.unmet;

  return (
    <div className="bg-ds-page min-h-full">
      <DetailHeader job={job} effectiveDate={EFFECTIVE_DATE} />

      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        {/* E · 게이트 상태 배너 */}
        <GateBanner
          state={openCount > 0 ? "VG-B" : "VG-A"}
          title={
            openCount > 0
              ? `이 공고에서 확인이 필요한 항목이 ${openCount}개 있습니다`
              : "이 공고의 모든 요건이 확인됐습니다"
          }
          description={`지원은 지금도 할 수 있어요. ${GATE.state} · 만료 ${GATE.expiresAt}`}
          actionLabel={
            openCount > 0 ? `${openCount}개 확인하기` : "지원 준비하기"
          }
        />

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1fr_320px]">
          <div className="flex min-w-0 flex-col gap-4">
            <VerdictSummary
              gap={job.gap}
              recommendReasons={job.recommendReasons}
              readinessNotes={job.readinessNotes}
            />

            {/* 기본은 접힘. 누르면 요건 표와 강점·채워야 할 것이 함께 열린다. */}
            {job.requirements.length > 0 && (
              <RequirementDisclosure
                requirements={job.requirements}
                gap={job.gap}
                strengths={job.strengths}
                toFill={job.toFill}
              />
            )}

            <PostingSource source={job.source} />

            <SimilarJobs jobs={job.similar} />

            {/* F · 면책·출처 푸터 */}
            <DisclaimerFooter
              ruleVersion={RULE_VERSION}
              effectiveDate={EFFECTIVE_DATE}
            />
          </div>

          <div className="lg:sticky lg:top-5">
            <SupportSidebar sites={job.supportSites} />
          </div>
        </div>
      </div>
    </div>
  );
}
