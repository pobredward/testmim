import type { TestAnswer, TestResult } from "@/types/tests";

export const TRALALERO_TEST = {
  code: "tralalero",
  docId: "tralalero",
  title: "당신은 어떤 Italian Brainrot 진화 단계에 있을까?",
  description:
    "AI 밈의 세계로 빠져든 당신! Tralalero Tralala부터 Ballerina Cappuccina까지, 당신의 브레인롯 진화 레벨을 측정해보세요. 당신은 과연 어떤 단계의 밈 존재로 진화할 운명일까요? 🧠🔥",
  bgGradient: "from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1]", // Italian 브레인롯 컬러
  mainColor: "#ff6b6b",
  icon: "🦈",
  thumbnailUrl: "/thumbnails/tralalero_thumb.png",
  tags: ["브레인롯", "밈", "AI", "재미"],
  seoKeywords: "Italian Brainrot, Tralalero, 브레인롯 테스트, 밈 테스트",
  views: 0,
  likes: 0,
  scraps: 0,
  category: "밈",
  questions: [
    {
      question: "TikTok을 보다가 의미를 모르는 밈을 발견했을 때 당신은?",
      options: [
        { text: "일단 웃고 보다가 나중에 찾아본다", value: "beginner", score: 2 },
        { text: "즉시 검색해서 뜻을 파악한다", value: "scholar", score: 2 },
        { text: "의미는 중요하지 않다, 느낌만 알면 됨", value: "evolved", score: 2 },
        { text: "더 이상한 밈을 만들어서 대응한다", value: "creator", score: 2 },
      ],
    },
    {
      question: "친구들과 대화할 때 가장 자주 사용하는 표현은?",
      options: [
        { text: "일반적인 유행어나 신조어", value: "beginner", score: 2 },
        { text: "정확한 밈 레퍼런스와 설명", value: "scholar", score: 2 },
        { text: "의미불명의 소리나 단어들", value: "evolved", score: 2 },
        { text: "내가 만든 오리지널 밈 언어", value: "creator", score: 2 },
      ],
    },
    {
      question: "AI가 생성한 이상한 이미지를 봤을 때 당신의 반응은?",
      options: [
        { text: "재미있네! 하고 넘어간다", value: "beginner", score: 2 },
        { text: "어떤 프롬프트로 만들었는지 궁금하다", value: "scholar", score: 2 },
        { text: "이 캐릭터의 스토리를 상상한다", value: "evolved", score: 2 },
        { text: "더 기괴한 버전을 만들어본다", value: "creator", score: 2 },
      ],
    },
    {
      question: "온라인에서 시간을 보내는 방식은?",
      options: [
        { text: "인기 있는 콘텐츠 위주로 본다", value: "beginner", score: 2 },
        { text: "밈의 역사와 원출처를 찾아본다", value: "scholar", score: 2 },
        { text: "알고리즘이 추천하는 대로 무한스크롤", value: "evolved", score: 2 },
        { text: "직접 콘텐츠를 만들고 공유한다", value: "creator", score: 2 },
      ],
    },
    {
      question: "Bombardiro Crocodilo 같은 캐릭터를 보면?",
      options: [
        { text: "귀엽고 웃기다고 생각한다", value: "beginner", score: 2 },
        { text: "AI 생성의 기술적 측면을 분석한다", value: "scholar", score: 2 },
        { text: "이 캐릭터의 능력과 설정을 만든다", value: "evolved", score: 2 },
        { text: "비슷한 캐릭터를 직접 만들어본다", value: "creator", score: 2 },
      ],
    },
    {
      question: "의미없는 소리(ex: Tung Tung Tung)를 들었을 때?",
      options: [
        { text: "따라 해보며 웃는다", value: "beginner", score: 2 },
        { text: "어떤 의미인지 해석하려 한다", value: "scholar", score: 2 },
        { text: "리듬감으로 받아들인다", value: "evolved", score: 2 },
        { text: "더 중독성 있는 소리를 만든다", value: "creator", score: 2 },
      ],
    },
    {
      question: "인터넷 밈 문화에 대한 당신의 철학은?",
      options: [
        { text: "재미있으면 그걸로 충분하다", value: "beginner", score: 2 },
        { text: "문화적 현상으로서 연구할 가치가 있다", value: "scholar", score: 2 },
        { text: "의미를 찾는 것 자체가 의미없다", value: "evolved", score: 2 },
        { text: "새로운 문화를 만들어가야 한다", value: "creator", score: 2 },
      ],
    },
    {
      question: "Ballerina Cappuccina의 춤을 본다면?",
      options: [
        { text: "신기하고 재미있어서 친구들에게 공유", value: "beginner", score: 2 },
        { text: "AI 애니메이션 기술에 감탄한다", value: "scholar", score: 2 },
        { text: "음악에 맞춰 같이 춤을 춘다", value: "evolved", score: 2 },
        { text: "더 화려한 버전의 춤을 만든다", value: "creator", score: 2 },
      ],
    },
    {
      question: "브레인롯 콘텐츠의 매력은 무엇이라고 생각하나요?",
      options: [
        { text: "단순하고 쉽게 웃을 수 있어서", value: "beginner", score: 2 },
        { text: "현대 문화의 아이러니를 보여줘서", value: "scholar", score: 2 },
        { text: "논리를 거부하는 자유로움", value: "evolved", score: 2 },
        { text: "무한한 창작 가능성", value: "creator", score: 2 },
      ],
    },
    {
      question: "당신만의 Italian Brainrot 캐릭터를 만든다면?",
      options: [
        { text: "기존 캐릭터와 비슷하게 만들겠다", value: "beginner", score: 2 },
        { text: "체계적으로 설정을 잡고 만들겠다", value: "scholar", score: 2 },
        { text: "직감적으로 떠오르는 대로 만들겠다", value: "evolved", score: 2 },
        { text: "완전히 새로운 장르를 개척하겠다", value: "creator", score: 2 },
      ],
    },
  ],
  results: [
    {
      type: "beginner",
      title: "🦈 Tralalero 새내기",
      desc: "브레인롯의 세계에 막 발을 담근 당신! Tralalero Tralala의 나이키 신발처럼 아직은 깔끔하고 순수합니다.\n밈을 보며 웃고 즐기지만, 아직은 그 깊은 의미를 모르는 상태예요.",
      subDesc: "- 밈을 순수하게 즐김\n- 유행을 따라가는 편\n- 아직 창작욕구는 적음",
      recommend: ["더 다양한 밈 탐험", "브레인롯 캐릭터 학습", "밈 문화 이해"],
      icon: "🦈",
      hashtags: ["#브레인롯새내기", "#순수한마음", "#밈입문자"],
    },
    {
      type: "scholar",
      title: "🎓 Professore 밈학자",
      desc: "밈의 역사와 원리를 이해하려는 학자적 성향! Bombardiro Crocodilo의 전술적 사고처럼 체계적으로 접근합니다.\n단순히 웃고 넘어가지 않고 분석하고 연구하는 타입이에요.",
      subDesc: "- 밈의 원리와 역사에 관심\n- 분석적이고 체계적\n- 지식을 정리하고 공유",
      recommend: ["밈 역사 연구", "트렌드 분석", "교육적 콘텐츠 제작"],
      icon: "🎓",
      hashtags: ["#밈학자", "#분석마스터", "#브레인롯연구가"],
    },
    {
      type: "evolved",
      title: "☕ Ballerina 진화체",
      desc: "의미보다 감각으로 받아들이는 진화된 존재! Ballerina Cappuccina처럼 우아하면서도 초현실적입니다.\n논리를 초월한 브레인롯의 본질을 체득한 상태예요.",
      subDesc: "- 직관적이고 감각적\n- 의미를 초월한 이해\n- 브레인롯 문화의 진정한 이해자",
      recommend: ["감각적 콘텐츠 소비", "직관적 창작", "브레인롯 문화 전파"],
      icon: "☕",
      hashtags: ["#진화한존재", "#감각적이해", "#브레인롯마스터"],
    },
    {
      type: "creator",
      title: "🎨 Supremo 창조신",
      desc: "브레인롯 문화를 만들어가는 창조자! 모든 Italian Brainrot 캐릭터들의 창조주처럼 새로운 밈을 탄생시킵니다.\n당신은 이미 브레인롯을 넘어선 존재예요.",
      subDesc: "- 창의적이고 독창적\n- 새로운 문화 창조\n- 밈 생태계의 선구자",
      recommend: ["오리지널 콘텐츠 제작", "새로운 밈 개발", "커뮤니티 리딩"],
      icon: "🎨",
      hashtags: ["#밈창조신", "#브레인롯마에스트로", "#문화선구자"],
    },
    {
      type: "transcendent",
      title: "🌟 Ultra 초월자",
      desc: "브레인롯을 초월한 궁극의 존재! 모든 Italian Brainrot 캐릭터들이 우러러보는 전설적인 존재입니다.\n당신의 존재 자체가 하나의 밈이 되었어요.",
      subDesc: "- 모든 것을 초월\n- 존재 자체가 밈\n- 브레인롯의 정점",
      recommend: ["자신만의 우주 창조", "차원을 넘나드는 활동", "전설이 되기"],
      icon: "🌟",
      hashtags: ["#초월자", "#밈의신", "#브레인롯황제"],
    },
    {
      type: "chaotic",
      title: "🌪 Tornado 혼돈체",
      desc: "예측 불가능한 혼돈의 화신! Tung Tung Tung Sahur의 리듬처럼 무작위적이고 강렬합니다.\n당신의 밈 센스는 그 누구도 따라올 수 없는 독특함을 자랑해요.",
      subDesc: "- 예측 불가능\n- 독특하고 파격적\n- 혼돈 속의 질서",
      recommend: ["무작위 창작", "파격적 실험", "혼돈의 예술"],
      icon: "🌪",
      hashtags: ["#혼돈체", "#예측불가", "#파격적존재"],
    },
  ] as TestResult[],
  calculateResult(answers: TestAnswer[]): TestResult {
    // 유형별 점수 집계
    const typeScores: Record<string, number> = {};
    answers.forEach((a) => {
      typeScores[a.value] = (typeScores[a.value] || 0) + a.score;
    });

    // 최고 점수 유형 찾기
    const maxScore = Math.max(...Object.values(typeScores));
    const candidates = Object.entries(typeScores)
      .filter(([, score]) => score === maxScore)
      .map(([type]) => type);

    // 특수 조건들 체크
    const totalAnswers = answers.length;
    const evolvedCount = answers.filter(a => a.value === "evolved").length;
    const creatorCount = answers.filter(a => a.value === "creator").length;
    
    // 혼돈체 조건: 모든 유형이 고루 분포된 경우
    const uniqueTypes = new Set(answers.map(a => a.value)).size;
    if (uniqueTypes === 4 && Math.abs(typeScores.beginner - typeScores.scholar) <= 2 && 
        Math.abs(typeScores.evolved - typeScores.creator) <= 2) {
      return this.results.find((r) => r.type === "chaotic")!;
    }

    // 초월자 조건: creator가 80% 이상이거나 evolved + creator가 압도적
    if (creatorCount >= totalAnswers * 0.8 || 
        (evolvedCount + creatorCount >= totalAnswers * 0.9 && creatorCount >= 4)) {
      return this.results.find((r) => r.type === "transcendent")!;
    }

    // 동점일 경우 마지막 선택 경향 기반
    let resultType = candidates[0];
    if (candidates.length > 1) {
      const lastAnswers = answers.slice(-3);
      const recentType = lastAnswers.reverse().find(a => candidates.includes(a.value));
      resultType = recentType ? recentType.value : candidates[Math.floor(Math.random() * candidates.length)];
    }

    return this.results.find((r) => r.type === resultType) || this.results[0];
  },
}; 