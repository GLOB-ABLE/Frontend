/**
 * 역량 강화 허브 — 무엇을 할지 카드로 고른다
 *
 * 탭으로 오가는 대신 여기서 한 번 고르게 한다.
 * 종류가 셋이라 탭보다 카드가 무엇을 하는 곳인지 더 잘 보여준다.
 */

import { ArrowRight } from "lucide-react";

import Link from "next/link";

import { DevNotice } from "@/components/layout/dev-notice";
import { GROWTH_ITEMS, isReady, type GrowthItem } from "@/lib/growth/items";
import { cn } from "@/lib/utils";

export function GrowthHub() {
  return (
    <div className="bg-ds-page min-h-full">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6">
          <h1 className="text-ds-navy text-2xl font-extrabold tracking-[-0.8px] sm:text-[28px]">
            역량 강화
          </h1>
          <p className="text-ds-body mt-2 text-[14.5px] leading-relaxed">
            공고에서 남은 요건을 채우는 곳이에요. 무엇부터 할지 골라보세요.
          </p>
        </header>

        <DevNotice variant="inline" className="mb-5" />

        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" role="list">
          {GROWTH_ITEMS.map((item) => (
            <li key={item.id}>
              <GrowthCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GrowthCard({ item }: { item: GrowthItem }) {
  const ready = isReady(item);
  const Icon = item.icon;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-[14px]",
            ready ? "bg-ds-tint text-ds-navy" : "bg-na-bg text-na-text",
          )}
        >
          <Icon className="size-6" />
        </span>

        {item.badge && (
          <span className="bg-na-bg text-na-text border-na-border rounded-md border px-2.5 py-1 text-[11.5px] font-bold">
            {item.badge}
          </span>
        )}
      </div>

      <h2
        className={cn(
          "mt-4 text-lg font-extrabold tracking-[-0.3px]",
          ready ? "text-ds-navy" : "text-ds-muted",
        )}
      >
        {item.title}
      </h2>
      <p className="text-ds-body mt-1.5 text-[13.5px] leading-relaxed">
        {item.description}
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {item.points.map((point) => (
          <li
            key={point}
            className="text-ds-muted flex items-center gap-2.5 text-[13px]"
          >
            <span
              aria-hidden
              className={cn(
                "size-[5px] shrink-0 rounded-full",
                ready ? "bg-ds-sub" : "bg-na",
              )}
            />
            {point}
          </li>
        ))}
      </ul>

      <p
        className={cn(
          "border-ds-divider mt-auto flex items-center gap-1.5 border-t pt-4 text-[13.5px] font-bold",
          ready ? "text-ds-primary" : "text-ds-label",
        )}
      >
        {ready ? "바로 가기" : "곧 열려요"}
        {ready && <ArrowRight className="size-3.5" aria-hidden />}
      </p>
    </>
  );

  const shell =
    "bg-ds-surface flex h-full flex-col rounded-2xl border p-5 sm:p-6 transition-colors";

  if (!ready) {
    return (
      <div className={cn(shell, "border-ds-line")} aria-disabled>
        {body}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        shell,
        "border-ds-line-strong hover:border-ds-primary hover:bg-ds-tint/30 shadow-[0_2px_10px_rgba(31,58,143,0.06)]",
      )}
    >
      {body}
    </Link>
  );
}
