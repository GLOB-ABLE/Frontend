/**
 * 비슷한 공고 — 매칭률 % 바 대신 요건 상태 요약 바를 쓴다 (디자인 시스템 B).
 */

import Link from "next/link";

import { RequirementBar } from "@/components/ds/requirement-bar";
import type { SimilarJob } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

export function SimilarJobs({ jobs }: { jobs: SimilarJob[] }) {
  if (jobs.length === 0) return null;

  return (
    <section>
      <h2 className="text-ds-navy mb-3.5 text-lg font-extrabold">
        비슷한 공고 {jobs.length}개
      </h2>
      <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link
              href={`/jobs/${job.id}`}
              className="border-ds-line bg-ds-surface hover:border-ds-line-strong block h-full rounded-[14px] border p-[18px] transition-colors"
            >
              <span
                aria-hidden
                className={cn(
                  "mb-3 flex size-10 items-center justify-center rounded-xl text-sm font-extrabold text-white",
                  job.logoTone === "navy" ? "bg-ds-navy" : "bg-ds-sub",
                )}
              >
                {job.logoText}
              </span>
              <p className="text-ds-ink text-[15px] font-extrabold">
                {job.title}
              </p>
              <p className="text-ds-body mt-1 text-[13px]">{job.company}</p>
              <p className="text-ds-muted mt-2 text-[12.5px]">
                {job.metaLabel}
              </p>
              <RequirementBar gap={job.gap} className="mt-3" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
