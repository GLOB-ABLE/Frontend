/**
 * 공고 원문 — 디자인 시스템 C (근거 칩 · 원문 하이라이트)
 *
 * 해석이 아니라 기업이 등록한 원문을 그대로 보여준다.
 * 출처와 등록일을 함께 표시한다 (PR-5).
 */

import { EvidenceChipRow } from "@/components/ds/evidence-chip";
import type { PostingSource as PostingSourceData } from "@/lib/feed/types";

export function PostingSource({ source }: { source: PostingSourceData }) {
  return (
    <section className="border-ds-line bg-ds-surface rounded-2xl border p-5 sm:p-6">
      <h2 className="text-ds-navy mb-4 text-lg font-extrabold">공고 원문</h2>

      <Block title="주요 업무" items={source.mainTasks} />
      <Block title="자격 요건" items={source.qualifications} />

      {source.foreignerNote && (
        <>
          <h3 className="text-ds-ink mb-2 text-[14.5px] font-bold">
            외국인 지원자 안내
          </h3>
          <p className="bg-ds-tint text-ds-navy rounded-xl p-4 text-sm leading-relaxed font-semibold">
            {source.foreignerNote}
          </p>
        </>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <EvidenceChipRow
          chips={[
            { label: `출처 · ${source.sourceLabel}`, tone: "meta" },
            { label: `${source.postedAt} 등록`, tone: "meta" },
            { label: "원문 전체 보기", tone: "action" },
          ]}
        />
      </div>
    </section>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-5">
      <h3 className="text-ds-ink mb-2 text-[14.5px] font-bold">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="text-ds-body flex gap-2.5 text-sm leading-relaxed"
          >
            <span aria-hidden className="text-ds-label">
              ·
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
