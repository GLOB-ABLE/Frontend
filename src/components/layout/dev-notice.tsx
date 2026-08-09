/**
 * 개발 중 안내 — 지금 화면이 완성된 서비스가 아니라는 것을 밝힌다.
 *
 * 데이터는 대부분 목 데이터고, 판정도 실제 심사가 아니다.
 *
 * 지금은 필요한 화면에만 inline으로 넣는다 — 역량 강화 허브, 시뮬레이션.
 * 전 화면 최상단에 두는 bar도 있지만 지금은 쓰지 않는다.
 *
 * 정식 배포 전에 쓰는 화면에서 이 컴포넌트만 빼면 된다.
 *
 * 닫기 버튼을 두지 않았다. 시연 중에 사라지면 안내 역할을 못 한다.
 * 상태 4색(초록·노랑·빨강)은 판정 배지 전용이라 여기 쓰지 않는다.
 */

import { Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

const TITLE = "개발 중인 시험용 화면입니다";
const BODY = "화면의 데이터와 판정 결과는 예시이며 실제가 아닙니다.";

export function DevNotice({
  variant = "bar",
  className,
}: {
  variant?: "bar" | "inline";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <aside
        className={cn(
          "bg-ds-navy flex items-center gap-3 rounded-[13px] px-4 py-3 text-white",
          className,
        )}
      >
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15"
        >
          <Wrench className="size-4" />
        </span>
        <p className="min-w-0 text-[13px] leading-relaxed">
          <b className="font-bold">{TITLE}.</b>{" "}
          <span className="text-ds-tint">{BODY}</span>
        </p>
      </aside>
    );
  }

  return (
    <div className={cn("bg-ds-navy text-center text-white", className)}>
      <p className="mx-auto w-full max-w-[1440px] px-4 py-2 text-[12.5px] leading-relaxed">
        <b className="font-bold">{TITLE}.</b>{" "}
        <span className="text-ds-tint">{BODY}</span>
      </p>
    </div>
  );
}
