import { IntroHeader } from "@/components/intro/intro-header";

/**
 * 인트로는 앱 셸(사이드바·하단탭)을 쓰지 않는다.
 * 로그인 전 방문자가 보는 화면이라 상단 바만 둔다.
 */
export default function IntroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-ds-page min-h-dvh">
      <IntroHeader />
      {children}
      <IntroFooter />
    </div>
  );
}

function IntroFooter() {
  return (
    <footer className="border-ds-line bg-ds-surface border-t">
      <div className="text-ds-muted mx-auto flex w-full max-w-[1120px] flex-col gap-2 px-4 py-8 text-[12.5px] sm:px-6">
        <p className="text-ds-navy text-[14px] font-extrabold">Globable</p>
        {/* TODO: 사업자 정보·약관·문의처가 정해지면 채운다 */}
        <p>사업자 정보 · 이용약관 · 개인정보처리방침 자리</p>
      </div>
    </footer>
  );
}
