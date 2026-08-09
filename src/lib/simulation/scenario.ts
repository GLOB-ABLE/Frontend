/**
 * 시뮬레이션 시나리오 — 첫 손님 응대
 *
 * 원본: 자료/VER2_직장시뮬레이션_프로토타입/neul-prototype/index.html
 *
 * 원본과 다른 점 (docs/simulation.md 2.2)
 * - 3단계 행동 미션을 **악수 → 명함 양손 전달**로 바꿨다.
 *   웹캠 판정(02_hand_test)이 양손을 모은 자세를 확인하는데,
 *   악수는 한 손만 뻗어서 판정에 걸리지 않는다.
 * - 결과 화면의 점수를 4상태로 바꿨다 (PR-2).
 */

import type { MissionOutcome } from "@/lib/simulation/hand-judge";
import type {
  Choice,
  HandMission,
  ResultRow,
  SceneCopy,
  Speaker,
  Step,
} from "@/lib/simulation/types";

/* ── 등장 인물 ── */

export const SUPERVISOR: Speaker = {
  name: "박서연 대리",
  role: "해외영업팀",
  image: "/simulation/supervisor.webp",
};

export const GUEST: Speaker = {
  name: "김민수 팀장",
  role: "한빛물류",
  image: "/simulation/guest.webp",
};

/* ── 상단 스텝바 ── */

export const STEPS: Step[] = [
  { id: 1, label: "업무 지시" },
  { id: 2, label: "의미 확인" },
  { id: 3, label: "행동 미션" },
  { id: 4, label: "돌발 상황" },
  { id: 5, label: "종합 피드백" },
];

/** 화면 번호 → 스텝바에서 켤 단계. 원본의 [0,0,1,1,1,2,2,3,3,4]와 같다. */
export const SCENE_STEP: (Step["id"] | null)[] = [
  null,
  1,
  2,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
];

/* ── 0. 시작 화면 ── */

export const INTRO = {
  tag: "맞춤 시나리오가 준비됐어요",
  headline: ["한국 직장에서의 첫", "손님 응대를 연습해볼까요?"],
  /** headline 두 번째 줄에서 강조할 부분 */
  highlight: "손님 응대",
  description:
    "나의 한국어 수준과 희망 직무에 맞춘 상황에서 업무 지시를 이해하고, 직접 말하고, 행동까지 연습합니다.",
  persona: {
    label: "나의 페르소나",
    text: "나는 한국 기업의 베트남 해외영업 신입사원입니다.",
    // 국적을 조건으로 쓰지 않는다 (PR-7). 여기서는 본인이 고른 페르소나 설명이다.
    chips: ["베트남어 사용", "TOPIK 3급", "해외영업", "베트남 시장 담당"],
  },
  situation: {
    label: "오늘의 상황",
    text: "베트남 수출 건을 협의할 한국인 물류 협력사 팀장님이 회사를 방문합니다.",
    sub: "상사의 지시를 듣고 손님을 맞이해보세요.",
  },
  action: "시뮬레이션 시작",
} as const;

/* ── 1. 업무 지시 ── */

export const BRIEFING: SceneCopy = {
  speaker: SUPERVISOR,
  tag: "1단계 · 업무 지시",
  title: "상사의 업무 지시를 들어보세요",
  speech: [
    "민 씨, 오늘 베트남 수출 건을 협의할 물류 협력사 팀장님이 오실 거예요.",
    "손님이 오시면 인사드리고 회의실로 안내해주세요.",
  ],
  note: "한국어 수준에 따라 업무 지시의 표현과 난이도가 조정됩니다.",
  action: "지시 의미 확인하기",
};

/* ── 2~3. 의미 확인 ── */

export const CHOICES: Choice[] = [
  {
    id: "A",
    title: "손님에게 인사만 하고 팀장에게 알린다.",
    sentence: "손님에게 인사한 뒤 팀장님께 알리겠습니다.",
    keywords: ["인사", "알리"],
    correct: false,
  },
  {
    id: "B",
    title: "손님에게 인사하고 회의실로 안내한다.",
    sentence: "손님에게 인사하고 회의실로 안내하겠습니다.",
    keywords: ["인사", "안내"],
    correct: true,
  },
];

/* ── 4. 확인 완료 ── */

export const CONFIRMED: SceneCopy = {
  speaker: SUPERVISOR,
  tag: "의미 확인 완료",
  title: "지시를 정확히 이해했어요",
  speech: ["네, 맞아요. 그렇게 부탁드릴게요."],
  note: "'인사하기'와 '회의실 안내하기'를 모두 정확하게 말했습니다.",
  action: "손님 맞이하러 가기",
};

/* ── 5. 손님 도착 ── */

export const GUEST_ARRIVAL: SceneCopy = {
  speaker: GUEST,
  tag: "3단계 · 행동 미션",
  title: "손님이 도착했습니다",
  speech: ["안녕하세요. 한빛물류에서 왔습니다.", "명함 먼저 드리겠습니다."],
  note: "한국에서는 명함을 양손으로 주고받습니다. 카메라 앞에서 연습해보세요.",
  action: "카메라 켜고 연습하기",
};

/* ── 6. 웹캠 미션 ── */

export const HAND_MISSION: HandMission = {
  tag: "3단계 · 웹캠 행동 평가",
  title: "명함을 양손으로 받아보세요",
  description: "상반신이 화면에 보이도록 카메라 위치를 맞춰주세요.",
  guide: [
    "두 손을 모아 앞으로 내밀기",
    "손바닥이 위를 향하게 펴기",
    "가슴이나 배 높이에 두기",
    "받는 자세를 2초 동안 유지하기",
  ],
  privacyNote:
    "영상은 브라우저 안에서만 처리되고 서버로 보내지 않습니다. 저장하지도 않습니다.",
};

/* ── 7~8. 돌발 상황 ── */

export const TROUBLE: SceneCopy = {
  speaker: GUEST,
  tag: "4단계 · 돌발 상황",
  title: "손님의 말을 정확히 듣지 못했어요",
  speech: ["한빛물류 해외사업팀 김민수 팀장입니다."],
  note: "손님이 소속과 직함을 빠르게 말해 정확히 듣지 못했습니다. 정중하게 다시 질문해보세요.",
  action: "직접 질문해보기",
};

export const ASK = {
  tag: "4단계 · 돌발 상황",
  title: "손님에게 직접 질문해보세요",
  description: "상황에 맞는 정중한 표현으로 소속과 직함을 다시 확인하세요.",
  placeholder: "질문을 입력하거나 마이크로 직접 말해보세요",
  hints: ["죄송하지만", "소속과 직함", "여쭤봐도 될까요"],
  action: "답변 제출하기",
} as const;

/* ── 9. 결과 ── */

/**
 * 결과 목록을 만든다.
 *
 * 의미 카드 발화와 명함 양손 전달은 실제 판정이다.
 * 지시 이해와 높임말 표현은 아직 목 데이터다.
 */
export function buildResultRows(
  speech: MissionOutcome,
  hand: MissionOutcome,
): ResultRow[] {
  return [
    {
      id: "understanding",
      label: "지시 이해",
      detail: "두 가지 행동이 모두 들어간 선택지를 골랐어요.",
      status: "met",
    },
    {
      id: "speaking",
      label: "의미 카드 발화",
      detail: speech.detail,
      status: speech.status,
    },
    {
      id: "hand",
      label: "명함 양손 전달",
      detail: hand.detail,
      status: hand.status,
    },
    {
      id: "politeness",
      label: "높임말·질문 표현",
      detail: "'여쭤봐도 될까요'를 써서 정중하게 물었어요.",
      status: "met",
    },
  ];
}

export const RESULT = {
  tag: "시뮬레이션 완료",
  title: "첫 손님 응대를 잘 마쳤어요",
  description:
    "업무 지시 이해부터 문화적 행동, 돌발 상황 대응까지 확인한 결과입니다.",
  disclaimer: "이 결과는 연습 기록입니다. 합격 가능성을 예측하지 않습니다.",
  retry: "다시 연습하기",
  save: "학습 결과 저장하고 나가기",
} as const;
