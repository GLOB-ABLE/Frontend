"use client";

/**
 * 홈 · 핵심 기능 1 — 나에게 맞는 공고와 지원 전략
 *
 * 왼쪽에서 공고를 고르면 오른쪽에 그 공고의 지원 전략이 열린다.
 * 요건 전체 표는 상세 화면에 있고, 여기서는 강점·남은 것·다음 할 일만 보여준다.
 *
 * 화면 규칙은 docs/design-system.md를 따른다.
 * - 판정은 4상태와 개수로만 말한다 (확률·게이지·순위 금지, PR-2)
 * - 모든 판정 옆에 근거 칩을 붙인다 (PR-1)
 */

import { ArrowRight } from "lucide-react";

import Link from "next/link";

import { useState } from "react";

import { EvidenceChipRow } from "@/components/ds/evidence-chip";
import { ReadinessTag } from "@/components/ds/readiness-tag";
import { RequirementBar } from "@/components/ds/requirement-bar";
import { StatusBadge } from "@/components/ds/status-badge";
import type { GapStatus, GapSummary } from "@/lib/feed/types";
import { totalRequirements } from "@/lib/feed/types";
import type { HomeJobStrategy } from "@/lib/home/select";
import { cn } from "@/lib/utils";

/** 아직 해결되지 않은 것 중 가장 무거운 상태를 대표로 쓴다 — 상세와 같은 규칙 */
function leadStatus(gap: GapSummary): GapStatus {
  if (gap.unmet > 0) return "unmet";
  if (gap.check > 0) return "check";
  return "met";
}

function headline(gap: GapSummary): string {
  const parts: string[] = [];
  if (gap.check > 0) parts.push(`확인 필요 ${gap.check}개`);
  if (gap.unmet > 0) parts.push(`미충족 ${gap.unmet}개`);
  if (parts.length === 0) return "남은 항목이 없습니다";
  return `${parts.join(" · ")}가 남았습니다`;
}

export function MatchedJobsSection({
  strategies,
}: {
  strategies: HomeJobStrategy[];
}) {
  const [selected, setSelected] = useState(0);
  const current = strategies[selected];

  if (!current) return null;

  return (
    <section aria-labelledby="home-jobs-heading">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="home-jobs-heading"
            className="text-ds-navy text-xl font-extrabold tracking-[-0.5px]"
          >
            나에게 맞는 공고와 지원 전략
          </h2>
          <p className="text-ds-muted mt-1.5 text-[13px]">
            요건을 하나씩 맞춰 본 결과예요. 합격 가능성은 예측하지 않습니다.
          </p>
        </div>

        <Link
          href="/jobs"
          className="border-ds-line-strong text-ds-primary hover:bg-ds-tint inline-flex shrink-0 items-center gap-1.5 rounded-[9px] border bg-white px-4 py-2.5 text-[13px] font-bold transition-colors"
        >
          공고 전체 보기
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* 공고 고르기 */}
        <ul className="flex flex-col gap-2.5" role="list">
          {strategies.map((item, index) => (
            <li key={item.job.id}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
                className={cn(
                  "w-full cursor-pointer rounded-2xl border p-[18px] text-left transition-colors",
                  selected === index
                    ? "border-ds-primary bg-ds-surface shadow-[0_4px_16px_rgba(31,119,255,0.12)]"
                    : "border-ds-line bg-ds-surface hover:border-ds-line-strong",
                )}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-[12px] text-[13px] font-extrabold text-white",
                      item.job.logoTone === "navy" ? "bg-ds-navy" : "bg-ds-sub",
                    )}
                  >
                    {item.job.logoText}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-ds-muted text-[12.5px] font-semibold">
                      {item.job.company}
                    </p>
                    <h3 className="text-ds-ink mt-0.5 text-[15px] font-extrabold">
                      {item.job.title}
                    </h3>
                    <p className="text-ds-muted mt-1.5 text-[12.5px]">
                      {item.job.location} · {item.job.salaryLabel}
                    </p>
                  </div>

                  <StatusBadge status={leadStatus(item.job.gap)} size="sm" />
                </div>

                <RequirementBar gap={item.job.gap} className="mt-3.5" />
              </button>
            </li>
          ))}
        </ul>

        {/* 고른 공고의 지원 전략 */}
        <StrategyPanel key={current.job.id} strategy={current} />
      </div>
    </section>
  );
}

function StrategyPanel({ strategy }: { strategy: HomeJobStrategy }) {
  const { job, strengths, toFill, nextStep } = strategy;
  const total = totalRequirements(job.gap);

  return (
    <article className="border-ds-line-strong bg-ds-surface rounded-2xl border p-5 shadow-[0_2px_12px_rgba(31,58,143,0.07)] sm:p-[26px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="bg-ds-tint text-ds-navy inline-block rounded-[7px] px-2.5 py-1 text-[11.5px] font-extrabold">
            공고별 지원 전략
          </span>
          <h3 className="text-ds-navy mt-2.5 text-lg font-extrabold tracking-[-0.4px]">
            {job.title}
          </h3>
          <p className="text-ds-body mt-1 text-[13.5px] font-semibold">
            {job.company} · {job.salaryLabel}
          </p>
        </div>
        <ReadinessTag readiness={job.readiness} />
      </div>

      {/* 판정 요약 — 상세와 같은 문장 규칙 */}
      <div className="border-ds-line mt-4 rounded-[13px] border bg-[#F7FBFF] p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusBadge status={leadStatus(job.gap)} size="md" />
          <p className="text-ds-ink text-[14.5px] font-bold">
            요건 {total}개 중 {headline(job.gap)}
          </p>
        </div>
        <RequirementBar gap={job.gap} className="mt-3.5" />
        <EvidenceChipRow chips={job.evidence} className="mt-3.5" />
      </div>

      {/* 강점 / 남은 것 */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <HighlightList
          title={`내 강점 ${strengths.length}개`}
          icon="↑"
          iconClass="bg-met-bg text-met-text"
          empty="아직 확인된 강점이 없어요."
        >
          {strengths.map((item) => (
            <li
              key={item.title}
              className="border-met-border bg-met-surface rounded-xl border p-3"
            >
              <p className="text-ds-ink text-[13.5px] font-bold">
                {item.title}
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[#4B6152]">
                {item.detail}
              </p>
            </li>
          ))}
        </HighlightList>

        <HighlightList
          title={`채워야 할 것 ${toFill.length}개`}
          icon="!"
          iconClass="bg-check-bg text-check-text"
          empty="남은 항목이 없어요."
        >
          {toFill.map((item) => (
            <li
              key={item.title}
              className={cn(
                "rounded-xl border p-3",
                item.status === "unmet"
                  ? "border-unmet-border bg-unmet-surface"
                  : "border-check-border bg-check-surface",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-ds-ink text-[13.5px] font-bold">
                  {item.title}
                </p>
                {item.status && <StatusBadge status={item.status} size="sm" />}
              </div>
              <p
                className={cn(
                  "mt-1 text-[12.5px] leading-relaxed",
                  item.status === "unmet"
                    ? "text-unmet-text"
                    : "text-[#7A5600]",
                )}
              >
                {item.detail}
              </p>
            </li>
          ))}
        </HighlightList>
      </div>

      {/* 지원 전 할 일 — 남은 요건에서 그대로 가져온다 */}
      {nextStep && (
        <div className="border-check-border bg-check-surface mt-4 flex flex-col gap-3 rounded-[13px] border p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-bold text-[#7A5600]">
              지원 전 할 일 · {nextStep.requirement}
            </p>
            <p className="text-ds-ink mt-1 text-[14.5px] font-bold">
              {nextStep.label}
            </p>
            <p className="text-ds-muted mt-1 text-[12.5px]">
              끝내면 이 요건의 상태가 바뀝니다. 합격 여부는 바뀌지 않습니다.
            </p>
          </div>
          {nextStep.href && (
            <Link
              href={nextStep.href}
              className="bg-ds-primary hover:bg-ds-navy inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[9px] px-4 py-2.5 text-[13px] font-bold text-white transition-colors"
            >
              바로 하기
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          )}
        </div>
      )}

      <Link
        href={`/jobs/${job.id}`}
        className="border-ds-line-strong text-ds-primary hover:bg-ds-tint mt-4 block rounded-[10px] border py-3 text-center text-[13.5px] font-bold transition-colors"
      >
        요건 {total}개 전부 보기
      </Link>
    </article>
  );
}

function HighlightList({
  title,
  icon,
  iconClass,
  empty,
  children,
}: {
  title: string;
  icon: string;
  iconClass: string;
  empty: string;
  children: React.ReactNode[];
}) {
  return (
    <section className="border-ds-line rounded-2xl border p-4">
      <div className="mb-3 flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "flex size-[21px] items-center justify-center rounded-[7px] text-[12px] font-extrabold",
            iconClass,
          )}
        >
          {icon}
        </span>
        <h4 className="text-ds-navy text-[14.5px] font-extrabold">{title}</h4>
      </div>
      {children.length > 0 ? (
        <ul className="flex flex-col gap-2">{children}</ul>
      ) : (
        <p className="text-ds-muted text-[12.5px]">{empty}</p>
      )}
    </section>
  );
}
