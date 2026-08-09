import { IntroPage } from "@/components/intro/intro-page";
import { INTRO_CONTENT } from "@/lib/intro/content";

export const metadata = {
  title: INTRO_CONTENT.company.title,
  description: INTRO_CONTENT.company.description,
};

export default function CompanyIntroPage() {
  return <IntroPage audience="company" />;
}
