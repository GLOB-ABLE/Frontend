"use client";

/**
 * 공고 피드 카드 — 디자인 시스템 4.3 (공고 카드 적용 예)
 *
 * 매칭률·게이지·순위는 쓰지 않는다. 요건은 항상 개수로 말한다 (PR-2).
 */

import Link from "next/link";

import { EvidenceChipRow } from "@/components/ds/evidence-chip";
import { ReadinessTag } from "@/components/ds/readiness-tag";
import { RequirementBar } from "@/components/ds/requirement-bar";
import { totalRequirements, type JobPosting } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  return `마감 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function JobFeedCard({
  job,
  /** 목록 첫 카드는 주요 액션(파란 버튼)으로 강조한다 */
  primary = false,
}: {
  job: JobPosting;
  primary?: boolean;
}) {
  const total = totalRequirements(job.gap);
  const checkHeavy = job.gap.check / Math.max(total, 1) > 0.5;

  return (
    <article
      className={cn(
        "bg-ds-surface rounded-2xl border p-5 transition-shadow sm:p-[22px]",
        checkHeavy
          ? "border-check-border"
          : primary
            ? "border-ds-line-strong hover:border-ds-primary shadow-[0_2px_10px_rgba(31,58,143,0.06)] hover:shadow-[0_6px_20px_rgba(31,119,255,0.14)]"
            : "border-ds-line hover:border-ds-line-strong",
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-[18px]">
        {/* 로고 + 본문 */}
        <div className="flex min-w-0 flex-1 gap-4">
          <span
            aria-hidden
            className={cn(
              "flex size-13 shrink-0 items-center justify-center rounded-[13px] text-base font-extrabold text-white",
              job.logoTone === "navy" ? "bg-ds-navy" : "bg-ds-sub",
            )}
          >
            {job.logoText}
          </span>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <ReadinessTag readiness={job.readiness} />
              <span className="text-ds-muted rounded-md bg-[#F1F5F9] px-2.5 py-1 text-[11.5px] font-bold">
                {formatDeadline(job.deadline)}
              </span>
            </div>

            <h3 className="text-ds-ink text-lg font-extrabold tracking-[-0.3px]">
              {job.title}
            </h3>
            <p className="text-ds-body mt-1 text-sm font-semibold">
              {job.company} · {job.headcount}명
            </p>
            <p className="text-ds-muted mt-2 text-[13px]">
              {job.location} · {job.salaryLabel} · {job.employmentType}
            </p>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {job.workTags.map((tag) => (
                <li
                  key={tag}
                  className="border-ds-line text-ds-navy rounded-[7px] border bg-[#F1F7FF] px-2.5 py-[5px] text-xs font-semibold"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 판정 요약 */}
        <div className="border-ds-divider shrink-0 border-t pt-4 lg:w-[230px] lg:border-t-0 lg:pt-0">
          <RequirementBar gap={job.gap} emphasizeChecks={checkHeavy} />

          {job.actionHint && (
            <p className="border-check-border bg-check-surface mt-[11px] rounded-[9px] border px-3 py-2.5 text-[12.5px] leading-relaxed font-semibold text-[#7A5600]">
              {job.actionHint}
            </p>
          )}

          <EvidenceChipRow chips={job.evidence} className="mt-3" />

          <Link
            href={`/jobs/${job.id}`}
            className={cn(
              "mt-3 block rounded-[10px] py-[11px] text-center text-[13.5px] font-bold transition-colors",
              primary
                ? "bg-ds-primary hover:bg-ds-navy text-white"
                : "border-ds-line-strong text-ds-primary hover:bg-ds-tint border",
            )}
          >
            상세 보기
          </Link>
        </div>
      </div>

      {/* 추천 근거 — 판정이 아니라 사실만 적는다 */}
      <div
        className={cn(
          "mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t pt-3.5",
          checkHeavy ? "border-check-border" : "border-ds-divider",
        )}
      >
        {job.matchReasons.map((reason) => (
          <span key={reason} className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="bg-ds-sub size-[5px] shrink-0 rounded-full"
            />
            <span className="text-ds-body text-[13.5px]">{reason}</span>
          </span>
        ))}
      </div>
    </article>
  );
}
