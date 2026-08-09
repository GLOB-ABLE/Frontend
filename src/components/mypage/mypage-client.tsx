"use client";

/**
 * 마이페이지 — 개요 · 이력서 · 서류
 *
 * PRD MVP-01(프로필·이력서 구조화) / MVP-02(진단 결과)를 한 곳에서 다룬다.
 * 이력서 본문은 폼으로 받고, 포트폴리오·증명서 같은 파일만 업로드로 받는다.
 */

import { FileText, IdCard, LayoutDashboard } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { GateBanner } from "@/components/ds/gate-banner";
import { DocumentsTab } from "@/components/mypage/documents-tab";
import { OverviewTab } from "@/components/mypage/overview-tab";
import { ResumeTab } from "@/components/mypage/resume-tab";
import { EFFECTIVE_DATE, GATE } from "@/lib/feed/mock";
import { useDocuments, useResume } from "@/lib/mypage/store";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "overview", label: "개요", icon: LayoutDashboard },
  { key: "resume", label: "이력서", icon: IdCard },
  { key: "documents", label: "서류", icon: FileText },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function isTabKey(value: string | null): value is TabKey {
  return TABS.some((t) => t.key === value);
}

export function MypageClient({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("tab");
  const tab: TabKey = isTabKey(raw) ? raw : "overview";

  const { resume, setResume, reset } = useResume();
  const { documents, add, remove, patch, setPrimary } = useDocuments();

  /** 탭은 쿼리로 둔다. 새로고침·공유 시 같은 탭이 열린다. */
  const goTab = useCallback(
    (next: TabKey) => {
      router.replace(next === "overview" ? "/mypage" : `/mypage?tab=${next}`, {
        scroll: false,
      });
    },
    [router],
  );

  const displayName = name || resume.basic.nameKo;

  return (
    <div className="bg-ds-page min-h-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        {/* 머리말 */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span
              aria-hidden
              className="bg-ds-navy flex size-12 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold text-white"
            >
              {displayName.slice(0, 2)}
            </span>
            <div>
              <h1 className="text-ds-navy text-2xl font-extrabold tracking-[-0.8px]">
                {displayName}
              </h1>
              <p className="text-ds-muted mt-1 text-[13.5px]">
                {email || resume.basic.email} · {resume.basic.residenceStatus} ·
                만료 {resume.basic.residenceExpiresAt}
              </p>
            </div>
          </div>
        </div>

        {/* E · 게이트 상태 배너 */}
        <GateBanner
          state={GATE.state}
          title={GATE.title}
          description={GATE.description}
          meta={`기준일 ${EFFECTIVE_DATE}`}
          actionLabel="체류 정보 보기"
        />

        {/* 탭 */}
        <nav
          aria-label="마이페이지 메뉴"
          className="border-ds-line mt-5 mb-4 flex gap-1 overflow-x-auto border-b"
        >
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => goTab(t.key)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-1.5 border-b-2 px-4 py-3 text-sm transition-colors",
                  active
                    ? "border-ds-primary text-ds-navy font-extrabold"
                    : "text-ds-muted hover:text-ds-body border-transparent font-semibold",
                )}
              >
                <t.icon aria-hidden className="size-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {tab === "overview" && (
          <OverviewTab
            resume={resume}
            documents={documents}
            onGoTab={(next) => goTab(next)}
          />
        )}

        {tab === "resume" && (
          <ResumeTab resume={resume} setResume={setResume} onReset={reset} />
        )}

        {tab === "documents" && (
          <DocumentsTab
            documents={documents}
            onAdd={add}
            onRemove={remove}
            onPatch={patch}
            onSetPrimary={setPrimary}
          />
        )}
      </div>
    </div>
  );
}
