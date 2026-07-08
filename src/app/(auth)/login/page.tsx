"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialButton } from "@/components/ui/social-button";
import {
  GoogleIcon,
  KakaoIcon,
  LinkedInIcon,
} from "@/components/ui/social-icons";
import { createClient } from "@/lib/supabase/client";
import { signInWithProvider, type OAuthProvider } from "@/lib/supabase/oauth";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const onSocial = async (provider: OAuthProvider) => {
    const error = await signInWithProvider(provider, "/");
    if (error) {
      setError("root", {
        message: "소셜 로그인에 실패했어요. 잠시 후 다시 시도해 주세요.",
      });
    }
  };

  const onSubmit = async (values: LoginValues) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password,
    });

    if (error) {
      setError("password", {
        message: "이메일 또는 비밀번호가 올바르지 않아요.",
      });
      return;
    }

    router.push("/");
  };

  return (
    <div className="bg-background flex flex-1 flex-col overflow-y-auto">
      {/* 중앙 정렬 영역 */}
      <div className="flex flex-1 items-center justify-center px-5 pt-1.5 pb-14">
        <div className="w-full max-w-[392px]">
          {/* 로고 + 환영 문구 */}
          <div className="mb-[26px] flex flex-col items-center gap-3.5">
            <div className="bg-primary text-point flex size-[50px] items-center justify-center rounded-[15px] text-[26px]">
              ✦
            </div>
            <div className="text-center">
              <h1 className="text-foreground text-[22px] font-extrabold tracking-[-0.4px]">
                Globable에 오신 걸 환영합니다.
              </h1>
              <p className="text-muted-foreground mt-[5px] text-[13px]">
                로그인하면 적합도·저장·맞춤 조언이 켜집니다.
              </p>
            </div>
          </div>

          {/* 로그인 카드 */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="border-border bg-card flex flex-col gap-[11px] rounded-[18px] border p-6 shadow-[0_12px_32px_rgba(31,58,138,0.06)]"
          >
            {/* LinkedIn */}
            <SocialButton
              onClick={() => onSocial("linkedin")}
              icon={<LinkedInIcon />}
            >
              LinkedIn으로 계속하기
            </SocialButton>

            {/* Google */}
            <SocialButton
              onClick={() => onSocial("google")}
              icon={<GoogleIcon />}
            >
              Google로 계속하기
            </SocialButton>

            {/* Kakao */}
            <SocialButton
              variant="kakao"
              onClick={() => onSocial("kakao")}
              icon={<KakaoIcon />}
            >
              카카오로 계속하기
            </SocialButton>

            {errors.root && (
              <span className="text-destructive text-xs" role="alert">
                {errors.root.message}
              </span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
