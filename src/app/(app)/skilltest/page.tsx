import { SkilltestClient } from "@/components/skilltest/skilltest-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "직무 테스트",
};

export default function SkilltestPage() {
  return <SkilltestClient />;
}
