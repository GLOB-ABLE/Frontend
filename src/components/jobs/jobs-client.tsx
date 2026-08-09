"use client";

/**
 * 맞춤 공고 목록 (공고 피드) — PRD MVP-03
 *
 * 필터를 늘 펼쳐두면 화면이 복잡해진다.
 * 대신 "AI가 정리한 내 조건" 카드를 먼저 보여주고,
 * 조건을 바꾸고 싶은 사람만 버튼으로 필터를 연다.
 *
 * 화면 규칙은 docs/design-system.md를 따른다.
 * - 판정은 4상태로만 말한다 (확률·게이지·순위 금지)
 * - 모든 판정 옆에 근거 칩을 붙인다
 */

import { X } from "lucide-react";

import { useMemo, useState } from "react";
import { FeedFiltersPanel } from "@/components/jobs/feed-filters";
import { JobFeedCard } from "@/components/jobs/job-feed-card";
import { MyConditionCard } from "@/components/jobs/my-condition-card";
import {
  JOB_POSTINGS,
  SALARY_RANGE,
  TOTAL_POSTING_COUNT,
} from "@/lib/feed/mock";
import type { FeedFilters } from "@/lib/feed/types";
import { totalRequirements } from "@/lib/feed/types";

const INITIAL_FILTERS: FeedFilters = {
  sortByFewestChecks: true,
  jobFamilies: ["trade"],
  regions: ["부산"],
  workLanguages: ["베트남어 응대"],
  employmentType: "정규직",
  salaryMin: 2900,
};

export function JobsClient() {
  const [filters, setFilters] = useState<FeedFilters>(INITIAL_FILTERS);
  /** 필터는 기본으로 닫아둔다. 조건 카드가 지금 상태를 대신 말해준다. */
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

  /** 목록 전체의 상태 분포 — 스크린리더용 요약에 쓴다 */
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
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
        {/* 왼쪽 조건 사이드바 (스크롤 따라 움직이게 둠) */}
        <aside className="w-full shrink-0 lg:w-[320px] xl:w-[360px]">
          <div className="flex flex-col gap-4">
            {/* 지금 어떤 조건으로 걸러졌는지 먼저 보여준다 */}
            <MyConditionCard
              filters={filters}
              onEditFilters={() => setFiltersOpen(true)}
              className="mb-0"
            />

            {/* 데스크톱에서는 카드 바로 아래에 펼친다 */}
            {filtersOpen && (
              <div className="hidden lg:block">
                <FeedFiltersPanel
                  filters={filters}
                  onChange={setFilters}
                  onReset={reset}
                />
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="bg-ds-primary hover:bg-ds-navy mt-3 w-full cursor-pointer rounded-[11px] py-3 text-sm font-bold text-white transition-colors"
                >
                  이 조건으로 공고 보기
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* 오른쪽 공고 목록 */}
        <main className="min-w-0 flex-1">
          <header className="mb-3.5 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-ds-navy text-xl font-extrabold tracking-[-0.5px] sm:text-[21px]">
              조건에 맞는 공고 {TOTAL_POSTING_COUNT}건
            </h1>
            <p className="text-ds-muted text-[13px]">매칭률이 높은 순서예요</p>
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

          <p className="sr-only">
            현재 목록의 요건 상태 합계 — 충족 {legend.met}, 확인 필요{" "}
            {legend.check}, 미충족 {legend.unmet}, 해당 없음 {legend.na}. 총{" "}
            {visible.reduce((n, j) => n + totalRequirements(j.gap), 0)}개.
          </p>
        </main>
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
            <div className="mb-2 flex items-center justify-between">
              <p className="text-ds-navy text-[15px] font-extrabold">
                조건 수정하기
              </p>
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
              이 조건으로 공고 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
