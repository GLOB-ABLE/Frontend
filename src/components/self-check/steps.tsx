"use client";

/**
 * 진단 4단계 — 각 단계의 문항 묶음
 *
 * 문항 번호(Q1~Q14)는 docs/내-조건-진단-문항.md와 1:1로 맞춘다.
 */

import { BehaviorGrid } from "@/components/self-check/behavior-grid";
import {
  ChipGroup,
  Field,
  ProofField,
  RadioGroup,
  Repeater,
  SegmentGroup,
  TextField,
} from "@/components/self-check/fields";
import {
  ACADEMIC_OPTIONS,
  DEGREE_OPTIONS,
  EMPLOYMENT_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  JOB_FAMILY_OPTIONS,
  KIIP_STAGES,
  LANGUAGE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  REGION_OPTIONS,
  SALARY_RANGE,
  TOPIK_LEVELS,
  VISA_OPTIONS,
} from "@/lib/self-check/questions";
import type {
  Certificate,
  KoreanExam,
  LanguageLevel,
  SelfCheckAnswers,
  WorkExperience,
} from "@/lib/self-check/types";

type Patch = (patch: Partial<SelfCheckAnswers>) => void;

const newId = () => Math.random().toString(36).slice(2, 9);

/* ══════════════ STEP 1 · 지금 상태 ══════════════ */

export function Step1({
  answers,
  patch,
}: {
  answers: SelfCheckAnswers;
  patch: Patch;
}) {
  const needsGraduation = answers.academicStatus !== "enrolled";

  return (
    <>
      <Field
        code="Q1"
        label="지금 가지고 있는 체류자격이 무엇인가요?"
        hint="외국인등록증 앞면에 적혀 있어요."
        required
      >
        <RadioGroup
          options={VISA_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
            hint: o.hint,
          }))}
          value={answers.visa}
          onChange={(visa) => patch({ visa })}
        />
      </Field>

      <Field code="Q2" label="지금 학교를 다니고 있나요?" required>
        <RadioGroup
          options={ACADEMIC_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
            hint: o.hint,
          }))}
          value={answers.academicStatus}
          onChange={(academicStatus) => patch({ academicStatus })}
        />

        {needsGraduation && answers.academicStatus && (
          <div className="border-ds-divider mt-4 border-t pt-4">
            <TextField
              label="졸업(예정)일"
              type="month"
              value={answers.graduationOn}
              onChange={(graduationOn) => patch({ graduationOn })}
              className="max-w-56"
            />
          </div>
        )}
      </Field>

      <Field code="Q3" label="체류 만료일이 언제인가요?" required>
        <TextField
          label="만료일"
          type="date"
          value={answers.visaExpiresOn}
          onChange={(visaExpiresOn) => patch({ visaExpiresOn })}
          className="max-w-56"
        />
      </Field>

      <Field code="Q4" label="외국인등록증을 올려주시겠어요?">
        <ProofField
          label="외국인등록증"
          note="올리지 않아도 진단은 됩니다. 올리면 체류 정보가 확인됨으로 바뀌어요."
          fileName={answers.residenceCardName}
          onPick={(residenceCardName) => patch({ residenceCardName })}
          onClear={() => patch({ residenceCardName: undefined })}
        />
      </Field>
    </>
  );
}

/* ══════════════ STEP 2 · 내 조건 ══════════════ */

export function Step2({
  answers,
  patch,
}: {
  answers: SelfCheckAnswers;
  patch: Patch;
}) {
  const exam = answers.koreanExam;

  const setExam = (next: KoreanExam) => patch({ koreanExam: next });

  const updateLanguage = (
    index: number,
    next: Partial<{ level: LanguageLevel; proofName?: string }>,
  ) => {
    const languages = answers.languages.map((lang, i) =>
      i === index ? { ...lang, ...next } : lang,
    );
    patch({ languages });
  };

  const toggleLanguage = (language: string) => {
    const exists = answers.languages.some((l) => l.language === language);
    patch({
      languages: exists
        ? answers.languages.filter((l) => l.language !== language)
        : [...answers.languages, { language, level: "business" as const }],
    });
  };

  const updateExperience = (id: string, next: Partial<WorkExperience>) =>
    patch({
      experiences: answers.experiences.map((e) =>
        e.id === id ? { ...e, ...next } : e,
      ),
    });

  const updateCertificate = (id: string, next: Partial<Certificate>) =>
    patch({
      certificates: answers.certificates.map((c) =>
        c.id === id ? { ...c, ...next } : c,
      ),
    });

  return (
    <>
      <Field code="Q5" label="최종 학력을 알려주세요." required>
        <SegmentGroup
          options={DEGREE_OPTIONS.map((d) => ({ value: d, label: d }))}
          value={answers.degree}
          onChange={(degree) => patch({ degree })}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField
            label="전공"
            value={answers.major}
            placeholder="국제통상학"
            onChange={(major) => patch({ major })}
          />
          <TextField
            label="학교 이름"
            value={answers.school}
            placeholder="○○대학교"
            onChange={(school) => patch({ school })}
          />
        </div>
        <ProofField
          label="졸업(예정)증명서"
          note="없어도 넘어갈 수 있어요. 올리면 학력이 충족으로 바뀝니다."
          fileName={answers.diplomaName}
          onPick={(diplomaName) => patch({ diplomaName })}
          onClear={() => patch({ diplomaName: undefined })}
        />
      </Field>

      <Field code="Q6" label="한국어 시험 성적이 있나요?" required>
        <RadioGroup
          options={[
            { value: "topik", label: "TOPIK 성적이 있어요" },
            { value: "kiip", label: "사회통합프로그램을 이수했어요" },
            {
              value: "conversational",
              label: "시험은 없지만 일상 대화는 가능해요",
            },
            { value: "none", label: "아직 없어요" },
          ]}
          value={exam?.kind ?? null}
          onChange={(kind) => {
            if (kind === "topik") setExam({ kind: "topik", level: 4 });
            else if (kind === "kiip") setExam({ kind: "kiip", stage: 3 });
            else if (kind === "conversational")
              setExam({ kind: "conversational" });
            else setExam({ kind: "none" });
          }}
        />

        {exam?.kind === "topik" && (
          <div className="border-ds-divider mt-4 border-t pt-4">
            <p className="text-ds-body mb-2 text-[12.5px] font-semibold">
              몇 급인가요?
            </p>
            <SegmentGroup
              options={TOPIK_LEVELS.map((l) => ({ value: l, label: `${l}급` }))}
              value={exam.level}
              onChange={(level) => setExam({ kind: "topik", level })}
            />
          </div>
        )}

        {exam?.kind === "kiip" && (
          <div className="border-ds-divider mt-4 border-t pt-4">
            <p className="text-ds-body mb-2 text-[12.5px] font-semibold">
              몇 단계인가요?
            </p>
            <SegmentGroup
              options={KIIP_STAGES.map((s) => ({
                value: s,
                label: `${s}단계`,
              }))}
              value={exam.stage}
              onChange={(stage) => setExam({ kind: "kiip", stage })}
            />
          </div>
        )}

        {(exam?.kind === "topik" || exam?.kind === "kiip") && (
          <div className="mt-4">
            <ProofField
              label="성적표"
              note="성적표가 없으면 확인 필요로 표시돼요."
              fileName={answers.koreanProofName}
              onPick={(koreanProofName) => patch({ koreanProofName })}
              onClear={() => patch({ koreanProofName: undefined })}
            />
          </div>
        )}
      </Field>

      <Field
        code="Q7"
        label="한국어 말고 업무에 쓸 수 있는 언어가 있나요?"
        hint="어느 나라 사람인지가 아니라, 업무에서 쓸 수 있는 언어를 고르는 자리예요."
      >
        <ChipGroup
          options={LANGUAGE_OPTIONS.map((l) => ({ value: l, label: l }))}
          values={answers.languages.map((l) => l.language)}
          onToggle={toggleLanguage}
        />

        {answers.languages.length > 0 && (
          <div className="border-ds-divider mt-4 flex flex-col gap-3 border-t pt-4">
            {answers.languages.map((lang, index) => (
              <div
                key={lang.language}
                className="border-ds-line rounded-xl border bg-[#FBFDFF] p-3.5"
              >
                <p className="text-ds-ink mb-2.5 text-[14px] font-bold">
                  {lang.language}
                </p>
                <SegmentGroup
                  options={LANGUAGE_LEVEL_OPTIONS}
                  value={lang.level}
                  onChange={(level) => updateLanguage(index, { level })}
                />
                <div className="mt-3">
                  <ProofField
                    label={`${lang.language} 성적표·증빙`}
                    fileName={lang.proofName}
                    onPick={(proofName) => updateLanguage(index, { proofName })}
                    onClear={() =>
                      updateLanguage(index, { proofName: undefined })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Field>

      <Field
        code="Q8"
        label="일해 본 경험이 있나요?"
        hint="인턴, 아르바이트, 학교 프로젝트도 모두 적어주세요."
      >
        <Repeater
          addLabel="경험 추가"
          emptyText="아직 적은 경험이 없어요."
          onAdd={() =>
            patch({
              experiences: [
                ...answers.experiences,
                {
                  id: newId(),
                  org: "",
                  task: "",
                  startedAt: "",
                  endedAt: "",
                  employment: "인턴",
                },
              ],
            })
          }
          items={answers.experiences.map((exp) => ({
            id: exp.id,
            onRemove: () =>
              patch({
                experiences: answers.experiences.filter((e) => e.id !== exp.id),
              }),
            node: (
              <div className="flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    label="어디서"
                    value={exp.org}
                    placeholder="○○무역"
                    onChange={(org) => updateExperience(exp.id, { org })}
                  />
                  <TextField
                    label="무슨 일을 했나요"
                    value={exp.task}
                    placeholder="수출 서류를 정리했어요"
                    onChange={(task) => updateExperience(exp.id, { task })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    label="시작"
                    type="month"
                    value={exp.startedAt}
                    onChange={(startedAt) =>
                      updateExperience(exp.id, { startedAt })
                    }
                  />
                  <TextField
                    label="끝"
                    type="month"
                    value={exp.endedAt}
                    onChange={(endedAt) =>
                      updateExperience(exp.id, { endedAt })
                    }
                  />
                </div>
                <div>
                  <p className="text-ds-body mb-1.5 text-[12.5px] font-semibold">
                    어떻게 일했나요
                  </p>
                  <SegmentGroup
                    options={EMPLOYMENT_OPTIONS.map((e) => ({
                      value: e,
                      label: e,
                    }))}
                    value={exp.employment}
                    onChange={(employment) =>
                      updateExperience(exp.id, { employment })
                    }
                  />
                </div>
                <ProofField
                  label="경력증명서"
                  fileName={exp.proofName}
                  onPick={(proofName) =>
                    updateExperience(exp.id, { proofName })
                  }
                  onClear={() =>
                    updateExperience(exp.id, { proofName: undefined })
                  }
                />
              </div>
            ),
          }))}
        />
      </Field>

      <Field code="Q9" label="가지고 있는 자격증이 있나요?">
        <Repeater
          addLabel="자격증 추가"
          emptyText="아직 적은 자격증이 없어요."
          onAdd={() =>
            patch({
              certificates: [
                ...answers.certificates,
                { id: newId(), name: "", acquiredAt: "" },
              ],
            })
          }
          items={answers.certificates.map((cert) => ({
            id: cert.id,
            onRemove: () =>
              patch({
                certificates: answers.certificates.filter(
                  (c) => c.id !== cert.id,
                ),
              }),
            node: (
              <div className="flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    label="자격증 이름"
                    value={cert.name}
                    placeholder="무역영어 2급"
                    onChange={(name) => updateCertificate(cert.id, { name })}
                  />
                  <TextField
                    label="취득일"
                    type="month"
                    value={cert.acquiredAt}
                    onChange={(acquiredAt) =>
                      updateCertificate(cert.id, { acquiredAt })
                    }
                  />
                </div>
                <ProofField
                  label="자격증 사본"
                  fileName={cert.proofName}
                  onPick={(proofName) =>
                    updateCertificate(cert.id, { proofName })
                  }
                  onClear={() =>
                    updateCertificate(cert.id, { proofName: undefined })
                  }
                />
              </div>
            ),
          }))}
        />
      </Field>
    </>
  );
}

/* ══════════════ STEP 3 · 한국어로 할 수 있는 일 ══════════════ */

export function Step3({
  answers,
  patch,
}: {
  answers: SelfCheckAnswers;
  patch: Patch;
}) {
  return (
    <Field code="Q10" label="한국어로 이런 일을 할 수 있나요?" required>
      <div className="bg-ds-tint mb-4 rounded-xl p-3.5">
        <p className="text-ds-body text-[12.5px] leading-relaxed">
          공고의 &ldquo;한국어 능통&rdquo;은 회사마다 뜻이 달라요. 어떤 곳은
          전화 응대를, 어떤 곳은 보고서 작성을 말합니다. 그래서 행동으로
          물어봐요.
        </p>
      </div>

      <BehaviorGrid
        values={answers.behaviors}
        onChange={(id, level) =>
          patch({ behaviors: { ...answers.behaviors, [id]: level } })
        }
      />
    </Field>
  );
}

/* ══════════════ STEP 4 · 원하는 일 ══════════════ */

export function Step4({
  answers,
  patch,
}: {
  answers: SelfCheckAnswers;
  patch: Patch;
}) {
  const toggle = (key: "jobFamilies" | "regions") => (value: string) => {
    const current = answers[key];
    patch({
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    });
  };

  return (
    <>
      <Field code="Q11" label="어떤 일을 하고 싶으세요?" required>
        <ChipGroup
          options={JOB_FAMILY_OPTIONS}
          values={answers.jobFamilies}
          onToggle={toggle("jobFamilies")}
        />
      </Field>

      <Field code="Q12" label="어디에서 일하고 싶으세요?">
        <ChipGroup
          options={REGION_OPTIONS}
          values={answers.regions}
          onToggle={toggle("regions")}
        />
      </Field>

      <Field code="Q13" label="희망 연봉이 어느 정도인가요?">
        <p className="text-ds-primary mb-3 text-[15px] font-bold">
          {answers.salaryMin.toLocaleString()}만원 이상
        </p>
        <input
          type="range"
          min={SALARY_RANGE.min}
          max={SALARY_RANGE.max}
          step={SALARY_RANGE.step}
          value={answers.salaryMin}
          aria-label="희망 연봉 하한"
          onChange={(e) => patch({ salaryMin: Number(e.target.value) })}
          className="accent-ds-primary bg-ds-line h-1 w-full cursor-pointer appearance-none rounded-full"
        />
        <div className="text-ds-label mt-2.5 flex justify-between text-[11.5px]">
          <span>{SALARY_RANGE.min.toLocaleString()}만원</span>
          <span>{SALARY_RANGE.max.toLocaleString()}만원</span>
        </div>
      </Field>

      <Field code="Q14" label="어떤 근무 형태를 원하세요?">
        <SegmentGroup
          options={EMPLOYMENT_TYPE_OPTIONS.map((t) => ({
            value: t,
            label: t,
          }))}
          value={answers.employmentType}
          onChange={(employmentType) => patch({ employmentType })}
        />
      </Field>
    </>
  );
}
