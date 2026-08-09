/**
 * 내 강점 / 채워야 할 것 — PRD MVP-04 (채용 장애요인 분석)
 *
 * "채우면 매칭률 98%" 같은 수치 예측은 쓰지 않는다 (PR-2).
 * 대신 어떤 상태가 어떻게 바뀌는지 사실로 적는다.
 */

import { StatusBadge } from "@/components/ds/status-badge";
import type { HighlightItem } from "@/lib/feed/types";
import { cn } from "@/lib/utils";

export function HighlightCards({
  strengths,
  toFill,
}: {
  strengths: HighlightItem[];
  toFill: HighlightItem[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel
        title={`내 강점 ${strengths.length}개`}
        iconClass="bg-met-bg text-met-text"
        icon="↑"
      >
        {strengths.map((item) => (
          <li
            key={item.title}
            className="border-met-border bg-met-surface rounded-xl border p-3.5"
          >
            <p className="text-ds-ink text-[14.5px] font-bold">{item.title}</p>
            <p className="mt-1.5 text-[13px] text-[#4B6152]">{item.detail}</p>
          </li>
        ))}
      </Panel>

      <Panel
        title={`채워야 할 것 ${toFill.length}개`}
        iconClass="bg-unmet-bg text-unmet-text"
        icon="!"
      >
        {toFill.map((item) => (
          <li
            key={item.title}
            className={cn(
              "rounded-xl border p-3.5",
              item.status === "unmet"
                ? "border-unmet-border bg-unmet-surface"
                : "border-check-border bg-check-surface",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-ds-ink text-[14.5px] font-bold">
                {item.title}
              </p>
              {item.status && <StatusBadge status={item.status} size="sm" />}
            </div>
            <p
              className={cn(
                "mt-1.5 text-[13px]",
                item.status === "unmet" ? "text-unmet-text" : "text-[#7A5600]",
              )}
            >
              {item.detail}
            </p>
          </li>
        ))}

        <li className="bg-ds-tint rounded-xl p-3.5">
          <p className="text-ds-navy text-[13.5px] font-bold">
            2개를 해결하면 확인 필요·미충족이 없어집니다
          </p>
          <p className="text-ds-body mt-1 text-[12.5px]">
            합격 여부를 예측하지는 않습니다. 상태만 바뀝니다.
          </p>
        </li>
      </Panel>
    </div>
  );
}

function Panel({
  title,
  icon,
  iconClass,
  children,
}: {
  title: string;
  icon: string;
  iconClass: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-ds-line bg-ds-surface rounded-2xl border p-5 sm:p-[22px]">
      <div className="mb-4 flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "flex size-[22px] items-center justify-center rounded-[7px] text-[13px] font-extrabold",
            iconClass,
          )}
        >
          {icon}
        </span>
        <h2 className="text-ds-navy text-base font-extrabold">{title}</h2>
      </div>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </section>
  );
}
