/**
 * 홈 · 핵심 기능 2 — 지금 필요한 취업지원 프로그램
 *
 * 위 섹션에서 남은 요건(확인 필요·미충족)을 채우는 프로그램만 고른다.
 * 프로그램에 추천도 %를 붙이지 않는다. 어떤 요건이 어떻게 바뀌는지로 말한다 (PR-2).
 */

import { ArrowRight } from "lucide-react";

import Link from "next/link";

import { StatusBadge } from "@/components/ds/status-badge";
import { NEEDS } from "@/lib/programs/mock";
import type { Program, ProgramCost, ProgramIntake } from "@/lib/programs/types";
import { cn } from "@/lib/utils";

export function HomeProgramsSection({ programs }: { programs: Program[] }) {
  return (
    <section aria-labelledby="home-programs-heading">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="home-programs-heading"
            className="text-ds-navy text-xl font-extrabold tracking-[-0.5px]"
          >
            지금 필요한 역량강화 프로그램
          </h2>
          <p className="text-ds-muted mt-1.5 text-[13px]">
            위에서 남은 요건을 채우는 것만 골랐어요
          </p>
        </div>

        <Link
          href="/programs"
          className="border-ds-line-strong text-ds-primary hover:bg-ds-tint inline-flex shrink-0 items-center gap-1.5 rounded-[9px] border bg-white px-4 py-2.5 text-[13px] font-bold transition-colors"
        >
          프로그램 전체 보기
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </header>

      {/* 선정 기준 — 무엇을 근거로 골랐는지 항상 밝힌다 (PR-1) */}
      <div className="bg-ds-tint mb-3.5 flex flex-col gap-2.5 rounded-[13px] border border-[#BFE0F7] px-4 py-3.5 lg:flex-row lg:items-center lg:gap-3">
        <p className="text-ds-navy shrink-0 text-[13.5px] font-bold">
          지금 채워야 할 것
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {NEEDS.map((need) => (
            <li key={need.requirementId} className="flex items-center gap-1.5">
              <span className="bg-ds-surface border-ds-line text-ds-ink rounded-[7px] border px-2.5 py-1.5 text-[12.5px] font-bold">
                {need.label}
              </span>
              <StatusBadge status={need.currentStatus} size="sm" />
            </li>
          ))}
        </ul>
      </div>

      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" role="list">
        {programs.map((program) => (
          <li key={program.id}>
            <HomeProgramCard program={program} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function HomeProgramCard({ program }: { program: Program }) {
  return (
    <article
      className={cn(
        "bg-ds-surface flex h-full flex-col rounded-2xl border p-5 transition-colors",
        program.featured
          ? "border-ds-line-strong hover:border-ds-primary shadow-[0_2px_10px_rgba(31,58,143,0.06)]"
          : "border-ds-line hover:border-ds-line-strong",
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {program.featured && (
          <span className="bg-ds-primary rounded-md px-2.5 py-1 text-[11.5px] font-bold text-white">
            가장 추천
          </span>
        )}
        <CostBadge cost={program.cost} />
        <IntakeBadge intake={program.intake} />
      </div>

      <div className="flex gap-3.5">
        <span
          aria-hidden
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-[12px] text-[12px] font-extrabold text-white",
            program.logoTone === "navy" ? "bg-ds-navy" : "bg-ds-sub",
          )}
        >
          {program.logoText}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-ds-ink text-[15px] font-extrabold tracking-[-0.2px]">
            {program.title}
          </h3>
          <p className="text-ds-body mt-1 text-[12.5px] font-semibold">
            {program.provider}
          </p>
        </div>
      </div>

      <p className="text-ds-muted mt-3 text-[12.5px] leading-relaxed">
        {program.formatLabel}
      </p>
      <p className="text-ds-ink mt-2 text-[13px] leading-relaxed">
        {program.reason}
      </p>

      {/* 추천도 % 자리 — 어떤 판정이 바뀌는지로 대체한다 */}
      <div className="border-ds-divider mt-auto border-t pt-3.5">
        <p className="text-ds-muted text-xs font-semibold">끝내면 바뀌는 것</p>
        {program.targets.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1.5">
            {program.targets.map((target) => (
              <li
                key={target.requirementId}
                className="flex flex-wrap items-center gap-1.5"
              >
                <span className="text-ds-ink text-[12.5px] font-bold">
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
        ) : (
          <p className="text-ds-body mt-2 text-[12.5px]">
            {program.supportNote}
          </p>
        )}

        <a
          href={program.href ?? "/programs"}
          className={cn(
            "mt-3.5 block rounded-[10px] py-2.5 text-center text-[13px] font-bold transition-colors",
            program.featured
              ? "bg-ds-primary hover:bg-ds-navy text-white"
              : "border-ds-line-strong text-ds-primary hover:bg-ds-tint border",
          )}
        >
          신청하기
        </a>
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
    <span className="bg-met-bg text-met-text rounded-md px-2.5 py-1 text-[11.5px] font-bold">
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
