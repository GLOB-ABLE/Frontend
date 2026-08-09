"use client";

/**
 * 요건 사이드바 — 공고 상세 오른쪽
 *
 * 요건 표와 강점·채워야 할 것을 본문에서 걷어내고 여기로 옮겼다.
 * 본문 자리는 공고 원문이 차지한다 — 먼저 보고 싶은 건 공고 내용이다.
 *
 * 사이드바에는 요약만 둔다. 표 전체는 오른쪽에서 열리는 패널에서 본다.
 * 320px 폭에 6줄짜리 표를 우겨넣으면 읽을 수 없다.
 */

import { ArrowRight, X } from "lucide-react";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { RequirementBar } from "@/components/ds/requirement-bar";
import { StatusBadge } from "@/components/ds/status-badge";
import { HighlightCards } from "@/components/jobs/detail/highlight-cards";
import { RequirementTable } from "@/components/jobs/detail/requirement-table";
import type {
  GapStatus,
  GapSummary,
  HighlightItem,
  RequirementRow,
} from "@/lib/feed/types";
import { totalRequirements } from "@/lib/feed/types";

/** 아직 해결되지 않은 것 중 가장 무거운 상태를 대표로 쓴다 */
function leadStatus(gap: GapSummary): GapStatus {
  if (gap.unmet > 0) return "unmet";
  if (gap.check > 0) return "check";
  return "met";
}

function headline(gap: GapSummary): string {
  const parts: string[] = [];
  if (gap.check > 0) parts.push(`확인 필요 ${gap.check}개`);
  if (gap.unmet > 0) parts.push(`미충족 ${gap.unmet}개`);
  if (parts.length === 0) return "남은 항목이 없어요";
  return `${parts.join(" · ")}가 남았어요`;
}

export function RequirementSidebar({
  requirements,
  gap,
  strengths,
  toFill,
}: {
  requirements: RequirementRow[];
  gap: GapSummary;
  strengths: HighlightItem[];
  toFill: HighlightItem[];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const total = totalRequirements(gap);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // 패널이 열려 있는 동안 Esc로 닫고 뒤 화면 스크롤을 막는다.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const modalContent = open ? (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-[#0F1F3D]/45"
      role="dialog"
      aria-modal="true"
      aria-labelledby="requirement-panel-title"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-ds-page flex h-full w-full max-w-[620px] animate-[pol-up_0.25s_ease] flex-col shadow-[-8px_0_40px_rgba(15,31,61,0.25)] motion-reduce:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="border-ds-line bg-ds-surface flex shrink-0 items-center gap-3 border-b px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2
              id="requirement-panel-title"
              className="text-ds-navy text-[16px] font-extrabold"
            >
              요건별 상태
            </h2>
            <p className="text-ds-muted mt-0.5 text-[12.5px]">
              요건 {total}개 · {headline(gap)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="닫기"
            className="text-ds-muted hover:bg-ds-tint hover:text-ds-primary grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex flex-col gap-4 overflow-y-auto p-5">
          {requirements.length > 0 && (
            <RequirementTable requirements={requirements} gap={gap} />
          )}
          {(strengths.length > 0 || toFill.length > 0) && (
            <HighlightCards strengths={strengths} toFill={toFill} />
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <section className="border-ds-line-strong bg-ds-surface rounded-2xl border p-5 shadow-[0_2px_12px_rgba(31,58,143,0.07)]">
        <h2 className="text-ds-navy text-[15.5px] font-extrabold">
          내 조건과 맞춰봤어요
        </h2>

        <div className="mt-3 flex items-center gap-2.5">
          <StatusBadge status={leadStatus(gap)} size="sm" />
          <p className="text-ds-ink text-[13.5px] font-bold">{headline(gap)}</p>
        </div>

        <RequirementBar gap={gap} className="mt-3.5" />

        <dl className="border-ds-divider mt-4 grid grid-cols-2 gap-3 border-t pt-4">
          <div>
            <dt className="text-ds-muted text-[12px]">내 강점</dt>
            <dd className="text-met-text mt-0.5 text-[15px] font-extrabold">
              {strengths.length}개
            </dd>
          </div>
          <div>
            <dt className="text-ds-muted text-[12px]">채워야 할 것</dt>
            <dd className="text-check-text mt-0.5 text-[15px] font-extrabold">
              {toFill.length}개
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border-ds-line-strong text-ds-primary hover:bg-ds-tint mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border py-3 text-[13.5px] font-bold transition-colors"
        >
          요건 {total}개 자세히 보기
          <ArrowRight className="size-3.5" aria-hidden />
        </button>

        <p className="text-ds-muted mt-3 text-[12px] leading-relaxed">
          합격 가능성을 예측하지 않습니다. 무엇이 확인됐고 무엇이 남았는지만
          보여줍니다.
        </p>
      </section>

      {mounted && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}
