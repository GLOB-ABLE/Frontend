import { MapHub } from "@/components/home/map-hub";
import { StudentHome } from "@/components/home/student-home";
import { OnboardingPopup } from "@/components/onboarding/onboarding-popup";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "홈 — Globable",
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 후에는 오늘 할 일이 먼저 보여야 한다 — 서비스 소개는 비로그인 화면에 남긴다.
  if (user) return <StudentHome />;

  return (
    <>
      <MapHub />
      <OnboardingPopup />
    </>
  );
}
