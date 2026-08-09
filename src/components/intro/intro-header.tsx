"use client";

/**
 * 인트로 상단 바 — 입장(유학생·기업·대학) 전환
 *
 * 인트로는 마케팅 화면이라 앱 사이드바를 쓰지 않는다.
 */

import { Bubbles } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { shellStrings as t } from "@/lib/i18n";
import { AUDIENCES } from "@/lib/intro/content";
import { cn } from "@/lib/utils";

export function IntroHeader() {
  const pathname = usePathname();

  return (
    <header className="border-ds-line bg-ds-surface/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center gap-4 px-4 sm:px-6">
        {/* 로고는 앱 헤더(app-header.tsx)와 같은 것을 쓴다 */}
        <Link
          href="/intro/student"
          className="focus-visible:ring-ds-primary flex shrink-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2"
        >
          <span className="bg-point rounded-md p-1.5">
            <Bubbles color="white" aria-hidden />
          </span>
          <span className="flex flex-col leading-[1.05]">
            <span className="text-ds-ink text-[17px] font-extrabold tracking-tight">
              Globable
            </span>
            <span className="text-ds-muted hidden text-[9.5px] font-medium min-[360px]:inline-block sm:text-[10px]">
              {t.tagline}
            </span>
          </span>
        </Link>

        {/* 입장 전환 */}
        <nav
          aria-label="이용 대상"
          className="border-ds-line ml-2 flex gap-0.5 rounded-xl border p-1"
        >
          {AUDIENCES.map((a) => {
            const active = pathname === a.href;
            return (
              <Link
                key={a.value}
                href={a.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors",
                  active
                    ? "bg-ds-tint text-ds-navy"
                    : "text-ds-muted hover:text-ds-primary",
                )}
              >
                {a.label}
              </Link>
            );
          })}
        </nav>

        {/*
          시작하기는 /login으로 보낸다. 로그인 화면에 "테스트 계정으로 로그인하기"가
          있어서 가입 없이 바로 들어올 수 있다 (docs/user-flow.md 5장).
          진단은 히어로의 "내 조건 진단하기"가 맡는다.
        */}
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/home"
            className="text-ds-muted hover:text-ds-primary hidden text-[13.5px] font-semibold transition-colors sm:block"
          >
            서비스 둘러보기
          </Link>
          <Link
            href="/login"
            className="bg-ds-primary hover:bg-ds-navy rounded-lg px-4 py-2 text-[13.5px] font-bold text-white transition-colors"
          >
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}
