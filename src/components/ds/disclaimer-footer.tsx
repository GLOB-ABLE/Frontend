/**
 * F · 면책·출처 푸터 — docs/design-system.md 8장
 *
 * 체류·정책 결과 화면 하단에 항상 반복한다 (PR-5).
 */

import { cn } from "@/lib/utils";

export function DisclaimerFooter({
  ruleVersion,
  effectiveDate,
  className,
}: {
  ruleVersion: string;
  effectiveDate: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-ds-line flex flex-col gap-4 rounded-[14px] border bg-[#F7FBFF] p-5 sm:flex-row sm:items-center sm:gap-[18px]",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-ds-body text-[13.5px] leading-relaxed">
          공고 판정은 정보 제공용 사전 점검입니다. 법적 판단이 아닙니다.
        </p>
        <p className="text-ds-muted mt-1.5 text-[12.5px]">
          {ruleVersion} · 적용 기준일 {effectiveDate}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <a
          href="https://www.hikorea.go.kr"
          target="_blank"
          rel="noreferrer"
          className="border-ds-line-strong text-ds-primary hover:bg-ds-tint rounded-lg border bg-white px-3 py-[7px] text-xs font-bold transition-colors"
        >
          하이코리아 ↗
        </a>
        <button
          type="button"
          className="border-ds-line-strong text-ds-primary hover:bg-ds-tint cursor-pointer rounded-lg border bg-white px-3 py-[7px] text-xs font-bold transition-colors"
        >
          전문가 검토 요청
        </button>
      </div>
    </div>
  );
}
