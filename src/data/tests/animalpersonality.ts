import type { TestAnswer, TestResult } from "@/types/tests";

export const ANIMALPERSONALITY_TEST = {
  code: "animalpersonality",
  docId: "animalpersonality",
  title: "나는 어떤 동물의 본성을 가졌을까?",
  description: "겉으로는 비슷해 보여도, 당신의 무의식은 분명히 '동물적인 본성'을 지니고 있습니다. 이 테스트를 통해 당신 안의 본성을 동물로 밝혀보세요.",
  bgGradient: "from-[#f8fafc] via-[#fceabb] to-[#f8fafc]", // 연노랑~연베이지~연화이트
  mainColor: "#f9a825",
  icon: "🐾",
  thumbnailUrl: "/animalpersonality_thumb.png",
  tags: ["동물", "성향", "심리"],
  seoKeywords: "동물 테스트, 동물 심리, 동물 성향",
  views: 0,
  likes: 0,
  scraps: 0,
  category: "동물",
  questions: [
    {
      question: "당신은 모임에서 어떤 타입인가요?",
      options: [
        { text: "리더가 되어 전체를 이끈다.", value: "tiger", score: 2 },
        { text: "조용히 있다가 분위기를 맞춘다.", value: "cat", score: 2 },
        { text: "모두에게 말을 걸고 친해진다.", value: "dog", score: 2 },
        { text: "모임 자체가 힘들다. 집 가고 싶다.", value: "octopus", score: 2 },
      ],
    },
    {
      question: "스트레스를 받을 때 당신의 반응은?",
      options: [
        { text: "운동을 하거나 나가서 활동한다.", value: "dog", score: 2 },
        { text: "혼자 있고 싶고, 침묵 모드에 들어간다.", value: "octopus", score: 2 },
        { text: "평소처럼 태연한 척 하지만 속으로 불편하다.", value: "bear", score: 2 },
        { text: "분석하고 상황을 정리한다.", value: "owl", score: 2 },
      ],
    },
    {
      question: "자신을 한 단어로 표현한다면?",
      options: [
        { text: "유쾌한", value: "dolphin", score: 2 },
        { text: "날카로운", value: "fox", score: 2 },
        { text: "신중한", value: "bear", score: 2 },
        { text: "냉정한", value: "owl", score: 2 },
      ],
    },
    {
      question: "친구가 고민을 털어놓았을 때 당신은?",
      options: [
        { text: "\"그건 이렇게 해보면 어때?\" 해결책 제시", value: "tiger", score: 2 },
        { text: "\"어… 그랬구나…\" 조용히 들어줌", value: "cat", score: 2 },
        { text: "\"와 진짜? 개어이없다ㅋㅋ\" 함께 감정표출", value: "dog", score: 2 },
        { text: "\"왜 그렇게 느꼈을까?\" 원인 분석", value: "owl", score: 2 },
      ],
    },
    {
      question: "사람이 많은 장소에서 당신은?",
      options: [
        { text: "피곤하지만 사람들 눈치를 살핀다.", value: "cat", score: 2 },
        { text: "적응은 잘 되지만 오래 있고 싶진 않음", value: "octopus", score: 2 },
        { text: "분위기 주도하고 리드한다.", value: "tiger", score: 2 },
        { text: "사람 관찰하다 재밌는 포인트 찾음", value: "fox", score: 2 },
      ],
    },
    {
      question: "SNS 사용 패턴은?",
      options: [
        { text: "피드 관리 철저 + 센스 있는 댓글러", value: "fox", score: 2 },
        { text: "감정글/짤 저장소로 씀", value: "dolphin", score: 2 },
        { text: "조용히 보기만 함", value: "bear", score: 2 },
        { text: "알고리즘 분석해서 활용함", value: "owl", score: 2 },
      ],
    },
    {
      question: "어릴 적 당신은 어떤 아이였나요?",
      options: [
        { text: "친구를 끌고 다니는 리더형", value: "tiger", score: 2 },
        { text: "나서는 것보다 혼자 노는 게 좋았음", value: "octopus", score: 2 },
        { text: "장난 많고 시끌벅적한 아이", value: "dog", score: 2 },
        { text: "어른들이 '조숙하다' 했음", value: "bear", score: 2 },
      ],
    },
    {
      question: "내가 좋아하는 공간은?",
      options: [
        { text: "혼자서 정리된 서재 느낌", value: "owl", score: 2 },
        { text: "따뜻한 사람냄새 나는 카페", value: "dog", score: 2 },
        { text: "햇살 드는 조용한 창가", value: "cat", score: 2 },
        { text: "비 오는 날 조용한 침대 속", value: "octopus", score: 2 },
      ],
    },
    {
      question: "내가 싫어하는 사람은?",
      options: [
        { text: "거짓말하는 사람", value: "bear", score: 2 },
        { text: "분위기 파악 못 하는 사람", value: "fox", score: 2 },
        { text: "감정 없는 사람", value: "cat", score: 2 },
        { text: "나서서 분위기 흐리는 사람", value: "owl", score: 2 },
      ],
    },
    {
      question: "결정의 순간, 당신은?",
      options: [
        { text: "분석하고 장단점 비교 후 결정", value: "owl", score: 2 },
        { text: "감정에 따라 직감적으로 결정", value: "dolphin", score: 2 },
        { text: "주변 사람의 생각도 듣고 정함", value: "bear", score: 2 },
        { text: "혼자 조용히 고민 후 결론 내림", value: "octopus", score: 2 },
      ],
    },
  ],
  results: [
    {
      type: "tiger",
      title: "🐯 호랑이 – 외유내강 리더형",
      desc: "겉은 차분하지만 안에는 결단력과 추진력을 가진 성격.\n상황을 리드하고 무리에서 중심 역할을 맡는 경우가 많다.\n당신은 조용한 카리스마, 판단력의 상징.",
      subDesc: "- 결단력과 추진력이 뛰어남\n- 무리의 중심 역할을 자주 맡음\n- 조용한 카리스마 보유",
      recommend: ["분위기 주도자", "리더십이 필요한 상황", "판단력 요구되는 일"],
      icon: "🐯",
    },
    {
      type: "dog",
      title: "🐶 강아지 – 따뜻한 관계 중심형",
      desc: "에너지 넘치고, 사람들과 있을 때 가장 행복한 타입.\n표현력과 친화력이 좋아 주변에 늘 사람이 많음.\n당신은 누군가의 '정서적 버팀목'.",
      subDesc: "- 친화력과 에너지가 밝음\n- 주변에 사람이 많음\n- 정서적 지지자 역할",
      recommend: ["정서적 교류", "사람 중심 환경", "분위기 메이커"],
      icon: "🐶",
    },
    {
      type: "cat",
      title: "🐱 고양이 – 감성적 예민 관찰자형",
      desc: "감정에 민감하며, 사람 기분에 금방 반응하는 센서 보유자.\n겉으로는 조용하지만 정서가 풍부함.\n당신은 조용한 위로를 건네는 존재.",
      subDesc: "- 감정 센서가 예민함\n- 조용하지만 정서가 풍부함\n- 섬세한 관찰자",
      recommend: ["감정적 공감", "관찰과 분석", "조용한 위로"],
      icon: "🐱",
    },
    {
      type: "octopus",
      title: "🐙 문어 – 철학적 은둔 지성형",
      desc: "외부보다 내부 세계에 집중하는 사람.\n혼자서 사고 정리, 창작, 분석하는 걸 즐김.\n당신은 침묵 속에 깊이를 담는 사색가.",
      subDesc: "- 내면 세계에 집중\n- 혼자 있는 시간 선호\n- 깊이 있는 사고",
      recommend: ["혼자만의 시간", "창작 활동", "분석적 사고"],
      icon: "🐙",
    },
    {
      type: "owl",
      title: "🦉 부엉이 – 이성 중심 전략가형",
      desc: "어떤 상황이든 감정보다 판단이 우선됨.\n이성적이고 분석적인 사고를 바탕으로 리더 역할도 무난히 수행.\n당신은 상황을 구조적으로 읽는 전략가.",
      subDesc: "- 이성적, 분석적 사고\n- 전략적 판단에 강함\n- 구조적 사고 선호",
      recommend: ["전략 수립", "분석적 환경", "리더십 역할"],
      icon: "🦉",
    },
    {
      type: "fox",
      title: "🦊 여우 – 영리한 현실주의자형",
      desc: "센스 있고 빠르며, 변화에 잘 적응하는 타입.\n처세에 능하고 위험 감지에 민감함.\n당신은 상황을 즐기며 통제하는 '현실 파이터'.",
      subDesc: "- 센스와 적응력 뛰어남\n- 위험 감지에 민감\n- 현실적 처세술 보유",
      recommend: ["빠른 판단", "변화 적응", "현실적 문제 해결"],
      icon: "🦊",
    },
    {
      type: "bear",
      title: "🐻 곰 – 조용한 안정 수호자형",
      desc: "말은 없지만 신뢰감 있고 든든함.\n깊고 넓은 인내심으로 주변 사람을 지지해줌.\n당신은 말없는 힘, 포근한 단단함.",
      subDesc: "- 신뢰감과 인내심\n- 조용한 힘\n- 든든한 지지자",
      recommend: ["신뢰와 안정", "지지자 역할", "인내심 요구 환경"],
      icon: "🐻",
    },
    {
      type: "dolphin",
      title: "🐬 돌고래 – 감성+사교 하이브리드형",
      desc: "공감력도 좋고 에너지도 밝음.\n모두의 분위기를 부드럽게 이어주는 유쾌한 존재.\n당신은 인간관계의 윤활유, 감성의 조율자.",
      subDesc: "- 밝고 유쾌한 에너지\n- 공감력 뛰어남\n- 분위기 조율자",
      recommend: ["분위기 메이커", "공감과 소통", "밝은 에너지"],
      icon: "🐬",
    },
  ] as TestResult[],
  calculateResult(answers: TestAnswer[]): TestResult {
    // 동물별 점수 집계
    const animalScores: Record<string, number> = {};
    answers.forEach((a) => {
      animalScores[a.value] = (animalScores[a.value] || 0) + a.score;
    });
    // 최고 점수 동물 찾기
    const maxScore = Math.max(...Object.values(animalScores));
    const candidates = Object.entries(animalScores)
      .filter(([, score]) => score === maxScore)
      .map(([type]) => type);
    // 동점일 경우 마지막 선택 경향 기반 랜덤
    let resultType = candidates[0];
    if (candidates.length > 1) {
      const last = answers.slice().reverse().find(a => candidates.includes(a.value));
      resultType = last ? last.value : candidates[Math.floor(Math.random() * candidates.length)];
    }
    return this.results.find(r => r.type === resultType) || this.results[0];
  },
}; 