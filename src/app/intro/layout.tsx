import { FeatureAnnouncement } from "@/components/intro/feature-announcement";
import { IntroHeader } from "@/components/intro/intro-header";
import { SimulationCta } from "@/components/intro/simulation-cta";

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
    // body가 flex 컨테이너다. min-h-dvh 대신 남은 높이를 채워 넘침을 막는다.
    <div className="bg-ds-page flex min-h-0 flex-1 flex-col">
      <IntroHeader />
      <div className="flex-1">{children}</div>

      {/* 하단 고정 바에 가리지 않도록 푸터에 여백을 더 준다 */}
      <IntroFooter />

      {/* 첫 방문자에게 신규 기능을 한 번만 알린다 */}
      <FeatureAnnouncement />

      {/* 팝업을 닫아도 남는 유도 바 */}
      <SimulationCta />
    </div>
  );
}

function IntroFooter() {
  return (
    <footer className="border-ds-line bg-ds-surface border-t">
      <div className="text-ds-muted mx-auto flex w-full max-w-[1120px] flex-col gap-2 px-4 pt-8 pb-32 text-[12.5px] sm:px-6">
        <p className="text-ds-navy text-[14px] font-extrabold">Globable</p>
        {/* TODO: 사업자 정보·약관·문의처가 정해지면 채운다 */}
        <p>사업자 정보 · 이용약관 · 개인정보처리방침 자리</p>
      </div>
    </footer>
  );
}
