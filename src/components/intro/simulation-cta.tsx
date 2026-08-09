/**
 * 인트로 하단 고정 유도 바 — 문화·언어 시뮬레이션
 *
 * 팝업(feature-announcement.tsx)은 한 번 닫으면 다시 뜨지 않는다.
 * 닫은 뒤에도 시뮬레이션으로 갈 길이 남아 있어야 해서 이 바를 둔다.
 *
 * 스크롤과 상관없이 화면 아래에 붙어 있는다.
 * 닫기 버튼은 두지 않았다 — 이 화면에서 가장 하고 싶은 안내다.
 */

import { ArrowRight, Sparkles } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { GUEST, SUPERVISOR } from "@/lib/simulation/scenario";

export function SimulationCta() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="pointer-events-auto mx-auto flex w-full max-w-[720px] animate-[pol-up_0.4s_ease_0.3s_both] items-center gap-3 rounded-[18px] border border-white/15 bg-[#16346F] p-3 shadow-[0_14px_40px_rgba(15,31,61,0.35)] backdrop-blur motion-reduce:animate-none sm:gap-4 sm:p-3.5">
        {/* 등장 인물 — 무엇을 하는 화면인지 바로 보이게 */}
        <div
          aria-hidden
          className="relative hidden h-14 w-[68px] shrink-0 sm:block"
        >
          <Image
            src={SUPERVISOR.image}
            alt=""
            width={800}
            height={1200}
            className="absolute bottom-0 left-0 h-14 w-9 rounded-[10px] object-cover object-top"
          />
          <Image
            src={GUEST.image}
            alt=""
            width={800}
            height={1200}
            className="absolute right-0 bottom-0 h-12 w-9 rounded-[10px] object-cover object-top ring-2 ring-[#16346F]"
          />
        </div>

        <div className="min-w-0 flex-1 text-white">
          <p className="flex items-center gap-1.5 text-[11.5px] font-extrabold text-[#9CC6FF]">
            <Sparkles className="size-3" aria-hidden />
            새로운 기능
          </p>
          <p className="mt-0.5 text-[14px] leading-snug font-extrabold sm:text-[15px]">
            문화·언어 시뮬레이션, 지금 해볼 수 있어요
          </p>
          <p className="mt-0.5 hidden text-[12.5px] text-white/70 sm:block">
            약 5분 · 가입하지 않아도 돼요
          </p>
        </div>

        <Link
          href="/simulation"
          className="text-ds-navy group inline-flex shrink-0 items-center gap-1.5 rounded-[12px] bg-white px-4 py-3 text-[13.5px] font-extrabold transition-colors hover:bg-[#DCEBFB]"
        >
          해보기
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
