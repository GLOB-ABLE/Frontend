/**
 * 인물 + 대사 화면 — 원본 프로토타입의 scene()
 *
 * 1·4·5·7번 화면이 이 레이아웃을 공유한다.
 */

import { ArrowRight } from "lucide-react";

import Image from "next/image";

import type { SceneCopy } from "@/lib/simulation/types";

export function SceneCard({
  copy,
  onNext,
}: {
  copy: SceneCopy;
  onNext: () => void;
}) {
  const { speaker } = copy;

  return (
    <section className="border-ds-line bg-ds-surface grid overflow-hidden rounded-2xl border shadow-[0_2px_12px_rgba(31,58,143,0.07)] lg:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
      {/* 인물 */}
      <div className="relative h-[320px] bg-[#ECEAF4] lg:h-auto lg:min-h-[520px]">
        <Image
          src={speaker.image}
          alt={`${speaker.name} ${speaker.role}`}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          priority
          className="object-cover object-top"
        />
        <span className="bg-ds-ink/85 absolute inset-x-4 bottom-4 rounded-[9px] px-3 py-2.5 text-[12.5px] font-bold text-white">
          {speaker.name} · {speaker.role}
        </span>
      </div>

      {/* 대사 */}
      <div className="flex flex-col items-start justify-center gap-4 p-6 sm:p-10">
        <span className="bg-ds-tint text-ds-navy rounded-[99px] px-3 py-2 text-[12px] font-extrabold">
          {copy.tag}
        </span>

        <h1 className="text-ds-navy text-2xl font-extrabold tracking-[-0.8px] sm:text-[28px]">
          {copy.title}
        </h1>

        <blockquote className="border-ds-line-strong w-full rounded-2xl border bg-[#F7FBFF] p-5">
          {copy.speech.map((line, i) => (
            <p
              key={line}
              className="text-ds-ink text-[15px] leading-[1.8] font-bold"
            >
              {i === 0 && "“"}
              {line}
              {i === copy.speech.length - 1 && "”"}
            </p>
          ))}
        </blockquote>

        <p className="bg-check-surface border-check-border text-ds-body w-full rounded-[11px] border px-4 py-3 text-[13px] leading-relaxed">
          {copy.note}
        </p>

        <button
          type="button"
          onClick={onNext}
          className="bg-ds-primary hover:bg-ds-navy inline-flex cursor-pointer items-center gap-2 rounded-[11px] px-5 py-3.5 text-[14px] font-bold text-white transition-colors"
        >
          {copy.action}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}
