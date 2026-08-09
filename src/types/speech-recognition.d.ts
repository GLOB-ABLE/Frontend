/**
 * Web Speech API 타입 — 브라우저 표준에 아직 다 들어가지 않아 직접 적는다.
 *
 * Chrome·Edge·Safari는 `webkitSpeechRecognition`으로 붙는다.
 * Firefox는 지원하지 않는다 — 쓰는 쪽에서 지원 여부를 먼저 확인해야 한다.
 */

export type SpeechRecognitionAlternativeLike = {
  transcript: string;
  confidence: number;
};

export type SpeechRecognitionResultLike = {
  readonly length: number;
  /** 말이 끝나 확정된 결과인지 */
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
};

export type SpeechRecognitionResultListLike = {
  readonly length: number;
  [index: number]: SpeechRecognitionResultLike;
};

export type SpeechRecognitionEventLike = {
  /** 이번 이벤트에서 새로 생긴 결과의 시작 위치 */
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
};

export type SpeechRecognitionErrorEventLike = {
  /** "not-allowed" | "no-speech" | "audio-capture" | "network" 등 */
  error: string;
};

export type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

export type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
