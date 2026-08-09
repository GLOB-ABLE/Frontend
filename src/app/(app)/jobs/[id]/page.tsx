import { notFound } from "next/navigation";

import { JobDetailClient } from "@/components/jobs/job-detail-client";
import { getJobDetail, getJobIds } from "@/lib/feed/detail-mock";

export function generateStaticParams() {
  return getJobIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJobDetail(id);
  if (!job) return { title: "공고를 찾을 수 없어요 — Globable" };

  return {
    title: `${job.title} · ${job.company} — Globable`,
    description: `요건 상태와 판정 근거를 지원 전에 확인하세요. ${job.location} · ${job.salaryLabel}`,
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!getJobDetail(id)) notFound();

  return <JobDetailClient id={id} />;
}
