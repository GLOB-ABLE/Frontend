"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, User, type LucideIcon } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { shellStrings as t } from "@/lib/i18n";
import { nav } from "@/lib/nav";
import { cn } from "@/lib/utils";

const navLinkBase =
  "focus-visible:ring-point flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-2";

function matches(pathname: string, href: string) {
  // 홈은 정확히 "/"일 때만. startsWith로 보면 모든 경로가 홈에 걸린다.
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** matchPaths가 있으면 함께 본다 — 역량 강화처럼 여러 화면을 묶는 메뉴 */
function isActive(pathname: string, href: string, extra?: string[]) {
  return (
    matches(pathname, href) || (extra ?? []).some((p) => matches(pathname, p))
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  matchPaths,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  matchPaths?: string[];
}) {
  const pathname = usePathname();
  const active = isActive(pathname, href, matchPaths);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        navLinkBase,
        active
          ? "bg-point-soft text-point-hover font-bold"
          : "text-secondary-foreground hover:bg-muted font-semibold",
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

/**
 * 홈이 항상 대시보드가 되면서 아이콘 레일로 접을 이유가 없어졌다.
 * 접힌 사이드바는 메뉴를 못 찾게 만든다 (docs/user-flow.md 5장).
 */
export function Sidebar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    // 셸 높이가 고정돼 있어(h-dvh) 이 자리는 스크롤과 무관하게 제자리에 있다.
    // 메뉴가 많아지면 사이드바 안에서만 스크롤된다.
    <div className="relative z-40 hidden h-full w-[244px] shrink-0 md:block">
      <nav className="border-border bg-card absolute inset-y-0 left-0 z-30 flex w-full flex-col gap-1 overflow-x-hidden overflow-y-auto border-r p-3">
        {nav.map(({ href, labelKey, icon, matchPaths }) => (
          <NavLink
            key={href}
            href={href}
            icon={icon}
            label={t[labelKey]}
            matchPaths={matchPaths}
          />
        ))}

        {/* auth section */}
        <div className="border-border mt-1 flex flex-col gap-1 border-t pt-2">
          {isLoggedIn ? (
            <>
              <NavLink href="/mypage" icon={User} label={t.navMypage} />
              <LogoutButton className="text-secondary-foreground hover:bg-muted w-full justify-start px-3 py-2.5 text-sm font-semibold" />
            </>
          ) : (
            <NavLink href="/login" icon={LogIn} label={t.navLogin} />
          )}
        </div>
      </nav>
    </div>
  );
}
