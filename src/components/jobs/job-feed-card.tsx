"use client";

/**
 * 공고 피드 카드
 *
 * ⚠️ 이 카드만 매칭률(%)을 쓴다. 디자인 시스템 2장 금지 패턴 1번(확률·점수·게이지)에
 *    해당하지만 제품 결정으로 목록에서는 퍼센트로 말한다.
 *    상세 화면(/jobs/[id])은 그대로 4상태와 개수로 말한다.
 *
 * 카드 전체가 상세로 가는 링크다. 안에 다른 버튼이나 링크를 넣지 않는다.
 */

import Link from "next/link";

import { type JobPosting } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

export function JobFeedCard({
  job,
  /** 목록 첫 카드는 테두리를 조금 더 진하게 둔다 */
  primary = false,
}: {
  job: JobPosting;
  primary?: boolean;
}) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        "bg-ds-surface hover:border-ds-primary block rounded-2xl border p-5 transition-all hover:shadow-[0_6px_20px_rgba(31,119,255,0.14)] sm:p-[22px]",
        primary
          ? "border-ds-line-strong shadow-[0_2px_10px_rgba(31,58,143,0.06)]"
          : "border-ds-line",
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-[18px]">
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
            <h3 className="text-ds-ink text-lg font-extrabold tracking-[-0.3px]">
              {job.title}
            </h3>
            <p className="text-ds-muted mt-2 text-[13px]">{job.location}</p>
          </div>
        </div>

        {/* 매칭률 */}
        <div className="border-ds-divider shrink-0 border-t pt-4 text-center lg:w-[140px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-[18px]">
          <p className="text-ds-muted text-[12.5px] font-semibold">매칭률</p>
          <p className="text-ds-primary mt-1 text-[32px] leading-none font-extrabold tracking-[-1px]">
            {job.matchRate}
            <span className="ml-0.5 text-[18px]">%</span>
          </p>
        </div>
      </div>

      {/* 추천 근거 — 판정이 아니라 사실만 적는다 */}
      <div className="border-ds-divider mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t pt-3.5">
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
    </Link>
  );
}
