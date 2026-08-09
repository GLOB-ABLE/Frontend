import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    /*
      셸 높이를 화면 높이로 고정한다.
      이래야 헤더·사이드바·하단탭이 제자리에 있고 본문(main)만 스크롤된다.
      flex-1로 두면 높이가 정해지지 않아 페이지 전체가 스크롤되고,
      그때 왼쪽 메뉴가 같이 위로 올라가버린다.
    */
    <div className="bg-background flex h-dvh flex-col overflow-hidden">
      <AppHeader />
      <div className="flex min-h-0 flex-1">
        <Sidebar isLoggedIn={!!user} />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
