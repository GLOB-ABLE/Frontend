"use client";

/**
 * 마이페이지 · 서류 탭
 *
 * 포트폴리오·증명서 같은 파일을 올린다. 이력서 본문은 이력서 탭의 폼으로 받는다.
 * 올렸다고 바로 충족이 되지는 않는다. 확인 전에는 "확인 필요"로 둔다 (PR-1).
 */

import { FileText, Star, Trash2, Upload, X } from "lucide-react";

import { useRef, useState } from "react";

import { StatusBadge } from "@/components/ds/status-badge";
import { RequirementBar } from "@/components/ds/requirement-bar";
import type { GapSummary } from "@/lib/feed/types";
import { DOCUMENT_REQUIREMENTS, UPLOAD_LIMIT } from "@/lib/mypage/mock";
import {
  DOCUMENT_KIND_LABEL,
  formatFileSize,
  newId,
  type DocumentFile,
  type DocumentKind,
  type DocumentStatus,
} from "@/lib/mypage/types";
import { cn } from "@/lib/utils";

const FILTERS: { value: "all" | DocumentKind; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "resume", label: "이력서" },
  { value: "portfolio", label: "포트폴리오" },
  { value: "registration", label: "증명서" },
];

const STATUS_LABEL: Record<DocumentStatus, string> = {
  verified: "확인됨",
  pending: "확인 필요",
  uploading: "올리는 중",
  failed: "실패",
};

/** 파일 이름으로 서류 종류를 추측한다. 사용자가 나중에 바꿀 수 있다. */
function guessKind(name: string): DocumentKind {
  const n = name.toLowerCase();
  if (n.includes("topik") || n.includes("성적")) return "topik";
  if (n.includes("등록증") || n.includes("registration")) return "registration";
  if (n.includes("졸업") || n.includes("graduat")) return "graduation";
  if (n.includes("포트폴리오") || n.includes("portfolio")) return "portfolio";
  if (n.includes("경력")) return "career";
  if (n.includes("이력") || n.includes("resume") || n.includes("cv"))
    return "resume";
  return "etc";
}

function todayLabel(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export function DocumentsTab({
  documents,
  onAdd,
  onRemove,
  onPatch,
  onSetPrimary,
}: {
  documents: DocumentFile[];
  onAdd: (file: DocumentFile) => void;
  onRemove: (id: string) => void;
  onPatch: (id: string, changes: Partial<DocumentFile>) => void;
  onSetPrimary: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | DocumentKind>("all");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const gap = DOCUMENT_REQUIREMENTS.reduce<GapSummary>(
    (acc, req) => ({ ...acc, [req.status]: acc[req.status] + 1 }),
    { met: 0, check: 0, unmet: 0, na: 0 },
  );

  const visible =
    filter === "all"
      ? documents
      : documents.filter((d) =>
          filter === "registration"
            ? d.kind === "registration" ||
              d.kind === "graduation" ||
              d.kind === "topik" ||
              d.kind === "career"
            : d.kind === filter,
        );

  /**
   * 백엔드가 없으므로 진행률을 흉내낸다.
   * 업로드가 끝나면 "확인됨"이 아니라 "확인 필요"가 된다.
   */
  function acceptFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    for (const file of Array.from(files)) {
      if (file.size > UPLOAD_LIMIT.maxSizeMb * 1_048_576) {
        setError(
          `${file.name} — 파일 하나에 ${UPLOAD_LIMIT.maxSizeMb}MB까지 올릴 수 있어요.`,
        );
        continue;
      }

      const id = newId("doc");
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";

      onAdd({
        id,
        name: file.name,
        kind: guessKind(file.name),
        ext,
        size: file.size,
        uploadedAt: todayLabel(),
        status: "uploading",
        progress: 0,
      });

      let progress = 0;
      const timer = window.setInterval(() => {
        progress += 18;
        if (progress >= 100) {
          window.clearInterval(timer);
          onPatch(id, { status: "pending", progress: undefined });
        } else {
          onPatch(id, { progress });
        }
      }, 320);
    }
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1fr_300px]">
      <div className="flex min-w-0 flex-col gap-4">
        {/* 업로드 영역 */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            acceptFiles(e.dataTransfer.files);
          }}
          className={cn(
            "rounded-2xl border-2 border-dashed p-8 text-center transition-colors sm:p-11",
            dragging
              ? "border-ds-primary bg-ds-tint"
              : "bg-ds-surface border-[#9CC6F5]",
          )}
        >
          <span
            aria-hidden
            className="bg-ds-tint text-ds-navy mx-auto flex size-14 items-center justify-center rounded-2xl"
          >
            <Upload className="size-6" />
          </span>
          <p className="text-ds-navy mt-4 text-lg font-extrabold">
            파일을 여기로 끌어 놓으세요
          </p>
          <p className="text-ds-muted mt-2 text-sm">
            {UPLOAD_LIMIT.acceptLabel} · 파일 하나에 {UPLOAD_LIMIT.maxSizeMb}
            MB까지
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept={UPLOAD_LIMIT.accept}
            className="hidden"
            onChange={(e) => {
              acceptFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="bg-ds-primary hover:bg-ds-navy mt-5 cursor-pointer rounded-[11px] px-6 py-3 text-sm font-bold text-white transition-colors"
          >
            파일 고르기
          </button>

          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {(
              ["portfolio", "registration", "topik", "graduation"] as const
            ).map((kind) => (
              <li
                key={kind}
                className="border-ds-line text-ds-navy rounded-[7px] border bg-[#F1F7FF] px-2.5 py-1.5 text-xs font-semibold"
              >
                {DOCUMENT_KIND_LABEL[kind]}
              </li>
            ))}
          </ul>

          {error && (
            <p className="border-unmet-border bg-unmet-bg text-unmet-text mx-auto mt-4 max-w-md rounded-[9px] border px-3 py-2.5 text-[12.5px] font-semibold">
              {error}
            </p>
          )}
        </div>

        {/* 파일 목록 */}
        <section className="border-ds-line bg-ds-surface rounded-2xl border p-5 shadow-[0_1px_3px_rgba(31,58,143,0.05)] sm:p-[22px]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-ds-navy text-base font-extrabold">
              내 파일 {documents.length}개
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-1.5 text-[12.5px] transition-colors",
                    filter === f.value
                      ? "bg-ds-primary font-bold text-white"
                      : "border-ds-line text-ds-muted hover:border-ds-line-strong border font-semibold",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="text-ds-muted py-10 text-center text-sm">
              이 분류에 올린 파일이 없어요.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {visible.map((doc) => (
                <li
                  key={doc.id}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl border p-3.5 sm:gap-4",
                    doc.status === "uploading"
                      ? "border-check-border bg-check-surface"
                      : doc.isPrimary
                        ? "border-ds-line-strong bg-[#F7FBFF]"
                        : "border-ds-line",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-[10px] text-[11px] font-extrabold text-white",
                      doc.status === "uploading"
                        ? "bg-check"
                        : doc.ext === "pdf"
                          ? "bg-ds-navy"
                          : "bg-ds-sub",
                    )}
                  >
                    {doc.status === "uploading" ? (
                      <Upload className="size-4" />
                    ) : (
                      doc.ext.toUpperCase()
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-ds-ink truncate text-[15px] font-bold">
                        {doc.name}
                      </p>
                      {doc.isPrimary && (
                        <span className="bg-ds-primary rounded-[5px] px-2 py-0.5 text-[11px] font-bold text-white">
                          기본
                        </span>
                      )}
                      <span className="text-ds-muted rounded-[5px] bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold">
                        {DOCUMENT_KIND_LABEL[doc.kind]}
                      </span>
                    </div>

                    {doc.status === "uploading" ? (
                      <>
                        {/*
                          업로드 진행률은 판정이 아니라 작업 진행 상태다.
                          금지 규칙(매칭률·적합도·순위)은 판정 표현에만 적용된다.
                        */}
                        <p className="mt-1.5 text-[12.5px] font-semibold text-[#7A5600]">
                          올리는 중 · {doc.progress ?? 0}%
                        </p>
                        <div
                          className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-[#F5E6C4]"
                          role="progressbar"
                          aria-valuenow={doc.progress ?? 0}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="bg-check h-full rounded-full transition-[width]"
                            style={{ width: `${doc.progress ?? 0}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-ds-muted mt-1 text-[12.5px]">
                        {formatFileSize(doc.size)} · {doc.uploadedAt} 올림
                        {doc.usedInPostings
                          ? ` · 공고 ${doc.usedInPostings}곳에 씀`
                          : ""}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {doc.status === "verified" && (
                      <StatusBadge status="met" size="sm" />
                    )}
                    {doc.status === "pending" && (
                      <StatusBadge status="check" size="sm" />
                    )}

                    {doc.kind === "resume" &&
                      !doc.isPrimary &&
                      doc.status !== "uploading" && (
                        <button
                          type="button"
                          onClick={() => onSetPrimary(doc.id)}
                          aria-label="기본 이력서로 지정"
                          title="기본 이력서로 지정"
                          className="text-ds-label hover:text-ds-primary cursor-pointer p-1 transition-colors"
                        >
                          <Star className="size-4" />
                        </button>
                      )}

                    <button
                      type="button"
                      onClick={() => onRemove(doc.id)}
                      aria-label={
                        doc.status === "uploading"
                          ? `${doc.name} 업로드 취소`
                          : `${doc.name} 삭제`
                      }
                      className="text-ds-label hover:text-unmet-text cursor-pointer p-1 transition-colors"
                    >
                      {doc.status === "uploading" ? (
                        <X className="size-4" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="text-ds-muted mt-4 text-[12.5px] leading-relaxed">
            상태 표시는 {STATUS_LABEL.verified} · {STATUS_LABEL.pending} 두
            가지입니다. 올린 직후에는 확인 필요이며, 확인이 끝나야 요건이
            충족으로 바뀝니다.
          </p>
        </section>
      </div>

      {/* 사이드 */}
      <div className="flex flex-col gap-3.5">
        <section className="border-ds-line-strong bg-ds-surface rounded-2xl border p-5">
          <h2 className="text-ds-navy mb-3 text-[15px] font-extrabold">
            서류 준비도
          </h2>
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
                  </span>
                  <span className="text-ds-muted block text-[12px] leading-relaxed">
                    {req.why}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-ds-tint rounded-2xl border border-[#BFE0F7] p-5">
          <h2 className="text-ds-navy text-[15px] leading-snug font-extrabold">
            이력서 첨삭이
            <br />
            필요하신가요?
          </h2>
          <p className="text-ds-body mt-2 text-[12.5px] leading-relaxed">
            한국식 이력서 형식을 멘토가 함께 봐줍니다. 3회까지 무료입니다.
          </p>
          <button
            type="button"
            className="bg-ds-navy mt-3.5 w-full cursor-pointer rounded-[10px] py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
          >
            첨삭 신청
          </button>
        </section>

        <section className="border-ds-line bg-ds-surface rounded-2xl border p-5">
          <h2 className="text-ds-navy mb-2.5 flex items-center gap-1.5 text-sm font-extrabold">
            <FileText aria-hidden className="size-4" />
            알아두세요
          </h2>
          <ul className="text-ds-body flex flex-col gap-2 text-[13px] leading-relaxed">
            <li>
              외국인등록증은 앞뒤를 함께 올려주세요. 체류자격 확인에 씁니다.
            </li>
            <li>
              TOPIK 성적표를 올리면 공고의 한국어 요건이 충족으로 바뀝니다.
            </li>
            <li>포트폴리오는 PDF 한 개로 묶어 올리면 보기 편합니다.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
