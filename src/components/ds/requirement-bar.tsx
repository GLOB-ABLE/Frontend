/**
 * B · 요건 상태 요약 바 — docs/design-system.md 4장
 *
 * %를 대체한다. 라벨은 항상 개수다 (PR-2).
 * 칸 순서 고정: 충족 → 확인 필요 → 미충족 → 해당 없음.
 */

import {
  GAP_ORDER,
  gapLabel,
  totalRequirements,
  type GapStatus,
  type GapSummary,
} from "@/lib/feed/types";
import { cn } from "@/lib/utils";

const SEGMENT: Record<GapStatus, string> = {
  met: "bg-met",
  check: "bg-check",
  unmet: "bg-unmet",
  na: "bg-na",
};

export function RequirementBar({
  gap,
  /** 확인 필요가 과반이면 라벨을 경고색으로 강조한다 */
  emphasizeChecks = false,
  className,
}: {
  gap: GapSummary;
  emphasizeChecks?: boolean;
  className?: string;
}) {
  const total = totalRequirements(gap);
  const label = gapLabel(gap);

  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-ds-muted text-[12.5px] font-semibold">
          요건 {total}개
        </span>
        <span
          className={cn(
            "text-right text-[13px] font-bold",
            emphasizeChecks ? "text-check-text" : "text-ds-body",
          )}
        >
          {label}
        </span>
      </div>
      <div
        className="flex h-2.5 gap-[3px] overflow-hidden rounded-md"
        role="img"
        aria-label={`요건 ${total}개 — ${label}`}
      >
        {GAP_ORDER.filter((key) => gap[key] > 0).map((key) => (
          <div
            key={key}
            className={SEGMENT[key]}
            style={{ flex: gap[key] }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

/** 목록 상단 범례 */
export function RequirementLegend({
  gap,
  className,
}: {
  gap?: Partial<GapSummary>;
  className?: string;
}) {
  const keys: GapStatus[] = gap
    ? GAP_ORDER.filter((k) => (gap[k] ?? 0) > 0)
    : ["met", "check", "unmet"];

  return (
    <div
      className={cn(
        "text-ds-body flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] font-semibold",
        className,
      )}
    >
      {keys.map((key) => (
        <span key={key} className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-[3px]", SEGMENT[key])} />
          {LEGEND_LABEL[key]}
          {gap ? ` ${gap[key]}` : ""}
        </span>
      ))}
    </div>
  );
}

const LEGEND_LABEL: Record<GapStatus, string> = {
  met: "충족",
  check: "확인 필요",
  unmet: "미충족",
  na: "해당 없음",
};
