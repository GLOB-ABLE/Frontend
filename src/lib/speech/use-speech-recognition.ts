"use client";

/**
 * 음성 인식 훅 — Web Speech API
 *
 * 브라우저가 직접 인식한다. 서버로 음성을 보내지 않는다.
 * 다만 Chrome은 내부적으로 구글 서버를 쓰므로, 화면에 "브라우저가 처리한다"고
 * 단정하지 않는다.
 *
 * 지원하지 않는 브라우저(Firefox 등)에서는 supported가 false다.
 * 쓰는 쪽에서 먼저 확인하고 마이크 버튼을 숨기거나 안내를 띄운다.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import type {
  SpeechRecognitionEventLike,
  SpeechRecognitionLike,
} from "@/types/speech-recognition";

/** 인식이 막힌 이유 — 화면에 그대로 띄운다 */
const ERROR_MESSAGE: Record<string, string> = {
  "not-allowed": "마이크 권한이 필요해요. 주소창에서 허용으로 바꿔주세요.",
  "service-not-allowed": "이 브라우저에서는 음성 인식을 쓸 수 없어요.",
  "no-speech": "소리가 들리지 않았어요. 다시 말해볼까요?",
  "audio-capture": "마이크를 찾지 못했어요. 연결 상태를 확인해주세요.",
  network: "네트워크가 끊겨 인식하지 못했어요.",
};

const DEFAULT_ERROR = "음성을 인식하지 못했어요. 다시 시도해주세요.";

/** 지원 여부는 바뀌지 않으므로 구독할 것이 없다 */
const noopSubscribe = () => () => {};

function readSupported(): boolean {
  return Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
}

/** 서버에서는 알 수 없다. false로 두면 하이드레이션이 어긋나지 않는다. */
const serverSupported = () => false;

export type SpeechRecognitionState = {
  /** 이 브라우저에서 쓸 수 있는지 */
  supported: boolean;
  listening: boolean;
  /** 아직 확정되지 않은 말 — 회색으로 미리 보여준다 */
  interim: string;
  error: string | null;
  start: () => void;
  stop: () => void;
};

export function useSpeechRecognition({
  lang = "ko-KR",
  /** 한 문장이 확정될 때마다 부른다 */
  onFinal,
}: {
  lang?: string;
  onFinal: (text: string) => void;
}): SpeechRecognitionState {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalRef = useRef(onFinal);

  // 렌더 중에 ref를 건드리지 않는다. 최신 콜백만 담아둔다.
  useEffect(() => {
    onFinalRef.current = onFinal;
  });

  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);

  const supported = useSyncExternalStore(
    noopSubscribe,
    readSupported,
    serverSupported,
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
    setInterim("");
  }, []);

  // 화면을 떠나면 마이크를 반드시 끈다.
  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    },
    [],
  );

  const start = useCallback(() => {
    if (recognitionRef.current) return;

    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      setError("이 브라우저에서는 음성 인식을 쓸 수 없어요.");
      return;
    }

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let pending = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          const trimmed = text.trim();
          if (trimmed) onFinalRef.current(trimmed);
        } else {
          pending += text;
        }
      }

      setInterim(pending);
    };

    recognition.onerror = ({ error: code }) => {
      // 말이 없어 끊긴 것은 오류로 보지 않는다. 다시 누르면 된다.
      setError(ERROR_MESSAGE[code] ?? DEFAULT_ERROR);
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setError(null);
      setListening(true);
    } catch {
      setError(DEFAULT_ERROR);
    }
  }, [lang]);

  return { supported, listening, interim, error, start, stop };
}
