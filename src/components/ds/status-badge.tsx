/**
 * A · 4상태 배지 — docs/design-system.md 3장
 *
 * 모든 화면에서 같은 색·같은 아이콘·같은 말로 쓴다.
 */

import { GAP_META, type GapStatus } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

const TONE: Record<GapStatus, { chip: string; dot: string }> = {
  met: { chip: "bg-met-bg text-met-text border-met-border", dot: "bg-met" },
  unmet: {
    chip: "bg-unmet-bg text-unmet-text border-unmet-border",
    dot: "bg-unmet",
  },
  check: {
    chip: "bg-check-bg text-check-text border-check-border",
    dot: "bg-check",
  },
  na: { chip: "bg-na-bg text-na-text border-na-border", dot: "bg-na" },
};

const SIZE = {
  sm: {
    chip: "gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold",
    glyph: "text-[11px] leading-none",
    dot: "",
  },
  md: {
    chip: "gap-[7px] rounded-lg px-[13px] py-[7px] text-[13.5px] font-bold",
    glyph: "text-[10px]",
    dot: "size-4",
  },
  lg: {
    chip: "gap-[9px] rounded-[11px] px-[18px] py-[11px] text-base font-extrabold",
    glyph: "text-xs",
    dot: "size-[22px]",
  },
} as const;

export type StatusBadgeSize = keyof typeof SIZE;

export function StatusBadge({
  status,
  size = "md",
  className,
}: {
  status: GapStatus;
  size?: StatusBadgeSize;
  className?: string;
}) {
  const meta = GAP_META[status];
  const tone = TONE[status];
  const dims = SIZE[size];

  return (
    <span
      className={cn(
        "inline-flex items-center border whitespace-nowrap",
        tone.chip,
        dims.chip,
        className,
      )}
    >
      {size === "sm" ? (
        <span aria-hidden className={dims.glyph}>
          {meta.glyph}
        </span>
      ) : (
        <span
          aria-hidden
          className={cn(
            "flex items-center justify-center rounded-full text-white",
            tone.dot,
            dims.dot,
            dims.glyph,
          )}
        >
          {meta.glyph}
        </span>
      )}
      {meta.label}
    </span>
  );
}
