/**
 * 상세 사이드바 — 멘토 신청 + 무료 취업지원 서비스 연계
 *
 * 지원 서비스는 공식 기관만 싣고 각 항목에 출처 링크를 붙인다 (PR-5).
 */

import { ExternalLink, Phone } from "lucide-react";

import type { SupportSite } from "@/lib/feed/types";

export function SupportSidebar({ sites }: { sites: SupportSite[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {/* 멘토 신청 */}
      <section className="bg-ds-tint rounded-2xl border border-[#BFE0F7] p-5 sm:p-[22px]">
        <h2 className="text-ds-navy text-[15px] leading-snug font-extrabold">
          이 공고, 혼자
          <br />
          준비하기 어렵나요?
        </h2>
        <p className="text-ds-body mt-2 text-[12.5px] leading-relaxed">
          멘토가 서류를 같이 봐줍니다. 판정을 바꿔주지는 않고, 무엇을 채우면
          되는지 함께 정리합니다.
        </p>
        <button
          type="button"
          className="bg-ds-navy mt-3.5 w-full cursor-pointer rounded-[10px] py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
        >
          멘토 신청
        </button>
      </section>

      {/* 무료 취업지원 서비스 */}
      <section className="border-ds-line bg-ds-surface rounded-2xl border p-5 sm:p-[22px]">
        <h2 className="text-ds-navy text-[15px] font-extrabold">
          무료로 쓸 수 있는 곳
        </h2>
        <p className="text-ds-muted mt-1.5 text-[12.5px] leading-relaxed">
          공공기관이 운영하는 서비스입니다. 비용이 들지 않습니다.
        </p>

        <ul className="mt-4 flex flex-col gap-2.5">
          {sites.map((site) => (
            <li key={site.name}>
              <a
                href={site.href}
                target="_blank"
                rel="noreferrer"
                className="border-ds-line hover:border-ds-line-strong block rounded-xl border p-3.5 transition-colors hover:bg-[#F7FBFF]"
              >
                <span className="text-ds-ink flex items-center gap-1.5 text-[13.5px] font-bold">
                  {site.name}
                  <ExternalLink
                    aria-hidden
                    className="text-ds-primary size-3.5 shrink-0"
                  />
                </span>
                <span className="text-ds-muted mt-1 block text-[12.5px] leading-relaxed">
                  {site.description}
                </span>
                {site.contact && (
                  <span className="text-ds-primary mt-2 flex items-center gap-1.5 text-[12.5px] font-bold">
                    <Phone aria-hidden className="size-3.5" />
                    {site.contact}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-ds-label mt-3.5 text-[11.5px] leading-relaxed">
          외부 기관 링크입니다. 운영 시간과 지원 범위는 각 기관 안내를
          확인하세요.
        </p>
      </section>
    </div>
  );
}
