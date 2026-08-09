"use client";

/**
 * 진단 입력 필드 — 디자인 시스템 v1.2 토큰만 쓴다.
 *
 * 카피 규칙: 한 문장 15자 내외 · 한자어와 업계용어를 쓰지 않는다.
 */

import { Check, Paperclip, Plus, X } from "lucide-react";

import { useId } from "react";

import { cn } from "@/lib/utils";

/* ── 문항 껍데기 ── */

export function Field({
  code,
  label,
  hint,
  required,
  children,
}: {
  /** "Q1" 같은 문항 번호 */
  code: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="border-ds-line bg-ds-surface rounded-2xl border p-5 sm:p-6">
      <div className="mb-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="bg-ds-tint text-ds-navy rounded-md px-2 py-0.5 text-[11.5px] font-extrabold">
            {code}
          </span>
          {required ? (
            <span className="text-ds-primary text-[11.5px] font-bold">
              필수
            </span>
          ) : (
            <span className="text-ds-label text-[11.5px] font-semibold">
              선택
            </span>
          )}
        </div>
        <h3 className="text-ds-ink text-[16.5px] font-bold">{label}</h3>
        {hint && <p className="text-ds-muted mt-1.5 text-[13px]">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

/* ── 단일 선택 ── */

export function RadioGroup<T extends string | number>({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: { value: T; label: string; hint?: string }[];
  value: T | null;
  onChange: (next: T) => void;
  columns?: 1 | 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
      )}
      role="radiogroup"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
              active
                ? "border-ds-primary bg-ds-tint"
                : "border-ds-line hover:border-ds-line-strong bg-white",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors",
                active
                  ? "border-ds-primary bg-ds-primary text-white"
                  : "border-ds-line-strong",
              )}
            >
              {active && <span className="size-1.5 rounded-full bg-white" />}
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  "block text-[14.5px]",
                  active
                    ? "text-ds-navy font-bold"
                    : "text-ds-ink font-semibold",
                )}
              >
                {opt.label}
              </span>
              {opt.hint && (
                <span className="text-ds-muted mt-1 block text-[12.5px]">
                  {opt.hint}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── 복수 선택 (칩) ── */

export function ChipGroup({
  options,
  values,
  onToggle,
}: {
  options: { value: string; label: string }[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = values.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(opt.value)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-[13.5px] transition-colors",
              active
                ? "border-ds-primary bg-ds-tint text-ds-navy font-bold"
                : "border-ds-line text-ds-body hover:border-ds-line-strong bg-white",
            )}
          >
            {active && <Check className="size-3.5" strokeWidth={3} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── 분절 선택 (급수 등) ── */

export function SegmentGroup<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "min-w-11 cursor-pointer rounded-lg border px-3 py-2 text-[13px] transition-colors",
              active
                ? "border-ds-primary bg-ds-primary font-bold text-white"
                : "border-ds-line text-ds-body hover:border-ds-line-strong bg-white",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── 텍스트 · 날짜 ── */

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: "text" | "date" | "month";
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="text-ds-body mb-1.5 block text-[12.5px] font-semibold"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border-ds-line focus:border-ds-primary text-ds-ink placeholder:text-ds-label w-full rounded-lg border bg-white px-3 py-2.5 text-[14px] transition-colors outline-none"
      />
    </div>
  );
}

/* ── 증빙 첨부 ── */

export function ProofField({
  label,
  fileName,
  onPick,
  onClear,
  note,
}: {
  label: string;
  fileName?: string;
  onPick: (name: string) => void;
  onClear: () => void;
  note?: string;
}) {
  const id = useId();

  return (
    <div className="border-ds-line rounded-xl border bg-[#F7FBFF] p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-ds-ink text-[13.5px] font-bold">{label}</p>
          {note && <p className="text-ds-muted mt-1 text-[12.5px]">{note}</p>}
        </div>

        {fileName ? (
          <span className="border-met-border bg-met-bg text-met-text inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-bold">
            <Check className="size-3.5" strokeWidth={3} />
            {fileName}
            <button
              type="button"
              onClick={onClear}
              aria-label={`${label} 지우기`}
              className="ml-1 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </span>
        ) : (
          <>
            <label
              htmlFor={id}
              className="border-ds-line-strong text-ds-primary hover:bg-ds-tint inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-[12.5px] font-bold transition-colors"
            >
              <Paperclip className="size-3.5" />
              올리기
            </label>
            <input
              id={id}
              type="file"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onPick(file.name);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ── 반복 입력 (경험·자격증) ── */

export function Repeater({
  items,
  onAdd,
  addLabel,
  emptyText,
}: {
  items: { id: string; node: React.ReactNode; onRemove: () => void }[];
  onAdd: () => void;
  addLabel: string;
  emptyText: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <p className="border-ds-line text-ds-muted rounded-xl border border-dashed px-4 py-6 text-center text-[13px]">
          {emptyText}
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className="border-ds-line relative rounded-xl border bg-[#FBFDFF] p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-ds-label text-[12px] font-extrabold">
              {index + 1}
            </span>
            <button
              type="button"
              onClick={item.onRemove}
              aria-label="지우기"
              className="text-ds-muted hover:text-unmet cursor-pointer transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
          {item.node}
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="border-ds-line-strong text-ds-primary hover:bg-ds-tint flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed py-3 text-[13.5px] font-bold transition-colors"
      >
        <Plus className="size-4" />
        {addLabel}
      </button>
    </div>
  );
}
