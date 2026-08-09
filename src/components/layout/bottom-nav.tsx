"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { shellStrings as t } from "@/lib/i18n";
import { bottomNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

function matches(pathname: string, href: string) {
  // 홈은 정확히 "/home"일 때만. startsWith로 보면 모든 경로가 홈에 걸린다.
  if (href === "/home") return pathname === "/home";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** matchPaths가 있으면 함께 본다 — 역량 강화처럼 여러 화면을 묶는 메뉴 */
function isActive(pathname: string, href: string, extra?: string[]) {
  return (
    matches(pathname, href) || (extra ?? []).some((p) => matches(pathname, p))
  );
}

/** Mobile-only bottom tab bar (hidden ≥ md, where the sidebar takes over). */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="border-border bg-card flex h-[62px] shrink-0 items-stretch border-t md:hidden">
      {bottomNav.map(
        ({ href, labelKey, shortLabelKey, matchPaths, icon: Icon }) => {
          const active = isActive(pathname, href, matchPaths);
          const label = t[shortLabelKey ?? labelKey];
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-visible:bg-muted flex flex-1 flex-col items-center justify-center gap-1 outline-none",
                active ? "text-point-hover" : "text-[#94a3b8]",
              )}
            >
              <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 2} />
              <span className="text-[10px] font-bold whitespace-nowrap">
                {label}
              </span>
            </Link>
          );
        },
      )}
    </nav>
  );
}
