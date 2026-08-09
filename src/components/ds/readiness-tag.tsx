/**
 * 기업 준비도 태그 — PRD MVP-09 (기업 준비도 공개)
 *
 * 상태 색상은 4상태 배지 전용이므로, 준비도는 틸/앰버 계열을 따로 쓴다.
 */

import type { CompanyReadiness } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

const VARIANT: Record<
  CompanyReadiness,
  { label: string; shell: string; dot: string }
> = {
  ready: {
    label: "외국인 채용 준비 완료",
    shell: "bg-[#DCF2F0] border-[#A9DCD7] text-[#0E5C55]",
    dot: "bg-owner-company",
  },
  partial: {
    label: "일부 미비",
    shell: "bg-check-bg border-check-border text-check-text",
    dot: "bg-check",
  },
  unknown: {
    label: "준비도 미확인",
    shell: "bg-na-bg border-na-border text-na-text",
    dot: "bg-na",
  },
};

export function ReadinessTag({
  readiness,
  className,
}: {
  readiness: CompanyReadiness;
  className?: string;
}) {
  const v = VARIANT[readiness];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap",
        v.shell,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", v.dot)} aria-hidden />
      {v.label}
    </span>
  );
}
