"use client";

/**
 * 마이페이지 · 개요 탭
 *
 * 진단(MVP-02) 결과와 서류 준비 상태를 한 화면에서 보여준다.
 * 점수·확률로 말하지 않고 4상태와 개수로만 말한다 (PR-2).
 */

import { ArrowRight, Pencil } from "lucide-react";

import Link from "next/link";

import { EvidenceChipRow } from "@/components/ds/evidence-chip";
import { RequirementBar } from "@/components/ds/requirement-bar";
import { StatusBadge } from "@/components/ds/status-badge";
import type { GapSummary } from "@/lib/feed/types";
import { DIAGNOSIS, DOCUMENT_REQUIREMENTS } from "@/lib/mypage/mock";
import {
  KOREAN_BEHAVIOR_LABEL,
  type DocumentFile,
  type ResumeForm,
} from "@/lib/mypage/types";

/** 서류 준비도를 4상태 요약으로 환산한다 */
function documentGap(): GapSummary {
  return DOCUMENT_REQUIREMENTS.reduce<GapSummary>(
    (acc, req) => ({ ...acc, [req.status]: acc[req.status] + 1 }),
    { met: 0, check: 0, unmet: 0, na: 0 },
  );
}

export function OverviewTab({
  resume,
  documents,
  onGoTab,
}: {
  resume: ResumeForm;
  documents: DocumentFile[];
  onGoTab: (tab: "resume" | "documents") => void;
}) {
  const gap = documentGap();
  const filledSections = [
    resume.educations.length > 0,
    resume.experiences.length > 0,
    resume.languages.length > 0,
    resume.skills.length > 0,
    resume.introduction.trim().length > 0,
    resume.portfolios.length > 0,
  ];
  const filled = filledSections.filter(Boolean).length;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1fr_320px]">
      <div className="flex min-w-0 flex-col gap-4">
        {/* 진단 결과 */}
        <section className="border-ds-line-strong bg-ds-surface rounded-2xl border p-5 shadow-[0_2px_12px_rgba(31,58,143,0.07)] sm:p-6">
          <div className="mb-1 flex flex-wrap items-center gap-2.5">
            <span className="bg-ds-tint text-ds-navy rounded-md px-2.5 py-1 text-[11.5px] font-extrabold">
              진단 결과
            </span>
            <h2 className="text-ds-navy text-lg font-extrabold">
              추천 직무 {DIAGNOSIS.recommendations.length}개
            </h2>
          </div>
          <p className="text-ds-muted mb-5 text-[13.5px] leading-relaxed">
            진단에서 답한 내용을 바탕으로 골랐습니다. 합격 가능성을 예측하지
            않습니다.
          </p>

          <ul className="flex flex-col gap-3">
            {DIAGNOSIS.recommendations.map((rec, i) => (
              <li
                key={rec.value}
                className="border-ds-line rounded-xl border bg-[#FBFDFF] p-4"
              >
                <div className="mb-2.5 flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="bg-ds-primary flex size-6 items-center justify-center rounded-full text-[12px] font-extrabold text-white"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-ds-ink text-[15px] font-extrabold">
                    {rec.label}
                  </h3>
                </div>

                <ul className="mb-3 flex flex-col gap-1.5">
                  {rec.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="text-ds-body flex gap-2 text-[13.5px]"
                    >
                      <span aria-hidden className="text-ds-primary font-bold">
                        ·
                      </span>
                      {reason}
                    </li>
                  ))}
                </ul>

                <div className="border-ds-divider border-t pt-3">
                  <p className="text-ds-label mb-1.5 text-[11.5px] font-extrabold">
                    대표 업무
                  </p>
                  <p className="text-ds-muted text-[12.5px] leading-relaxed">
                    {rec.typicalWork.join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-ds-divider mt-5 border-t pt-4">
            <p className="text-ds-label mb-2 text-[12.5px] font-extrabold">
              진단에서 고른 희망 조건
            </p>
            <dl className="text-ds-body flex flex-wrap gap-x-6 gap-y-1.5 text-[13px]">
              <div className="flex gap-1.5">
                <dt className="text-ds-muted">직무</dt>
                <dd className="font-semibold">
                  {DIAGNOSIS.wishes.jobFamilies.join(", ")}
                </dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-ds-muted">지역</dt>
                <dd className="font-semibold">
                  {DIAGNOSIS.wishes.regions.join(", ")}
                </dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-ds-muted">급여</dt>
                <dd className="font-semibold">
                  {DIAGNOSIS.wishes.salaryMin.toLocaleString()}만원 이상
                </dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-ds-muted">근무형태</dt>
                <dd className="font-semibold">
                  {DIAGNOSIS.wishes.employmentType}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-ds-divider mt-4 border-t pt-4">
            <p className="text-ds-label mb-2 text-[12.5px] font-extrabold">
              한국어 업무 행동
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {DIAGNOSIS.koreanBehaviors.map((b) => (
                <li
                  key={b}
                  className="border-ds-line text-ds-navy rounded-[7px] border bg-[#F1F7FF] px-2.5 py-1 text-xs font-semibold"
                >
                  {KOREAN_BEHAVIOR_LABEL[b]}
                </li>
              ))}
            </ul>
            <p className="text-ds-muted mt-2 text-[12.5px]">
              급수만이 아니라 실제로 할 수 있는 일로 적습니다. 공고의
              &ldquo;한국어 능통&rdquo; 요건과 이 항목을 맞춰 봅니다.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <EvidenceChipRow
              chips={[
                { label: `진단일 ${DIAGNOSIS.completedAt}`, tone: "meta" },
                { label: "다시 진단하기", tone: "action" },
              ]}
            />
            <Link
              href="/jobs"
              className="bg-ds-primary hover:bg-ds-navy ml-auto inline-flex items-center gap-1.5 rounded-[9px] px-4 py-2.5 text-[12.5px] font-bold text-white transition-colors"
            >
              맞춤 공고 보기
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </div>
        </section>

        {/* 확인 필요 항목 */}
        {DIAGNOSIS.needsCheck.length > 0 && (
          <section className="border-check-border bg-check-surface rounded-2xl border p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2.5">
              <StatusBadge status="check" size="sm" />
              <h2 className="text-ds-ink text-[15px] font-extrabold">
                아직 확인이 필요한 것 {DIAGNOSIS.needsCheck.length}개
              </h2>
            </div>
            <ul className="flex flex-col gap-2">
              {DIAGNOSIS.needsCheck.map((item) => (
                <li key={item} className="text-ds-ink flex gap-2.5 text-sm">
                  <span aria-hidden className="text-check-text font-extrabold">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onGoTab("documents")}
              className="bg-ds-primary hover:bg-ds-navy mt-4 cursor-pointer rounded-[9px] px-4 py-2.5 text-[12.5px] font-bold text-white transition-colors"
            >
              서류 올리러 가기
            </button>
          </section>
        )}
      </div>

      {/* 사이드 요약 */}
      <div className="flex flex-col gap-3.5">
        <section className="border-ds-line-strong bg-ds-surface rounded-2xl border p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-ds-navy text-[15px] font-extrabold">
              서류 준비도
            </h2>
            <button
              type="button"
              onClick={() => onGoTab("documents")}
              className="text-ds-primary cursor-pointer text-[12.5px] font-semibold"
            >
              관리
            </button>
          </div>

          <RequirementBar gap={gap} />

          <ul className="mt-4 flex flex-col gap-2.5">
            {DOCUMENT_REQUIREMENTS.map((req) => (
              <li key={req.label} className="flex items-start gap-2.5">
                <StatusBadge
                  status={req.status}
                  size="sm"
                  className="shrink-0"
                />
                <span className="min-w-0">
                  <span className="text-ds-ink block text-[13px] font-semibold">
                    {req.label}
                    {req.required && (
                      <span className="text-ds-muted ml-1 text-[11.5px] font-normal">
                        필수
                      </span>
                    )}
                  </span>
                  <span className="text-ds-muted block text-[12px] leading-relaxed">
                    {req.why}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-ds-line bg-ds-surface rounded-2xl border p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-ds-navy text-[15px] font-extrabold">이력서</h2>
            <button
              type="button"
              onClick={() => onGoTab("resume")}
              className="text-ds-primary flex cursor-pointer items-center gap-1 text-[12.5px] font-semibold"
            >
              <Pencil aria-hidden className="size-3.5" />
              수정
            </button>
          </div>
          <p className="text-ds-body text-[13px]">
            항목 {filledSections.length}개 중{" "}
            <strong className="text-ds-navy">{filled}개</strong> 채웠습니다.
          </p>
          <p className="text-ds-muted mt-1.5 text-[12.5px] leading-relaxed">
            채운 내용은 공고 요건과 자동으로 대조됩니다.
          </p>
          <dl className="text-ds-body mt-3.5 flex flex-col gap-1.5 text-[12.5px]">
            <div className="flex justify-between">
              <dt className="text-ds-muted">학력</dt>
              <dd className="font-semibold">{resume.educations.length}건</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ds-muted">경력</dt>
              <dd className="font-semibold">{resume.experiences.length}건</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ds-muted">어학</dt>
              <dd className="font-semibold">{resume.languages.length}건</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ds-muted">올린 파일</dt>
              <dd className="font-semibold">{documents.length}개</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
