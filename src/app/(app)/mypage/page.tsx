import { Suspense } from "react";

import { MypageClient } from "@/components/mypage/mypage-client";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "마이페이지 — Globable",
  description: "진단 결과, 이력서, 서류를 한곳에서 관리합니다.",
};

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const name = ((user?.user_metadata?.name as string | undefined) ?? "").trim();
  const email = user?.email ?? "";

  // useSearchParams를 쓰므로 Suspense 경계가 필요하다.
  return (
    <Suspense>
      <MypageClient name={name} email={email} />
    </Suspense>
  );
}
