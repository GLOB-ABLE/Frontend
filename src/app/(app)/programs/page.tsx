import { ProgramsClient } from "@/components/programs/programs-client";

export const metadata = {
  title: "추천 프로그램 — Globable",
  description: "확인 필요·미충족으로 남은 요건을 채우는 프로그램을 모았어요.",
};

export default function ProgramsPage() {
  return <ProgramsClient />;
}
