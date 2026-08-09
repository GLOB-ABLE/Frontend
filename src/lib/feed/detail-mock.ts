/**
 * 공고 상세 목 데이터
 *
 * 목록(mock.ts)의 공고와 같은 id를 쓴다. 카드 → 상세가 실제로 이어진다.
 * 확률·매칭률·순위는 어떤 형태로도 쓰지 않는다 (PR-2, 디자인 시스템 2장 금지 패턴 1·5).
 */

import { EFFECTIVE_DATE, JOB_POSTINGS, RULE_VERSION } from "./mock";
import type {
  JobPosting,
  JobPostingDetail,
  SimilarJob,
  SupportSite,
} from "./types";

/**
 * 무료 취업지원 서비스.
 * 공식 기관만 싣고, 각 항목에 출처 링크를 붙인다 (PR-5).
 */
export const SUPPORT_SITES: SupportSite[] = [
  {
    name: "Work24",
    description:
      "고용노동부 통합 고용포털. 구인 정보와 직업훈련을 무료로 봅니다.",
    href: "https://www.work24.go.kr",
  },
  {
    name: "하이코리아 · 유학생정보시스템",
    description: "체류자격 민원과 유학생 대상 안내를 확인합니다.",
    href: "https://www.hikorea.go.kr/isi/",
  },
  {
    name: "Study in Korea",
    description: "정부가 운영하는 유학생 포털. 진로·장학 정보를 제공합니다.",
    href: "https://www.studyinkorea.go.kr",
  },
  {
    name: "외국인종합안내센터",
    description: "체류·생활 상담을 여러 언어로 받을 수 있습니다.",
    href: "https://www.hikorea.go.kr",
    contact: "1345",
  },
];

function toSimilar(job: JobPosting): SimilarJob {
  return {
    id: job.id,
    logoText: job.logoText,
    logoTone: job.logoTone,
    title: job.title,
    company: job.company,
    gap: job.gap,
    metaLabel: `${job.location} · ${job.salaryLabel}`,
  };
}

const BASE_EVIDENCE: JobPosting["evidence"] = [
  { label: "근거 보기", tone: "action" },
  { label: RULE_VERSION, tone: "meta" },
  { label: `기준일 ${EFFECTIVE_DATE}`, tone: "meta" },
];

const DETAILS: Record<string, Omit<JobPostingDetail, keyof JobPosting>> = {
  "daesung-overseas-sales": {
    breadcrumb: ["맞춤 공고", "해외영업·무역", "해외영업 담당 (신입)"],
    companyNote: "자동차 부품 수출",
    recommendReasons: [
      "베트남 시장 수출 업무가 주 업무입니다.",
      "학위 요건은 전공을 가리지 않습니다.",
      "졸업 후 D-10 전환을 전제로 채용을 진행합니다.",
    ],
    readinessNotes: [
      "외국인 담당자가 지정되어 있습니다.",
      "근로조건이 공고에 모두 적혀 있습니다.",
      "E-7 전환 절차를 회사가 지원합니다.",
    ],
    requirements: [
      {
        id: "degree",
        label: "학위",
        required: "4년제 졸업",
        mine: "인문사회계열 졸업예정 2027.02",
        status: "met",
        reasons: [
          "졸업증명서를 확인했습니다.",
          "졸업 예정 시기가 채용 일정보다 앞섭니다.",
        ],
        evidence: BASE_EVIDENCE,
      },
      {
        id: "korean",
        label: "한국어",
        required: "회의 참여 · 전화 응대",
        mine: "미입력",
        mineNote: "한국어 시험 기록 없음",
        status: "check",
        reasons: [
          "한국어 시험 급수를 아직 적지 않았습니다.",
          "성적표도 올라오지 않았습니다.",
          "증빙이 없어 충족으로 바꾸지 않습니다.",
        ],
        action: { label: "한국어 기록 채우기", href: "/mypage?tab=documents" },
        evidence: [
          { label: "증빙 없음", tone: "warn" },
          { label: RULE_VERSION, tone: "meta" },
          { label: `기준일 ${EFFECTIVE_DATE}`, tone: "meta" },
        ],
      },
      {
        id: "vietnamese",
        label: "베트남어",
        required: "거래처 응대",
        mine: "원어민 수준",
        status: "met",
        reasons: [
          "프로필에 원어민으로 적혀 있습니다.",
          "베트남 소재 고등학교 졸업증명이 확인됐습니다.",
        ],
        evidence: BASE_EVIDENCE,
      },
      {
        id: "experience",
        label: "직무 경험",
        required: "수출 서류 업무 1년",
        mine: "카페 근무 8개월",
        status: "unmet",
        reasons: [
          "적은 경험은 카페 근무 8개월입니다.",
          "수출 서류 업무 기록이 없습니다.",
        ],
        action: { label: "실무미션 보기", href: "/jobs" },
        evidence: BASE_EVIDENCE,
      },
      {
        id: "residence",
        label: "체류자격",
        required: "취업활동 가능 체류자격",
        mine: "D-2-2 재학",
        mineNote: "졸업 후 D-10 전환 예정",
        status: "check",
        reasons: [
          "지금은 학업 목적 체류자격입니다.",
          "졸업 후 D-10으로 바꾸면 취업활동을 할 수 있습니다.",
          "전환은 출입국·외국인청이 판단합니다.",
        ],
        action: { label: "체류 정보 채우기", href: "/mypage?tab=documents" },
        evidence: [
          { label: "증빙 없음", tone: "warn" },
          { label: RULE_VERSION, tone: "meta" },
        ],
      },
      {
        id: "license",
        label: "운전면허",
        required: "이 공고에서 묻지 않습니다",
        mine: "—",
        status: "na",
        reasons: [
          "이 공고의 요건 목록에 없는 항목입니다. 판정에 넣지 않습니다.",
        ],
        evidence: [{ label: RULE_VERSION, tone: "meta" }],
      },
    ],
    strengths: [
      {
        title: "졸업 시기가 채용 일정과 맞아요",
        detail: "인문사회계열 · 학위 요건은 전공을 가리지 않아요",
      },
      {
        title: "베트남어로 바로 응대할 수 있어요",
        detail: "원어민 수준 · 주 업무가 베트남 거래처 응대",
      },
      {
        title: "부산에서 다닐 수 있어요",
        detail: "부산 금정구 거주 · 근무지 부산 사상구",
      },
    ],
    toFill: [
      {
        title: "한국어 능력 기록",
        detail:
          "급수를 적고 성적표를 올리면 충족으로 바뀝니다. 학생이 하는 일입니다.",
        status: "check",
      },
      {
        title: "수출 서류 업무 경험",
        detail: "실무미션 1건으로 대신할 수 있습니다. 예상 4주.",
        status: "unmet",
      },
    ],
    source: {
      mainTasks: [
        "베트남 거래처와 이메일·전화로 주문을 확인합니다.",
        "인보이스와 통관 서류를 만듭니다.",
        "선적 일정을 거래처와 맞춥니다.",
      ],
      qualifications: [
        "4년제 대학 졸업 또는 졸업 예정",
        "베트남어로 거래처 응대가 가능한 분",
        "수출 서류 업무 경험 1년 이상",
      ],
      foreignerNote:
        "E-7 전환 절차를 회사가 함께 준비합니다. 서류 비용은 회사가 부담합니다.",
      postedAt: "2026.02.24",
      sourceLabel: "기업 등록 공고",
    },
    supportSites: SUPPORT_SITES,
    similar: [],
  },

  "shinheung-sales-support": {
    breadcrumb: ["맞춤 공고", "해외영업·무역", "해외영업 지원"],
    companyNote: "전자소재 수출",
    recommendReasons: [
      "베트남 거래처 응대가 주 업무입니다.",
      "학위 요건은 전공을 가리지 않습니다.",
      "부산에서 다닐 수 있는 거리입니다.",
    ],
    readinessNotes: [
      "외국인 담당자가 지정되어 있습니다.",
      "근로조건이 공고에 모두 적혀 있습니다.",
    ],
    requirements: [
      {
        id: "degree",
        label: "학위",
        required: "4년제 졸업",
        mine: "인문사회계열 졸업예정 2027.02",
        status: "met",
        reasons: [
          "졸업증명서를 확인했습니다.",
          "졸업 예정 시기가 채용 일정보다 앞섭니다.",
        ],
        evidence: BASE_EVIDENCE,
      },
      {
        id: "vietnamese",
        label: "베트남어",
        required: "거래처 응대",
        mine: "원어민 수준",
        status: "met",
        reasons: ["프로필에 원어민으로 적혀 있습니다."],
        evidence: BASE_EVIDENCE,
      },
      {
        id: "residence",
        label: "체류자격",
        required: "취업활동 가능 체류자격",
        mine: "D-2-2 재학",
        mineNote: "졸업 후 D-10 전환 예정",
        status: "check",
        reasons: [
          "지금은 학업 목적 체류자격입니다.",
          "졸업 후 D-10으로 바꾸면 취업활동을 할 수 있습니다.",
          "전환은 출입국·외국인청이 판단합니다.",
        ],
        action: { label: "체류 정보 채우기", href: "/mypage?tab=documents" },
        evidence: [
          { label: "증빙 없음", tone: "warn" },
          { label: RULE_VERSION, tone: "meta" },
        ],
      },
      {
        id: "office-tool",
        label: "문서 작성",
        required: "엑셀 기본 함수",
        mine: "인턴 중 주간 보고서 작성",
        status: "met",
        reasons: ["인턴 확인서에 보고서 작성 업무가 적혀 있습니다."],
        evidence: BASE_EVIDENCE,
      },
      {
        id: "travel",
        label: "출장",
        required: "분기 1회 베트남 출장",
        mine: "가능으로 표시함",
        status: "met",
        reasons: ["프로필에서 출장 가능으로 선택했습니다."],
        evidence: BASE_EVIDENCE,
      },
      {
        id: "korean-meeting",
        label: "한국어 회의 참여",
        required: "회의 발언 가능",
        mine: "미입력",
        mineNote: "한국어 시험 기록 없음",
        status: "check",
        reasons: [
          "한국어 시험 급수를 아직 적지 않았습니다.",
          "성적표도 올라오지 않았습니다.",
          "증빙이 없어 충족으로 바꾸지 않습니다.",
        ],
        action: { label: "한국어 기록 채우기", href: "/mypage?tab=documents" },
        evidence: [
          { label: "증빙 없음", tone: "warn" },
          { label: RULE_VERSION, tone: "meta" },
          { label: `기준일 ${EFFECTIVE_DATE}`, tone: "meta" },
        ],
      },
    ],
    strengths: [
      {
        title: "베트남어로 바로 응대할 수 있어요",
        detail: "원어민 수준 · 주 업무가 베트남 거래처 응대",
      },
      {
        title: "졸업 시기가 채용 일정과 맞아요",
        detail: "인문사회계열 · 학위 요건은 전공을 가리지 않아요",
      },
      {
        title: "출장 조건이 맞아요",
        detail: "분기 1회 베트남 출장 · 프로필에서 가능으로 선택",
      },
    ],
    toFill: [
      {
        title: "한국어 능력 기록",
        detail:
          "급수를 적고 성적표를 올리면 충족으로 바뀝니다. 학생이 하는 일입니다.",
        status: "check",
      },
    ],
    source: {
      mainTasks: [
        "베트남 거래처의 주문과 재고를 확인합니다.",
        "영업 담당자의 출장 일정과 자료를 준비합니다.",
        "주간 판매 실적을 정리합니다.",
      ],
      qualifications: [
        "4년제 대학 졸업 또는 졸업 예정",
        "베트남어로 거래처 응대가 가능한 분",
        "한국어로 회의에 참여할 수 있는 분",
      ],
      foreignerNote:
        "외국인 담당자가 입사 절차를 안내합니다. 체류 서류는 회사가 함께 준비합니다.",
      postedAt: "2026.02.27",
      sourceLabel: "기업 등록 공고",
    },
    supportSites: SUPPORT_SITES,
    similar: [],
  },

  "woojin-trade-office": {
    breadcrumb: ["맞춤 공고", "해외영업·무역", "무역사무 담당"],
    companyNote: "생활용품 수출입",
    recommendReasons: [
      "수출 서류 업무가 주 업무입니다.",
      "학위 요건은 전공을 가리지 않습니다.",
      "출퇴근 지역이 희망 지역과 같습니다.",
    ],
    readinessNotes: [
      "근로조건이 공고에 모두 적혀 있습니다.",
      "외국인 직원이 이미 근무하고 있습니다.",
    ],
    requirements: [
      {
        id: "degree",
        label: "학위",
        required: "4년제 졸업",
        mine: "인문사회계열 졸업예정 2027.02",
        status: "met",
        reasons: ["졸업증명서를 확인했습니다."],
        evidence: BASE_EVIDENCE,
      },
      {
        id: "english-docs",
        label: "영어 문서 작성",
        required: "인보이스·계약서 작성",
        mine: "인턴 중 영문 메일 작성",
        status: "met",
        reasons: ["인턴 확인서에 영문 메일 업무가 적혀 있습니다."],
        evidence: BASE_EVIDENCE,
      },
      {
        id: "residence",
        label: "체류자격",
        required: "취업활동 가능 체류자격",
        mine: "D-2-2 재학",
        mineNote: "졸업 후 D-10 전환 예정",
        status: "check",
        reasons: [
          "지금은 학업 목적 체류자격입니다.",
          "졸업 후 D-10으로 바꾸면 취업활동을 할 수 있습니다.",
        ],
        action: { label: "체류 정보 채우기", href: "/mypage?tab=documents" },
        evidence: [
          { label: "증빙 없음", tone: "warn" },
          { label: RULE_VERSION, tone: "meta" },
        ],
      },
      {
        id: "commute",
        label: "근무 지역",
        required: "부산 동래구 출근",
        mine: "부산 금정구 거주",
        status: "met",
        reasons: ["프로필에 적은 거주지와 근무지가 같은 생활권입니다."],
        evidence: BASE_EVIDENCE,
      },
      {
        id: "customs-system",
        label: "통관 시스템 사용",
        required: "유니패스 등 통관 시스템 경험",
        mine: "인턴 중 사용해봤다고 적음",
        mineNote: "인턴 확인서에 기재 없음",
        status: "check",
        reasons: [
          "본인이 사용해봤다고 적었습니다.",
          "인턴 확인서에는 이 업무가 적혀 있지 않습니다.",
          "증빙이 없어 충족으로 바꾸지 않습니다.",
        ],
        action: { label: "경력 증빙 올리기", href: "/mypage?tab=documents" },
        evidence: [
          { label: "증빙 없음", tone: "warn" },
          { label: RULE_VERSION, tone: "meta" },
        ],
      },
      {
        id: "license",
        label: "운전면허",
        required: "이 공고에서 묻지 않습니다",
        mine: "—",
        status: "na",
        reasons: [
          "이 공고의 요건 목록에 없는 항목입니다. 판정에 넣지 않습니다.",
        ],
        evidence: [{ label: RULE_VERSION, tone: "meta" }],
      },
    ],
    strengths: [
      {
        title: "영문 서류를 이미 써봤어요",
        detail: "인턴 확인서에 영문 메일 업무가 적혀 있어요",
      },
      {
        title: "졸업 시기가 채용 일정과 맞아요",
        detail: "인문사회계열 · 학위 요건은 전공을 가리지 않아요",
      },
      {
        title: "출퇴근 거리가 가까워요",
        detail: "부산 금정구 거주 · 근무지 부산 동래구",
      },
    ],
    toFill: [
      {
        title: "통관 시스템 사용 증빙",
        detail:
          "인턴 확인서에 업무가 적히면 충족으로 바뀝니다. 학생이 하는 일입니다.",
        status: "check",
      },
    ],
    source: {
      mainTasks: [
        "수출 인보이스와 패킹리스트를 만듭니다.",
        "통관 진행 상황을 관세사와 확인합니다.",
        "거래처에 영문 메일로 일정을 안내합니다.",
      ],
      qualifications: [
        "4년제 대학 졸업 또는 졸업 예정",
        "영문 서류 작성이 가능한 분",
        "통관 시스템 사용 경험이 있는 분 우대",
      ],
      foreignerNote:
        "외국인 직원이 이미 근무하고 있습니다. 입사 서류는 담당자가 안내합니다.",
      postedAt: "2026.03.01",
      sourceLabel: "기업 등록 공고",
    },
    supportSites: SUPPORT_SITES,
    similar: [],
  },
};

/** 목록에 있지만 상세 시드가 없는 공고를 위한 기본값 */
function fallbackDetail(
  job: JobPosting,
): Omit<JobPostingDetail, keyof JobPosting> {
  return {
    breadcrumb: ["맞춤 공고", job.title],
    companyNote: "",
    recommendReasons: job.matchReasons,
    readinessNotes: [],
    requirements: [],
    strengths: [],
    toFill: [],
    source: {
      mainTasks: [],
      qualifications: [],
      foreignerNote: "",
      postedAt: EFFECTIVE_DATE,
      sourceLabel: "기업 등록 공고",
    },
    supportSites: SUPPORT_SITES,
    similar: [],
  };
}

export function getJobDetail(id: string): JobPostingDetail | null {
  const job = JOB_POSTINGS.find((j) => j.id === id);
  if (!job) return null;

  const extra = DETAILS[id] ?? fallbackDetail(job);
  const similar = JOB_POSTINGS.filter((j) => j.id !== id)
    .slice(0, 3)
    .map(toSimilar);

  return { ...job, ...extra, similar };
}

export function getJobIds(): string[] {
  return JOB_POSTINGS.map((j) => j.id);
}
