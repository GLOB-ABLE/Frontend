"use client";

/**
 * 시연용 테스트 계정 로그인 — docs/user-flow.md 5.1
 *
 * 심사·발표에서 매번 가입하지 않도록 한 번에 로그인한다.
 * 소셜 로그인 버튼과 같은 모양(SocialButton)을 써서 같은 줄에 나란히 놓는다.
 *
 * ⚠️ 계정 정보는 `.env`의 NEXT_PUBLIC_DEMO_EMAIL / NEXT_PUBLIC_DEMO_PASSWORD를 쓴다.
 *    NEXT_PUBLIC_ 값은 브라우저 번들에 그대로 들어간다. 시연 전용 계정만 넣고,
 *    실제 사용자 데이터가 있는 계정은 절대 쓰지 않는다.
 */

import { UserRound } from "lucide-react";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { SocialButton } from "@/components/ui/social-button";
import { createClient } from "@/lib/supabase/client";

// Next가 빌드 시 값을 박아 넣으려면 process.env.X 형태로 직접 참조해야 한다.
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL;
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

export function DemoLoginButton({ next = "/" }: { next?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (loading) return;

    // 버튼은 항상 보인다. 준비가 안 됐으면 무엇을 하면 되는지 알려준다.
    if (!DEMO_EMAIL || !DEMO_PASSWORD) {
      setError(
        ".env에 NEXT_PUBLIC_DEMO_EMAIL과 NEXT_PUBLIC_DEMO_PASSWORD를 넣어주세요.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    if (authError) {
      // 계정이 아직 없을 때가 가장 흔하다.
      setError(
        "테스트 계정으로 들어가지 못했어요. Supabase에 계정이 있는지 확인해 주세요.",
      );
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <>
      <SocialButton
        onClick={handleClick}
        disabled={loading}
        icon={<UserRound className="size-[17px]" aria-hidden />}
      >
        {loading ? "들어가는 중…" : "테스트 계정으로 로그인하기"}
      </SocialButton>

      {error && (
        <span className="text-destructive text-xs" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
