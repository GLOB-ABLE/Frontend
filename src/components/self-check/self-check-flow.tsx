"use client";

/**
 * 03 진단 — 내 조건 진단 (4단계 위저드)
 *
 * 문항 정의: docs/내-조건-진단-문항.md
 * 각 단계 끝에서 저장한다. 중간에 나가도 다음에 이어서 할 수 있다.
 */

import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { useRouter } from "next/navigation";

import { useCallback, useState } from "react";

import { Step1, Step2, Step3, Step4 } from "@/components/self-check/steps";
import { isStepComplete, STEPS, type Step } from "@/lib/self-check/questions";
import { saveAnswers, useStoredAnswers } from "@/lib/self-check/store";
import { EMPTY_ANSWERS, type SelfCheckAnswers } from "@/lib/self-check/types";
import { cn } from "@/lib/utils";

/**
 * 저장된 응답을 다 읽은 뒤에야 위저드를 띄운다.
 * 이렇게 해야 effect 안에서 상태를 되돌리지 않아도 된다.
 */
export function SelfCheckFlow() {
  const saved = useStoredAnswers();

  if (saved === undefined) {
    return (
      <div className="bg-ds-page min-h-full">
        <div className="mx-auto w-full max-w-[760px] px-4 py-10 sm:px-6">
          <div className="border-ds-line bg-ds-surface h-40 animate-pulse rounded-2xl border" />
        </div>
      </div>
    );
  }

  return <FlowInner initial={saved ?? EMPTY_ANSWERS} />;
}

function FlowInner({ initial }: { initial: SelfCheckAnswers }) {
  const router = useRouter();
  const [step, setStep] = useState<Step["id"]>(1);
  const [answers, setAnswers] = useState<SelfCheckAnswers>(initial);
  const [showRequired, setShowRequired] = useState(false);

  const patch = useCallback((next: Partial<SelfCheckAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...next }));
    setShowRequired(false);
  }, []);

  const current = STEPS.find((s) => s.id === step)!;
  const complete = isStepComplete(step, answers);
  const isLast = step === 4;

  const goNext = () => {
    if (!complete) {
      setShowRequired(true);
      return;
    }
    saveAnswers(answers);
    if (isLast) {
      router.push("/self-check/result");
      return;
    }
    setStep((s) => (s + 1) as Step["id"]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    if (step === 1) return;
    saveAnswers(answers);
    setStep((s) => (s - 1) as Step["id"]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-ds-page min-h-full">
      <div className="mx-auto w-full max-w-[760px] px-4 pt-6 pb-28 sm:px-6">
        {/* 단계 표시 */}
        <ol className="mb-5 flex items-center gap-1.5">
          {STEPS.map((s) => {
            const done = s.id < step;
            const active = s.id === step;
            return (
              <li key={s.id} className="flex flex-1 flex-col gap-1.5">
                <span
                  className={cn(
                    "h-1 rounded-full transition-colors",
                    done || active ? "bg-ds-primary" : "bg-ds-line",
                  )}
                />
                <span
                  className={cn(
                    "hidden text-[11.5px] font-semibold sm:block",
                    active
                      ? "text-ds-navy"
                      : done
                        ? "text-ds-primary"
                        : "text-ds-label",
                  )}
                >
                  {s.name}
                </span>
              </li>
            );
          })}
        </ol>

        <header className="mb-5">
          <p className="text-ds-primary mb-1.5 text-[12.5px] font-bold">
            STEP {current.id} / 4 · {current.duration}
          </p>
          <h1 className="text-ds-navy text-2xl font-extrabold tracking-[-0.6px]">
            {current.name}
          </h1>
          <p className="text-ds-muted mt-2 text-[13.5px] leading-relaxed">
            {current.lead}
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {step === 1 && <Step1 answers={answers} patch={patch} />}
          {step === 2 && <Step2 answers={answers} patch={patch} />}
          {step === 3 && <Step3 answers={answers} patch={patch} />}
          {step === 4 && <Step4 answers={answers} patch={patch} />}
        </div>

        {showRequired && !complete && (
          <p
            role="alert"
            className="border-check-border bg-check-surface text-check-text mt-4 rounded-xl border px-4 py-3 text-[13.5px] font-semibold"
          >
            아직 답하지 않은 필수 문항이 있어요.
          </p>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="border-ds-line bg-ds-surface/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur">
        <div className="mx-auto flex w-full max-w-[760px] items-center gap-3 px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 1}
            className="border-ds-line text-ds-body hover:border-ds-line-strong flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-3 text-[14px] font-bold transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
            이전
          </button>

          <button
            type="button"
            onClick={goNext}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-[15px] font-bold transition-colors",
              complete
                ? "bg-ds-primary hover:bg-ds-navy text-white"
                : "bg-ds-line text-ds-muted",
            )}
          >
            {isLast ? (
              <>
                <Check className="size-4" strokeWidth={3} />
                진단 마치기
              </>
            ) : (
              <>
                다음
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
