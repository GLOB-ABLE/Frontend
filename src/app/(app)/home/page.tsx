import { StudentHome } from "@/components/home/student-home";

export const metadata = {
  title: "홈 — Globable",
};

/**
 * 홈 — docs/user-flow.md 3.5
 *
 * 항상 대시보드다. 진단 여부로도, 로그인 여부로도 가르지 않는다.
 * 서비스 소개(/intro/student)는 별도 주소로만 연다.
 */
export default function HomePage() {
  return <StudentHome />;
}
