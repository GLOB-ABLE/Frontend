"use client";

/**
 * 마이페이지 폼 기본 요소
 *
 * 디자인 시스템 타이포·라인 토큰을 그대로 쓴다.
 * 라벨은 짧게, 도움말은 사실만 (카피 규칙).
 */

import { Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function FormSection({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-ds-line bg-ds-surface rounded-2xl border p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-ds-navy text-base font-extrabold">{title}</h2>
          {hint && (
            <p className="text-ds-muted mt-1 text-[12.5px] leading-relaxed">
              {hint}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-ds-ink flex items-center gap-1 text-[13px] font-bold">
        {label}
        {required && (
          <span className="text-unmet-text" aria-label="필수">
            *
          </span>
        )}
      </span>
      {hint && <span className="text-ds-muted mt-1 block text-xs">{hint}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

const CONTROL =
  "w-full rounded-[10px] border border-ds-line bg-[#F7FBFF] px-3.5 py-2.5 text-sm text-ds-ink placeholder:text-ds-label focus:border-ds-primary focus:bg-white focus:outline-none transition-colors";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(CONTROL, props.className)} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={cn(
        CONTROL,
        "min-h-24 resize-y leading-relaxed",
        props.className,
      )}
    />
  );
}

export function Select({
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly string[];
}) {
  return (
    <select
      {...props}
      className={cn(CONTROL, "cursor-pointer", props.className)}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

/** 여러 개 추가·삭제하는 항목 묶음 (학력, 경력 등) */
export function RepeatableItem({
  index,
  label,
  onRemove,
  removable,
  children,
}: {
  index: number;
  label: string;
  onRemove: () => void;
  removable: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border-ds-line rounded-xl border bg-[#FBFDFF] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-ds-navy text-[12.5px] font-extrabold">
          {label} {index + 1}
        </span>
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="text-ds-muted hover:text-unmet-text flex cursor-pointer items-center gap-1 text-xs font-semibold transition-colors"
          >
            <Trash2 aria-hidden className="size-3.5" />
            삭제
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-ds-line-strong text-ds-primary hover:bg-ds-tint flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed py-2.5 text-[13px] font-bold transition-colors"
    >
      <Plus aria-hidden className="size-4" />
      {label}
    </button>
  );
}

/** 여러 개 고르는 체크박스 묶음 */
export function CheckGroup<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            aria-pressed={active}
            className={cn(
              "cursor-pointer rounded-lg border px-3 py-2 text-[12.5px] transition-colors",
              active
                ? "bg-ds-tint border-ds-primary text-ds-navy font-bold"
                : "border-ds-line text-ds-body hover:border-ds-line-strong",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** 쉼표로 입력받아 태그로 보여주는 입력 */
export function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <TextInput
        defaultValue={values.join(", ")}
        placeholder={placeholder}
        onBlur={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean),
          )
        }
      />
      {values.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {values.map((v) => (
            <li
              key={v}
              className="border-ds-line text-ds-navy rounded-[7px] border bg-[#F1F7FF] px-2.5 py-1 text-xs font-semibold"
            >
              {v}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
