"use client";

/**
 * 마이페이지 저장 레이어 (localStorage)
 *
 * 백엔드가 붙기 전까지 브라우저에 저장한다.
 * 화면은 이 훅만 쓰므로, 나중에 내부 구현을 API 호출로 바꾸면 화면은 그대로 둘 수 있다.
 *
 * useSyncExternalStore를 쓰는 이유:
 * 서버 렌더에는 기본값을, 클라이언트에는 저장 값을 주면서도
 * effect에서 setState를 부르지 않아 렌더가 연쇄되지 않는다.
 */

import { useCallback, useSyncExternalStore } from "react";

import { INITIAL_DOCUMENTS, INITIAL_RESUME } from "./mock";
import type { DocumentFile, ResumeForm } from "./types";

const KEY = {
  resume: "syfity.mypage.resume.v1",
  documents: "syfity.mypage.documents.v1",
} as const;

/**
 * 스냅샷 캐시.
 * useSyncExternalStore는 값이 바뀌지 않으면 같은 참조가 돌아와야 하므로
 * 매 호출마다 JSON.parse를 하지 않고 캐시를 들고 있는다.
 */
const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

function subscribe(key: string, onChange: () => void): () => void {
  const set = listeners.get(key) ?? new Set();
  set.add(onChange);
  listeners.set(key, set);
  return () => set.delete(onChange);
}

function emit(key: string): void {
  listeners.get(key)?.forEach((fn) => fn());
}

function getSnapshot<T>(key: string, fallback: T): T {
  if (cache.has(key)) return cache.get(key) as T;

  let value = fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) value = JSON.parse(raw) as T;
  } catch {
    // 저장 값이 깨졌으면 기본값을 쓴다. 부분 복구는 시도하지 않는다.
  }
  cache.set(key, value);
  return value;
}

function setValue<T>(key: string, value: T): void {
  cache.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 용량 초과 등은 무시한다. 저장 실패가 입력을 막지는 않게 한다.
  }
  emit(key);
}

function usePersistent<T>(key: string, initial: T) {
  const value = useSyncExternalStore(
    useCallback((cb: () => void) => subscribe(key, cb), [key]),
    () => getSnapshot(key, initial),
    () => initial,
  );

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = getSnapshot(key, initial);
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      setValue(key, resolved);
    },
    [key, initial],
  );

  return [value, update] as const;
}

export function useResume() {
  const [resume, setResume] = usePersistent<ResumeForm>(
    KEY.resume,
    INITIAL_RESUME,
  );

  const reset = useCallback(() => setResume(INITIAL_RESUME), [setResume]);

  return { resume, setResume, reset };
}

export function useDocuments() {
  const [documents, setDocuments] = usePersistent<DocumentFile[]>(
    KEY.documents,
    INITIAL_DOCUMENTS,
  );

  const add = useCallback(
    (file: DocumentFile) => setDocuments((prev) => [file, ...prev]),
    [setDocuments],
  );

  const remove = useCallback(
    (id: string) => setDocuments((prev) => prev.filter((f) => f.id !== id)),
    [setDocuments],
  );

  const patch = useCallback(
    (id: string, changes: Partial<DocumentFile>) =>
      setDocuments((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...changes } : f)),
      ),
    [setDocuments],
  );

  /** 기본 이력서는 하나만 둔다 */
  const setPrimary = useCallback(
    (id: string) =>
      setDocuments((prev) =>
        prev.map((f) => ({
          ...f,
          isPrimary: f.kind === "resume" ? f.id === id : f.isPrimary,
        })),
      ),
    [setDocuments],
  );

  return { documents, add, remove, patch, setPrimary };
}
