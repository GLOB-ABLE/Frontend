"use client";

/**
 * 맞춤 공고 목록 (공고 피드) — PRD MVP-03
 *
 * 화면 규칙은 docs/design-system.md를 따른다.
 * - 판정은 4상태로만 말한다 (확률·게이지·순위 금지)
 * - 모든 판정 옆에 근거 칩을 붙인다
 * - 체류자격 게이트 배너를 항상 상단에 놓는다
 */

import { SlidersHorizontal, X } from "lucide-react";

import { useMemo, useState } from "react";

import { DisclaimerFooter } from "@/components/ds/disclaimer-footer";
import { GateBanner } from "@/components/ds/gate-banner";
import { RequirementLegend } from "@/components/ds/requirement-bar";
import { FeedFiltersPanel } from "@/components/jobs/feed-filters";
import { JobFeedCard } from "@/components/jobs/job-feed-card";
import {
  EFFECTIVE_DATE,
  GATE,
  JOB_POSTINGS,
  RULE_VERSION,
  SALARY_RANGE,
  TOTAL_POSTING_COUNT,
} from "@/lib/feed/mock";
import type { FeedFilters } from "@/lib/feed/types";
import { totalRequirements } from "@/lib/feed/types";

const INITIAL_FILTERS: FeedFilters = {
  sortByFewestChecks: true,
  jobFamilies: ["trade"],
  regions: ["경기"],
  workLanguages: ["베트남어 응대"],
  employmentType: "정규직",
  salaryMin: 2900,
};

export function JobsClient() {
  const [filters, setFilters] = useState<FeedFilters>(INITIAL_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /**
   * 목 데이터에서는 필터가 목록을 비우지 않도록 정렬만 적용한다.
   * 실제 API가 붙으면 이 자리에서 서버 필터 결과를 받는다.
   */
  const visible = useMemo(() => {
    const list = [...JOB_POSTINGS];
    if (!filters.sortByFewestChecks) return list;
    return list.sort((a, b) => {
      if (a.gap.check !== b.gap.check) return a.gap.check - b.gap.check;
      if (a.gap.unmet !== b.gap.unmet) return a.gap.unmet - b.gap.unmet;
      return b.gap.met - a.gap.met;
    });
  }, [filters.sortByFewestChecks]);

  /** 목록 전체의 상태 분포 — 상단 범례에 쓴다 */
  const legend = useMemo(
    () =>
      visible.reduce(
        (acc, job) => ({
          met: acc.met + job.gap.met,
          check: acc.check + job.gap.check,
          unmet: acc.unmet + job.gap.unmet,
          na: acc.na + job.gap.na,
        }),
        { met: 0, check: 0, unmet: 0, na: 0 },
      ),
    [visible],
  );

  const reset = () =>
    setFilters({
      sortByFewestChecks: true,
      jobFamilies: [],
      regions: [],
      workLanguages: [],
      employmentType: "정규직",
      salaryMin: SALARY_RANGE.min,
    });

  return (
    <div className="bg-ds-page min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        {/* E · 게이트 상태 배너 — 항상 상단 */}
        <GateBanner
          state={GATE.state}
          title={GATE.title}
          description={GATE.description}
          meta={`기준일 ${EFFECTIVE_DATE}`}
          actionLabel="체류 정보 보기"
        />

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[280px_1fr]">
          {/* 조건 고르기 — 데스크톱 고정, 모바일은 시트 */}
          <FeedFiltersPanel
            filters={filters}
            onChange={setFilters}
            onReset={reset}
            className="hidden lg:block"
          />

          <section>
            <header className="mb-3.5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-ds-navy text-xl font-extrabold tracking-[-0.5px] sm:text-[21px]">
                  조건에 맞는 공고 {TOTAL_POSTING_COUNT}건
                </h1>
                <p className="text-ds-muted mt-1.5 text-[13px]">
                  {filters.sortByFewestChecks
                    ? "확인 필요 항목이 적은 순서예요"
                    : "최근 등록순이에요"}{" "}
                  · 기준일 {EFFECTIVE_DATE}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <RequirementLegend className="hidden sm:flex" />
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="border-ds-line bg-ds-surface text-ds-body flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-[12.5px] font-bold lg:hidden"
                >
                  <SlidersHorizontal className="size-3.5" aria-hidden />
                  조건 고르기
                </button>
              </div>
            </header>

            <div className="flex flex-col gap-3">
              {visible.map((job, index) => (
                <JobFeedCard key={job.id} job={job} primary={index === 0} />
              ))}
            </div>

            {visible.length === 0 && (
              <div className="border-ds-line bg-ds-surface rounded-2xl border py-16 text-center">
                <p className="text-ds-ink text-[15px] font-bold">
                  조건에 맞는 공고가 없어요
                </p>
                <p className="text-ds-muted mt-1.5 text-sm">
                  조건을 넓히면 더 많은 공고를 볼 수 있습니다.
                </p>
              </div>
            )}

            {/* F · 면책·출처 푸터 */}
            <DisclaimerFooter
              ruleVersion={RULE_VERSION}
              effectiveDate={EFFECTIVE_DATE}
              className="mt-4"
            />

            <p className="sr-only">
              현재 목록의 요건 상태 합계 — 충족 {legend.met}, 확인 필요{" "}
              {legend.check}, 미충족 {legend.unmet}, 해당 없음 {legend.na}. 총{" "}
              {visible.reduce((n, j) => n + totalRequirements(j.gap), 0)}개.
            </p>
          </section>
        </div>
      </div>

      {/* 모바일 필터 시트 */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="필터 닫기"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-[#0F1F3D]/40"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-8">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="닫기"
                className="text-ds-muted cursor-pointer p-1"
              >
                <X className="size-5" />
              </button>
            </div>
            <FeedFiltersPanel
              filters={filters}
              onChange={setFilters}
              onReset={reset}
              className="border-0 p-0 shadow-none"
            />
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="bg-ds-primary mt-5 w-full cursor-pointer rounded-[10px] py-3 text-sm font-bold text-white"
            >
              공고 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
