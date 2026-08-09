"use client";

/**
 * 공고 피드 · 조건 고르기 사이드바
 *
 * 업무언어 필터는 국적이 아니라 실제 업무 행동을 고른다 (PR-7).
 */

import { Check } from "lucide-react";

import {
  FILTER_COUNTS,
  JOB_FAMILY_OPTIONS,
  REGION_OPTIONS,
  SALARY_RANGE,
  WORK_LANGUAGE_OPTIONS,
} from "@/lib/feed/mock";
import type { FeedFilters, FilterOption, JobPosting } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

const EMPLOYMENT_TYPES: JobPosting["employmentType"][] = [
  "정규직",
  "계약직",
  "인턴",
];

export function FeedFiltersPanel({
  filters,
  onChange,
  onReset,
  className,
}: {
  filters: FeedFilters;
  onChange: (next: FeedFilters) => void;
  onReset: () => void;
  className?: string;
}) {
  const toggle = (key: "jobFamilies" | "regions" | "workLanguages") => {
    return (value: string) => {
      const current = filters[key];
      onChange({
        ...filters,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      });
    };
  };

  return (
    <aside
      className={cn(
        "border-ds-line bg-ds-surface rounded-2xl border p-5 shadow-[0_1px_3px_rgba(31,58,143,0.04)]",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-ds-navy text-[15px] font-extrabold">조건 고르기</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-ds-muted hover:text-ds-primary cursor-pointer text-[12.5px] transition-colors"
        >
          초기화
        </button>
      </div>

      {/* 정렬 토글 — 확인 필요가 적은 순 */}
      <div className="bg-ds-tint mb-[18px] rounded-xl border border-[#BFE0F7] p-3.5">
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <p className="text-ds-navy text-[13.5px] leading-snug font-extrabold">
              확인 필요 항목이
              <br />
              적은 순으로 보기
            </p>
            <p className="text-ds-body mt-1.5 text-xs leading-relaxed">
              바로 지원할 수 있는 공고가 위로 옵니다.
            </p>
          </div>
          <Switch
            checked={filters.sortByFewestChecks}
            onChange={(next) =>
              onChange({ ...filters, sortByFewestChecks: next })
            }
            label="확인 필요 항목이 적은 순으로 보기"
          />
        </div>
      </div>

      <Section title="직무">
        <CheckboxList
          options={JOB_FAMILY_OPTIONS}
          selected={filters.jobFamilies}
          onToggle={toggle("jobFamilies")}
        />
      </Section>

      <Section title="지역">
        <div className="flex flex-wrap gap-1.5">
          {REGION_OPTIONS.map((opt) => (
            <PillToggle
              key={opt.value}
              label={`${opt.label} ${FILTER_COUNTS[opt.value] ?? 0}`}
              active={filters.regions.includes(opt.value)}
              onClick={() => toggle("regions")(opt.value)}
            />
          ))}
        </div>
      </Section>

      <Section title="업무언어" hint="실제 업무에서 쓰는 언어입니다">
        <CheckboxList
          options={WORK_LANGUAGE_OPTIONS}
          selected={filters.workLanguages}
          onToggle={toggle("workLanguages")}
        />
      </Section>

      <Section title="근무형태">
        <div className="flex gap-1.5">
          {EMPLOYMENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ ...filters, employmentType: type })}
              className={cn(
                "flex-1 cursor-pointer rounded-lg border py-2.5 text-center text-[12.5px] transition-colors",
                filters.employmentType === type
                  ? "bg-ds-tint border-ds-primary text-ds-navy font-bold"
                  : "border-ds-line text-ds-body hover:border-ds-line-strong",
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </Section>

      <Section title="급여" last>
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-ds-primary text-[12.5px] font-semibold">
            {filters.salaryMin.toLocaleString()}만원 이상
          </span>
        </div>
        <input
          type="range"
          min={SALARY_RANGE.min}
          max={SALARY_RANGE.max}
          step={100}
          value={filters.salaryMin}
          onChange={(e) =>
            onChange({ ...filters, salaryMin: Number(e.target.value) })
          }
          aria-label="최소 급여"
          className="accent-ds-primary bg-ds-line h-1 w-full cursor-pointer appearance-none rounded-full"
        />
        <div className="text-ds-label mt-2.5 flex justify-between text-[11.5px]">
          <span>{SALARY_RANGE.min.toLocaleString()}만원</span>
          <span>{SALARY_RANGE.max.toLocaleString()}만원</span>
        </div>
      </Section>
    </aside>
  );
}

function Section({
  title,
  hint,
  last,
  children,
}: {
  title: string;
  hint?: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("border-ds-divider border-t pt-4", last ? "pb-0" : "pb-4")}
    >
      <h3 className="text-ds-ink text-[13.5px] font-bold">{title}</h3>
      {hint && <p className="text-ds-muted mt-1 text-xs">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function CheckboxList({
  options,
  selected,
  onToggle,
}: {
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <li key={opt.value}>
            <button
              type="button"
              onClick={() => onToggle(opt.value)}
              aria-pressed={active}
              className="flex w-full cursor-pointer items-center gap-2.5 text-left text-[13px]"
            >
              <span
                className={cn(
                  "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors",
                  active
                    ? "bg-ds-primary border-ds-primary text-white"
                    : "border-ds-line-strong",
                )}
              >
                {active && <Check className="size-3" strokeWidth={3.5} />}
              </span>
              <span
                className={cn(
                  "flex-1",
                  active ? "text-ds-navy font-bold" : "text-ds-body",
                )}
              >
                {opt.label}
              </span>
              <span className="text-ds-label tabular-nums">
                {FILTER_COUNTS[opt.value] ?? 0}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function PillToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "cursor-pointer rounded-lg border px-[11px] py-[7px] text-[12.5px] transition-colors",
        active
          ? "bg-ds-tint border-ds-primary text-ds-navy font-bold"
          : "border-ds-line text-ds-body hover:border-ds-line-strong",
      )}
    >
      {label}
    </button>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-[42px] shrink-0 cursor-pointer rounded-full transition-colors",
        checked ? "bg-ds-primary" : "bg-[#BFD3F5]",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] size-[18px] rounded-full bg-white transition-[left]",
          checked ? "left-[21px]" : "left-[3px]",
        )}
      />
    </button>
  );
}
