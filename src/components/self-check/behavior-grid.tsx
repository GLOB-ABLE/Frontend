"use client";

/**
 * Q10 · 한국어 업무 행동 — 5단계 응답
 *
 * 급수만으로는 알 수 없는 것을 행동 단위로 받는다.
 * 공고의 "한국어 능통" 요건과 이 값을 나란히 비교한다 (PRD MVP-02).
 */

import { BEHAVIOR_LEVELS, BEHAVIORS } from "@/lib/self-check/questions";
import type { BehaviorLevel } from "@/lib/self-check/types";
import { cn } from "@/lib/utils";

export function BehaviorGrid({
  values,
  onChange,
}: {
  values: Record<string, BehaviorLevel | undefined>;
  onChange: (id: string, level: BehaviorLevel) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {BEHAVIORS.map((behavior) => {
        const current = values[behavior.id];
        return (
          <div
            key={behavior.id}
            className={cn(
              "rounded-xl border p-3.5 transition-colors",
              current
                ? "border-ds-line bg-white"
                : "border-check-border bg-check-surface",
            )}
          >
            <p className="text-ds-ink mb-3 text-[14.5px] font-semibold">
              {behavior.label}
            </p>

            <div
              role="radiogroup"
              aria-label={behavior.label}
              className="grid grid-cols-5 gap-1.5"
            >
              {BEHAVIOR_LEVELS.map((level) => {
                const active = current === level.value;
                return (
                  <button
                    key={level.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onChange(behavior.id, level.value)}
                    className={cn(
                      "flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border px-1 py-2.5 transition-colors",
                      active
                        ? "border-ds-primary bg-ds-tint"
                        : "border-ds-line hover:border-ds-line-strong bg-white",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "block rounded-full transition-all",
                        active
                          ? "bg-ds-primary size-2.5"
                          : "bg-ds-line-strong size-2",
                      )}
                    />
                    <span
                      className={cn(
                        "text-center text-[10.5px] leading-tight",
                        active
                          ? "text-ds-navy font-bold"
                          : "text-ds-muted font-medium",
                      )}
                    >
                      {level.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
