import type { TestAnswer, TestResult } from "@/types/tests";

export const LOLLANE_TEST = {
  code: "lollane",
  docId: "lollane",
  title: "나는 LOL 게임에서 어떤 라인이 어울릴까?",
  description: "플레이 스타일, 성향, 반응 방식에 따라 어울리는 LOL 라인은 다릅니다. 10가지 질문을 통해 당신의 포지션을 알아보세요!",
  bgGradient: "from-[#e3f2fd] via-[#fce4ec] to-[#fff3e0]",
  mainColor: "#3f51b5",
  icon: "🎮",
  thumbnailUrl: "/lollane_thumb.png",
  tags: ["LOL", "게임", "라인", "MBTI", "포지션테스트"],
  views: 0,
  likes: 0,
  scraps: 0,
  category: "게임",
  questions: [
    {
      question: "1. 팀원이 트롤을 하기 시작했다. 당신은?",
      options: [
        { text: "라인이나 더 이기자.", value: "TOP", score: 2 },
        { text: "지금 이 타이밍에 미드 뚫자!", value: "MID", score: 2 },
        { text: "어쩌라고ㅋㅋ", value: "ADC", score: 2 },
        { text: "팀원 상태부터 챙기자.", value: "SUP", score: 2 }
      ]
    },
    {
      question: "2. 게임 초반, 가장 먼저 챙기는 것은?",
      options: [
        { text: "라인전 주도권", value: "TOP", score: 2 },
        { text: "로밍 타이밍 계산", value: "MID", score: 2 },
        { text: "CS 손실 최소화", value: "ADC", score: 2 },
        { text: "시야 장악", value: "SUP", score: 2 }
      ]
    },
    {
      question: "3. 팀원들이 말다툼을 시작한다면?",
      options: [
        { text: "무시하고 플레이 집중", value: "TOP", score: 2 },
        { text: "말리는 척하면서 운영으로 승리 노림", value: "MID", score: 2 },
        { text: "눈치 보며 채팅 관망", value: "ADC", score: 2 },
        { text: '“그만 싸우고 게임합시다” 먼저 나서서 말림', value: "SUP", score: 2 }
      ]
    },
    {
      question: "4. 한타가 시작됐다! 당신은?",
      options: [
        { text: "앞라인에서 딜 맞으며 버팀", value: "TOP", score: 2 },
        { text: "뒤에서 폭딜하고 살아남기", value: "MID", score: 2 },
        { text: "정확한 포지셔닝으로 딜링", value: "ADC", score: 2 },
        { text: "힐/쉴드/CC로 팀을 지킴", value: "SUP", score: 2 }
      ]
    },
    {
      question: "5. 가장 좋아하는 순간은?",
      options: [
        { text: "1:1 솔킬 땄을 때", value: "TOP", score: 2 },
        { text: "로밍으로 킬 만들어냈을 때", value: "MID", score: 2 },
        { text: "내가 캐리해서 역전했을 때", value: "ADC", score: 2 },
        { text: "팀원이 ‘고마워’ 했을 때", value: "SUP", score: 2 }
      ]
    },
    {
      question: "6. 당신이 자주 픽하는 챔피언 스타일은?",
      options: [
        { text: "탱커/브루저", value: "TOP", score: 2 },
        { text: "암살자/컨트롤메이지", value: "MID", score: 2 },
        { text: "원거리 딜러", value: "ADC", score: 2 },
        { text: "이니시에이터/힐러", value: "SUP", score: 2 }
      ]
    },
    {
      question: "7. 게임에서 가장 중요하다고 생각하는 것은?",
      options: [
        { text: "라인전 승리", value: "TOP", score: 2 },
        { text: "전략적 시야 활용", value: "JUNGLE", score: 2 },
        { text: "딜량과 포지셔닝", value: "ADC", score: 2 },
        { text: "팀워크와 호흡", value: "SUP", score: 2 }
      ]
    },
    {
      question: "8. 미니맵을 얼마나 자주 확인하나요?",
      options: [
        { text: "필요할 때만", value: "TOP", score: 2 },
        { text: "자주 체크하면서 동선 계산", value: "JUNGLE", score: 2 },
        { text: "주로 우리 라인만 본다", value: "ADC", score: 2 },
        { text: "항상 맵 전반을 살핀다", value: "SUP", score: 2 }
      ]
    },
    {
      question: "9. 게임을 시작할 때 가장 먼저 생각하는 건?",
      options: [
        { text: "1렙 싸움 구도", value: "TOP", score: 2 },
        { text: "상대 정글 동선", value: "JUNGLE", score: 2 },
        { text: "내 딜 사이클", value: "MID", score: 2 },
        { text: "우리팀 조합 궁합", value: "SUP", score: 2 }
      ]
    },
    {
      question: "10. 당신이 없는 팀은 어떤 모습일까?",
      options: [
        { text: "앞라인이 약해진다", value: "TOP", score: 2 },
        { text: "운영과 시야가 부족하다", value: "JUNGLE", score: 2 },
        { text: "화력이 떨어진다", value: "ADC", score: 2 },
        { text: "팀워크가 흐트러진다", value: "SUP", score: 2 }
      ]
    }
  ],
  results: [
    {
      type: "TOP",
      title: "🛡️ 탑라인 – 단단한 외로운 전사",
      desc: "자신만의 길을 묵묵히 가는 강인한 당신!",
      subDesc: "상대의 압박 속에서도 꿋꿋하게 라인을 유지하는 타입",
      icon: "🛡️",
      hashtags: ["#1인분", "#탑솔", "#강한멘탈"],
      condition: (scores: Record<string, number>, highest: string[]) => scores.TOP >= 12 && highest.includes("TOP")
    },
    {
      type: "MID",
      title: "⚔️ 미드라인 – 전략의 중심",
      desc: "맵을 관통하는 존재감, 로밍과 화력 모두를 책임지는 중심축!",
      subDesc: "판을 읽고 움직이는 리더 타입",
      icon: "⚔️",
      hashtags: ["#중심", "#로밍", "#미드라이너"],
      condition: (scores: Record<string, number>, highest: string[]) => scores.MID >= 12 && highest.includes("MID")
    },
    {
      type: "ADC",
      title: "🎯 원딜 – 후반 캐리의 아이콘",
      desc: "포지셔닝 하나로 게임을 뒤집는 딜링 머신!",
      subDesc: "한타에선 당신의 딜량이 곧 희망",
      icon: "🎯",
      hashtags: ["#원딜", "#포지셔닝", "#캐리력"],
      condition: (scores: Record<string, number>, highest: string[]) => scores.ADC >= 12 && highest.includes("ADC")
    },
    {
      type: "SUP",
      title: "💉 서포터 – 팀의 숨은 MVP",
      desc: "시야와 힐, CC로 팀을 완성시키는 헌신형 플레이어!",
      subDesc: "당신은 팀워크의 핵심",
      icon: "💉",
      hashtags: ["#서폿", "#시야장인", "#팀플"],
      condition: (scores: Record<string, number>, highest: string[]) => scores.SUP >= 12 && highest.includes("SUP")
    },
    {
      type: "JUNGLE",
      title: "🌲 정글 – 설계자이자 판을 흔드는 자",
      desc: "맵 전체를 움직이는 전략가!",
      subDesc: "초반 설계부터 오브젝트 컨트롤까지, 다 당신 손에 달렸다",
      icon: "🌲",
      hashtags: ["#정글러", "#갱킹", "#설계자"],
      condition: (scores: Record<string, number>, highest: string[]) => scores.JUNGLE >= 12 && highest.includes("JUNGLE")
    },
    {
      type: "ALL",
      title: "🌀 올라운더 – 어떤 라인도 소화하는 만능형",
      desc: "모든 포지션에 적응 가능한 유연한 플레이어!",
      subDesc: "팀의 상황에 따라 언제든 역할을 바꿀 수 있는 당신",
      icon: "🌀",
      hashtags: ["#올라운더", "#전천후", "#유연함"],
      condition: () => true
    }
  ] as TestResult[],
  calculateResult(answers: TestAnswer[]): TestResult {
    // 라인별 점수 집계
    const scores: Record<string, number> = { TOP: 0, MID: 0, ADC: 0, SUP: 0, JUNGLE: 0 };
    answers.forEach((a) => {
      if (scores[a.value] !== undefined) scores[a.value] += a.score;
    });
    // 최고 점수 라인 찾기
    const maxScore = Math.max(...Object.values(scores));
    const highest = Object.entries(scores)
      .filter(([, score]) => score === maxScore && score > 0)
      .map(([type]) => type);
    // 결과 조건에 따라 반환
    for (const result of this.results) {
      if (result.condition && result.condition(scores, highest)) {
        return { ...result, scores };
      }
    }
    return { ...this.results[this.results.length - 1], scores };
  }
}; 