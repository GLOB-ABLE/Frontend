import { JobsClient } from "@/components/jobs/jobs-client";

export const metadata = {
  title: "맞춤 공고 — Globable",
  description:
    "지원 전에 무엇이 충족되고 무엇이 확인이 필요한지 근거와 함께 확인하세요.",
};

export default function JobsPage() {
  return <JobsClient />;
}
