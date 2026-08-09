"use client";

/**
 * 마이페이지 · 이력서 탭
 *
 * 업로드 디자인은 이력서를 파일로 받지만, 여기서는 폼으로 받는다.
 * 폼으로 받아야 각 항목을 공고 요건과 대조할 수 있다 (PRD MVP-01 구조화).
 * 파일(포트폴리오·증명서)은 서류 탭에서 따로 받는다.
 */

import { Check, RotateCcw } from "lucide-react";

import { useState } from "react";

import {
  AddButton,
  CheckGroup,
  Field,
  FormSection,
  RepeatableItem,
  Select,
  TagInput,
  TextArea,
  TextInput,
} from "@/components/mypage/form-kit";
import {
  KOREAN_BEHAVIOR_LABEL,
  newId,
  type EducationEntry,
  type ExperienceEntry,
  type KoreanBehavior,
  type LanguageEntry,
  type ResumeForm,
} from "@/lib/mypage/types";

const DEGREES = ["전문학사", "학사", "석사", "박사"] as const;
const EDU_STATUS = ["졸업", "졸업예정", "재학", "중퇴"] as const;
const EMPLOYMENT = [
  "정규직",
  "계약직",
  "인턴",
  "아르바이트",
  "프로젝트",
] as const;
const LANG_LEVELS = ["원어민", "업무 가능", "일상 회화", "기초"] as const;

const BEHAVIOR_OPTIONS = (
  Object.keys(KOREAN_BEHAVIOR_LABEL) as KoreanBehavior[]
).map((value) => ({ value, label: KOREAN_BEHAVIOR_LABEL[value] }));

/** 반복 입력 항목이 들어 있는 필드 */
type ListKey =
  | "educations"
  | "experiences"
  | "languages"
  | "certificates"
  | "portfolios";

type ListItem<K extends ListKey> = ResumeForm[K][number];

export function ResumeTab({
  resume,
  setResume,
  onReset,
}: {
  resume: ResumeForm;
  setResume: (next: ResumeForm | ((prev: ResumeForm) => ResumeForm)) => void;
  onReset: () => void;
}) {
  /** 저장 안내는 잠깐만 띄운다 */
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const patch = <K extends keyof ResumeForm>(key: K, value: ResumeForm[K]) =>
    setResume((prev) => ({ ...prev, [key]: value }));

  const patchBasic = (key: keyof ResumeForm["basic"], value: string) =>
    setResume((prev) => ({ ...prev, basic: { ...prev.basic, [key]: value } }));

  /** 반복 항목을 한 줄만 바꾼다 */
  function patchList<K extends ListKey>(
    key: K,
    id: string,
    changes: Partial<ListItem<K>>,
  ) {
    setResume((prev) => {
      const list = prev[key] as ListItem<K>[];
      return {
        ...prev,
        [key]: list.map((item) =>
          item.id === id ? { ...item, ...changes } : item,
        ),
      };
    });
  }

  function removeFromList(key: ListKey, id: string) {
    setResume((prev) => {
      const list = prev[key] as { id: string }[];
      return { ...prev, [key]: list.filter((item) => item.id !== id) };
    });
  }

  const save = () => {
    // 입력은 이미 저장돼 있다. 이 버튼은 사용자가 저장 시점을 확인하는 용도다.
    setSavedAt(new Date().toLocaleTimeString("ko-KR"));
    window.setTimeout(() => setSavedAt(null), 2500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-ds-line-strong flex flex-wrap items-center gap-3 rounded-2xl border bg-[#F7FBFF] px-5 py-4">
        <p className="text-ds-body min-w-0 flex-1 text-[13px] leading-relaxed">
          입력하는 대로 이 브라우저에 저장됩니다. 채운 항목은 공고 요건과
          대조되고, 비어 있는 항목은 <strong>확인 필요</strong>로 남습니다.
        </p>
        <div className="flex items-center gap-2">
          {savedAt && (
            <span className="text-met-text flex items-center gap-1 text-[12.5px] font-bold">
              <Check aria-hidden className="size-3.5" />
              {savedAt} 저장됨
            </span>
          )}
          <button
            type="button"
            onClick={onReset}
            className="border-ds-line text-ds-muted hover:text-ds-primary flex cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-[12.5px] font-semibold transition-colors"
          >
            <RotateCcw aria-hidden className="size-3.5" />
            예시로 되돌리기
          </button>
          <button
            type="button"
            onClick={save}
            className="bg-ds-primary hover:bg-ds-navy cursor-pointer rounded-lg px-4 py-2 text-[12.5px] font-bold text-white transition-colors"
          >
            저장
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <FormSection
        title="기본 정보"
        hint="국적은 통계 목적으로만 보관하고 공고 매칭에는 쓰지 않습니다."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="이름 (한글)" required>
            <TextInput
              value={resume.basic.nameKo}
              onChange={(e) => patchBasic("nameKo", e.target.value)}
              placeholder="응우옌 티 린"
            />
          </Field>
          <Field label="이름 (영문)">
            <TextInput
              value={resume.basic.nameEn}
              onChange={(e) => patchBasic("nameEn", e.target.value)}
              placeholder="Nguyen Thi Linh"
            />
          </Field>
          <Field label="이메일" required>
            <TextInput
              type="email"
              value={resume.basic.email}
              onChange={(e) => patchBasic("email", e.target.value)}
            />
          </Field>
          <Field label="연락처">
            <TextInput
              value={resume.basic.phone}
              onChange={(e) => patchBasic("phone", e.target.value)}
              placeholder="010-0000-0000"
            />
          </Field>
          <Field label="국적">
            <TextInput
              value={resume.basic.nationality}
              onChange={(e) => patchBasic("nationality", e.target.value)}
            />
          </Field>
          <Field label="거주 지역">
            <TextInput
              value={resume.basic.address}
              onChange={(e) => patchBasic("address", e.target.value)}
              placeholder="경기도 시흥시"
            />
          </Field>
          <Field
            label="체류자격"
            hint="외국인등록증에 적힌 그대로 씁니다."
            required
          >
            <TextInput
              value={resume.basic.residenceStatus}
              onChange={(e) => patchBasic("residenceStatus", e.target.value)}
              placeholder="D-10"
            />
          </Field>
          <Field label="체류 만료일" required>
            <TextInput
              value={resume.basic.residenceExpiresAt}
              onChange={(e) => patchBasic("residenceExpiresAt", e.target.value)}
              placeholder="2027.02.15"
            />
          </Field>
        </div>
      </FormSection>

      {/* 학력 */}
      <FormSection title="학력" hint="가장 최근 학력을 위에 둡니다.">
        <div className="flex flex-col gap-3">
          {resume.educations.map((edu, i) => (
            <RepeatableItem
              key={edu.id}
              index={i}
              label="학력"
              removable={resume.educations.length > 1}
              onRemove={() => removeFromList("educations", edu.id)}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="학교">
                  <TextInput
                    value={edu.school}
                    onChange={(e) =>
                      patchList("educations", edu.id, {
                        school: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="전공">
                  <TextInput
                    value={edu.major}
                    onChange={(e) =>
                      patchList("educations", edu.id, {
                        major: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="학위">
                  <Select
                    options={DEGREES}
                    value={edu.degree}
                    onChange={(e) =>
                      patchList("educations", edu.id, {
                        degree: e.target.value as EducationEntry["degree"],
                      })
                    }
                  />
                </Field>
                <Field label="상태">
                  <Select
                    options={EDU_STATUS}
                    value={edu.status}
                    onChange={(e) =>
                      patchList("educations", edu.id, {
                        status: e.target.value as EducationEntry["status"],
                      })
                    }
                  />
                </Field>
                <Field label="입학" hint="2022.03">
                  <TextInput
                    value={edu.startedAt}
                    onChange={(e) =>
                      patchList("educations", edu.id, {
                        startedAt: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="졸업(예정)" hint="2026.02">
                  <TextInput
                    value={edu.graduatedAt}
                    onChange={(e) =>
                      patchList("educations", edu.id, {
                        graduatedAt: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="보충 설명" className="sm:col-span-2">
                  <TextArea
                    value={edu.note}
                    onChange={(e) =>
                      patchList("educations", edu.id, {
                        note: e.target.value,
                      })
                    }
                    placeholder="수강 과목, 졸업 프로젝트 등"
                  />
                </Field>
              </div>
            </RepeatableItem>
          ))}
          <AddButton
            label="학력 추가"
            onClick={() =>
              patch("educations", [
                ...resume.educations,
                {
                  id: newId("edu"),
                  school: "",
                  major: "",
                  degree: "학사",
                  startedAt: "",
                  graduatedAt: "",
                  status: "졸업",
                  note: "",
                },
              ])
            }
          />
        </div>
      </FormSection>

      {/* 경력 */}
      <FormSection
        title="경력 · 경험"
        hint="아르바이트와 교내 활동도 적습니다. 어떤 일을 했는지가 중요합니다."
      >
        <div className="flex flex-col gap-3">
          {resume.experiences.map((exp, i) => (
            <RepeatableItem
              key={exp.id}
              index={i}
              label="경력"
              removable
              onRemove={() => removeFromList("experiences", exp.id)}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="회사·기관">
                  <TextInput
                    value={exp.company}
                    onChange={(e) =>
                      patchList("experiences", exp.id, {
                        company: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="직무·역할">
                  <TextInput
                    value={exp.role}
                    onChange={(e) =>
                      patchList("experiences", exp.id, {
                        role: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="형태">
                  <Select
                    options={EMPLOYMENT}
                    value={exp.employmentType}
                    onChange={(e) =>
                      patchList("experiences", exp.id, {
                        employmentType: e.target
                          .value as ExperienceEntry["employmentType"],
                      })
                    }
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="시작" hint="2024.06">
                    <TextInput
                      value={exp.startedAt}
                      onChange={(e) =>
                        patchList("experiences", exp.id, {
                          startedAt: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="종료" hint="재직 중이면 비웁니다">
                    <TextInput
                      value={exp.endedAt}
                      disabled={exp.current}
                      onChange={(e) =>
                        patchList("experiences", exp.id, {
                          endedAt: e.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
                <Field
                  label="한 일"
                  hint="한 줄에 하나씩 씁니다. 짧게 씁니다."
                  className="sm:col-span-2"
                >
                  <TextArea
                    value={exp.tasks}
                    onChange={(e) =>
                      patchList("experiences", exp.id, {
                        tasks: e.target.value,
                      })
                    }
                    placeholder={
                      "베트남 거래처 이메일을 처리했습니다.\n주문서를 정리했습니다."
                    }
                  />
                </Field>
              </div>
            </RepeatableItem>
          ))}
          <AddButton
            label="경력 추가"
            onClick={() =>
              patch("experiences", [
                ...resume.experiences,
                {
                  id: newId("exp"),
                  company: "",
                  role: "",
                  employmentType: "인턴",
                  startedAt: "",
                  endedAt: "",
                  current: false,
                  tasks: "",
                },
              ])
            }
          />
        </div>
      </FormSection>

      {/* 어학 */}
      <FormSection
        title="어학"
        hint="자격증이 없으면 비워 둡니다. 증빙이 없으면 확인 필요로 남습니다."
      >
        <div className="flex flex-col gap-3">
          {resume.languages.map((lang, i) => (
            <RepeatableItem
              key={lang.id}
              index={i}
              label="언어"
              removable
              onRemove={() => removeFromList("languages", lang.id)}
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="언어">
                  <TextInput
                    value={lang.language}
                    onChange={(e) =>
                      patchList("languages", lang.id, {
                        language: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="수준">
                  <Select
                    options={LANG_LEVELS}
                    value={lang.level}
                    onChange={(e) =>
                      patchList("languages", lang.id, {
                        level: e.target.value as LanguageEntry["level"],
                      })
                    }
                  />
                </Field>
                <Field label="자격증" hint="TOPIK 4급 등">
                  <TextInput
                    value={lang.certification}
                    onChange={(e) =>
                      patchList("languages", lang.id, {
                        certification: e.target.value,
                      })
                    }
                  />
                </Field>
              </div>
            </RepeatableItem>
          ))}
          <AddButton
            label="언어 추가"
            onClick={() =>
              patch("languages", [
                ...resume.languages,
                {
                  id: newId("lang"),
                  language: "",
                  level: "업무 가능",
                  certification: "",
                },
              ])
            }
          />
        </div>

        <div className="border-ds-divider mt-5 border-t pt-4">
          <p className="text-ds-ink text-[13px] font-bold">한국어 업무 행동</p>
          <p className="text-ds-muted mt-1 mb-3 text-xs leading-relaxed">
            할 수 있는 일을 고릅니다. 공고의 &ldquo;한국어 능통&rdquo;이 실제로
            무엇을 요구하는지와 이 항목을 맞춰 봅니다.
          </p>
          <CheckGroup
            options={BEHAVIOR_OPTIONS}
            selected={resume.koreanBehaviors}
            onToggle={(value) =>
              patch(
                "koreanBehaviors",
                resume.koreanBehaviors.includes(value)
                  ? resume.koreanBehaviors.filter((b) => b !== value)
                  : [...resume.koreanBehaviors, value],
              )
            }
          />
        </div>
      </FormSection>

      {/* 기술·자격증 */}
      <FormSection title="기술 · 자격증">
        <Field label="보유 기술" hint="쉼표로 구분해 적습니다.">
          <TagInput
            values={resume.skills}
            onChange={(next) => patch("skills", next)}
            placeholder="무역 서류 작성, MS Excel, 인보이스 처리"
          />
        </Field>

        <div className="mt-5 flex flex-col gap-3">
          {resume.certificates.map((cert, i) => (
            <RepeatableItem
              key={cert.id}
              index={i}
              label="자격증"
              removable
              onRemove={() => removeFromList("certificates", cert.id)}
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="자격증명">
                  <TextInput
                    value={cert.name}
                    onChange={(e) =>
                      patchList("certificates", cert.id, {
                        name: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="발급 기관">
                  <TextInput
                    value={cert.issuer}
                    onChange={(e) =>
                      patchList("certificates", cert.id, {
                        issuer: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="취득일" hint="2025.09">
                  <TextInput
                    value={cert.acquiredAt}
                    onChange={(e) =>
                      patchList("certificates", cert.id, {
                        acquiredAt: e.target.value,
                      })
                    }
                  />
                </Field>
              </div>
            </RepeatableItem>
          ))}
          <AddButton
            label="자격증 추가"
            onClick={() =>
              patch("certificates", [
                ...resume.certificates,
                { id: newId("cert"), name: "", issuer: "", acquiredAt: "" },
              ])
            }
          />
        </div>
      </FormSection>

      {/* 자기소개 */}
      <FormSection
        title="자기소개"
        hint="한 문장을 짧게 씁니다. 없는 경험을 있다고 적지 않습니다."
      >
        <TextArea
          value={resume.introduction}
          onChange={(e) => patch("introduction", e.target.value)}
          className="min-h-40"
          placeholder="어떤 일을 할 수 있는지, 무엇을 준비하고 있는지 적습니다."
        />
        <p className="text-ds-label mt-2 text-right text-xs">
          {resume.introduction.length}자
        </p>
      </FormSection>

      {/* 포트폴리오 링크 */}
      <FormSection
        title="포트폴리오 링크"
        hint="PDF 파일은 서류 탭에서 올립니다. 여기에는 주소만 적습니다."
      >
        <div className="flex flex-col gap-3">
          {resume.portfolios.map((pf, i) => (
            <RepeatableItem
              key={pf.id}
              index={i}
              label="링크"
              removable
              onRemove={() => removeFromList("portfolios", pf.id)}
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_1.5fr]">
                <Field label="이름">
                  <TextInput
                    value={pf.label}
                    onChange={(e) =>
                      patchList("portfolios", pf.id, { label: e.target.value })
                    }
                    placeholder="졸업 프로젝트"
                  />
                </Field>
                <Field label="주소">
                  <TextInput
                    type="url"
                    value={pf.url}
                    onChange={(e) =>
                      patchList("portfolios", pf.id, { url: e.target.value })
                    }
                    placeholder="https://"
                  />
                </Field>
              </div>
            </RepeatableItem>
          ))}
          <AddButton
            label="링크 추가"
            onClick={() =>
              patch("portfolios", [
                ...resume.portfolios,
                { id: newId("pf"), label: "", url: "" },
              ])
            }
          />
        </div>
      </FormSection>
    </div>
  );
}
