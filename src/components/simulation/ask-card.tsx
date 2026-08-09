"use client";

/**
 * 8. 돌발 상황 — 손님에게 직접 질문하기
 *
 * 입력은 두 가지다. 타이핑하거나, 마이크를 눌러 말하거나.
 * 음성 인식은 Web Speech API를 쓴다 (lib/speech/use-speech-recognition.ts).
 * 지원하지 않는 브라우저에서는 마이크 버튼 대신 안내가 나온다.
 */

import { ArrowRight, Mic, Square } from "lucide-react";

import { useState } from "react";

import { ASK } from "@/lib/simulation/scenario";
import { useSpeechRecognition } from "@/lib/speech/use-speech-recognition";
import { cn } from "@/lib/utils";

export function AskCard({ onSubmit }: { onSubmit: () => void }) {
  const [answer, setAnswer] = useState("");

  const { supported, listening, interim, error, start, stop } =
    useSpeechRecognition({
      // 확정된 문장을 뒤에 이어 붙인다. 타이핑한 내용을 지우지 않는다.
      onFinal: (text) =>
        setAnswer((prev) => (prev ? `${prev.trimEnd()} ${text}` : text)),
    });

  const empty = answer.trim().length === 0;

  return (
    <section className="border-ds-line bg-ds-surface rounded-2xl border p-6 text-center shadow-[0_2px_12px_rgba(31,58,143,0.07)] sm:p-10">
      <span className="bg-ds-tint text-ds-navy inline-block rounded-[99px] px-3 py-2 text-[12px] font-extrabold">
        {ASK.tag}
      </span>

      <h1 className="text-ds-navy mt-4 text-2xl font-extrabold tracking-[-0.8px] sm:text-[28px]">
        {ASK.title}
      </h1>
      <p className="text-ds-muted mt-2 text-[13.5px]">{ASK.description}</p>

      <div className="mx-auto mt-6 flex w-full max-w-[680px] items-start gap-2.5">
        <div className="min-w-0 flex-1 text-left">
          <label htmlFor="sim-answer" className="sr-only">
            손님에게 할 질문
          </label>
          <textarea
            id="sim-answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={ASK.placeholder}
            className={cn(
              "text-ds-ink placeholder:text-ds-label block h-28 w-full resize-none rounded-[14px] border-[1.5px] p-4 text-[14.5px] transition-colors outline-none",
              listening ? "border-ds-primary" : "border-ds-line",
            )}
          />

          {/* 아직 확정되지 않은 말 — 회색으로 미리 보여준다 */}
          {listening && (
            <p className="text-ds-muted mt-2 min-h-[18px] text-[13px]">
              {interim || "듣고 있어요…"}
            </p>
          )}
        </div>

        {supported ? (
          <button
            type="button"
            onClick={listening ? stop : start}
            aria-pressed={listening}
            aria-label={listening ? "말하기 멈추기" : "마이크로 말하기"}
            className={cn(
              "grid size-14 shrink-0 cursor-pointer place-items-center rounded-full text-white transition-colors",
              listening
                ? "bg-ds-navy shadow-[0_0_0_6px_#D7EDFB]"
                : "bg-ds-primary hover:bg-ds-navy shadow-[0_0_0_6px_#EAF3FF]",
            )}
          >
            {listening ? (
              <Square className="size-5 fill-current" aria-hidden />
            ) : (
              <Mic className="size-5" aria-hidden />
            )}
          </button>
        ) : (
          <p className="text-ds-muted w-[120px] shrink-0 text-left text-[12px] leading-relaxed">
            이 브라우저에서는 음성 입력을 쓸 수 없어요. 직접 입력해주세요.
          </p>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="text-unmet-text mx-auto mt-2 max-w-[680px] text-left text-[12.5px]"
        >
          {error}
        </p>
      )}

      <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
        <li className="text-ds-muted self-center text-[12.5px]">힌트</li>
        {ASK.hints.map((hint) => (
          <li
            key={hint}
            className="border-ds-line text-ds-body rounded-[7px] border bg-[#F7FBFF] px-2.5 py-1.5 text-[12px] font-semibold"
          >
            {hint}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => {
          stop();
          onSubmit();
        }}
        disabled={empty}
        className="bg-ds-primary hover:bg-ds-navy mt-6 inline-flex cursor-pointer items-center gap-2 rounded-[11px] px-5 py-3.5 text-[14px] font-bold text-white transition-colors disabled:cursor-default disabled:opacity-45"
      >
        {ASK.action}
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </section>
  );
}
