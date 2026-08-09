/**
 * 프로그램 카드
 *
 * 추천 점수를 쓰지 않는다. 신청 자격을 4상태로 말하고, 근거를 함께 적는다
 * (PR-1 · PR-2 · 디자인 시스템 2장 금지 패턴 1).
 *
 * 상세 페이지가 아직 없어서 링크를 걸지 않는다. 카드 안에서 다 보여준다.
 */

import { CalendarDays, MapPin } from "lucide-react";

import { StatusBadge } from "@/components/ds/status-badge";
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

export function ProgramCard({ item }: { item: ProgramItem }) {
  const unmet = item.eligibility === "unmet";

  return (
    <article
      className={cn(
        "bg-ds-surface flex h-full flex-col rounded-2xl border p-5 transition-colors sm:p-[22px]",
        unmet
          ? "border-ds-line opacity-90"
          : item.eligibility === "check"
            ? "border-check-border"
            : "border-ds-line hover:border-ds-line-strong",
      )}
    >
      {/* 분류 · 마감 · 비용 */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="bg-ds-tint text-ds-navy rounded-md px-2.5 py-1 text-[11.5px] font-bold">
          {CATEGORY_LABEL[item.category]}
        </span>
        <DeadlineBadge item={item} />
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
      </div>

      <h3 className="text-ds-ink text-[16px] font-extrabold tracking-[-0.2px]">
        {item.title}
      </h3>
      <p className="text-ds-body mt-1 text-[13px] font-semibold">
        {item.provider}
      </p>
      <p className="text-ds-muted mt-2 text-[13px] leading-relaxed">
        {item.summary}
      </p>

      {/* 기간 · 지역 */}
      <ul className="text-ds-muted mt-3 flex flex-col gap-1.5 text-[12.5px]">
        <li className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          신청 {formatPeriod(item.applicationPeriod)}
        </li>
        {item.activePeriod && (
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="w-3.5 shrink-0" />
            {item.activePeriodLabel} {formatPeriod(item.activePeriod)}
          </li>
        )}
        {item.region && (
          <li className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {item.region}
          </li>
        )}
      </ul>

      {/* 얻는 것 */}
      {item.highlights.length > 0 && (
        <>
          <p className="text-ds-muted mt-4 text-xs font-semibold">
            {item.highlightsLabel}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {item.highlights.map((skill) => (
              <li
                key={skill}
                className="border-ds-line text-ds-body rounded-[7px] border bg-[#F7FBFF] px-2.5 py-1.5 text-[12px] font-semibold"
              >
                {skill}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 추천 이유 — 사실만 적는다 */}
      <p className="text-ds-ink mt-3.5 text-[13px] leading-relaxed">
        {item.reason}
      </p>

      {/* 신청 자격 판정 + 근거 */}
      <div
        className={cn(
          "mt-auto rounded-[13px] border p-3.5",
          item.eligibility === "met"
            ? "border-met-border bg-met-surface"
            : item.eligibility === "check"
              ? "border-check-border bg-check-surface"
              : "border-unmet-border bg-unmet-surface",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={item.eligibility} size="sm" />
          <p className="text-ds-ink text-[13.5px] font-bold">
            {ELIGIBILITY_HEADLINE[item.eligibility]}
          </p>
        </div>
        <p className="text-ds-body mt-1.5 text-[12.5px] leading-relaxed">
          {item.verificationNote}
        </p>

        {item.requirements.length > 0 && (
          <ul className="mt-2.5 flex flex-col gap-1">
            {item.requirements.map((req) => (
              <li
                key={req}
                className="text-ds-muted flex gap-2 text-[12.5px] leading-relaxed"
              >
                <span aria-hidden className="text-ds-label">
                  ·
                </span>
                {req}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 부가 정보 */}
      {item.facts.length > 0 && (
        <dl className="border-ds-divider text-ds-muted mt-3.5 flex flex-wrap gap-x-4 gap-y-1 border-t pt-3 text-[12px]">
          {item.facts.map((fact) => (
            <div key={fact.label} className="flex gap-1.5">
              <dt className="text-ds-label">{fact.label}</dt>
              <dd className="font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

function DeadlineBadge({ item }: { item: ProgramItem }) {
  const label = deadlineLabel(item);
  // 마감이 가까우면 눈에 띄게. 판정 색이 아니라 일정 안내용이다.
  const urgent = label.startsWith("D-") || label === "오늘 마감";

  return (
    <span
      className={cn(
        "rounded-md px-2.5 py-1 text-[11.5px] font-bold",
        urgent && Number(label.replace("마감 D-", "")) <= 7
          ? "bg-unmet-bg text-unmet-text"
          : "text-ds-muted bg-[#F1F5F9]",
      )}
    >
      {label}
    </span>
  );
}
