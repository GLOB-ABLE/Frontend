"use client";

/**
 * 역량 강화 프로그램 목록 — PRD MVP-10
 *
 * 공공데이터 5종을 한 목록에 놓고 분류 칩으로 거른다.
 *
 * 화면 규칙
 * - 추천 점수를 쓰지 않는다. 정렬에만 쓴다 (PR-2)
 * - 신청 자격은 4상태 배지로 말하고 근거를 함께 적는다 (PR-1)
 * - 신청이 어려운 것도 감추지 않고 맨 아래에 둔다
 */

import { useMemo, useState } from "react";

import { GrowthBackLink } from "@/components/growth/growth-back-link";
import { ProgramCard } from "@/components/programs/program-card";
import { EFFECTIVE_DATE, RULE_VERSION } from "@/lib/feed/mock";
import {
  DATASET_DISCLAIMER,
  FOCUS_SKILLS,
  LEARNER,
  PROGRAMS,
} from "@/lib/programs/mock";
import {
  CATEGORY_CHIPS,
  daysLeft,
  isFree,
  PROGRAM_SORTS,
  type ProgramCategory,
  type ProgramSort,
} from "@/lib/programs/types";
import { cn } from "@/lib/utils";

export function ProgramsClient() {
  const [category, setCategory] = useState<ProgramCategory | "all">("all");
  const [sort, setSort] = useState<ProgramSort>("recommended");

  const visible = useMemo(() => {
    const list =
      category === "all"
        ? [...PROGRAMS]
        : PROGRAMS.filter((item) => item.category === category);

    if (sort === "freeOnly") return list.filter(isFree);

    if (sort === "deadline") {
      // 신청이 어려운 것은 여기서도 맨 아래에 둔다
      return list.sort((a, b) => {
        const aUnmet = a.eligibility === "unmet" ? 1 : 0;
        const bUnmet = b.eligibility === "unmet" ? 1 : 0;
        if (aUnmet !== bUnmet) return aUnmet - bUnmet;
        return daysLeft(a) - daysLeft(b);
      });
    }

    // 추천순 — PROGRAMS가 이미 그 순서다
    return list;
  }, [category, sort]);

  /** 분류 칩에 붙는 건수 */
  const countOf = (key: ProgramCategory | "all") =>
    key === "all"
      ? PROGRAMS.length
      : PROGRAMS.filter((item) => item.category === key).length;

  return (
    <div className="bg-ds-page min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <GrowthBackLink className="mb-4" />

        <header className="mb-5">
          <h1 className="text-ds-navy text-2xl font-extrabold tracking-[-0.8px] sm:text-[26px]">
            역량 강화 프로그램
          </h1>
          <p className="text-ds-muted mt-1.5 text-sm">
            {LEARNER.region}에서 {LEARNER.careerGoals.join(" · ")}로 가는 데
            도움이 되는 순서예요
          </p>
        </header>

        {/* 무엇을 근거로 골랐는지 밝힌다 (PR-1) */}
        <section className="bg-ds-tint mb-4 flex flex-col gap-2.5 rounded-[14px] border border-[#BFE0F7] px-5 py-4 lg:flex-row lg:items-center lg:gap-3.5">
          <h2 className="text-ds-navy shrink-0 text-[14.5px] font-bold">
            {LEARNER.name}님께 필요한 것
          </h2>
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
        </section>

        {/* 분류 칩 */}
        <nav aria-label="분류" className="mb-3 flex flex-wrap gap-1.5">
          {CATEGORY_CHIPS.map((chip) => {
            const on = category === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setCategory(chip.key)}
                aria-pressed={on}
                className={cn(
                  "cursor-pointer rounded-[9px] px-3.5 py-2.5 text-[13px] transition-colors",
                  on
                    ? "bg-ds-navy font-bold text-white"
                    : "border-ds-line bg-ds-surface text-ds-body hover:border-ds-line-strong border font-semibold",
                )}
              >
                {chip.label}
                <span
                  className={cn(
                    "ml-1.5",
                    on ? "text-ds-tint" : "text-ds-label",
                  )}
                >
                  {countOf(chip.key)}
                </span>
              </button>
            );
          })}
        </nav>

        {/* 정렬 */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-ds-muted text-[13px]">
            {visible.length}건
            {sort === "recommended" && " · 도움이 되는 순서예요"}
            {sort === "deadline" && " · 마감이 가까운 순서예요"}
            {sort === "freeOnly" && " · 무료만 골랐어요"}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {PROGRAM_SORTS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSort(option.key)}
                aria-pressed={sort === option.key}
                className={cn(
                  "cursor-pointer rounded-[9px] px-3.5 py-2 text-[12.5px] transition-colors",
                  sort === option.key
                    ? "bg-ds-primary font-bold text-white"
                    : "border-ds-line bg-ds-surface text-ds-muted hover:border-ds-line-strong border font-semibold",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3" role="list">
          {visible.map((item) => (
            <li key={item.id}>
              <ProgramCard item={item} />
            </li>
          ))}
        </ul>

        {visible.length === 0 && (
          <div className="border-ds-line bg-ds-surface rounded-2xl border py-16 text-center">
            <p className="text-ds-ink text-[15px] font-bold">
              조건에 맞는 프로그램이 없어요
            </p>
            <p className="text-ds-muted mt-1.5 text-sm">
              분류나 정렬을 바꾸면 더 많이 볼 수 있습니다.
            </p>
          </div>
        )}

        {/* 목데이터임을 밝힌다 (PR-5) */}
        <p className="border-ds-line text-ds-muted mt-5 rounded-[14px] border bg-[#F7FBFF] p-5 text-[12.5px] leading-relaxed">
          {DATASET_DISCLAIMER}
          <br />
          {RULE_VERSION} · 적용 기준일 {EFFECTIVE_DATE}
        </p>
      </div>
    </div>
  );
}
