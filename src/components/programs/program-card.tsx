"use client";

/**
 * 추천 프로그램 카드
 *
 * 시안의 "매칭도 96%" + 진행 바 자리를 요건 표현으로 바꿨다.
 * 어떤 요건이 어떤 상태에서 충족으로 바뀌는지를 보여준다 (PR-2).
 */

import { StatusBadge } from "@/components/ds/status-badge";
import {
  isFree,
  targetLabel,
  type Program,
  type ProgramCost,
  type ProgramIntake,
} from "@/lib/programs/types";
import { cn } from "@/lib/utils";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article
      className={cn(
        "bg-ds-surface rounded-2xl border p-5 transition-colors sm:p-[22px]",
        program.featured
          ? "border-ds-line-strong hover:border-ds-primary shadow-[0_2px_10px_rgba(31,58,143,0.06)]"
          : "border-ds-line hover:border-ds-line-strong",
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex min-w-0 flex-1 gap-4 sm:gap-5">
          <span
            aria-hidden
            className={cn(
              "flex size-16 shrink-0 items-center justify-center rounded-2xl text-[13px] font-extrabold text-white",
              program.logoTone === "navy" ? "bg-ds-navy" : "bg-ds-sub",
            )}
          >
            {program.logoText}
          </span>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {program.featured && (
                <span className="bg-ds-primary rounded-md px-2.5 py-1 text-[11.5px] font-bold text-white">
                  가장 추천
                </span>
              )}
              <CostBadge cost={program.cost} />
              <IntakeBadge intake={program.intake} />
            </div>

            <h3 className="text-ds-ink text-lg font-extrabold tracking-[-0.3px]">
              {program.title}
            </h3>
            <p className="text-ds-body mt-1 text-[13.5px] font-semibold">
              {program.provider}
            </p>
            <p className="text-ds-muted mt-2.5 text-[13px]">
              {program.formatLabel}
            </p>
            <p className="text-ds-ink mt-2.5 text-[13.5px] leading-relaxed">
              {program.reason}
            </p>
          </div>
        </div>

        {/* 매칭도 % 자리 — 해결되는 요건을 개수와 상태로 적는다 */}
        <div className="border-ds-divider flex shrink-0 flex-col justify-between gap-4 border-t pt-4 lg:w-[220px] lg:border-t-0 lg:pt-0">
          <div>
            <p className="text-ds-muted text-xs font-semibold lg:text-right">
              끝내면 바뀌는 것
            </p>

            {program.targets.length > 0 ? (
              <>
                <ul className="mt-2.5 flex flex-col gap-2">
                  {program.targets.map((target) => (
                    <li
                      key={target.requirementId}
                      className="flex flex-wrap items-center gap-1.5 lg:justify-end"
                    >
                      <span className="text-ds-ink text-[13px] font-bold">
                        {target.label}
                      </span>
                      <StatusBadge status={target.currentStatus} size="sm" />
                      <span aria-hidden className="text-ds-label text-xs">
                        →
                      </span>
                      <StatusBadge status="met" size="sm" />
                    </li>
                  ))}
                </ul>
                <p className="text-ds-muted mt-2.5 text-xs lg:text-right">
                  {targetLabel(program)} 해결
                </p>
              </>
            ) : (
              <p className="text-ds-body mt-2.5 text-[13px] lg:text-right">
                {program.supportNote}
              </p>
            )}
          </div>

          <a
            href={program.href ?? "#"}
            className={cn(
              "block rounded-[11px] py-3 text-center text-sm font-bold transition-colors",
              program.featured
                ? "bg-ds-primary hover:bg-ds-navy text-white shadow-[0_4px_14px_rgba(31,119,255,0.26)]"
                : "border-ds-line-strong text-ds-primary hover:bg-ds-tint border",
            )}
          >
            신청하기
          </a>
        </div>
      </div>
    </article>
  );
}

function CostBadge({ cost }: { cost: ProgramCost }) {
  if (cost.kind === "paid") {
    return (
      <span className="text-ds-muted rounded-md bg-[#F1F5F9] px-2.5 py-1 text-[11.5px] font-bold">
        {cost.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "rounded-md px-2.5 py-1 text-[11.5px] font-bold",
        "bg-met-bg text-met-text",
      )}
    >
      {cost.kind === "free" ? "무료" : cost.label}
    </span>
  );
}

function IntakeBadge({ intake }: { intake: ProgramIntake }) {
  if (intake.kind === "always") {
    return (
      <span className="text-ds-muted rounded-md bg-[#F1F5F9] px-2.5 py-1 text-[11.5px] font-bold">
        상시 모집
      </span>
    );
  }

  if (intake.kind === "exam") {
    return (
      <span className="bg-ds-tint text-ds-navy rounded-md px-2.5 py-1 text-[11.5px] font-bold">
        시험 {intake.date}
      </span>
    );
  }

  // 마감이 가까우면 눈에 띄게. 상태 색상이 아니라 마감 안내용이므로 배지와 구분한다.
  const urgent = intake.daysLeft <= 7;
  return (
    <span
      className={cn(
        "rounded-md px-2.5 py-1 text-[11.5px] font-bold",
        urgent ? "bg-unmet-bg text-unmet-text" : "text-ds-muted bg-[#F1F5F9]",
      )}
    >
      모집 D-{intake.daysLeft}
    </span>
  );
}

export { isFree };
