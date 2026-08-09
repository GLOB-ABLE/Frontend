"use client";

/**
 * 요건별 상태 확인 — 공고 상세
 *
 * 버튼을 한 번 누르면 확인을 시작하고, 끝나면 결과가 그대로 남는다.
 * 접었다 폈다 하지 않는다. 한 번 확인한 결과를 다시 숨길 이유가 없다.
 *
 * 누르기 전에도 판정 자체는 위 판정 요약(VerdictSummary)에 개수와 근거 칩으로 나와 있다.
 * 근거 없는 판정 화면을 만들지 않는다는 규칙(PR-1)을 깨지 않는다.
 */

import { ArrowRight } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { HighlightCards } from "@/components/jobs/detail/highlight-cards";
import { RequirementTable } from "@/components/jobs/detail/requirement-table";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  GapSummary,
  HighlightItem,
  RequirementRow,
} from "@/lib/feed/types";
import { totalRequirements } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

/**
 * 확인 단계 — 무엇을 하고 있는지 순서대로 보여준다.
 *
 * ⚠️ 지금은 시연용 연출이다. 실제 API가 붙으면 각 단계를 진짜 진행 상태에 연결한다.
 *    문구는 "무엇을 확인하는 중인지"만 말한다. 합격 가능성을 계산한다고 쓰지 않는다 (PR-2).
 */
const STEPS = [
  "공고 원문에서 요건을 뽑고 있어요",
  "내 조건과 하나씩 맞춰보고 있어요",
  "판정 근거를 정리하고 있어요",
] as const;

/** 단계당 머무는 시간 */
const STEP_MS = 750;

type Phase = "idle" | "loading" | "ready";

export function RequirementDisclosure({
  requirements,
  gap,
  strengths,
  toFill,
}: {
  requirements: RequirementRow[];
  gap: GapSummary;
  strengths: HighlightItem[];
  toFill: HighlightItem[];
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  // 한 번만 누른다. 확인이 시작되면 버튼은 사라지고 되돌아오지 않는다.
  const start = () => {
    if (phase !== "idle") return;

    setPhase("loading");
    setStep(0);

    // 단계를 하나씩 넘기고, 마지막 단계가 끝나면 결과를 보여준다.
    timers.current = STEPS.map((_, i) =>
      setTimeout(
        () => (i === STEPS.length - 1 ? setPhase("ready") : setStep(i + 1)),
        STEP_MS * (i + 1),
      ),
    );
  };

  // 스켈레톤 높이를 맞추는 데만 쓴다. 화면에 개수를 적지는 않는다.
  const total = totalRequirements(gap);

  if (phase === "idle") {
    return (
      <button
        type="button"
        onClick={start}
        className="border-ds-line-strong bg-ds-surface hover:border-ds-primary hover:bg-ds-tint flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 text-left shadow-[0_1px_3px_rgba(31,58,143,0.05)] transition-colors sm:px-6"
      >
        {/*
          누르기 전에는 결과를 적지 않는다. 개수를 미리 보여주면
          "지금 확인하는 중"이라는 말과 앞뒤가 맞지 않는다.
        */}
        <span className="min-w-0 flex-1">
          <span className="text-ds-navy block text-[15.5px] font-extrabold">
            요건별 상태 보기
          </span>
          <span className="text-ds-muted mt-1 block text-[12.5px]">
            내 조건과 하나씩 맞춰서 확인해 드려요
          </span>
        </span>
        <ArrowRight aria-hidden className="text-ds-primary size-5 shrink-0" />
      </button>
    );
  }

  if (phase === "loading") {
    return (
      <div className="flex flex-col gap-4">
        <VerifyingPanel step={step} />
        <DisclosureSkeleton
          rows={total}
          strengthCount={strengths.length}
          toFillCount={toFill.length}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {requirements.length > 0 && (
        <RequirementTable requirements={requirements} gap={gap} />
      )}
      {(strengths.length > 0 || toFill.length > 0) && (
        <HighlightCards strengths={strengths} toFill={toFill} />
      )}
    </div>
  );
}

/**
 * 확인 중 패널 — 지금 무엇을 하고 있는지 단계로 보여준다.
 *
 * 진행률 %를 쓰지 않는다. 몇 단계 중 몇 번째인지 개수로만 말한다 (PR-2).
 * 상태 4색(충족·미충족·확인 필요·해당 없음)은 판정 전용이라 여기 쓰지 않는다.
 */
function VerifyingPanel({ step }: { step: number }) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="border-ds-line-strong rounded-2xl border bg-[#F7FBFF] p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="border-ds-line-strong border-t-ds-primary size-5 shrink-0 animate-[pol-spin_0.8s_linear_infinite] rounded-full border-2 motion-reduce:animate-none"
        />
        <div className="min-w-0 flex-1">
          {/* 아직 확인 전이라 요건 개수도 말하지 않는다 */}
          <p className="text-ds-navy text-[15px] font-extrabold">
            공고 요건을 확인하고 있어요
          </p>
          <p className="text-ds-muted mt-0.5 text-[12.5px]">
            {STEPS.length}단계 중 {step + 1}단계
          </p>
        </div>
      </div>

      <ol className="mt-4 flex flex-col gap-2.5">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2.5 text-[13.5px] transition-colors",
                current
                  ? "text-ds-ink font-bold"
                  : done
                    ? "text-ds-body"
                    : "text-ds-label",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-[18px] shrink-0 items-center justify-center rounded-full border text-[10px] font-extrabold",
                  done
                    ? "border-ds-primary bg-ds-primary text-white"
                    : current
                      ? "border-ds-primary text-ds-primary"
                      : "border-ds-line text-ds-label",
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              {label}
              {current && (
                <span
                  aria-hidden
                  className="bg-ds-primary size-1.5 shrink-0 animate-[pol-blink_1.2s_ease-in-out_infinite] rounded-full motion-reduce:animate-none"
                />
              )}
            </li>
          );
        })}
      </ol>

      <p className="text-ds-muted border-ds-line mt-4 border-t pt-3 text-[12px] leading-relaxed">
        합격 가능성은 계산하지 않아요. 무엇이 확인됐고 무엇이 남았는지만
        정리합니다.
      </p>
    </section>
  );
}

/**
 * 열리는 동안 자리를 잡아두는 스켈레톤.
 * 실제 개수만큼 그려야 내용이 들어올 때 화면이 튀지 않는다.
 */
function DisclosureSkeleton({
  rows,
  strengthCount,
  toFillCount,
}: {
  rows: number;
  strengthCount: number;
  toFillCount: number;
}) {
  // 채워야 할 것 패널에는 "N개를 해결하면…" 안내가 한 칸 더 붙는다
  const columns = [strengthCount, toFillCount + 1];

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex flex-col gap-4"
    >
      {/* 요건별 상태 표 */}
      <section className="border-ds-line bg-ds-surface rounded-2xl border p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="mb-5 h-3.5 w-3/5" />

        <div className="border-ds-divider overflow-hidden rounded-xl border">
          <div className="border-ds-divider hidden gap-3 border-b bg-[#F7FBFF] px-[18px] py-3 lg:flex">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 flex-1" />
            <Skeleton className="h-3.5 flex-1" />
            <Skeleton className="h-3.5 w-20" />
          </div>

          {Array.from({ length: Math.max(rows, 3) }).map((_, i) => (
            <div
              key={i}
              className="border-ds-divider flex items-center gap-3 border-b px-[18px] py-4 last:border-b-0"
            >
              <Skeleton className="h-4 w-20 shrink-0" />
              <Skeleton className="hidden h-4 flex-1 lg:block" />
              <Skeleton className="hidden h-4 flex-1 lg:block" />
              <Skeleton className="ml-auto h-7 w-24 shrink-0 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      {/* 내 강점 / 채워야 할 것 */}
      <div className="grid gap-4 md:grid-cols-2">
        {columns.map((count, col) => (
          <section
            key={col}
            className="border-ds-line bg-ds-surface rounded-2xl border p-5 sm:p-[22px]"
          >
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="size-[22px] rounded-[7px]" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: Math.max(count, 1) }).map((_, i) => (
                <div key={i} className="border-ds-line rounded-xl border p-3.5">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="mt-2 h-3.5 w-full" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
