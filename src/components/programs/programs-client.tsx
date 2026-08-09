"use client";

/**
 * 추천 프로그램 — PRD MVP-10 (부족 역량 기반 프로그램 배정)
 *
 * 공고 상세에서 확인 필요·미충족으로 남은 요건을 채우는 순서로 보여준다.
 * 프로그램에 매칭도 %를 붙이지 않는다 (PR-2).
 */

import { useMemo, useState } from "react";

import { DisclaimerFooter } from "@/components/ds/disclaimer-footer";
import { StatusBadge } from "@/components/ds/status-badge";
import { ProgramCard } from "@/components/programs/program-card";
import { EFFECTIVE_DATE, RULE_VERSION } from "@/lib/feed/mock";
import { LEARNER_NAME, NEEDS, PROGRAMS } from "@/lib/programs/mock";
import {
  intakeOrder,
  isFree,
  PROGRAM_SORTS,
  type ProgramSort,
} from "@/lib/programs/types";
import { cn } from "@/lib/utils";

export function ProgramsClient() {
  const [sort, setSort] = useState<ProgramSort>("recommended");

  const visible = useMemo(() => {
    if (sort === "freeOnly") {
      return PROGRAMS.filter((p) => isFree(p.cost));
    }
    if (sort === "deadline") {
      return [...PROGRAMS].sort(
        (a, b) => intakeOrder(a.intake) - intakeOrder(b.intake),
      );
    }
    // 추천순 — 요건을 해결하는 프로그램이 먼저, 그 안에서 featured가 위로
    return [...PROGRAMS].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.targets.length - a.targets.length;
    });
  }, [sort]);

  return (
    <div className="bg-ds-page min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-ds-navy text-2xl font-extrabold tracking-[-0.8px] sm:text-[26px]">
              추천 프로그램
            </h1>
            <p className="text-ds-muted mt-1.5 text-sm">
              부족한 요건을 채우는 데 도움이 되는 순서예요
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PROGRAM_SORTS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSort(option.key)}
                aria-pressed={sort === option.key}
                className={cn(
                  "cursor-pointer rounded-[9px] px-4 py-2.5 text-[13px] transition-colors",
                  sort === option.key
                    ? "bg-ds-primary font-bold text-white"
                    : "border-ds-line bg-ds-surface text-ds-muted hover:border-ds-line-strong border font-semibold",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </header>

        {/* 선정 기준 — 무엇을 근거로 골랐는지 항상 밝힌다 (PR-1) */}
        <section className="bg-ds-tint mb-4.5 flex flex-col gap-3 rounded-[14px] border border-[#BFE0F7] px-5 py-4 lg:flex-row lg:items-center lg:gap-3.5">
          <h2 className="text-ds-navy shrink-0 text-[14.5px] font-bold">
            {LEARNER_NAME}님께 필요한 것
          </h2>

          <ul className="flex flex-wrap gap-1.5">
            {NEEDS.map((need) => (
              <li
                key={need.requirementId}
                className="flex items-center gap-1.5"
              >
                <span className="bg-ds-surface border-ds-line text-ds-ink rounded-[7px] border px-2.5 py-1.5 text-[12.5px] font-bold">
                  {need.label}
                </span>
                <StatusBadge status={need.currentStatus} size="sm" />
              </li>
            ))}
          </ul>

          <p className="text-ds-body text-[13px] lg:ml-auto">
            이 {NEEDS.length}가지를 기준으로 골랐어요
          </p>
        </section>

        <div className="flex flex-col gap-3">
          {visible.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>

        {visible.length === 0 && (
          <div className="border-ds-line bg-ds-surface rounded-2xl border py-16 text-center">
            <p className="text-ds-ink text-[15px] font-bold">
              조건에 맞는 프로그램이 없어요
            </p>
            <p className="text-ds-muted mt-1.5 text-sm">
              정렬을 바꾸면 더 많은 프로그램을 볼 수 있습니다.
            </p>
          </div>
        )}

        <DisclaimerFooter
          ruleVersion={RULE_VERSION}
          effectiveDate={EFFECTIVE_DATE}
          className="mt-4"
        />
      </div>
    </div>
  );
}
