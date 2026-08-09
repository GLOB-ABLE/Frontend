import { IntroPage } from "@/components/intro/intro-page";
import { INTRO_CONTENT } from "@/lib/intro/content";

export const metadata = {
  title: INTRO_CONTENT.university.title,
  description: INTRO_CONTENT.university.description,
};

export default function UniversityIntroPage() {
  return <IntroPage audience="university" />;
}
