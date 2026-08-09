"use client";

import { useState } from "react";
import { GrowthBackLink } from "@/components/growth/growth-back-link";
import { HOME_USER } from "@/lib/home/select";

// Types
type MissionStatus = "대기" | "진행중" | "평가완료";

interface RubricItem {
  criterion: string;
  weight: number;
}

interface Mission {
  id: string;
  companyMark: string;
  company: string;
  jobTitle: string;
  title: string;
  context: string;
  difficulty: string;
  estimatedTime: string;
  status: MissionStatus;
  tasks: string[];
  materials: string[];
  rubric: RubricItem[];
}

const MISSIONS: Mission[] = [
  {
    id: "m1",
    companyMark: "대성",
    company: "대성정밀공업",
    jobTitle: "해외영업 담당",
    title: "현지 바이어 응대 및 수출 견적서 작성",
    context:
      "신규 발굴된 현지 유통업체로부터 제품 문의가 들어왔습니다. 제공된 제품 단가표를 참고하여 비즈니스 이메일 회신과 수출 견적서(Proforma Invoice)를 작성해주세요.",
    difficulty: "난이도 중",
    estimatedTime: "예상 3시간",
    status: "평가완료",
    tasks: [
      "바이어 문의 사항 분석 및 비즈니스 회신 메일 작성",
      "제공된 단가표를 바탕으로 영문 견적서(PI) 작성",
      "수출입 조건(Incoterms) 명시",
    ],
    materials: [
      "회사 소개서 및 제품 단가표 (PDF)",
      "바이어 인콰이어리 이메일 내용",
    ],
    rubric: [
      { criterion: "비즈니스 메일 작성의 적절성", weight: 30 },
      { criterion: "견적서(PI) 양식 준수 및 계산 정확도", weight: 40 },
      { criterion: "바이어 요구사항에 대한 대응력", weight: 30 },
    ],
  },
  {
    id: "m2",
    companyMark: "한영",
    company: "한영테크",
    jobTitle: "수출 서류 담당",
    title: "수출용 선적 서류 및 L/C 분석",
    context:
      "해외 바이어가 발급한 신용장(L/C) 사본이 주어집니다. 조건에 맞게 상업송장(Commercial Invoice)과 포장명세서(Packing List)를 작성하세요.",
    difficulty: "난이도 상",
    estimatedTime: "예상 2시간",
    status: "대기",
    tasks: [
      "신용장(L/C) 필수 조건 및 선적 기한 분석",
      "상업송장(Commercial Invoice) 작성",
      "포장명세서(Packing List) 작성",
    ],
    materials: ["신용장(L/C) 사본 (PDF)", "제품 포장 및 무게 정보 명세서"],
    rubric: [
      { criterion: "신용장 조건 해석의 정확도", weight: 40 },
      { criterion: "무역 서류 양식 및 필수 항목 준수", weight: 40 },
      { criterion: "영어 문서 작성 능력", weight: 20 },
    ],
  },
  {
    id: "m3",
    companyMark: "삼양",
    company: "삼양기전",
    jobTitle: "구매·자재 담당",
    title: "글로벌 공급망 비교 및 소싱 기획",
    context:
      "주요 원자재를 납품할 해외 공급사 3곳의 제안서가 주어집니다. 단가, 리드타임, 품질 조건을 비교하여 최적의 업체를 선정하는 보고서를 작성하세요.",
    difficulty: "난이도 중",
    estimatedTime: "예상 4시간",
    status: "대기",
    tasks: [
      "3개 공급사 제안 조건 요약 및 비교",
      "원가 및 물류비용 종합 분석",
      "최적 공급사 선정 근거를 담은 기획서 작성",
    ],
    materials: [
      "공급사별 제안서 및 견적서 3부 (PDF)",
      "연간 소요량 및 예산 가이드",
    ],
    rubric: [
      { criterion: "공급 조건 비교 분석의 정확성", weight: 30 },
      { criterion: "업체 선정 논리의 타당성", weight: 40 },
      { criterion: "보고서 가독성 및 형식", weight: 30 },
    ],
  },
];

export function SkilltestClient() {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(
    null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [showResultFor, setShowResultFor] = useState<string | null>("m1");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F4F9FF] pt-8 pb-24">
      <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-8">
        <GrowthBackLink className="mb-5" />

        <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1F3A8F] via-[#2457A8] to-[#1F77FF] px-10 py-10 text-white md:flex-row">
          <div className="pointer-events-none absolute -top-24 -right-16 size-[260px] rounded-full border-[48px] border-white/10" />

          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-extrabold tracking-wide">
              PRACTICAL MISSIONS · 기업 승인 과제
            </div>
            <h1 className="mt-4 text-[32px] leading-snug font-extrabold tracking-[-1px]">
              기업이 실제 업무로 확인하는
              <br />
              나의 직무역량
            </h1>
            <p className="mt-3 text-sm leading-[1.8] text-[#CFE0FA]">
              학력과 어학점수만으로 보여주기 어려운 실력을 실제 과제 결과물로
              증명해 보세요.
            </p>
          </div>

          <div className="relative z-10 w-full max-w-[310px] rounded-[18px] bg-white p-5 text-[#0F1F3D] shadow-[0_14px_34px_rgba(15,31,61,0.2)]">
            <div className="text-xs font-bold text-[#6B7A99]">
              {HOME_USER.name}님에게 배정된 미션
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-[42px] leading-none font-extrabold text-[#1F77FF]">
                3
              </span>
              <span className="text-sm text-[#40507A]">개 기업 과제</span>
            </div>
            <div className="my-3.5 h-px bg-[#EDF3FB]" />
            <div className="flex justify-between text-[12.5px]">
              <span className="text-[#6B7A99]">평가 초안 완료</span>
              <b className="text-[#12A150]">1개</b>
            </div>
            <div className="mt-2 flex justify-between text-[12.5px]">
              <span className="text-[#6B7A99]">기업 최종 검토</span>
              <b className="text-[#A16A00]">검토 대기</b>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-[19px] font-extrabold text-[#1F3A8F]">
                기업 연결 실무 미션
              </h2>
              <span className="text-[12.5px] text-[#6B7A99]">
                부족역량 증명 과제 · 3개
              </span>
            </div>

            {MISSIONS.map((mission) => {
              const isSelected = selectedMissionId === mission.id;
              const hasResult = showResultFor === mission.id;

              return (
                <div
                  key={mission.id}
                  className={`rounded-[16px] border bg-white p-5 transition-shadow ${
                    isSelected
                      ? "border-[#1F77FF] shadow-[0_4px_16px_rgba(31,119,255,0.12)]"
                      : "border-[#E2ECF9] shadow-[0_1px_3px_rgba(31,58,143,0.05)]"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-[13px] bg-[#D7EDFB] text-xs font-extrabold text-[#1F3A8F]">
                      {mission.companyMark}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="rounded-md bg-[#E6F6ED] px-2 py-1 text-[11px] font-extrabold text-[#0E8A45]">
                          기업 승인·배정
                        </div>
                        <div className="rounded-md bg-[#F1F7FF] px-2 py-1 text-[11px] font-bold text-[#1F3A8F]">
                          {mission.difficulty}
                        </div>
                        <div className="rounded-md bg-[#F7F8FA] px-2 py-1 text-[11px] font-bold text-[#6B7A99]">
                          {mission.estimatedTime}
                        </div>
                        {mission.status === "평가완료" && (
                          <div className="rounded-md border border-[#CBEAD8] bg-[#F5FBF7] px-2 py-1 text-[11px] font-extrabold text-[#0E8A45]">
                            AI 평가 완료
                          </div>
                        )}
                      </div>
                      <div className="mt-2.5 text-[12.5px] font-bold text-[#1F77FF]">
                        {mission.company} · {mission.jobTitle}
                      </div>
                      <div className="mt-1 text-[17px] leading-[1.45] font-extrabold text-[#0F1F3D]">
                        {mission.title}
                      </div>
                      <div className="mt-2 text-[13px] leading-[1.7] text-[#6B7A99]">
                        {mission.context}
                      </div>
                    </div>
                  </div>

                  {!isSelected && (
                    <div className="mt-4 flex items-center justify-between border-t border-[#EDF3FB] pt-3.5">
                      <div className="text-xs text-[#6B7A99]">
                        평가 기준 {mission.rubric.length}개 · 제공 자료{" "}
                        {mission.materials.length}개
                      </div>
                      <button
                        onClick={() => setSelectedMissionId(mission.id)}
                        className="rounded-[9px] bg-[#1F77FF] px-3.5 py-2 text-[12.5px] font-extrabold text-white transition-colors hover:bg-blue-600"
                      >
                        과제 수행 및 제출하기
                      </button>
                    </div>
                  )}

                  {isSelected && (
                    <div className="mt-4 border-t border-[#DDE9F7] pt-4">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-[#E2ECF9] bg-[#F7FBFF] p-4">
                          <h3 className="mb-2 text-[12.5px] font-extrabold text-[#1F3A8F]">
                            수행 항목
                          </h3>
                          <ul className="flex flex-col gap-1">
                            {mission.tasks.map((task, i) => (
                              <li
                                key={i}
                                className="text-[12.5px] leading-[1.6] text-[#40507A]"
                              >
                                ✓ {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-[#E2ECF9] bg-[#F7FBFF] p-4">
                          <h3 className="mb-2 text-[12.5px] font-extrabold text-[#1F3A8F]">
                            제공 자료
                          </h3>
                          <ul className="flex flex-col gap-1">
                            {mission.materials.map((mat, i) => (
                              <li
                                key={i}
                                className="text-[12.5px] leading-[1.6] text-[#40507A]"
                              >
                                • {mat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-[#E2ECF9] bg-white p-4">
                        <h3 className="mb-2 text-[12.5px] font-extrabold text-[#1F3A8F]">
                          평가 루브릭
                        </h3>
                        {mission.rubric.map((crit, i) => (
                          <div
                            key={i}
                            className="flex justify-between border-b border-[#F1F4F8] py-1.5 pb-0 text-[12.5px] text-[#40507A] last:border-0"
                          >
                            <span>{crit.criterion}</span>
                            <b className="text-[#1F77FF]">{crit.weight}%</b>
                          </div>
                        ))}
                      </div>

                      {!hasResult && (
                        <div className="mt-3 rounded-[13px] border border-[#C9DFF8] bg-[#F1F7FF] p-4">
                          <h3 className="text-[13px] font-extrabold text-[#1F3A8F]">
                            결과물 제출
                          </h3>
                          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <label className="flex cursor-pointer flex-col justify-center rounded-[11px] border-[1.5px] border-dashed border-[#9CBDEB] bg-white p-4 transition-colors hover:border-[#1F77FF]">
                              <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) =>
                                  e.target.files && setFile(e.target.files[0])
                                }
                              />
                              <span className="text-[12.5px] font-extrabold text-[#1F77FF]">
                                PDF 결과물 선택
                              </span>
                              <span className="mt-1.5 text-xs text-[#6B7A99]">
                                {file ? file.name : "선택된 파일 없음"}
                              </span>
                              <span className="mt-1 text-[11px] text-[#9AAAC4]">
                                최대 10MB · 파일 내용은 전송하지 않음
                              </span>
                            </label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="과제 수행 과정과 중점적으로 고민한 내용을 작성해 주세요."
                              className="min-h-[96px] resize-y rounded-[11px] border border-[#C9DFF8] bg-white p-3 text-[12.5px] text-[#40507A] outline-none focus:border-[#1F77FF]"
                            />
                          </div>
                          <div className="mt-3 flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedMissionId(null)}
                              className="rounded-[9px] border border-[#C9DFF8] bg-white px-3.5 py-2 text-[12.5px] font-bold text-[#40507A] hover:bg-slate-50"
                            >
                              취소
                            </button>
                            <button
                              onClick={() => {
                                if (file) setShowResultFor(mission.id);
                              }}
                              disabled={!file}
                              className="rounded-[9px] bg-[#1F77FF] px-4 py-2 text-[12.5px] font-extrabold text-white disabled:opacity-50"
                            >
                              제출하기
                            </button>
                          </div>
                        </div>
                      )}

                      {hasResult && (
                        <div className="mt-3 rounded-[13px] border border-[#CBEAD8] bg-[#F5FBF7] p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-[#0E8A45]">
                                AI 평가 초안
                              </div>
                              <div className="mt-1 text-xs text-[#4B6152]">
                                기업 담당자 최종 검토 전
                              </div>
                            </div>
                            <div className="text-[28px] font-extrabold text-[#12A150]">
                              85<span className="text-xs">점</span>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            <div className="rounded-[10px] bg-white p-3">
                              <div className="text-[11.5px] font-extrabold text-[#0E8A45]">
                                강점
                              </div>
                              <div className="mt-1.5 text-[12.5px] leading-[1.6] text-[#40507A]">
                                비즈니스 베트남어 메일 작성 규격을 잘 이해하고
                                있으며, 견적서(PI)에 요구된 제품 단가와 수출입
                                조건(FOB)을 누락 없이 명시한 점이 훌륭합니다.
                              </div>
                            </div>
                            <div className="rounded-[10px] bg-white p-3">
                              <div className="text-[11.5px] font-extrabold text-[#A16A00]">
                                보완 의견
                              </div>
                              <div className="mt-1.5 text-[12.5px] leading-[1.6] text-[#40507A]">
                                견적서 내 제품 규격 표기 시 현지에서 통용되는
                                단위를 병기해주면 바이어의 이해를 더 돕고 신뢰를
                                줄 수 있겠습니다. 무역 실무 용어를 조금 더
                                보완하면 완벽합니다.
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="rounded-[7px] bg-[#FFF6E0] px-2 py-1.5 text-[11.5px] font-extrabold text-[#A16A00]">
                              기업 검토 대기중
                            </span>
                            <button
                              onClick={() => setSelectedMissionId(null)}
                              className="text-[12.5px] font-extrabold text-[#1F77FF] hover:underline"
                            >
                              목록으로 돌아가기
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right sidebar */}
          <div className="sticky top-20 flex hidden flex-col gap-3.5 lg:flex">
            <div className="rounded-[16px] border border-[#E2ECF9] bg-white p-5">
              <h3 className="text-[15px] font-extrabold text-[#1F3A8F]">
                진행 순서
              </h3>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex gap-2.5">
                  <div className="flex size-[25px] shrink-0 items-center justify-center rounded-full bg-[#1F77FF] text-[11px] font-extrabold text-white">
                    1
                  </div>
                  <div>
                    <div className="text-[13px] font-extrabold">과제 확인</div>
                    <div className="mt-1 text-[11.5px] text-[#6B7A99]">
                      업무 배경과 자료를 읽어요
                    </div>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="flex size-[25px] shrink-0 items-center justify-center rounded-full bg-[#D7EDFB] text-[11px] font-extrabold text-[#1F3A8F]">
                    2
                  </div>
                  <div>
                    <div className="text-[13px] font-extrabold">
                      결과물 제출
                    </div>
                    <div className="mt-1 text-[11.5px] text-[#6B7A99]">
                      PDF와 수행 노트를 준비해요
                    </div>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="flex size-[25px] shrink-0 items-center justify-center rounded-full bg-[#D7EDFB] text-[11px] font-extrabold text-[#1F3A8F]">
                    3
                  </div>
                  <div>
                    <div className="text-[13px] font-extrabold">
                      AI 평가 초안
                    </div>
                    <div className="mt-1 text-[11.5px] text-[#6B7A99]">
                      루브릭 기준 피드백을 받아요
                    </div>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="flex size-[25px] shrink-0 items-center justify-center rounded-full bg-[#FFF6E0] text-[11px] font-extrabold text-[#A16A00]">
                    4
                  </div>
                  <div>
                    <div className="text-[13px] font-extrabold">
                      기업 최종 검토
                    </div>
                    <div className="mt-1 text-[11.5px] text-[#6B7A99]">
                      담당자가 근거와 결과를 확정해요
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[16px] border border-[#F3DFAE] bg-[#FFFBF0] p-4">
              <h3 className="text-[13.5px] font-extrabold text-[#7A5600]">
                평가 결과 안내
              </h3>
              <p className="mt-2 text-xs leading-[1.65] text-[#7A5600]">
                AI 평가는 초안이며 합격·불합격을 확정하지 않습니다. 기업
                담당자의 최종 검토 후 결과가 확정됩니다.
              </p>
            </div>
            <div className="rounded-[16px] border border-[#BFE0F7] bg-[#D7EDFB] p-4">
              <h3 className="text-[13.5px] font-extrabold text-[#1F3A8F]">
                프로토타입 파일 처리
              </h3>
              <p className="mt-2 text-xs leading-[1.65] text-[#40507A]">
                선택한 PDF의 파일명과 크기만 화면 상태에 저장되며 파일 내용은
                업로드되지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
