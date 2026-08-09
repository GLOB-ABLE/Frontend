"use client";

/**
 * 2. 의미 확인 — 지시의 뜻 고르기
 * 3. 말하기 — 고른 문장을 직접 말해보기
 *
 * 말하기는 Web Speech API로 실제 인식한다.
 * 발음을 채점하지 않는다. 꼭 필요한 낱말이 들어갔는지만 본다 —
 * 발음 점수는 근거를 댈 수 없고, 금지 패턴이기도 하다 (PR-2).
 */

import { ArrowRight, Check, Mic, Square } from "lucide-react";

import { useState } from "react";

import type { MissionOutcome } from "@/lib/simulation/hand-judge";
import { CHOICES } from "@/lib/simulation/scenario";
import type { Choice } from "@/lib/simulation/types";
import { useSpeechRecognition } from "@/lib/speech/use-speech-recognition";
import { cn } from "@/lib/utils";

export function ChoiceCard({
  selected,
  onSelect,
  onNext,
}: {
  selected: Choice["id"] | null;
  onSelect: (id: Choice["id"]) => void;
  onNext: () => void;
}) {
  return (
    <section className="border-ds-line bg-ds-surface rounded-2xl border p-6 text-center shadow-[0_2px_12px_rgba(31,58,143,0.07)] sm:p-10">
      <span className="bg-ds-tint text-ds-navy inline-block rounded-[99px] px-3 py-2 text-[12px] font-extrabold">
        2단계 · 의미 확인
      </span>

      <h1 className="text-ds-navy mt-4 text-2xl font-extrabold tracking-[-0.8px] sm:text-[28px]">
        상사의 지시는 어떤 뜻인가요?
      </h1>
      <p className="text-ds-muted mt-2 text-[13.5px]">
        가장 정확한 의미를 고른 뒤 그 문장을 직접 말해보세요.
      </p>

      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {CHOICES.map((choice) => {
          const on = selected === choice.id;
          return (
            <li key={choice.id}>
              <button
                type="button"
                onClick={() => onSelect(choice.id)}
                aria-pressed={on}
                className={cn(
                  "h-full w-full cursor-pointer rounded-[15px] border-[1.5px] p-5 text-left transition-colors",
                  on
                    ? "border-ds-primary bg-ds-tint/40 shadow-[0_0_0_3px_#D7EDFB]"
                    : "border-ds-line hover:border-ds-line-strong",
                )}
              >
                <b className="text-ds-ink block text-[14.5px] font-extrabold">
                  {choice.id}. {choice.title}
                </b>
                <small className="text-ds-muted mt-2 block text-[13px] leading-relaxed">
                  “{choice.sentence}”
                </small>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onNext}
        disabled={selected === null}
        className="bg-ds-primary hover:bg-ds-navy mt-6 inline-flex cursor-pointer items-center gap-2 rounded-[11px] px-5 py-3.5 text-[14px] font-bold text-white transition-colors disabled:cursor-default disabled:opacity-45"
      >
        선택한 문장 말하기
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </section>
  );
}

/** 3. 고른 문장을 말해보는 화면 */
export function SpeakCard({
  choice,
  onDone,
}: {
  choice: Choice;
  onDone: (outcome: MissionOutcome) => void;
}) {
  const [heard, setHeard] = useState("");

  const { supported, listening, interim, error, start, stop } =
    useSpeechRecognition({
      onFinal: (text) => setHeard((prev) => (prev ? `${prev} ${text}` : text)),
    });

  // 공백을 지워서 비교한다. 인식기가 띄어쓰기를 다르게 넣는 일이 잦다.
  const flat = heard.replace(/\s/g, "");
  const matched = choice.keywords.filter((word) => flat.includes(word));
  const allMatched = matched.length === choice.keywords.length;

  const finish = () => {
    stop();
    if (allMatched) {
      onDone({
        status: "met",
        detail: `'${choice.keywords.join("'과 '")}'를 모두 말했어요.`,
      });
      return;
    }
    if (heard.trim().length === 0) {
      onDone({
        status: "check",
        detail: "말한 내용을 확인하지 못했어요.",
      });
      return;
    }
    const missing = choice.keywords.filter((word) => !flat.includes(word));
    onDone({
      status: "check",
      detail: `'${missing.join("', '")}'가 들리지 않았어요.`,
    });
  };

  return (
    <section className="border-ds-line bg-ds-surface rounded-2xl border p-6 text-center shadow-[0_2px_12px_rgba(31,58,143,0.07)] sm:p-10">
      <span className="bg-ds-tint text-ds-navy inline-block rounded-[99px] px-3 py-2 text-[12px] font-extrabold">
        2단계 · 의미 확인
      </span>

      <h1 className="text-ds-navy mt-4 text-2xl font-extrabold tracking-[-0.8px] sm:text-[28px]">
        선택한 문장을 직접 말해보세요
      </h1>

      <blockquote className="border-ds-line-strong text-ds-ink mx-auto mt-6 max-w-[640px] rounded-2xl border bg-[#F7FBFF] p-5 text-[15px] leading-[1.8] font-bold">
        “{choice.sentence}”
      </blockquote>

      {/* 꼭 들어가야 할 낱말 — 말하면 하나씩 채워진다 */}
      <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
        {choice.keywords.map((word) => {
          const on = flat.includes(word);
          return (
            <li
              key={word}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[7px] border px-2.5 py-1.5 text-[12.5px] font-bold transition-colors",
                on
                  ? "border-met-border bg-met-bg text-met-text"
                  : "border-ds-line text-ds-label",
              )}
            >
              {on && <Check className="size-3" strokeWidth={3.5} aria-hidden />}
              {word}
            </li>
          );
        })}
      </ul>

      {supported ? (
        <>
          <button
            type="button"
            onClick={listening ? stop : start}
            aria-pressed={listening}
            aria-label={listening ? "말하기 멈추기" : "마이크를 눌러 말하기"}
            className={cn(
              "mx-auto mt-6 grid size-20 cursor-pointer place-items-center rounded-full text-white transition-colors",
              listening
                ? "bg-ds-navy shadow-[0_0_0_10px_#D7EDFB]"
                : "bg-ds-primary hover:bg-ds-navy shadow-[0_0_0_10px_#EAF3FF]",
            )}
          >
            {listening ? (
              <Square className="size-6 fill-current" aria-hidden />
            ) : (
              <Mic className="size-7" aria-hidden />
            )}
          </button>

          <p
            className="text-ds-muted mx-auto mt-4 min-h-[20px] max-w-[640px] text-[13px]"
            role="status"
            aria-live="polite"
          >
            {heard ||
              interim ||
              (listening ? "듣고 있어요…" : "마이크를 눌러 말하기")}
          </p>
        </>
      ) : (
        <p className="text-ds-muted mx-auto mt-6 max-w-[420px] text-[13px] leading-relaxed">
          이 브라우저에서는 음성 인식을 쓸 수 없어요. Chrome에서 열면 말하기를
          연습할 수 있습니다.
        </p>
      )}

      {error && (
        <p role="alert" className="text-unmet-text mt-2 text-[12.5px]">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={finish}
        className="bg-ds-primary hover:bg-ds-navy mt-6 inline-flex cursor-pointer items-center gap-2 rounded-[11px] px-5 py-3.5 text-[14px] font-bold text-white transition-colors"
      >
        {allMatched ? "다음으로" : "건너뛰고 계속하기"}
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </section>
  );
}
