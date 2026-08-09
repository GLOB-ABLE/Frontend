import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Globable — 외국인 취업 플랫폼",
  description:
    "한국에서 일하려는 외국인 유학생과 외국인 인재를 채용하려는 기업을 잇는 취업 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
