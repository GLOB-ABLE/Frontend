/**
 * 판정 요약 — 매칭률 도넛과 "지원자 중 상위 N%"를 대체한다.
 *
 * 확률·점수·순위는 쓰지 않는다 (PR-2, 디자인 시스템 금지 패턴 1·5).
 * 대신 요건 개수와 기업 준비도 근거를 보여준다.
 */

import { Check } from "lucide-react";

import { RequirementBar } from "@/components/ds/requirement-bar";
import { StatusBadge } from "@/components/ds/status-badge";
import type { GapStatus, GapSummary } from "@/lib/feed/types";
import { totalRequirements } from "@/lib/feed/types";

/** 아직 해결되지 않은 것 중 가장 무거운 상태를 대표 배지로 쓴다. */
function leadStatus(gap: GapSummary): GapStatus {
  if (gap.unmet > 0) return "unmet";
  if (gap.check > 0) return "check";
  return "met";
}

function headline(gap: GapSummary): string {
  const parts: string[] = [];
  if (gap.check > 0) parts.push(`확인이 필요한 항목이 ${gap.check}개`);
  if (gap.unmet > 0) parts.push(`미충족 항목이 ${gap.unmet}개`);
  if (parts.length === 0) return "모든 요건이 확인됐습니다.";
  return `${parts.join(", ")} 있습니다.`;
}

export function VerdictSummary({
  gap,
  recommendReasons,
  readinessNotes,
}: {
  gap: GapSummary;
  recommendReasons: string[];
  readinessNotes: string[];
}) {
  const total = totalRequirements(gap);

  return (
    <section className="border-ds-line-strong bg-ds-surface rounded-2xl border p-5 shadow-[0_2px_12px_rgba(31,58,143,0.07)] sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={leadStatus(gap)} size="lg" />
            <p className="text-ds-ink text-[15px] font-bold">
              요건 {total}개 중 {headline(gap)}
            </p>
          </div>

          <RequirementBar gap={gap} className="mt-4" />

          <p className="text-ds-body mt-5 mb-3 text-sm font-semibold">
            이 공고를 추천하는 이유
          </p>
          <ul className="flex flex-col gap-2.5">
            {recommendReasons.map((reason) => (
              <li
                key={reason}
                className="text-ds-ink flex items-center gap-2.5 text-[14.5px]"
              >
                <span
                  aria-hidden
                  className="bg-met-bg text-met-text flex size-5 shrink-0 items-center justify-center rounded-full"
                >
                  <Check className="size-3" strokeWidth={3.5} />
                </span>
                {reason}
              </li>
            ))}
          </ul>

          <p className="text-ds-muted mt-4 text-[12.5px] leading-relaxed">
            합격 가능성을 예측하지 않습니다. 무엇이 확인됐고 무엇이 남았는지만
            보여줍니다.
          </p>
        </div>

        {readinessNotes.length > 0 && (
          <aside className="bg-ds-tint shrink-0 rounded-[13px] p-[18px] lg:w-[230px]">
            <p className="text-ds-body text-[12.5px] font-semibold">
              이 기업의 준비 상태
            </p>
            <ul className="mt-2.5 flex flex-col gap-2">
              {readinessNotes.map((note) => (
                <li
                  key={note}
                  className="text-ds-navy flex gap-2 text-[12.5px] leading-relaxed font-semibold"
                >
                  <span aria-hidden className="text-ds-primary">
                    ·
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
}
