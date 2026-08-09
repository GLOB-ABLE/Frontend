/**
 * 홈 · 핵심 기능 2 — 지금 필요한 역량강화 프로그램
 *
 * 신청 자격을 4상태로 말하고 근거를 함께 적는다 (PR-1).
 * 추천 점수는 화면에 쓰지 않는다. 정렬에만 쓴다 (PR-2).
 */

import { ArrowRight, CalendarDays } from "lucide-react";

import Link from "next/link";

import { StatusBadge } from "@/components/ds/status-badge";
import { FOCUS_SKILLS } from "@/lib/programs/mock";
import {
  CATEGORY_LABEL,
  deadlineLabel,
  ELIGIBILITY_HEADLINE,
  feeLabel,
  formatPeriod,
  isFree,
  type ProgramItem,
} from "@/lib/programs/types";
import { cn } from "@/lib/utils";

export function HomeProgramsSection({ programs }: { programs: ProgramItem[] }) {
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
            신청할 수 있는 것부터 골랐어요
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
          {FOCUS_SKILLS.map((skill) => (
            <li
              key={skill}
              className="bg-ds-surface border-ds-line text-ds-ink rounded-[7px] border px-2.5 py-1.5 text-[12.5px] font-bold"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" role="list">
        {programs.map((item) => (
          <li key={item.id}>
            <HomeProgramCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function HomeProgramCard({ item }: { item: ProgramItem }) {
  return (
    <article
      className={cn(
        "bg-ds-surface flex h-full flex-col rounded-2xl border p-5 transition-colors",
        item.eligibility === "check"
          ? "border-check-border"
          : "border-ds-line hover:border-ds-line-strong",
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="bg-ds-tint text-ds-navy rounded-md px-2.5 py-1 text-[11.5px] font-bold">
          {CATEGORY_LABEL[item.category]}
        </span>
        <span
          className={cn(
            "rounded-md px-2.5 py-1 text-[11.5px] font-bold",
            isFree(item)
              ? "bg-met-bg text-met-text"
              : "text-ds-muted bg-[#F1F5F9]",
          )}
        >
          {feeLabel(item)}
        </span>
        <span className="text-ds-muted rounded-md bg-[#F1F5F9] px-2.5 py-1 text-[11.5px] font-bold">
          {deadlineLabel(item)}
        </span>
      </div>

      <h3 className="text-ds-ink text-[15px] font-extrabold tracking-[-0.2px]">
        {item.title}
      </h3>
      <p className="text-ds-body mt-1 text-[12.5px] font-semibold">
        {item.provider}
      </p>

      <p className="text-ds-muted mt-2.5 flex items-center gap-1.5 text-[12.5px]">
        <CalendarDays className="size-3.5 shrink-0" aria-hidden />
        신청 {formatPeriod(item.applicationPeriod)}
      </p>

      <p className="text-ds-ink mt-2.5 text-[13px] leading-relaxed">
        {item.reason}
      </p>

      {/* 신청 자격 — 판정에는 근거를 붙인다 */}
      <div className="border-ds-divider mt-auto border-t pt-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={item.eligibility} size="sm" />
          <p className="text-ds-ink text-[12.5px] font-bold">
            {ELIGIBILITY_HEADLINE[item.eligibility]}
          </p>
        </div>
        <p className="text-ds-muted mt-1.5 text-[12px] leading-relaxed">
          {item.verificationNote}
        </p>
      </div>
    </article>
  );
}
