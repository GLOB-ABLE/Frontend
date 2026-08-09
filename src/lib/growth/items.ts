/**
 * 역량 강화 허브에 놓는 것들 — docs/simulation.md 3장
 *
 * 사이드바 메뉴는 "역량 강화" 하나이고, 실제 화면은 이 목록에서 고른다.
 * 아직 만들지 않은 것도 자리를 잡아둔다. 무엇이 준비 중인지 감추지 않는다.
 */

import {
  Briefcase,
  GraduationCap,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

export type GrowthItem = {
  id: string;
  title: string;
  /** 한 줄 설명 */
  description: string;
  /** 카드 안에 적는 특징 — 사실만 적는다 */
  points: string[];
  icon: LucideIcon;
  /** 준비 중이면 없다 */
  href?: string;
  /** 카드 오른쪽 위 배지 */
  badge?: string;
};

export const GROWTH_ITEMS: GrowthItem[] = [
  {
    id: "programs",
    title: "프로그램",
    description: "남은 요건을 채우는 교육과 상담을 모았어요.",
    points: ["무료·국비 지원 과정", "요건별로 무엇이 바뀌는지 표시"],
    icon: GraduationCap,
    href: "/programs",
  },
  {
    id: "simulation",
    title: "문화·언어 시뮬레이션",
    description: "한국 직장의 상황을 말하기와 행동으로 연습해요.",
    points: ["음성 인식으로 말하기 연습", "웹캠으로 행동 확인"],
    icon: MessagesSquare,
    href: "/simulation",
  },
  {
    id: "job-test",
    title: "직무 테스트",
    description: "희망 직무에 필요한 실무 능력을 확인해요.",
    points: ["직무별 실무 과제", "결과를 공고 요건과 연결"],
    icon: Briefcase,
    badge: "준비 중",
  },
];

export function isReady(item: GrowthItem): boolean {
  return Boolean(item.href);
}
