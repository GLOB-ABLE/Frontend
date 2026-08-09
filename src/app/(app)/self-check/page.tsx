import { SelfCheckFlow } from "@/components/self-check/self-check-flow";

export const metadata = {
  title: "내 조건 진단 — Globable",
  description:
    "몇 가지만 알려주시면 공고마다 무엇이 충족되고 무엇이 확인이 필요한지 보여드려요.",
};

export default function SelfCheckPage() {
  return <SelfCheckFlow />;
}
