"use client";

/**
 * 공고 상세 헤더
 *
 * 마감일까지 남은 일수는 적용 기준일을 기준으로 계산한다.
 * 브라우저 현재 시각을 쓰면 서버/클라이언트 렌더 결과가 달라진다.
 */

import { Bookmark, ChevronRight } from "lucide-react";

import { useState } from "react";

import { ReadinessTag } from "@/components/ds/readiness-tag";
import type { JobPostingDetail } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

export function daysUntil(deadlineIso: string, baseDate: string): number {
  const base = new Date(baseDate.replace(/\./g, "-"));
  const end = new Date(deadlineIso);
  return Math.round((end.getTime() - base.getTime()) / 86_400_000);
}

export function DetailHeader({
  job,
  effectiveDate,
}: {
  job: JobPostingDetail;
  effectiveDate: string;
}) {
  const [saved, setSaved] = useState(false);
  const dday = daysUntil(job.deadline, effectiveDate);
  const deadlineLabel = job.deadline.replace(/-/g, ".");

  return (
    <header className="border-ds-line bg-ds-surface border-b">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-5 sm:px-6 lg:px-8">
        <nav
          aria-label="위치"
          className="text-ds-muted flex flex-wrap items-center gap-1 text-[13px]"
        >
          {job.breadcrumb.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight aria-hidden className="size-3.5 shrink-0" />
              )}
              <span
                className={cn(
                  i === job.breadcrumb.length - 1 && "text-ds-body",
                )}
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>

        <div className="flex flex-col gap-5 pt-3.5 pb-5 lg:flex-row lg:items-start lg:gap-5">
          <span
            aria-hidden
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold text-white sm:size-16 sm:text-[21px]",
              job.logoTone === "navy" ? "bg-ds-navy" : "bg-ds-sub",
            )}
          >
            {job.logoText}
          </span>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <ReadinessTag readiness={job.readiness} />
              <span
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-bold",
                  dday <= 7
                    ? "bg-unmet-bg text-unmet-text"
                    : "text-ds-muted bg-[#F1F5F9]",
                )}
              >
                마감 D-{dday}
              </span>
            </div>

            <h1 className="text-ds-ink text-2xl font-extrabold tracking-[-0.8px] sm:text-[28px]">
              {job.title}
            </h1>
            <p className="text-ds-body mt-1.5 text-[15.5px] font-semibold">
              {job.company}
              {job.companyNote && ` · ${job.companyNote}`}
            </p>

            <dl className="text-ds-muted mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[13.5px]">
              <div>
                <dt className="sr-only">근무지</dt>
                <dd>{job.location}</dd>
              </div>
              <div>
                <dt className="sr-only">급여</dt>
                <dd>{job.salaryLabel}</dd>
              </div>
              <div>
                <dt className="sr-only">고용 형태</dt>
                <dd>신입 · {job.employmentType}</dd>
              </div>
              <div>
                <dt className="sr-only">마감</dt>
                <dd>{deadlineLabel} 마감</dd>
              </div>
            </dl>
          </div>

          <div className="flex shrink-0 gap-2.5">
            <button
              type="button"
              aria-pressed={saved}
              aria-label={saved ? "저장 해제" : "저장"}
              onClick={() => setSaved((v) => !v)}
              className={cn(
                "flex size-[46px] cursor-pointer items-center justify-center rounded-[11px] border transition-colors",
                saved
                  ? "bg-ds-tint border-ds-primary text-ds-primary"
                  : "border-ds-line-strong text-ds-primary hover:bg-ds-tint",
              )}
            >
              <Bookmark
                className="size-5"
                fill={saved ? "currentColor" : "none"}
              />
            </button>
            <button
              type="button"
              className="bg-ds-primary hover:bg-ds-navy h-[46px] flex-1 cursor-pointer rounded-[11px] px-9 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(31,119,255,0.3)] transition-colors lg:flex-none"
            >
              지원하기
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
