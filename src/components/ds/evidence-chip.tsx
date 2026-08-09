/**
 * C · 근거 칩 — docs/design-system.md 5장
 *
 * 모든 판정 옆에 붙는다. 판정만 있고 근거가 없는 화면은 만들지 않는다 (PR-1).
 */

import type { EvidenceChip as EvidenceChipData } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

const TONE = {
  action: "border-ds-line-strong bg-[#F7FBFF] text-ds-primary font-bold",
  meta: "border-ds-line bg-transparent text-ds-muted font-semibold",
  warn: "border-check-border bg-check-bg text-check-text font-bold",
  stale: "border-na-border bg-[#F4F6F9] text-na-text font-semibold",
} as const;

export function EvidenceChip({
  chip,
  className,
}: {
  chip: EvidenceChipData;
  className?: string;
}) {
  const base = cn(
    "inline-flex items-center rounded-[7px] border px-[11px] py-1.5 text-[11.5px] whitespace-nowrap",
    TONE[chip.tone],
    className,
  );

  if (chip.href) {
    return (
      <a href={chip.href} className={base}>
        {chip.label}
      </a>
    );
  }

  return <span className={base}>{chip.label}</span>;
}

export function EvidenceChipRow({
  chips,
  className,
}: {
  chips: EvidenceChipData[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {chips.map((chip) => (
        <EvidenceChip key={chip.label} chip={chip} />
      ))}
    </div>
  );
}
