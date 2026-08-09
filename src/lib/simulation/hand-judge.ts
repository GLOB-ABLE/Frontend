/**
 * 명함 양손 전달 자세 판정 — 자료/02_hand_test.html의 규칙을 그대로 옮겼다.
 *
 * 판정은 순수 함수로 둔다. 화면(캔버스·타이머)과 섞이면 기준을 바꿀 때 위험해진다.
 *
 * 원본과 같은 값
 *   - 양손이 모두 보여야 한다 (multiHandLandmarks.length === 2)
 *   - 한 사람의 왼손 + 오른손이어야 한다
 *   - 두 손목 사이 거리 <= 0.38
 *   - 두 손목 평균 높이 0.35 ~ 0.95 (가슴/배)
 *   - 위 조건을 2초 유지
 */

import type { HandsResults, NormalizedLandmark } from "@/types/mediapipe";

/** 두 손목이 이보다 멀면 "모았다"고 보지 않는다 */
export const WRIST_MAX_DISTANCE = 0.38;

/** 손목 평균 높이 허용 범위. 값이 클수록 화면 아래쪽이다. */
export const WRIST_Y_MIN = 0.35;
export const WRIST_Y_MAX = 0.95;

/** 자세를 유지해야 하는 시간 */
export const REQUIRED_HOLD_MS = 2000;

/** MediaPipe 손 랜드마크에서 손목의 인덱스 */
const WRIST = 0;

/** 판정이 막힌 이유 — 화면에 그대로 띄운다 */
export type RejectReason = "no-hands" | "one-hand" | "too-far" | "wrong-height";

export const REJECT_MESSAGE: Record<RejectReason, string> = {
  "no-hands": "양손을 화면에 보여주세요",
  "one-hand": "한 사람의 양손이 보여야 합니다",
  "too-far": "두 손을 더 가까이 모아주세요",
  "wrong-height": "가슴이나 배 높이로 맞춰주세요",
};

export type Judgement =
  | { valid: true }
  | { valid: false; reason: RejectReason };

function distance(a: NormalizedLandmark, b: NormalizedLandmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 한 프레임의 인식 결과가 올바른 자세인지 판정한다.
 * 시간 유지 여부는 여기서 보지 않는다 — 호출하는 쪽이 센다.
 */
export function judgeFrame(results: HandsResults): Judgement {
  const landmarks = results.multiHandLandmarks;
  const handedness = results.multiHandedness;

  if (!landmarks || !handedness || landmarks.length !== 2) {
    return { valid: false, reason: "no-hands" };
  }

  const labels = handedness.map((h) => h.label);
  if (!labels.includes("Left") || !labels.includes("Right")) {
    return { valid: false, reason: "one-hand" };
  }

  const left = landmarks[0][WRIST];
  const right = landmarks[1][WRIST];

  if (distance(left, right) > WRIST_MAX_DISTANCE) {
    return { valid: false, reason: "too-far" };
  }

  const averageY = (left.y + right.y) / 2;
  if (averageY < WRIST_Y_MIN || averageY > WRIST_Y_MAX) {
    return { valid: false, reason: "wrong-height" };
  }

  return { valid: true };
}

/** "2.0초 중 1.4초" 형태. 진행률 %를 쓰지 않는다 (PR-2). */
export function holdLabel(heldMs: number): string {
  const held = Math.min(heldMs, REQUIRED_HOLD_MS) / 1000;
  const required = REQUIRED_HOLD_MS / 1000;
  return `${required.toFixed(1)}초 중 ${held.toFixed(1)}초`;
}

/**
 * 미션 결과.
 * 통과하면 충족, 못 했으면 확인 필요다. 미충족으로 두지 않는다 —
 * 자세를 못 잡은 것과 할 수 없는 것은 다르다.
 */
export type MissionOutcome = {
  status: "met" | "check";
  detail: string;
};

export function outcomeFor(
  passed: boolean,
  bestHeldMs: number,
): MissionOutcome {
  if (passed) {
    return {
      status: "met",
      detail: "두 손을 모은 자세를 2초 동안 유지했어요.",
    };
  }
  if (bestHeldMs === 0) {
    return {
      status: "check",
      detail: "자세를 인식하지 못했어요. 카메라 앞에서 다시 해볼 수 있어요.",
    };
  }
  return {
    status: "check",
    detail: `2초 유지 중 ${(bestHeldMs / 1000).toFixed(1)}초에서 자세가 풀렸어요.`,
  };
}
