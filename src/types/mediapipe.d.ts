/**
 * MediaPipe 전역 타입 — CDN 빌드용
 *
 * @mediapipe/hands · camera_utils · drawing_utils를 CDN에서 불러오면
 * 전역(window)에 Hands / Camera / drawConnectors / drawLandmarks /
 * HAND_CONNECTIONS가 붙는다. npm 패키지를 쓰지 않으므로 타입을 직접 적는다.
 *
 * 필요한 것만 적었다. 전체 API는 https://google.github.io/mediapipe 참고.
 */

/** 정규화 좌표 (0~1). z는 손목 기준 상대 깊이. */
export type NormalizedLandmark = {
  x: number;
  y: number;
  z: number;
  visibility?: number;
};

export type Handedness = {
  /** "Left" | "Right" — 거울 영상 기준이라 실제 손과 반대일 수 있다 */
  label: string;
  score: number;
  index: number;
};

export type HandsResults = {
  image: CanvasImageSource;
  multiHandLandmarks?: NormalizedLandmark[][];
  multiHandedness?: Handedness[];
};

export type HandsOptions = {
  maxNumHands?: number;
  modelComplexity?: 0 | 1;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
  selfieMode?: boolean;
};

export type HandsInstance = {
  setOptions(options: HandsOptions): void;
  onResults(callback: (results: HandsResults) => void): void;
  send(input: { image: CanvasImageSource }): Promise<void>;
  close(): Promise<void>;
};

export type CameraInstance = {
  start(): Promise<void>;
  stop(): void;
};

export type DrawOptions = {
  color?: string;
  lineWidth?: number;
  radius?: number;
};

declare global {
  const Hands: new (config: {
    locateFile: (file: string) => string;
  }) => HandsInstance;

  const Camera: new (
    video: HTMLVideoElement,
    config: {
      onFrame: () => Promise<void>;
      width: number;
      height: number;
    },
  ) => CameraInstance;

  const HAND_CONNECTIONS: readonly (readonly [number, number])[];

  function drawConnectors(
    ctx: CanvasRenderingContext2D,
    landmarks: NormalizedLandmark[],
    connections: readonly (readonly [number, number])[],
    options?: DrawOptions,
  ): void;

  function drawLandmarks(
    ctx: CanvasRenderingContext2D,
    landmarks: NormalizedLandmark[],
    options?: DrawOptions,
  ): void;
}
