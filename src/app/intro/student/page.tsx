import { IntroPage } from "@/components/intro/intro-page";
import { INTRO_CONTENT } from "@/lib/intro/content";

export const metadata = {
  title: INTRO_CONTENT.student.title,
  description: INTRO_CONTENT.student.description,
};

export default function StudentIntroPage() {
  return <IntroPage audience="student" />;
}
