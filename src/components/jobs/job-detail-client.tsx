/**
 * 공고 상세 — PRD MVP-03 (공고 해석 · 4상태 갭 분석) / MVP-04 (장애요인)
 *
 * 왼쪽은 공고 내용, 오른쪽은 내 조건과 맞춰본 결과다.
 * 요건 표를 본문에 펼쳐두면 읽을 것이 너무 많아, 사이드바 요약 + 패널로 옮겼다.
 *
 * 화면 규칙은 docs/design-system.md를 따른다.
 * - 상세에서는 확률·매칭률을 쓰지 않는다. 4상태와 개수로만 말한다
 * - 모든 판정에 근거를 붙인다
 */

import { notFound } from "next/navigation";


import { DetailHeader } from "@/components/jobs/detail/detail-header";
import { PostingSource } from "@/components/jobs/detail/posting-source";
import { RequirementSidebar } from "@/components/jobs/detail/requirement-sidebar";
import { SimilarJobs } from "@/components/jobs/detail/similar-jobs";
import { getJobDetail } from "@/lib/feed/detail-mock";
import { EFFECTIVE_DATE } from "@/lib/feed/mock";

export function JobDetailClient({ id }: { id: string }) {
  const job = getJobDetail(id);
  if (!job) notFound();

  return (
    <div className="bg-ds-page min-h-full">
      <DetailHeader job={job} effectiveDate={EFFECTIVE_DATE} />

      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1fr_320px]">
          {/* 왼쪽 — 공고 내용부터 바로 */}
          <div className="flex min-w-0 flex-col gap-4">
            <PostingSource source={job.source} />

            {/* 이 공고를 추천하는 이유 — 판정이 아니라 사실만 적는다 */}
            {job.recommendReasons.length > 0 && (
              <section className="border-ds-line bg-ds-surface rounded-2xl border p-5 sm:p-6">
                <h2 className="text-ds-navy mb-3 text-lg font-extrabold">
                  이 공고를 추천하는 이유
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {job.recommendReasons.map((reason) => (
                    <li
                      key={reason}
                      className="text-ds-ink flex items-center gap-2.5 text-[14.5px]"
                    >
                      <span
                        aria-hidden
                        className="bg-ds-sub size-[5px] shrink-0 rounded-full"
                      />
                      {reason}
                    </li>
                  ))}
                </ul>

                {job.readinessNotes.length > 0 && (
                  <div className="bg-ds-tint mt-4 rounded-[13px] p-4">
                    <p className="text-ds-body text-[12.5px] font-semibold">
                      이 기업의 준비 상태
                    </p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {job.readinessNotes.map((note) => (
                        <li
                          key={note}
                          className="text-ds-navy flex gap-2 text-[12.5px] leading-relaxed font-semibold"
                        >
                          <span aria-hidden className="text-ds-primary">
                            ·
                          </span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            <SimilarJobs jobs={job.similar} />
          </div>

          {/* 오른쪽 — 요건은 여기서 확인한다 */}
          <div className="lg:sticky lg:top-5">
            {job.requirements.length > 0 && (
              <RequirementSidebar
                requirements={job.requirements}
                gap={job.gap}
                strengths={job.strengths}
                toFill={job.toFill}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
