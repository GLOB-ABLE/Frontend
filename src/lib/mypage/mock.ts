/**
 * 마이페이지 더미 데이터
 *
 * 공고 피드(lib/feed/mock.ts)의 페르소나와 같은 사람이다.
 * 응우옌 티 린 · 국제통상학 졸업 · D-10 · 베트남어 원어민 / TOPIK 4급(성적표 미제출).
 * 공고 상세의 판정 근거와 숫자가 어긋나지 않게 맞춰 둔다.
 */

import type {
  CertificateEntry,
  DiagnosisResult,
  DocumentFile,
  DocumentRequirement,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  PortfolioLink,
  ResumeForm,
} from "./types";

/* ── 진단 결과 ────────────────────────────────────── */

export const DIAGNOSIS: DiagnosisResult = {
  completedAt: "2026.02.18",
  wishes: {
    jobFamilies: ["해외영업·무역", "구매·자재"],
    regions: ["경기", "인천", "서울"],
    salaryMin: 2900,
    employmentType: "정규직",
  },
  recommendations: [
    {
      value: "trade",
      label: "해외영업·무역",
      reasons: [
        "국제통상학 전공과 요구 조건이 같습니다.",
        "베트남어를 원어민 수준으로 씁니다.",
        "희망 지역에 이 직무 공고가 가장 많습니다.",
      ],
      typicalWork: [
        "거래처와 주문·일정을 맞춥니다.",
        "인보이스와 통관 서류를 만듭니다.",
        "해외 출장에 동행합니다.",
      ],
    },
    {
      value: "purchasing",
      label: "구매·자재",
      reasons: [
        "해외 공장과 소통하는 일이 많습니다.",
        "무역 서류 지식을 그대로 씁니다.",
      ],
      typicalWork: [
        "자재 발주와 입고 일정을 관리합니다.",
        "해외 공급처와 단가를 확인합니다.",
      ],
    },
    {
      value: "support",
      label: "경영지원",
      reasons: [
        "문서 작성 비중이 높아 어학이 강점이 됩니다.",
        "신입 채용이 상대적으로 많습니다.",
      ],
      typicalWork: [
        "계약서와 사내 문서를 정리합니다.",
        "해외 방문객 응대를 돕습니다.",
      ],
    },
  ],
  koreanBehaviors: ["phone", "meeting", "messenger"],
  needsCheck: [
    "수출 서류 업무 경험이 아직 없습니다.",
    "TOPIK 성적표가 올라오지 않았습니다.",
  ],
};

/* ── 이력서 폼 초기값 ─────────────────────────────── */

const EDUCATIONS: EducationEntry[] = [
  {
    id: "edu-1",
    school: "한국대학교",
    major: "국제통상학과",
    degree: "학사",
    startedAt: "2022.03",
    graduatedAt: "2026.02",
    status: "졸업",
    note: "무역실무·국제물류 수강. 졸업 프로젝트로 베트남 수출 사례 분석.",
  },
];

const EXPERIENCES: ExperienceEntry[] = [
  {
    id: "exp-1",
    company: "카페 모닝",
    role: "홀 서비스",
    employmentType: "아르바이트",
    startedAt: "2024.06",
    endedAt: "2025.02",
    current: false,
    tasks:
      "한국어로 주문을 받고 응대했습니다.\n마감 정산과 재고 확인을 맡았습니다.",
  },
  {
    id: "exp-2",
    company: "한국대학교 국제교류처",
    role: "유학생 통역 도우미",
    employmentType: "프로젝트",
    startedAt: "2025.03",
    endedAt: "2025.12",
    current: false,
    tasks:
      "베트남 신입생 상담을 통역했습니다.\n학사 안내문을 베트남어로 옮겼습니다.",
  },
];

const LANGUAGES: LanguageEntry[] = [
  {
    id: "lang-1",
    language: "베트남어",
    level: "원어민",
    certification: "",
  },
  {
    id: "lang-2",
    language: "한국어",
    level: "업무 가능",
    certification: "TOPIK 4급",
  },
  {
    id: "lang-3",
    language: "영어",
    level: "일상 회화",
    certification: "TOEIC 720",
  },
];

const CERTIFICATES: CertificateEntry[] = [
  {
    id: "cert-1",
    name: "무역영어 2급",
    issuer: "대한상공회의소",
    acquiredAt: "2025.09",
  },
  {
    id: "cert-2",
    name: "컴퓨터활용능력 2급",
    issuer: "대한상공회의소",
    acquiredAt: "2025.05",
  },
];

const PORTFOLIOS: PortfolioLink[] = [
  {
    id: "pf-1",
    label: "졸업 프로젝트 — 베트남 수출 사례 분석",
    url: "https://example.com/portfolio/vn-export",
  },
];

export const INITIAL_RESUME: ResumeForm = {
  basic: {
    nameKo: "응우옌 티 린",
    nameEn: "Nguyen Thi Linh",
    email: "linh.nguyen@example.com",
    phone: "010-0000-0000",
    nationality: "베트남",
    residenceStatus: "D-10",
    residenceExpiresAt: "2027.02.15",
    address: "경기도 시흥시",
  },
  educations: EDUCATIONS,
  experiences: EXPERIENCES,
  languages: LANGUAGES,
  koreanBehaviors: ["phone", "meeting", "messenger"],
  skills: ["무역 서류 작성", "MS Excel", "인보이스 처리", "통번역(베트남어)"],
  certificates: CERTIFICATES,
  introduction:
    "국제통상학을 전공하고 베트남어와 한국어로 일할 수 있습니다. 학교 국제교류처에서 베트남 신입생 상담을 통역하며 두 언어 사이를 옮기는 일에 익숙해졌습니다. 수출 서류 업무는 아직 경험이 없어 무역영어 자격을 먼저 취득했고, 실무는 입사 후 빠르게 배우겠습니다.",
  portfolios: PORTFOLIOS,
};

/* ── 서류 파일 ────────────────────────────────────── */

export const INITIAL_DOCUMENTS: DocumentFile[] = [
  {
    id: "doc-1",
    name: "이력서_응우옌티린_국문.pdf",
    kind: "resume",
    ext: "pdf",
    size: 1_258_291,
    uploadedAt: "2026.01.28",
    status: "verified",
    usedInPostings: 4,
    isPrimary: true,
  },
  {
    id: "doc-2",
    name: "Resume_Linh_Nguyen_EN.pdf",
    kind: "resume",
    ext: "pdf",
    size: 1_003_520,
    uploadedAt: "2026.01.28",
    status: "verified",
    usedInPostings: 2,
  },
  {
    id: "doc-3",
    name: "포트폴리오_베트남수출사례.pdf",
    kind: "portfolio",
    ext: "pdf",
    size: 4_404_019,
    uploadedAt: "2026.02.05",
    status: "verified",
    usedInPostings: 1,
  },
  {
    id: "doc-4",
    name: "외국인등록증_앞뒤.jpg",
    kind: "registration",
    ext: "jpg",
    size: 2_516_582,
    uploadedAt: "2026.01.15",
    status: "verified",
  },
  {
    id: "doc-5",
    name: "졸업증명서.pdf",
    kind: "graduation",
    ext: "pdf",
    size: 655_360,
    uploadedAt: "2026.02.01",
    status: "verified",
  },
  {
    id: "doc-6",
    name: "무역영어2급_자격증.pdf",
    kind: "etc",
    ext: "pdf",
    size: 412_672,
    uploadedAt: "2026.02.10",
    status: "pending",
  },
];

/**
 * 서류 준비도.
 * TOPIK 성적표가 없어서 공고 상세의 "한국어" 요건이 확인 필요로 남아 있다.
 */
export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    kind: "resume",
    label: "국문 이력서",
    required: true,
    status: "met",
    why: "지원할 때 기본으로 보냅니다.",
  },
  {
    kind: "resume",
    label: "영문 이력서",
    required: false,
    status: "met",
    why: "외국계·수출기업에서 함께 요구합니다.",
  },
  {
    kind: "registration",
    label: "외국인등록증",
    required: true,
    status: "met",
    why: "체류자격을 확인하는 데 씁니다.",
  },
  {
    kind: "graduation",
    label: "졸업(예정)증명서",
    required: true,
    status: "met",
    why: "학위 요건을 확인하는 데 씁니다.",
  },
  {
    kind: "topik",
    label: "TOPIK 성적표",
    required: true,
    status: "check",
    why: "올리면 한국어 요건이 충족으로 바뀝니다.",
  },
  {
    kind: "portfolio",
    label: "포트폴리오",
    required: false,
    status: "met",
    why: "직무 경험을 대신 보여줄 수 있습니다.",
  },
  {
    kind: "career",
    label: "경력증명서",
    required: false,
    status: "unmet",
    why: "수출 서류 업무 경력이 아직 없습니다.",
  },
];

/** 업로드 안내에 쓰는 제약 */
export const UPLOAD_LIMIT = {
  maxSizeMb: 10,
  accept: ".pdf,.jpg,.jpeg,.png",
  acceptLabel: "PDF, JPG, PNG",
} as const;
