"use client";

/**
 * AI가 정리한 내 조건 — 공고 목록 상단
 *
 * 필터 항목을 늘어놓는 대신, 지금 어떤 조건으로 걸러졌는지 한 카드로 먼저 보여준다.
 * 조건을 바꾸고 싶은 사람만 아래 버튼으로 필터를 연다.
 *
 * 값은 진단(/self-check)과 프로필에서 온다. 여기서 새로 판정하지 않는다.
 * 아직 안 적은 항목은 감추지 않고 "확인 필요"로 함께 보여준다 (PR-1).
 */

import { MapPin, Pencil, Sparkles } from "lucide-react";

import Link from "next/link";

import { StatusBadge } from "@/components/ds/status-badge";
import { JOB_FAMILY_OPTIONS, REGION_OPTIONS } from "@/lib/feed/mock";
import type { FeedFilters } from "@/lib/feed/types";
import { LEARNER } from "@/lib/programs/mock";
import { cn } from "@/lib/utils";

/** 조건 한 줄 */
type Condition = {
  label: string;
  value: string;
  /** 아직 안 적었으면 확인 필요로 둔다 */
  pending?: boolean;
};

export function MyConditionCard({
  filters,
  onEditFilters,
  className,
}: {
  filters: FeedFilters;
  onEditFilters: () => void;
  className?: string;
}) {
  const familyLabels = filters.jobFamilies
    .map((key) => JOB_FAMILY_OPTIONS.find((o) => o.value === key)?.label ?? key)
    .join(" · ");

  const regionLabels = filters.regions
    .map((key) => REGION_OPTIONS.find((o) => o.value === key)?.label ?? key)
    .join(" · ");

  const conditions: Condition[] = [
    {
      label: "희망 직무",
      value: familyLabels || LEARNER.careerGoals.join(" · "),
    },
    { label: "희망 지역", value: regionLabels || LEARNER.region },
    { label: "고용형태", value: filters.employmentType },
    {
      label: "업무 언어",
      value: filters.workLanguages.join(" · ") || "베트남어 · 한국어",
    },
    { label: "체류자격", value: `${LEARNER.visa} · ${LEARNER.visaPlan}` },
    { label: "한국어", value: "아직 안 적었어요", pending: true },
  ];

  return (
    <section
      className={cn(
        "border-ds-line-strong bg-ds-surface rounded-2xl border p-5 shadow-[0_2px_12px_rgba(31,58,143,0.07)] sm:p-6",
        className,
      )}
      aria-labelledby="my-condition-heading"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="bg-ds-tint text-ds-navy inline-flex items-center gap-1.5 rounded-[99px] px-2.5 py-1 text-[11px] font-extrabold">
            <Sparkles className="size-3" aria-hidden />
            AI가 정리한 내 조건
          </span>
          <Link
            href="/self-check"
            className="text-ds-muted hover:text-ds-primary text-[12px] font-bold transition-colors"
          >
            진단 다시 하기
          </Link>
        </div>

        <h2
          id="my-condition-heading"
          className="text-ds-navy mt-1 text-[16px] font-extrabold tracking-[-0.4px] leading-snug"
        >
          {LEARNER.name}님은 이런 조건으로<br />
          찾고 있어요
        </h2>
        <p className="text-ds-muted mt-0.5 flex items-center gap-1.5 text-[12.5px]">
          <MapPin className="size-3 shrink-0" aria-hidden />
          {LEARNER.major} · {LEARNER.graduation}
        </p>
      </div>

      {/* 조건 목록 */}
      <dl className="mt-5 flex flex-col gap-3.5">
        {conditions.map((item) => (
          <div key={item.label} className="min-w-0 border-ds-divider border-b pb-3.5 last:border-0 last:pb-0">
            <dt className="text-ds-muted text-[12px] font-medium">
              {item.label}
            </dt>
            <dd
              className={cn(
                "mt-1.5 flex flex-wrap items-center gap-1.5 text-[14.5px] font-bold",
                item.pending ? "text-ds-muted" : "text-ds-ink",
              )}
            >
              {item.value}
              {item.pending && <StatusBadge status="check" size="sm" />}
            </dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={onEditFilters}
        className="border-ds-line-strong text-ds-primary hover:bg-ds-tint mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[11px] border py-3 text-[13.5px] font-bold transition-colors"
      >
        <Pencil className="size-3.5" aria-hidden />
        조건 수정하기
      </button>
    </section>
  );
}
