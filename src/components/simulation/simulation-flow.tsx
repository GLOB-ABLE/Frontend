"use client";

/**
 * 직장 시뮬레이션 — 화면 진행 관리
 *
 * 화면 번호는 원본 프로토타입의 screens[0..9]와 같다 (docs/simulation.md).
 *   0 시작 · 1 업무 지시 · 2 의미 선택 · 3 말하기 · 4 확인 완료
 *   5 손님 도착 · 6 웹캠 미션 · 7 돌발 상황 · 8 질문 · 9 결과
 *
 * 2번에서 틀린 선택지(A)를 고르면 3번에서 다시 2번으로 돌아온다. 원본과 같다.
 */

import { X } from "lucide-react";

import Link from "next/link";

import { useState } from "react";

import { GrowthBackLink } from "@/components/growth/growth-back-link";
import { DevNotice } from "@/components/layout/dev-notice";
import { AskCard } from "@/components/simulation/ask-card";
import { ChoiceCard, SpeakCard } from "@/components/simulation/choice-card";
import { HandMissionCard } from "@/components/simulation/hand-mission-card";
import { IntroCard } from "@/components/simulation/intro-card";
import { ResultCard } from "@/components/simulation/result-card";
import { SceneCard } from "@/components/simulation/scene-card";
import { StepBar } from "@/components/simulation/step-bar";
import type { MissionOutcome } from "@/lib/simulation/hand-judge";
import {
  BRIEFING,
  CHOICES,
  CONFIRMED,
  GUEST_ARRIVAL,
  TROUBLE,
} from "@/lib/simulation/scenario";
import type { Choice, SceneId } from "@/lib/simulation/types";

/** 아직 해보지 않았을 때의 값 */
const NOT_SPOKEN: MissionOutcome = {
  status: "check",
  detail: "말한 내용을 확인하지 않았어요.",
};

const NOT_TRIED: MissionOutcome = {
  status: "check",
  detail: "자세를 확인하지 않았어요.",
};

export function SimulationFlow() {
  const [scene, setScene] = useState<SceneId>(0);
  const [choice, setChoice] = useState<Choice["id"] | null>(null);
  const [speechOutcome, setSpeechOutcome] =
    useState<MissionOutcome>(NOT_SPOKEN);
  const [handOutcome, setHandOutcome] = useState<MissionOutcome>(NOT_TRIED);

  const go = (next: SceneId) => {
    setScene(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const picked = CHOICES.find((c) => c.id === choice) ?? CHOICES[0];

  return (
    <div className="bg-ds-page min-h-full">
      <header className="border-ds-line bg-ds-surface border-b">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
          <p className="text-ds-navy shrink-0 text-[15px] font-extrabold">
            직장 언어·문화 시뮬레이션
          </p>

          <div className="order-3 w-full lg:order-2 lg:w-auto lg:flex-1">
            <StepBar scene={scene} />
          </div>

          <Link
            href="/growth"
            className="border-ds-line-strong text-ds-body hover:bg-ds-tint order-2 ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-[9px] border px-3.5 py-2 text-[13px] font-bold transition-colors lg:order-3"
          >
            <X className="size-3.5" aria-hidden />
            나가기
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
        {/* 시작 화면에서만 허브로 돌아가는 길을 둔다. 시나리오 중에는 흐름을 끊지 않는다. */}
        {scene === 0 && <GrowthBackLink className="mb-4" />}

        {/*
          최상단 안내 바는 스크롤하면 올라가버린다.
          시뮬레이션은 화면이 길어서 여기 한 번 더 둔다.
        */}
        <DevNotice variant="inline" className="mb-4" />

        {scene === 0 && <IntroCard onStart={() => go(1)} />}

        {scene === 1 && <SceneCard copy={BRIEFING} onNext={() => go(2)} />}

        {scene === 2 && (
          <ChoiceCard
            selected={choice}
            onSelect={setChoice}
            onNext={() => go(3)}
          />
        )}

        {scene === 3 && (
          <SpeakCard
            choice={picked}
            onDone={(outcome) => {
              setSpeechOutcome(outcome);
              // 맞게 골랐으면 다음으로, 아니면 선택 화면으로 되돌아간다.
              go(picked.correct ? 4 : 2);
            }}
          />
        )}

        {scene === 4 && <SceneCard copy={CONFIRMED} onNext={() => go(5)} />}

        {scene === 5 && <SceneCard copy={GUEST_ARRIVAL} onNext={() => go(6)} />}

        {scene === 6 && (
          <HandMissionCard
            onDone={(outcome) => {
              setHandOutcome(outcome);
              go(7);
            }}
          />
        )}

        {scene === 7 && <SceneCard copy={TROUBLE} onNext={() => go(8)} />}

        {scene === 8 && <AskCard onSubmit={() => go(9)} />}

        {scene === 9 && (
          <ResultCard
            speechOutcome={speechOutcome}
            handOutcome={handOutcome}
            onRetry={() => {
              setChoice(null);
              setSpeechOutcome(NOT_SPOKEN);
              setHandOutcome(NOT_TRIED);
              go(1);
            }}
          />
        )}
      </main>
    </div>
  );
}
