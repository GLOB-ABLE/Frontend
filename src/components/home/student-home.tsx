/**
 * 로그인 후 홈 — 유학생(D-10) 대시보드
 *
 * 두 가지만 답한다.
 *   1. 지금 지원할 만한 공고와, 그 공고에 무엇을 준비해야 하는지
 *   2. 남은 요건을 채우는 데 쓸 수 있는 취업지원 프로그램
 *
 * 화면 규칙은 docs/design-system.md를 따른다.
 * - 게이트 배너(E)를 항상 상단에 놓는다
 * - 확률·매칭률·점수·순위는 어떤 형태로도 쓰지 않는다 (PR-2)
 * - 면책·출처 푸터(F)를 하단에 반복한다 (PR-5)
 */

import Link from "next/link";
import {
  Briefcase,
  BookOpen,
  Send,
  ChevronRight,
  Search,
  Sparkles,
  List,
} from "lucide-react";
import {
  getHomeJobStrategies,
  getHomePrograms,
  HOME_USER,
} from "@/lib/home/select";

import Image from "next/image";

export function StudentHome() {
  const strategies = getHomeJobStrategies();
  const programs = getHomePrograms();

  // 지원한 공고 갯수는 현재 목데이터가 없으므로 임시로 0으로 설정합니다.
  const appliedJobsCount = 0;

  return (
    <div className="bg-ds-page min-h-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/jobs"
            className="group flex items-center justify-between rounded-[16px] bg-white p-4 shadow-sm ring-1 ring-black/[0.04] transition-all hover:shadow-md hover:ring-black/[0.08]"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                <Send className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-ds-gray-500 text-[13px] font-medium">
                  나의 지원 내역
                </h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-ds-navy text-[22px] leading-none font-extrabold tracking-tight">
                    {appliedJobsCount}
                  </span>
                  <span className="text-ds-gray-500 text-[14px] font-medium">
                    건
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-ds-gray-300 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-indigo-600" />
          </Link>

          <Link
            href="/jobs"
            className="group flex items-center justify-between rounded-[16px] bg-white p-4 shadow-sm ring-1 ring-black/[0.04] transition-all hover:shadow-md hover:ring-black/[0.08]"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Briefcase className="text-ds-primary h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-ds-gray-500 text-[13px] font-medium">
                  나에게 딱 맞는 공고
                </h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-ds-navy text-[22px] leading-none font-extrabold tracking-tight">
                    {strategies.length}
                  </span>
                  <span className="text-ds-gray-500 text-[14px] font-medium">
                    건
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-ds-gray-300 group-hover:text-ds-primary h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/programs"
            className="group flex items-center justify-between rounded-[16px] bg-white p-4 shadow-sm ring-1 ring-black/[0.04] transition-all hover:shadow-md hover:ring-black/[0.08]"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-ds-gray-500 text-[13px] font-medium">
                  추천 취업 프로그램
                </h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-ds-navy text-[22px] leading-none font-extrabold tracking-tight">
                    {programs.length}
                  </span>
                  <span className="text-ds-gray-500 text-[14px] font-medium">
                    개
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-ds-gray-300 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600" />
          </Link>
        </section>

        {/* 섹션 구분 타이틀 */}
        <div className="mt-8 mb-2 px-1">
          <h2 className="text-ds-navy text-[24px] font-bold tracking-tight">
            지금 바로 시작하기
          </h2>
          <p className="text-ds-gray-500 mt-1.5 text-[15px] font-medium">
            다음 취업 준비 단계를 진행해 보세요
          </p>
        </div>

        {/* 프리미엄 배너 영역 */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* 공고 전체보기 */}
          <Link
            href="/jobs"
            className="group relative flex min-h-[220px] overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-500 to-blue-700 p-8 shadow-[0_8px_30px_rgba(37,99,235,0.2)] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(37,99,235,0.3)]"
          >
            {/* 배경 그라데이션 장식 */}
            <div className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-gradient-to-br from-white/20 to-transparent transition-transform duration-500 ease-out group-hover:scale-[1.8]" />

            <div className="relative z-10 flex h-full w-full flex-col justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30 backdrop-blur-md">
                <Search className="h-7 w-7 text-white transition-transform duration-300 ease-out group-hover:scale-110" />
              </div>
              <div className="mt-8">
                <h3 className="text-[22px] font-extrabold tracking-tight text-white">
                  모든 공고 찾아보기
                </h3>
                <p className="mt-2 text-[15.5px] leading-snug font-medium text-blue-100">
                  새로운 기회를 발견해보세요
                </p>
              </div>
            </div>

            <div className="absolute right-8 bottom-8 flex h-10 w-10 -translate-x-3 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:bg-white group-hover:text-blue-600 group-hover:opacity-100">
              <ChevronRight className="h-5 w-5" />
            </div>
          </Link>

          {/* 시뮬레이션 하러가기 */}
          <Link
            href="/simulation"
            className="group relative flex min-h-[220px] overflow-hidden rounded-[28px] bg-gradient-to-br from-purple-500 to-purple-700 p-8 shadow-[0_8px_30px_rgba(147,51,234,0.2)] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(147,51,234,0.3)]"
          >
            <div className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-gradient-to-br from-white/20 to-transparent transition-transform duration-500 ease-out group-hover:scale-[1.8]" />

            <div className="relative z-10 flex h-full w-full flex-col justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30 backdrop-blur-md">
                <Sparkles className="h-7 w-7 text-white transition-transform duration-300 ease-out group-hover:scale-110" />
              </div>
              <div className="mt-8">
                <h3 className="text-[22px] font-extrabold tracking-tight text-white">
                  K-직장 시뮬레이션
                </h3>
                <p className="mt-2 text-[15.5px] leading-snug font-medium text-purple-100">
                  한국 직장 생활을 미리 연습해 보세요
                </p>
              </div>
            </div>

            <div className="absolute right-8 bottom-8 flex h-10 w-10 -translate-x-3 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:bg-white group-hover:text-purple-600 group-hover:opacity-100">
              <ChevronRight className="h-5 w-5" />
            </div>
          </Link>

          {/* 프로그램 목록 */}
          <Link
            href="/programs"
            className="group relative flex min-h-[220px] overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 shadow-[0_8px_30px_rgba(16,185,129,0.2)] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(16,185,129,0.3)]"
          >
            <div className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-gradient-to-br from-white/20 to-transparent transition-transform duration-500 ease-out group-hover:scale-[1.8]" />

            <div className="relative z-10 flex h-full w-full flex-col justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30 backdrop-blur-md">
                <List className="h-7 w-7 text-white transition-transform duration-300 ease-out group-hover:scale-110" />
              </div>
              <div className="mt-8">
                <h3 className="text-[22px] font-extrabold tracking-tight text-white">
                  지원 프로그램 전체보기
                </h3>
                <p className="mt-2 text-[15.5px] leading-snug font-medium text-emerald-100">
                  나에게 꼭 필요한 멘토링과 교육
                </p>
              </div>
            </div>

            <div className="absolute right-8 bottom-8 flex h-10 w-10 -translate-x-3 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:bg-white group-hover:text-emerald-600 group-hover:opacity-100">
              <ChevronRight className="h-5 w-5" />
            </div>
          </Link>
        </section>
      </div>

      {/* 오른쪽 하단 고정: 인사 텍스트 + 3D 캐릭터 */}
      <div className="pointer-events-none fixed right-0 bottom-0 z-50 hidden max-w-[1050px] items-center gap-6 select-none lg:flex">
        {/* Welcome Text Box */}
        <div className="mb-6 flex flex-col text-right drop-shadow-sm">
          <h1 className="text-ds-navy mt-2 text-2xl font-extrabold tracking-[-0.9px] sm:text-[30px]">
            안녕하세요! {HOME_USER.name}님, 오늘은 여기까지 왔어요
          </h1>
          <p className="mt-3.5 text-[16px] leading-relaxed font-semibold text-[#64748B]">
            나에게 딱 맞는 공고와 진로 방향을 찾을 수 있도록
            <br />
            함께 탐색해줄게요!
          </p>
        </div>
        {/* Mascot image */}
        <div className="relative h-[250px] w-[180px] shrink-0 xl:h-[300px] xl:w-[200px]">
          <Image
            src="/map_right.png"
            alt="나랑이"
            fill
            priority
            sizes="300px"
            className="object-contain object-bottom drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
