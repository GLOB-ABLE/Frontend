/**
 * 시뮬레이션 상단 스텝바 — 원본 프로토타입의 .steps
 *
 * 색만 디자인 시스템으로 바꿨다. 보라(#7058dc) → ds-primary.
 */

import { SCENE_STEP, STEPS } from "@/lib/simulation/scenario";
import type { SceneId } from "@/lib/simulation/types";
import { cn } from "@/lib/utils";

export function StepBar({ scene }: { scene: SceneId }) {
  const current = SCENE_STEP[scene];

  return (
    <ol
      className="hidden flex-wrap items-center justify-center gap-x-7 gap-y-2 md:flex"
      aria-label="시뮬레이션 진행 단계"
    >
      {STEPS.map((step) => {
        const active = current === step.id;
        const done = current !== null && current > step.id;

        return (
          <li
            key={step.id}
            aria-current={active ? "step" : undefined}
            className={cn(
              "flex items-center gap-1.5 text-[12.5px] font-bold",
              active
                ? "text-ds-primary"
                : done
                  ? "text-ds-body"
                  : "text-ds-label",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "grid size-[25px] place-items-center rounded-full border text-[11px]",
                active
                  ? "border-ds-primary bg-ds-primary text-white"
                  : done
                    ? "border-ds-primary text-ds-primary"
                    : "border-ds-line-strong text-ds-label",
              )}
            >
              {done ? "✓" : step.id}
            </span>
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
