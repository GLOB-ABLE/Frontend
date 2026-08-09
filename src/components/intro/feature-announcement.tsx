"use client";

/**
 * 인트로 신규 기능 안내 팝업 — 문화·언어 시뮬레이션
 *
 * 기존 온보딩 팝업(components/onboarding/onboarding-popup.tsx)의 구조를 따랐다.
 * 다만 여러 단계를 넘기지 않고 한 화면으로 둔다. 알릴 것이 하나뿐이다.
 *
 * 등장 인물 이미지를 그대로 써서 무엇을 하는 화면인지 바로 보이게 한다.
 * 글로만 설명하면 눌러볼 이유가 잘 생기지 않는다.
 *
 * 기기별 1회. localStorage에 닫음을 기록해 이후엔 뜨지 않는다.
 * 키에 버전을 넣어, 다음에 알릴 기능이 생기면 키만 올리면 된다.
 */

import { ArrowRight, Clock, Hand, Mic, Sparkles, X } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

import { GUEST, SUPERVISOR } from "@/lib/simulation/scenario";

const SEEN_KEY = "globable.announcement.simulation.v1";

const POINTS = [
  {
    icon: Mic,
    title: "말로 연습해요",
    body: "상사의 지시를 이해하고, 그 문장을 직접 말해봅니다.",
  },
  {
    icon: Hand,
    title: "행동까지 확인해요",
    body: "명함을 양손으로 받는 자세를 카메라 앞에서 연습합니다.",
  },
];

export function FeatureAnnouncement() {
  const [open, setOpen] = useState(false);

  // localStorage는 서버에서 못 읽는다. 마운트 후에 확인한다.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!localStorage.getItem(SEEN_KEY)) setOpen(true);
    } catch {
      // 프라이빗 모드 등으로 못 읽으면 열지 않는다.
    }
  }, []);

  const close = () => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // 저장에 실패해도 이번 세션에서는 닫는다.
    }
    setOpen(false);
  };

  // 열려 있는 동안 Esc로 닫고, 뒤 화면이 스크롤되지 않게 막는다.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-[pol-fade_0.2s_ease] items-center justify-center bg-[#0F1F3D]/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
      onClick={close}
    >
      <div
        className="bg-ds-surface relative w-full max-w-[460px] animate-[pol-pop_0.28s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-[24px] shadow-[0_30px_70px_rgba(15,31,61,0.35)] motion-reduce:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="닫기"
          className="absolute top-4 right-4 z-20 grid size-8 cursor-pointer place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
        >
          <X className="size-4" />
        </button>

        {/* 머리말 — 등장 인물을 함께 보여준다 */}
        <div className="from-ds-navy relative overflow-hidden bg-linear-160 to-[#2D5BC4] px-6 pt-7 pb-5">
          {/* 뒤쪽 장식 원 */}
          <span
            aria-hidden
            className="absolute -top-16 -right-10 size-44 rounded-full bg-white/[0.07]"
          />

          <div className="relative flex items-end gap-4">
            <div className="min-w-0 flex-1 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-[99px] bg-white/20 px-3 py-1.5 text-[12px] font-extrabold">
                <Sparkles className="size-3.5" aria-hidden />
                새로운 기능
              </span>

              <h2
                id="announcement-title"
                className="mt-3 text-[23px] leading-snug font-extrabold tracking-[-0.6px]"
              >
                문화·언어
                <br />
                시뮬레이션이 열렸어요
              </h2>
            </div>

            {/* 인물 두 명 — 실제 시뮬레이션에 나오는 사람들 */}
            <div className="relative h-[128px] w-[120px] shrink-0 self-end">
              <Image
                src={SUPERVISOR.image}
                alt=""
                aria-hidden
                width={800}
                height={1200}
                className="absolute bottom-0 left-0 h-full w-[74px] rounded-t-[14px] object-cover object-top"
              />
              <Image
                src={GUEST.image}
                alt=""
                aria-hidden
                width={800}
                height={1200}
                className="absolute right-0 bottom-0 h-[112px] w-[70px] rounded-t-[14px] object-cover object-top ring-2 ring-[#2D5BC4]"
              />
            </div>
          </div>

          <p className="text-ds-tint relative mt-3 text-[13.5px] leading-relaxed">
            한국 직장의 첫 손님 응대를 5단계로 연습해보세요. 읽고 넘기는 교육이
            아니라 직접 말하고 움직여 봅니다.
          </p>
        </div>

        {/* 무엇을 하는지 */}
        <ul className="flex flex-col gap-3.5 px-6 pt-5">
          {POINTS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-3">
              <span
                aria-hidden
                className="bg-ds-tint text-ds-navy grid size-9 shrink-0 place-items-center rounded-[11px]"
              >
                <Icon className="size-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-ds-ink text-[14px] font-extrabold">
                  {title}
                </p>
                <p className="text-ds-muted mt-0.5 text-[13px] leading-relaxed">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="px-6 pt-4 pb-6">
          {/* 얼마나 걸리는지 먼저 알려준다. 부담이 줄어든다. */}
          <p className="text-ds-muted mb-3 flex items-center justify-center gap-1.5 text-[12.5px] font-semibold">
            <Clock className="size-3.5" aria-hidden />약 5분이면 끝나요 ·
            가입하지 않아도 돼요
          </p>

          <Link
            href="/simulation"
            onClick={close}
            className="bg-ds-primary hover:bg-ds-navy group flex items-center justify-center gap-2 rounded-[14px] py-4 text-[15px] font-extrabold text-white shadow-[0_8px_20px_rgba(31,119,255,0.35)] transition-colors"
          >
            지금 해보기
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
