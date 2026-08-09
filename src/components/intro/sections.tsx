/**
 * 인트로 페이지 섹션 — 유학생 · 기업 · 대학이 공유하는 뼈대
 *
 * 와꾸용입니다. 이미지 자리는 비워뒀고, 카피는 content.ts에서 옵니다.
 * 디자인 시스템 v1.2 토큰만 씁니다 (docs/design-system.md).
 */

import { ArrowRight } from "lucide-react";

import Link from "next/link";

import type { Cta, Stat } from "@/lib/intro/content";
import { cn } from "@/lib/utils";

/* ── 공용 ── */

/**
 * href가 없으면 아직 연결할 화면이 없다는 뜻이다.
 * 눌러도 아무 일도 일어나지 않는 자리 버튼으로 남긴다.
 */
export function CtaButton({
  cta,
  variant = "primary",
  size = "md",
  className,
}: {
  cta: Cta;
  variant?: "primary" | "outline" | "ghost";
  size?: "md" | "lg";
  className?: string;
}) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors",
    size === "lg" ? "px-7 py-4 text-[15.5px]" : "px-5 py-3 text-[14.5px]",
    variant === "primary" && "bg-ds-primary hover:bg-ds-navy text-white",
    variant === "outline" &&
      "border-ds-line-strong text-ds-primary hover:bg-ds-tint border bg-white",
    variant === "ghost" && "text-ds-primary hover:bg-ds-tint",
    className,
  );

  if (cta.href) {
    return (
      <Link href={cta.href} className={styles}>
        {cta.label}
        {variant === "primary" && <ArrowRight className="size-4" aria-hidden />}
      </Link>
    );
  }

  // TODO: 연결할 화면이 정해지면 href를 채운다
  return (
    <button type="button" className={cn(styles, "cursor-pointer")}>
      {cta.label}
    </button>
  );
}

function SectionShell({
  children,
  className,
  tone = "page",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "page" | "surface" | "navy";
}) {
  return (
    <section
      className={cn(
        "px-4 py-14 sm:px-6 sm:py-20",
        tone === "page" && "bg-ds-page",
        tone === "surface" && "bg-ds-surface",
        tone === "navy" && "bg-ds-navy",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  tone?: "light" | "dark";
}) {
  return (
    <header className="mb-9 max-w-[640px]">
      {eyebrow && (
        <p
          className={cn(
            "mb-2.5 text-[12.5px] font-extrabold tracking-wide",
            tone === "dark" ? "text-ds-tint" : "text-ds-primary",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-[26px] leading-tight font-extrabold tracking-[-0.8px] sm:text-[32px]",
          tone === "dark" ? "text-white" : "text-ds-navy",
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={cn(
            "mt-3.5 text-[15px] leading-relaxed",
            tone === "dark" ? "text-[#BFD3F5]" : "text-ds-muted",
          )}
        >
          {sub}
        </p>
      )}
    </header>
  );
}

/** 이미지·스크린샷 자리. 나중에 실제 이미지로 바꾼다. */
export function MediaSlot({
  label,
  ratio = "4/3",
  className,
}: {
  label: string;
  ratio?: "4/3" | "16/9" | "1/1";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-ds-line-strong text-ds-label flex items-center justify-center rounded-2xl border border-dashed bg-[#F7FBFF] text-[12.5px] font-semibold",
        ratio === "4/3" && "aspect-4/3",
        ratio === "16/9" && "aspect-video",
        ratio === "1/1" && "aspect-square",
        className,
      )}
    >
      {label}
    </div>
  );
}

/* ── 1. 히어로 ── */

export function HeroSection({
  eyebrow,
  headline,
  sub,
  primary,
  secondary,
}: {
  eyebrow: string;
  headline: string[];
  sub: string;
  primary: Cta;
  secondary: Cta;
}) {
  return (
    <SectionShell tone="navy" className="pt-12 pb-16 sm:pt-16 sm:pb-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-ds-tint mb-4 text-[13px] font-bold">{eyebrow}</p>
          <h1 className="text-[34px] leading-[1.25] font-extrabold tracking-[-1.4px] text-white sm:text-[46px]">
            {headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-[520px] text-[15.5px] leading-relaxed text-[#BFD3F5]">
            {sub}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaButton cta={primary} size="lg" />
            <CtaButton
              cta={secondary}
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            />
          </div>
        </div>

        <MediaSlot
          label="히어로 이미지 자리"
          ratio="4/3"
          className="border-white/25 bg-white/5 text-white/60"
        />
      </div>
    </SectionShell>
  );
}

/* ── 2. 지표 ── */

export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <SectionShell tone="surface" className="py-8 sm:py-10">
      <dl className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-ds-muted text-[13px] font-semibold">
              {stat.label}
            </dt>
            <dd className="text-ds-navy mt-1.5 text-[28px] font-extrabold tracking-[-1px]">
              {stat.value}
            </dd>
            {/* 출처 없는 숫자는 쓰지 않는다 (PR-5) */}
            <p className="text-ds-label mt-1 text-[11.5px]">
              {stat.pending ? "수치·출처 확인 중" : stat.source}
            </p>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}

/* ── 3. 문제 ── */

export function ProblemSection({
  problems,
}: {
  problems: { title: string; body: string }[];
}) {
  return (
    <SectionShell tone="page">
      <SectionHead
        eyebrow="지금 벌어지는 일"
        title="이런 게 어렵지 않으셨나요"
      />
      <ul className="grid gap-3 sm:grid-cols-3">
        {problems.map((p) => (
          <li
            key={p.title}
            className="border-ds-line bg-ds-surface rounded-2xl border p-6"
          >
            <h3 className="text-ds-ink text-[16.5px] font-bold">{p.title}</h3>
            <p className="text-ds-muted mt-2.5 text-[13.5px] leading-relaxed">
              {p.body}
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

/* ── 4. 이렇게 달라져요 ── */

export function StepsSection({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <SectionShell tone="surface">
      <SectionHead eyebrow="쓰는 방법" title="이렇게 달라져요" />
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="border-ds-line rounded-2xl border bg-[#F7FBFF] p-6"
          >
            <span className="bg-ds-primary mb-4 flex size-8 items-center justify-center rounded-full text-[14px] font-extrabold text-white">
              {index + 1}
            </span>
            <h3 className="text-ds-ink text-[16.5px] font-bold">
              {step.title}
            </h3>
            <p className="text-ds-muted mt-2.5 text-[13.5px] leading-relaxed">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

/* ── 5. 기능 소개 ── */

export function FeatureSection({
  features,
}: {
  features: {
    tag: string;
    title: string;
    body: string;
    bullets: string[];
  }[];
}) {
  return (
    <SectionShell tone="page">
      <SectionHead eyebrow="무엇을 해드리나요" title="이런 걸 할 수 있어요" />

      <div className="flex flex-col gap-4">
        {features.map((feature, index) => (
          <article
            key={feature.title}
            className="border-ds-line bg-ds-surface grid gap-8 rounded-2xl border p-6 sm:p-9 lg:grid-cols-2 lg:items-center"
          >
            <div className={cn(index % 2 === 1 && "lg:order-2")}>
              <span className="bg-ds-tint text-ds-navy inline-block rounded-md px-2.5 py-1 text-[11.5px] font-extrabold">
                {feature.tag}
              </span>
              <h3 className="text-ds-navy mt-3.5 text-[21px] font-extrabold tracking-[-0.5px]">
                {feature.title}
              </h3>
              <p className="text-ds-muted mt-2.5 text-[14px] leading-relaxed">
                {feature.body}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="bg-ds-sub mt-2 size-[5px] shrink-0 rounded-full"
                    />
                    <span className="text-ds-ink text-[13.5px] leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <MediaSlot
              label={`${feature.tag} 화면 자리`}
              ratio="4/3"
              className={cn(index % 2 === 1 && "lg:order-1")}
            />
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

/* ── 6. 자주 묻는 질문 ── */

export function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <SectionShell tone="surface">
      <SectionHead title="자주 묻는 질문" />
      <div className="flex flex-col gap-2.5">
        {faq.map((item) => (
          <details
            key={item.q}
            className="border-ds-line group rounded-2xl border bg-[#F7FBFF] p-5 sm:p-6"
          >
            <summary className="text-ds-ink flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-bold">
              {item.q}
              <span
                aria-hidden
                className="text-ds-primary shrink-0 text-lg transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="text-ds-muted mt-3.5 text-[13.5px] leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}

/* ── 7. 마무리 ── */

export function ClosingSection({
  headline,
  sub,
  primary,
  secondary,
}: {
  headline: string;
  sub: string;
  primary: Cta;
  secondary?: Cta;
}) {
  return (
    <SectionShell tone="navy">
      <div className="flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.8px] text-white sm:text-[32px]">
            {headline}
          </h2>
          <p className="mt-3 text-[15px] text-[#BFD3F5]">{sub}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <CtaButton cta={primary} size="lg" />
          {secondary && (
            <CtaButton
              cta={secondary}
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            />
          )}
        </div>
      </div>
    </SectionShell>
  );
}

/* ── 면책 ── */

export function IntroDisclaimer() {
  return (
    <SectionShell tone="page" className="py-8 sm:py-10">
      <p className="text-ds-muted text-[12.5px] leading-relaxed">
        이 서비스는 합격 가능성이나 체류자격 발급 여부를 예측하지 않습니다.
        무엇이 충족되고 무엇이 확인이 필요한지를 근거와 함께 보여드립니다. 최종
        판단은 기업과 출입국·외국인청이 합니다.
      </p>
    </SectionShell>
  );
}
