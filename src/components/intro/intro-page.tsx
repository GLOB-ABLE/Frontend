/**
 * 인트로 페이지 — 세 입장이 같은 뼈대를 쓴다.
 *
 * 섹션 순서
 *   히어로 → 지표 → 문제 → 방법 → 기능 → FAQ → 마무리 → 면책
 *
 * 순서를 바꾸려면 여기만 고치면 세 화면에 같이 반영됩니다.
 */

import {
  ClosingSection,
  FaqSection,
  FeatureSection,
  HeroSection,
  IntroDisclaimer,
  ProblemSection,
  StatsSection,
  StepsSection,
} from "@/components/intro/sections";
import { INTRO_CONTENT, type Audience } from "@/lib/intro/content";

export function IntroPage({ audience }: { audience: Audience }) {
  const c = INTRO_CONTENT[audience];

  return (
    <main>
      <HeroSection {...c.hero} />
      <StatsSection stats={c.stats} />
      <ProblemSection problems={c.problems} />
      <StepsSection steps={c.steps} />
      <FeatureSection features={c.features} />
      <FaqSection faq={c.faq} />
      <ClosingSection {...c.closing} />
      <IntroDisclaimer />
    </main>
  );
}
