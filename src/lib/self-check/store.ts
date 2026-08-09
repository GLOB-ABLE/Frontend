"use client";

/**
 * 진단 응답 저장 — 프로토타입용 localStorage
 *
 * 실제 서비스에서는 Supabase에 저장하고 RLS로 보호한다.
 * 여기 저장되는 값은 화면 확인용이며 증빙 파일 자체는 담지 않는다.
 *
 * 읽기는 useSyncExternalStore로 노출한다. effect 안에서 setState 하지 않기 위함이다.
 */

import { useSyncExternalStore } from "react";

import { EMPTY_ANSWERS, type SelfCheckAnswers } from "@/lib/self-check/types";

const KEY = "syfity.self-check.v1";

/**
 * undefined = 아직 읽지 않음 (서버 렌더 / 하이드레이션 전)
 * null      = 저장된 응답 없음
 */
type Snapshot = SelfCheckAnswers | null | undefined;

let cache: Snapshot = undefined;
let cacheValid = false;

const listeners = new Set<() => void>();

function readStorage(): SelfCheckAnswers | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    // 저장 스키마가 바뀌어도 화면이 깨지지 않도록 기본값 위에 덮어쓴다
    return { ...EMPTY_ANSWERS, ...(JSON.parse(raw) as SelfCheckAnswers) };
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Snapshot {
  if (!cacheValid) {
    cache = readStorage();
    cacheValid = true;
  }
  return cache;
}

/** 서버에서는 저장값을 알 수 없다 */
function getServerSnapshot(): Snapshot {
  return undefined;
}

/**
 * 저장된 진단 응답을 구독한다.
 *
 * @returns `undefined`면 아직 읽는 중, `null`이면 진단 기록 없음
 */
export function useStoredAnswers(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function saveAnswers(answers: SelfCheckAnswers): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    // 저장 실패는 조용히 넘긴다. 진단 자체를 막지 않는다.
  }
  cache = answers;
  cacheValid = true;
  emit();
}

export function clearAnswers(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  cache = null;
  cacheValid = true;
  emit();
}
