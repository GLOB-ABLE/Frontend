/**
 * 마이페이지 도메인 타입
 *
 * PRD MVP-01 (프로필·이력서 구조화) / MVP-02 (취업 나침반 진단)
 * 디자인 시스템 v1.2 규칙을 따른다 — 판정은 4상태, 숫자는 개수로만 (PR-1, PR-2).
 */

import type { GapStatus } from "@/lib/feed/types";

/* ── 진단 결과 (MVP-02) ───────────────────────────── */

/**
 * 한국어 업무 행동.
 * 급수만 묻지 않고 행동 단위로 수집한다. 공고의 "한국어 능통" 요건과
 * 행동 단위로 대조하기 위함이다 (PRD MVP-02).
 */
export type KoreanBehavior =
  | "phone"
  | "meeting"
  | "messenger"
  | "report"
  | "customer";

export const KOREAN_BEHAVIOR_LABEL: Record<KoreanBehavior, string> = {
  phone: "전화 응대",
  meeting: "회의 참여",
  messenger: "메신저 소통",
  report: "보고서 작성",
  customer: "고객 응대",
};

/** 추천 직무 한 건 */
export type RecommendedJobFamily = {
  /** 공고 피드의 jobFamily와 같은 키 */
  value: string;
  label: string;
  /** 추천 근거 — 판정이 아니라 사실만 적는다 */
  reasons: string[];
  /** 이 직무에서 자주 요구되는 일 */
  typicalWork: string[];
};

export type DiagnosisResult = {
  /** 진단 완료일 */
  completedAt: string;
  /** 희망 조건 */
  wishes: {
    jobFamilies: string[];
    regions: string[];
    salaryMin: number;
    employmentType: string;
  };
  recommendations: RecommendedJobFamily[];
  /** 자기 진단한 한국어 업무 행동 */
  koreanBehaviors: KoreanBehavior[];
  /** 진단만으로는 알 수 없어 확인이 필요한 항목 */
  needsCheck: string[];
};

/* ── 이력서 폼 (MVP-01) ───────────────────────────── */

export type EducationEntry = {
  id: string;
  school: string;
  major: string;
  degree: "학사" | "석사" | "박사" | "전문학사";
  /** "2022.03" 형태 */
  startedAt: string;
  graduatedAt: string;
  status: "졸업" | "졸업예정" | "재학" | "중퇴";
  note: string;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  employmentType: "정규직" | "계약직" | "인턴" | "아르바이트" | "프로젝트";
  startedAt: string;
  endedAt: string;
  /** 재직 중이면 endedAt을 비운다 */
  current: boolean;
  /** 한 일 — 한 줄에 하나씩 */
  tasks: string;
};

export type LanguageEntry = {
  id: string;
  language: string;
  level: "원어민" | "업무 가능" | "일상 회화" | "기초";
  /** "TOPIK 4급", "TOEIC 870" 등. 없으면 빈 문자열 */
  certification: string;
};

export type CertificateEntry = {
  id: string;
  name: string;
  issuer: string;
  acquiredAt: string;
};

export type PortfolioLink = {
  id: string;
  label: string;
  url: string;
};

export type ResumeForm = {
  /** 기본 정보 */
  basic: {
    nameKo: string;
    nameEn: string;
    email: string;
    phone: string;
    /**
     * 국적은 통계 목적으로만 보관하고 매칭에 쓰지 않는다 (PR-7).
     * 공고 요건과 대조되는 것은 언어·업무 행동이다.
     */
    nationality: string;
    /** 체류자격 (예: "D-10") */
    residenceStatus: string;
    /** 체류 만료일 "2027.02.15" */
    residenceExpiresAt: string;
    address: string;
  };
  educations: EducationEntry[];
  experiences: ExperienceEntry[];
  languages: LanguageEntry[];
  /** 한국어 업무 행동 자기 진단 — 진단 결과와 같은 축을 쓴다 */
  koreanBehaviors: KoreanBehavior[];
  /** 보유 기술 — 쉼표로 구분해 입력받고 배열로 저장 */
  skills: string[];
  certificates: CertificateEntry[];
  /** 자기소개 */
  introduction: string;
  portfolios: PortfolioLink[];
};

/* ── 서류 파일 ────────────────────────────────────── */

export type DocumentKind =
  | "resume"
  | "portfolio"
  | "registration"
  | "topik"
  | "graduation"
  | "career"
  | "etc";

export const DOCUMENT_KIND_LABEL: Record<DocumentKind, string> = {
  resume: "이력서",
  portfolio: "포트폴리오",
  registration: "외국인등록증",
  topik: "TOPIK 성적표",
  graduation: "졸업(예정)증명서",
  career: "경력증명서",
  etc: "기타",
};

/**
 * 서류 상태.
 * 올렸다고 바로 충족이 되지는 않는다. 확인 전에는 "확인 필요"다 (PR-1).
 */
export type DocumentStatus = "verified" | "pending" | "uploading" | "failed";

export type DocumentFile = {
  id: string;
  name: string;
  kind: DocumentKind;
  /** "pdf" | "jpg" | "png" */
  ext: string;
  /** 바이트 */
  size: number;
  /** "2026.01.28" */
  uploadedAt: string;
  status: DocumentStatus;
  /** 업로드 진행률 (uploading일 때만) */
  progress?: number;
  /** 이 파일을 쓴 공고 수 */
  usedInPostings?: number;
  /** 기본 이력서 표시 */
  isPrimary?: boolean;
};

/** 서류 준비도 체크리스트 한 줄 */
export type DocumentRequirement = {
  kind: DocumentKind;
  label: string;
  /** 필수인지 */
  required: boolean;
  status: GapStatus;
  /** 왜 필요한지 */
  why: string;
};

/* ── 유틸 ─────────────────────────────────────────── */

export function formatFileSize(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)}MB`;
  return `${Math.round(bytes / 1024)}KB`;
}

export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
