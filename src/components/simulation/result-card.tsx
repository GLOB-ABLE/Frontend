/**
 * 9. 종합 피드백
 *
 * 원본의 `92/100` 점수를 4상태와 개수로 바꿨다 (docs/simulation.md 2.1).
 * 점수는 왜 92인지 설명할 수 없다. 무엇을 해냈고 무엇이 남았는지만 적는다 (PR-2).
 */

import Link from "next/link";

import { StatusBadge } from "@/components/ds/status-badge";
import type { MissionOutcome } from "@/lib/simulation/hand-judge";
import { buildResultRows, RESULT } from "@/lib/simulation/scenario";
import { doneLabel, retryRows } from "@/lib/simulation/types";
import { cn } from "@/lib/utils";

export function ResultCard({
  speechOutcome,
  handOutcome,
  onRetry,
}: {
  speechOutcome: MissionOutcome;
  handOutcome: MissionOutcome;
  onRetry: () => void;
}) {
  const rows = buildResultRows(speechOutcome, handOutcome);
  const remaining = retryRows(rows);

  return (
    <section className="border-ds-line bg-ds-surface rounded-2xl border p-6 shadow-[0_2px_12px_rgba(31,58,143,0.07)] sm:p-10">
      <div className="text-center">
        <span className="bg-ds-tint text-ds-navy inline-block rounded-[99px] px-3 py-2 text-[12px] font-extrabold">
          {RESULT.tag}
        </span>

        <h1 className="text-ds-navy mt-4 text-2xl font-extrabold tracking-[-0.8px] sm:text-[28px]">
          {RESULT.title}
        </h1>

        {/* 점수 자리 — 개수로 말한다 */}
        <p className="text-ds-primary mt-4 text-[30px] font-extrabold tracking-[-1px] sm:text-[34px]">
          {doneLabel(rows)}
        </p>
        <p className="text-ds-muted mx-auto mt-2 max-w-[520px] text-[13.5px] leading-relaxed">
          {RESULT.description}
        </p>
      </div>

      <ul className="mt-7 grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className={cn(
              "rounded-xl border p-4",
              row.status === "met"
                ? "border-met-border bg-met-surface"
                : row.status === "unmet"
                  ? "border-unmet-border bg-unmet-surface"
                  : "border-check-border bg-check-surface",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <b className="text-ds-ink text-[14.5px] font-extrabold">
                {row.label}
              </b>
              <StatusBadge status={row.status} size="sm" />
            </div>
            <p className="text-ds-body mt-2 text-[13px] leading-relaxed">
              {row.detail}
            </p>
          </li>
        ))}
      </ul>

      {remaining.length > 0 && (
        <div className="bg-ds-tint mt-4 rounded-[13px] border border-[#BFE0F7] px-5 py-4">
          <p className="text-ds-navy text-[13.5px] font-bold">
            다시 연습할 것 {remaining.length}개
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {remaining.map((row) => (
              <li
                key={row.id}
                className="bg-ds-surface border-ds-line text-ds-ink rounded-[7px] border px-2.5 py-1.5 text-[12.5px] font-bold"
              >
                {row.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-ds-muted border-ds-divider mt-5 border-t pt-4 text-[12.5px] leading-relaxed">
        {RESULT.disclaimer}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="border-ds-line-strong text-ds-body hover:bg-ds-tint cursor-pointer rounded-[11px] border px-5 py-3 text-[14px] font-bold transition-colors"
        >
          {RESULT.retry}
        </button>
        <Link
          href="/growth"
          className="bg-ds-primary hover:bg-ds-navy rounded-[11px] px-5 py-3 text-[14px] font-bold text-white transition-colors"
        >
          {RESULT.save}
        </Link>
      </div>
    </section>
  );
}
