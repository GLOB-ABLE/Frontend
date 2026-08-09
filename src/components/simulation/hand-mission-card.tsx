"use client";

/**
 * 6. 웹캠 행동 미션 — 명함 양손 전달
 *
 * 판정 규칙은 lib/simulation/hand-judge.ts에 있다 (자료/02_hand_test.html과 같은 값).
 * 여기서는 카메라를 열고, 프레임마다 판정을 물어보고, 유지 시간을 센다.
 *
 * ⚠️ 카메라 정리는 반드시 cleanup에서 한다.
 *    Camera.stop()만으로는 트랙이 남을 수 있어 getTracks()도 함께 멈춘다.
 *    안 하면 화면을 떠나도 카메라 표시등이 켜져 있다.
 */

import {
  ArrowRight,
  Camera as CameraIcon,
  CameraOff,
  Check,
} from "lucide-react";

import Script from "next/script";

import { useCallback, useEffect, useRef, useState } from "react";

import { HAND_MISSION } from "@/lib/simulation/scenario";
import {
  holdLabel,
  judgeFrame,
  outcomeFor,
  REJECT_MESSAGE,
  REQUIRED_HOLD_MS,
  type MissionOutcome,
} from "@/lib/simulation/hand-judge";
import type { CameraInstance, HandsInstance } from "@/types/mediapipe";
import { cn } from "@/lib/utils";

const CDN = "https://cdn.jsdelivr.net/npm/@mediapipe";
const VIDEO_SIZE = { width: 640, height: 480 };

type Phase = "idle" | "starting" | "tracking" | "passed" | "denied";

export function HandMissionCard({
  onDone,
}: {
  onDone: (outcome: MissionOutcome) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<HandsInstance | null>(null);
  const cameraRef = useRef<CameraInstance | null>(null);

  /** 자세가 유효해진 시각. 풀리면 null로 되돌린다. */
  const holdStartRef = useRef<number | null>(null);
  /** 이번 시도에서 가장 오래 유지한 시간 — 실패해도 결과에 적는다 */
  const bestHeldRef = useRef(0);
  const passedRef = useRef(false);

  const [scriptsReady, setScriptsReady] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState(REJECT_MESSAGE["no-hands"]);
  const [heldMs, setHeldMs] = useState(0);

  const allScriptsReady = scriptsReady >= 3;

  /** 카메라와 인식기를 모두 정리한다 */
  const teardown = useCallback(() => {
    cameraRef.current?.stop();
    cameraRef.current = null;

    const video = videoRef.current;
    const stream = video?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
    if (video) video.srcObject = null;

    void handsRef.current?.close();
    handsRef.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  const handleResults = useCallback(
    (results: Parameters<Parameters<HandsInstance["onResults"]>[0]>[0]) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const judgement = judgeFrame(results);

      // 손 그리기 — 상태 4색은 판정 배지 전용이라 여기서는 파랑/회색만 쓴다
      for (const landmarks of results.multiHandLandmarks ?? []) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
          color: judgement.valid ? "#1F77FF" : "#94A3B8",
          lineWidth: 4,
        });
        drawLandmarks(ctx, landmarks, { color: "#FFFFFF", lineWidth: 2 });
      }
      ctx.restore();

      if (passedRef.current) return;

      if (!judgement.valid) {
        holdStartRef.current = null;
        setHeldMs(0);
        setMessage(REJECT_MESSAGE[judgement.reason]);
        return;
      }

      const now = Date.now();
      if (holdStartRef.current === null) holdStartRef.current = now;

      const held = now - holdStartRef.current;
      bestHeldRef.current = Math.max(bestHeldRef.current, held);
      setHeldMs(held);
      setMessage("좋아요. 자세를 그대로 유지해주세요");

      if (held >= REQUIRED_HOLD_MS) {
        passedRef.current = true;
        setPhase("passed");
        setMessage("자세를 2초 동안 유지했어요");
      }
    },
    [],
  );

  const start = async () => {
    if (phase === "starting" || phase === "tracking") return;
    if (!allScriptsReady) return;

    setPhase("starting");
    passedRef.current = false;
    holdStartRef.current = null;
    bestHeldRef.current = 0;
    setHeldMs(0);

    try {
      const video = videoRef.current;
      if (!video) return;

      const hands = new Hands({ locateFile: (file) => `${CDN}/hands/${file}` });
      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });
      hands.onResults(handleResults);
      handsRef.current = hands;

      const camera = new Camera(video, {
        onFrame: async () => {
          if (handsRef.current) await handsRef.current.send({ image: video });
        },
        ...VIDEO_SIZE,
      });
      cameraRef.current = camera;

      await camera.start();
      setPhase("tracking");
    } catch {
      teardown();
      setPhase("denied");
    }
  };

  const retry = () => {
    passedRef.current = false;
    holdStartRef.current = null;
    bestHeldRef.current = 0;
    setHeldMs(0);
    setMessage(REJECT_MESSAGE["no-hands"]);
    setPhase("tracking");
  };

  const finish = () => {
    const outcome = outcomeFor(passedRef.current, bestHeldRef.current);
    teardown();
    onDone(outcome);
  };

  const showOverlay =
    phase === "idle" || phase === "starting" || phase === "denied";

  return (
    <>
      {/* MediaPipe는 CDN 전역 스크립트다. 셋 다 준비돼야 카메라를 켤 수 있다. */}
      <Script
        src={`${CDN}/hands/hands.js`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onReady={() => setScriptsReady((n) => n + 1)}
      />
      <Script
        src={`${CDN}/camera_utils/camera_utils.js`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onReady={() => setScriptsReady((n) => n + 1)}
      />
      <Script
        src={`${CDN}/drawing_utils/drawing_utils.js`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onReady={() => setScriptsReady((n) => n + 1)}
      />

      <section className="border-ds-line bg-ds-surface grid overflow-hidden rounded-2xl border shadow-[0_2px_12px_rgba(31,58,143,0.07)] lg:grid-cols-[minmax(0,1fr)_285px]">
        <div className="p-6 sm:p-10">
          <span className="bg-ds-tint text-ds-navy inline-block rounded-[99px] px-3 py-2 text-[12px] font-extrabold">
            {HAND_MISSION.tag}
          </span>

          <h1 className="text-ds-navy mt-4 text-2xl font-extrabold tracking-[-0.8px] sm:text-[28px]">
            {HAND_MISSION.title}
          </h1>
          <p className="text-ds-muted mt-2 text-[13.5px]">
            {HAND_MISSION.description}
          </p>

          <div className="relative mt-5 aspect-4/3 overflow-hidden rounded-2xl bg-[#20232A]">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 size-full scale-x-[-1] object-cover"
            />
            <canvas
              ref={canvasRef}
              width={VIDEO_SIZE.width}
              height={VIDEO_SIZE.height}
              className="absolute inset-0 size-full scale-x-[-1] object-cover"
            />

            {showOverlay && (
              <div className="absolute inset-0 grid place-content-center gap-3 bg-[#20232A] text-center text-white">
                {phase === "denied" ? (
                  <>
                    <CameraOff className="mx-auto size-7" aria-hidden />
                    <b className="text-[14.5px]">카메라를 열지 못했어요</b>
                    <p className="mx-auto max-w-[300px] text-[12.5px] text-white/70">
                      브라우저 주소창의 카메라 권한을 허용으로 바꾸고 다시
                      시도해주세요.
                    </p>
                  </>
                ) : (
                  <>
                    <CameraIcon className="mx-auto size-7" aria-hidden />
                    <b className="text-[14.5px]">
                      {phase === "starting"
                        ? "카메라를 켜는 중…"
                        : allScriptsReady
                          ? "카메라가 꺼져 있습니다"
                          : "동작 인식을 준비하는 중…"}
                    </b>
                  </>
                )}

                <button
                  type="button"
                  onClick={start}
                  disabled={phase === "starting" || !allScriptsReady}
                  className="bg-ds-primary hover:bg-ds-navy mx-auto mt-1 cursor-pointer rounded-[10px] px-4 py-2.5 text-[13px] font-bold transition-colors disabled:cursor-default disabled:opacity-60"
                >
                  {phase === "denied" ? "다시 시도하기" : "카메라 켜기"}
                </button>
              </div>
            )}
          </div>

          {/* 유지 시간 — 진행률 %를 쓰지 않는다 */}
          {(phase === "tracking" || phase === "passed") && (
            <div
              className={cn(
                "mt-4 rounded-[13px] border px-4 py-3.5",
                phase === "passed"
                  ? "border-met-border bg-met-surface"
                  : "border-ds-line bg-[#F7FBFF]",
              )}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2.5">
                {phase === "passed" && (
                  <span
                    aria-hidden
                    className="bg-met grid size-5 shrink-0 place-items-center rounded-full text-white"
                  >
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                )}
                <p
                  className={cn(
                    "text-[14.5px] font-bold",
                    phase === "passed" ? "text-met-text" : "text-ds-ink",
                  )}
                >
                  {message}
                </p>
                <span className="text-ds-muted ml-auto shrink-0 text-[12.5px] font-semibold">
                  {holdLabel(phase === "passed" ? REQUIRED_HOLD_MS : heldMs)}
                </span>
              </div>

              <div
                className="bg-ds-line mt-2.5 h-2.5 overflow-hidden rounded-md"
                role="img"
                aria-label={holdLabel(heldMs)}
              >
                <div
                  className={cn(
                    "h-full rounded-md transition-[width] duration-100",
                    phase === "passed" ? "bg-met" : "bg-ds-primary",
                  )}
                  style={{
                    width: `${Math.min(heldMs / REQUIRED_HOLD_MS, 1) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {phase === "passed" && (
              <button
                type="button"
                onClick={retry}
                className="border-ds-line-strong text-ds-body hover:bg-ds-tint cursor-pointer rounded-[10px] border px-4 py-2.5 text-[13px] font-bold transition-colors"
              >
                다시 해보기
              </button>
            )}
            <button
              type="button"
              onClick={finish}
              className="bg-ds-primary hover:bg-ds-navy inline-flex cursor-pointer items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-bold text-white transition-colors"
            >
              {phase === "passed" ? "다음으로" : "건너뛰고 계속하기"}
              <ArrowRight className="size-3.5" aria-hidden />
            </button>
          </div>

          <p className="text-ds-muted mt-3 text-[12px] leading-relaxed">
            {HAND_MISSION.privacyNote}
          </p>
        </div>

        {/* 동작 가이드 */}
        <aside className="border-ds-line bg-[#FAFCFF] p-6 lg:border-l">
          <h2 className="text-ds-navy text-[14.5px] font-extrabold">
            양손 전달 자세
          </h2>
          <ol className="mt-3">
            {HAND_MISSION.guide.map((line, i) => (
              <li
                key={line}
                className="border-ds-line text-ds-body flex items-center gap-2.5 border-b py-3.5 text-[13px] last:border-b-0"
              >
                <span
                  aria-hidden
                  className="bg-ds-tint text-ds-navy grid size-[25px] shrink-0 place-items-center rounded-full text-[12px] font-extrabold"
                >
                  {i + 1}
                </span>
                {line}
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </>
  );
}
