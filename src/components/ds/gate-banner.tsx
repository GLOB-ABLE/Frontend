/**
 * E · 게이트 상태 배너 — docs/design-system.md 7장 · PRD 6장
 *
 * 항상 화면 상단에 놓는다. 차단 상태도 오류가 아니라 안내로 보이게 한다.
 * 차단 상태(VG-C)에도 레드를 쓰지 않는다.
 */

import { ArrowRight } from "lucide-react";

import type { GateState } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

const VARIANT: Record<
  GateState,
  {
    shell: string;
    code: string;
    title: string;
    desc: string;
    action: string;
  }
> = {
  "VG-A": {
    shell: "bg-linear-90 from-ds-navy to-ds-primary border-transparent",
    code: "bg-white/[0.18] border-white/35 text-white",
    title: "text-white",
    desc: "text-ds-tint",
    action: "bg-white/[0.16] text-white",
  },
  "VG-B": {
    shell: "bg-ds-surface border-check-border border-l-4 border-l-check",
    code: "bg-check-bg border-check-border text-check-text",
    title: "text-ds-ink",
    desc: "text-[#7A5600]",
    action: "bg-ds-primary text-white",
  },
  "VG-C": {
    shell: "bg-ds-surface border-ds-line border-l-4 border-l-na",
    code: "bg-na-bg border-na-border text-na-text",
    title: "text-ds-ink",
    desc: "text-ds-muted",
    action: "border border-ds-line-strong text-ds-primary",
  },
  "VG-D": {
    shell: "bg-[#F7FBFF] border-ds-line-strong border-l-4 border-l-ds-sub",
    code: "bg-ds-tint border-[#A9D2F5] text-ds-navy",
    title: "text-ds-ink",
    desc: "text-ds-body",
    action: "bg-ds-primary text-white",
  },
};

export function GateBanner({
  state,
  title,
  description,
  /** 우측 보조 메타 (예: "기준일 2026.03.01") */
  meta,
  actionLabel,
  onAction,
  className,
}: {
  state: GateState;
  title: string;
  description: string;
  meta?: string;
  actionLabel: string;
  onAction?: () => void;
  className?: string;
}) {
  const v = VARIANT[state];

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-[14px] border px-5 py-4 sm:flex-row sm:items-center sm:gap-[18px] sm:px-6",
        v.shell,
        className,
      )}
    >
      <span
        className={cn(
          "shrink-0 self-start rounded-lg border px-3 py-1.5 text-[13px] font-extrabold",
          v.code,
        )}
      >
        {state}
      </span>

      <div className="min-w-0 flex-1">
        <p className={cn("text-[15.5px] font-bold", v.title)}>{title}</p>
        <p className={cn("mt-1 text-[13px] leading-relaxed", v.desc)}>
          {description}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {meta && (
          <span
            className={cn(
              "rounded-[7px] border px-[11px] py-1.5 text-xs font-semibold",
              state === "VG-A"
                ? "border-white/30 text-white"
                : "border-ds-line text-ds-muted",
            )}
          >
            {meta}
          </span>
        )}
        <button
          type="button"
          onClick={onAction}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-[9px] px-4 py-2.5 text-[13px] font-bold transition-opacity hover:opacity-90",
            v.action,
          )}
        >
          {actionLabel}
          {state === "VG-A" && <ArrowRight className="size-3.5" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
