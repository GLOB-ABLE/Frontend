/**
 * 역량 강화 허브로 돌아가는 링크
 *
 * 허브 안의 화면(프로그램·시뮬레이션) 상단에 둔다.
 * 탭 대신 카드로 고르게 바뀌면서, 돌아갈 길은 이 링크가 맡는다.
 */

import { ChevronLeft } from "lucide-react";

import Link from "next/link";

import { cn } from "@/lib/utils";

export function GrowthBackLink({ className }: { className?: string }) {
  return (
    <Link
      href="/growth"
      className={cn(
        "text-ds-muted hover:text-ds-primary inline-flex items-center gap-1 text-[13px] font-bold transition-colors",
        className,
      )}
    >
      <ChevronLeft className="size-4" aria-hidden />
      역량 강화
    </Link>
  );
}
