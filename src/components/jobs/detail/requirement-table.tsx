"use client";

/**
 * 요건별 판정 표 — 디자인 시스템 A(4상태 배지) + C(근거 칩)
 *
 * 배지를 누르면 판정 근거가 열린다.
 * 근거 없이 판정만 보여주지 않는다 (PR-1).
 */

import { ChevronDown } from "lucide-react";

import { useState } from "react";

import { EvidenceChipRow } from "@/components/ds/evidence-chip";
import { StatusBadge } from "@/components/ds/status-badge";
import { RequirementLegend } from "@/components/ds/requirement-bar";
import type { GapStatus, GapSummary, RequirementRow } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

const ROW_TONE: Record<GapStatus, string> = {
  met: "bg-met-surface",
  check: "bg-check-surface",
  unmet: "bg-unmet-surface",
  na: "bg-na-surface",
};

const BULLET_TONE: Record<GapStatus, string> = {
  met: "text-met-text",
  check: "text-check-text",
  unmet: "text-unmet-text",
  na: "text-na-text",
};

export function RequirementTable({
  requirements,
  gap,
}: {
  requirements: RequirementRow[];
  gap: GapSummary;
}) {
  /** 확인 필요·미충족 행은 처음부터 열어둔다. 할 일을 먼저 보여주기 위함이다. */
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      requirements.map((r) => [
        r.id,
        r.status === "check" || r.status === "unmet",
      ]),
    ),
  );

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section className="border-ds-line bg-ds-surface rounded-2xl border p-5 shadow-[0_1px_3px_rgba(31,58,143,0.05)] sm:p-6">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-ds-navy text-lg font-extrabold">요건별 상태</h2>
        <RequirementLegend gap={gap} />
      </div>
      <p className="text-ds-muted mb-5 text-[13.5px] leading-relaxed">
        내 데이터와 공고 요구를 나란히 놓고 비교했습니다. 행을 누르면 판정
        근거가 열립니다.
      </p>

      <div className="border-ds-divider overflow-hidden rounded-xl border">
        {/* 표 헤더 — 데스크톱만 */}
        <div className="text-ds-muted border-ds-divider hidden grid-cols-[130px_1fr_1fr_130px_28px] gap-3 border-b bg-[#F7FBFF] px-[18px] py-3 text-[12.5px] font-bold lg:grid">
          <span>요건</span>
          <span>공고 요구</span>
          <span>내 데이터</span>
          <span>상태</span>
          <span className="sr-only">펼치기</span>
        </div>

        <ul>
          {requirements.map((row, i) => {
            const isOpen = open[row.id];
            return (
              <li
                key={row.id}
                className={cn(
                  i < requirements.length - 1 && "border-ds-divider border-b",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(row.id)}
                  aria-expanded={isOpen}
                  className={cn(
                    "grid w-full cursor-pointer grid-cols-[1fr_28px] items-center gap-3 px-4 py-4 text-left text-sm sm:px-[18px] lg:grid-cols-[130px_1fr_1fr_130px_28px]",
                    ROW_TONE[row.status],
                  )}
                >
                  <span className="text-ds-navy col-start-1 font-bold lg:col-auto">
                    {row.label}
                  </span>

                  <span className="text-ds-muted col-start-1 text-[13px] lg:col-auto lg:text-sm">
                    <span className="lg:hidden">공고 요구 · </span>
                    {row.required}
                  </span>

                  <span className="text-ds-ink col-start-1 text-[13px] font-semibold lg:col-auto lg:text-sm">
                    <span className="text-ds-muted font-normal lg:hidden">
                      내 데이터 ·{" "}
                    </span>
                    {row.mine}
                    {row.mineNote && (
                      <span
                        className={cn(
                          "ml-1.5 font-medium",
                          BULLET_TONE[row.status],
                        )}
                      >
                        ({row.mineNote})
                      </span>
                    )}
                  </span>

                  <span className="col-start-1 lg:col-auto">
                    <StatusBadge status={row.status} size="sm" />
                  </span>

                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "col-start-2 row-start-1 size-4 shrink-0 transition-transform lg:col-auto lg:row-auto",
                      BULLET_TONE[row.status],
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="bg-ds-surface border-ds-divider border-t px-4 py-4 sm:px-[18px]">
                    <p className="text-ds-label mb-3 text-[12.5px] font-extrabold tracking-wide">
                      판정 근거
                    </p>
                    <ul className="mb-4 flex flex-col gap-2">
                      {row.reasons.map((reason) => (
                        <li
                          key={reason}
                          className="text-ds-ink flex gap-2.5 text-[13.5px]"
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "font-extrabold",
                              BULLET_TONE[row.status],
                            )}
                          >
                            ·
                          </span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-2">
                      <EvidenceChipRow chips={row.evidence} />
                      {row.action && (
                        <a
                          href={row.action.href ?? "#"}
                          className="bg-ds-primary hover:bg-ds-navy ml-auto rounded-[9px] px-4 py-2.5 text-[12.5px] font-bold text-white transition-colors"
                        >
                          {row.action.label}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
