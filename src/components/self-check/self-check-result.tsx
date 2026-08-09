"use client";

/**
 * 04 결과 — 진단 결과
 *
 * 화면 순서 (docs/내-조건-진단-문항.md 3.1)
 *   1. 게이트 상태 배너 + 쓸 수 있는 기능
 *   2. 내 조건 요약 (수정 가능)
 *   3. 확인 필요 항목
 *   4. 다음 행동 — 공고 보러가기 (버튼)
 *
 * ⚠️ 공고로 가는 경로는 **버튼뿐이다** (md 3.2).
 *    카드 전체 클릭, 스크롤 자동 이동, 미리보기에서 상세 직행은 두지 않는다.
 */

import { ArrowRight, Lock, Pencil } from "lucide-react";

import Link from "next/link";


import { StatusBadge } from "@/components/ds/status-badge";
import { EFFECTIVE_DATE, RULE_VERSION } from "@/lib/feed/mock";
import { collectPendingProofs, evaluateGate } from "@/lib/self-check/gate";
import {
  BEHAVIOR_LEVELS,
  BEHAVIORS,
  JOB_FAMILY_OPTIONS,
  koreanExamLabel,
} from "@/lib/self-check/questions";
import { useStoredAnswers } from "@/lib/self-check/store";

export function SelfCheckResult() {
  const answers = useStoredAnswers();

  if (answers === undefined) {
    return (
      <div className="bg-ds-page min-h-full">
        <div className="mx-auto w-full max-w-[880px] px-4 py-10 sm:px-6">
          <div className="border-ds-line bg-ds-surface h-40 animate-pulse rounded-2xl border" />
        </div>
      </div>
    );
  }

  if (!answers) {
    return (
      <div className="bg-ds-page min-h-full">
        <div className="mx-auto w-full max-w-[880px] px-4 py-16 text-center sm:px-6">
          <h1 className="text-ds-ink text-xl font-extrabold">
            아직 진단을 하지 않았어요
          </h1>
          <p className="text-ds-muted mt-2 text-[14px]">
            몇 가지만 알려주시면 조건을 맞춰볼 수 있어요.
          </p>
          <Link
            href="/self-check"
            className="bg-ds-primary hover:bg-ds-navy mt-6 inline-block rounded-xl px-6 py-3 text-[15px] font-bold text-white transition-colors"
          >
            진단 시작하기
          </Link>
        </div>
      </div>
    );
  }

  const gate = evaluateGate(answers);
  const pending = collectPendingProofs(answers);

  return (
    <div className="bg-ds-page min-h-full">
      <div className="mx-auto w-full max-w-[880px] px-4 py-6 pb-16 sm:px-6">
        <header className="mb-5">
          <h1 className="text-ds-navy text-2xl font-extrabold tracking-[-0.6px]">
            진단 결과
          </h1>
          <p className="text-ds-muted mt-2 text-[13.5px]">
            지금 쓸 수 있는 기능과 채워야 할 것을 정리했어요.
          </p>
        </header>

        {/* 판정 근거 — 판정만 있고 근거가 없는 화면은 만들지 않는다 */}
        <section className="border-ds-line bg-ds-surface mt-3 rounded-2xl border p-5">
          <h2 className="text-ds-label mb-3 text-[12.5px] font-extrabold tracking-wide">
            판정 근거
          </h2>
          <ul className="flex flex-col gap-2">
            {gate.reasons.map((reason) => (
              <li key={reason} className="flex gap-2.5">
                <span aria-hidden className="text-ds-primary font-extrabold">
                  ·
                </span>
                <span className="text-ds-ink text-[13.5px]">{reason}</span>
              </li>
            ))}
          </ul>

          <div className="border-ds-divider mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2">
            <div>
              <p className="text-met-text mb-2 text-[12.5px] font-extrabold">
                지금 쓸 수 있어요
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {gate.allowed.map((f) => (
                  <li
                    key={f}
                    className="border-met-border bg-met-bg text-met-text rounded-md border px-2.5 py-1 text-[12px] font-semibold"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {gate.blocked.length > 0 && (
              <div>
                <p className="text-na-text mb-2 text-[12.5px] font-extrabold">
                  아직 열리지 않았어요
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {gate.blocked.map((f) => (
                    <li
                      key={f}
                      className="border-na-border bg-na-bg text-na-text inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[12px] font-semibold"
                    >
                      <Lock className="size-3" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* ── 2. 내 조건 요약 ── */}
        <section className="border-ds-line bg-ds-surface mt-3 rounded-2xl border p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-ds-navy text-[17px] font-extrabold">
              내 조건 요약
            </h2>
            <Link
              href="/self-check"
              className="border-ds-line-strong text-ds-primary hover:bg-ds-tint inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-bold transition-colors"
            >
              <Pencil className="size-3.5" />
              고치기
            </Link>
          </div>

          <dl className="divide-ds-divider divide-y">
            <SummaryRow label="체류자격" value={answers.visa ?? "-"} />
            <SummaryRow
              label="체류 만료일"
              value={answers.visaExpiresOn.replace(/-/g, ".") || "-"}
            />
            <SummaryRow
              label="학력"
              value={
                answers.degree
                  ? `${answers.school || "학교 미입력"} · ${answers.major} ${answers.degree}`
                  : "-"
              }
            />
            <SummaryRow
              label="한국어"
              value={koreanExamLabel(answers.koreanExam) || "-"}
            />
            <SummaryRow
              label="업무 언어"
              value={
                answers.languages.length
                  ? answers.languages
                      .map((l) => `${l.language} (${levelLabel(l.level)})`)
                      .join(" · ")
                  : "없음"
              }
            />
            <SummaryRow
              label="일 경험"
              value={
                answers.experiences.length
                  ? `${answers.experiences.length}건`
                  : "없음"
              }
            />
            <SummaryRow
              label="자격증"
              value={
                answers.certificates.length
                  ? answers.certificates.map((c) => c.name).join(" · ")
                  : "없음"
              }
            />
            <SummaryRow
              label="희망 직무"
              value={
                answers.jobFamilies
                  .map(
                    (v) =>
                      JOB_FAMILY_OPTIONS.find((o) => o.value === v)?.label ?? v,
                  )
                  .join(" · ") || "-"
              }
            />
          </dl>
        </section>

        {/* 한국어 업무 행동 */}
        <section className="border-ds-line bg-ds-surface mt-3 rounded-2xl border p-5">
          <h2 className="text-ds-navy mb-1.5 text-[17px] font-extrabold">
            한국어로 할 수 있는 일
          </h2>
          <p className="text-ds-muted mb-4 text-[13px]">
            공고의 &ldquo;한국어 능통&rdquo;과 이 답을 나란히 비교해요.
          </p>
          <ul className="flex flex-col gap-2">
            {BEHAVIORS.map((b) => {
              const level = answers.behaviors[b.id];
              return (
                <li
                  key={b.id}
                  className="border-ds-divider flex items-center justify-between gap-3 border-b pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="text-ds-ink text-[13.5px]">{b.label}</span>
                  <span className="text-ds-primary shrink-0 text-[12.5px] font-bold">
                    {level
                      ? BEHAVIOR_LEVELS.find((l) => l.value === level)?.label
                      : "미응답"}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── 3. 확인 필요 항목 ── */}
        <section className="border-check-border bg-ds-surface mt-3 rounded-2xl border p-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-ds-navy text-[17px] font-extrabold">
              확인이 필요한 항목
            </h2>
            {pending.length > 0 ? (
              <StatusBadge status="check" size="sm" />
            ) : (
              <StatusBadge status="met" size="sm" />
            )}
          </div>

          {pending.length === 0 ? (
            <p className="text-ds-body text-[13.5px]">
              증빙이 모두 올라와 있어요. 바로 공고를 볼 수 있어요.
            </p>
          ) : (
            <>
              <p className="text-check-text mb-4 text-[13.5px] font-semibold">
                증빙 {pending.length}개를 올리면 상태가 바뀝니다.
              </p>
              <ul className="flex flex-col gap-2">
                {pending.map((p) => (
                  <li
                    key={p.id}
                    className="border-check-border bg-check-surface rounded-xl border p-3.5"
                  >
                    <p className="text-ds-ink text-[14px] font-bold">
                      {p.label}
                    </p>
                    <p className="mt-1 text-[13px] text-[#7A5600]">
                      {p.reason} {p.effect}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* ── 4. 다음 행동 — 공고로 가는 길은 이 버튼뿐이다 ── */}
        <section className="border-ds-line-strong mt-3 rounded-2xl border bg-[#F7FBFF] p-5 sm:p-6">
          {gate.canBrowseJobs ? (
            <>
              <h2 className="text-ds-navy text-[17px] font-extrabold">
                이제 공고를 볼 수 있어요
              </h2>
              <p className="text-ds-body mt-2 text-[13.5px] leading-relaxed">
                진단한 조건으로 공고마다 무엇이 충족되고 무엇이 확인이 필요한지
                보여드려요.
                {!gate.canApply && " 지금은 보기만 되고 지원은 아직이에요."}
              </p>
              <Link
                href="/jobs"
                className="bg-ds-primary hover:bg-ds-navy mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-bold text-white transition-colors"
              >
                공고 보러가기
                <ArrowRight className="size-4" />
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-ds-navy text-[17px] font-extrabold">
                지금은 공고를 열 수 없어요
              </h2>
              <p className="text-ds-body mt-2 text-[13.5px] leading-relaxed">
                조건이 갖춰지면 다시 열립니다. 그동안 할 수 있는 준비부터
                알려드릴게요.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/insight"
                  className="bg-ds-primary hover:bg-ds-navy inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14.5px] font-bold text-white transition-colors"
                >
                  지금 할 수 있는 준비 보기
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/chat"
                  className="border-ds-line-strong text-ds-primary inline-flex items-center rounded-xl border bg-white px-5 py-3 text-[14.5px] font-bold transition-colors hover:bg-white/60"
                >
                  무엇을 하면 되나요
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-ds-muted shrink-0 text-[13px] font-semibold">
        {label}
      </dt>
      <dd className="text-ds-ink text-right text-[13.5px] font-semibold">
        {value}
      </dd>
    </div>
  );
}

function levelLabel(level: "native" | "business" | "daily"): string {
  return level === "native"
    ? "원어민 수준"
    : level === "business"
      ? "업무 가능"
      : "일상 대화";
}
