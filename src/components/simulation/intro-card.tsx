/**
 * 0. 시작 화면 — 페르소나와 오늘의 상황
 */

import { ArrowRight } from "lucide-react";

import Image from "next/image";

import { GUEST, INTRO, SUPERVISOR } from "@/lib/simulation/scenario";

export function IntroCard({ onStart }: { onStart: () => void }) {
  return (
    <section className="border-ds-line bg-ds-surface grid overflow-hidden rounded-2xl border shadow-[0_2px_12px_rgba(31,58,143,0.07)] lg:grid-cols-[minmax(0,54%)_minmax(0,46%)]">
      <div className="p-6 sm:p-10">
        <span className="bg-ds-tint text-ds-navy inline-block rounded-[99px] px-3 py-2 text-[12px] font-extrabold">
          {INTRO.tag}
        </span>

        <h1 className="text-ds-navy mt-4 text-[28px] font-extrabold tracking-[-1.2px] sm:text-[34px]">
          {INTRO.headline[0]}
          <br />
          <em className="text-ds-primary not-italic">{INTRO.highlight}</em>
          {INTRO.headline[1].replace(INTRO.highlight, "")}
        </h1>

        <p className="text-ds-body mt-3 text-[14.5px] leading-relaxed">
          {INTRO.description}
        </p>

        <div className="border-ds-line mt-4 rounded-[15px] border p-4">
          <small className="text-ds-muted text-[12.5px] font-bold">
            {INTRO.persona.label}
          </small>
          <p className="text-ds-ink mt-1.5 text-[14.5px] font-bold">
            {INTRO.persona.text}
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {INTRO.persona.chips.map((chip) => (
              <li
                key={chip}
                className="border-ds-line text-ds-body rounded-[7px] border bg-[#F7FBFF] px-2.5 py-1.5 text-[12px] font-semibold"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-ds-line mt-3 rounded-[15px] border p-4">
          <small className="text-ds-muted text-[12.5px] font-bold">
            {INTRO.situation.label}
          </small>
          <p className="text-ds-ink mt-1.5 text-[14.5px] font-bold">
            {INTRO.situation.text}
          </p>
          <p className="text-ds-muted mt-1.5 text-[13px]">
            {INTRO.situation.sub}
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="bg-ds-primary hover:bg-ds-navy mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[11px] py-3.5 text-[14.5px] font-bold text-white transition-colors"
        >
          {INTRO.action}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>

      {/* 인물 두 명 */}
      <div className="relative min-h-[360px] bg-linear-160 from-[#DCEBFB] to-[#F7FBFF] lg:min-h-[600px]">
        <Image
          src={SUPERVISOR.image}
          alt=""
          aria-hidden
          width={800}
          height={1200}
          className="absolute bottom-0 left-0 z-10 h-[86%] w-[58%] object-cover object-top"
        />
        <Image
          src={GUEST.image}
          alt=""
          aria-hidden
          width={800}
          height={1200}
          className="absolute -right-[5%] bottom-0 h-[86%] w-[58%] object-cover object-top"
        />
      </div>
    </section>
  );
}
