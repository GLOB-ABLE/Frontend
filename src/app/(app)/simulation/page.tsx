import { SimulationFlow } from "@/components/simulation/simulation-flow";

export const metadata = {
  title: "직장 시뮬레이션 — Globable",
  description:
    "한국 직장의 첫 손님 응대를 업무 지시부터 행동까지 단계별로 연습합니다.",
};

export default function SimulationPage() {
  return <SimulationFlow />;
}
