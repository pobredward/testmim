import type { TestAnswer, TestResult } from "@/types/tests";

export const PASTLIFE_TEST = {
  code: "pastlife",
  docId: "pastlife",
  title: "전생에서 당신은 어떤 인물이었을까?",
  description:
    "우리는 모르는 사이, 지금의 성격과 기질이 전생에서 이어져 왔을지도 모릅니다. 고대의 사상가였을까, 감성의 시인이었을까, 아니면 전장의 영웅? 10문항을 통해 당신의 전생 캐릭터를 찾아보세요.",
  bgGradient: "from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa]", // 연보라~연파랑~연민트
  mainColor: "#6c5ce7",
  icon: "🧬",
  thumbnailUrl: "/thumbnails/pastlife_thumb.png",
  tags: ["전생", "성향", "심리"],
  seoKeywords: "전생 테스트, 전생",
  views: 0,
  likes: 0,
  scraps: 0,
  category: "운명",
  questions: [
    {
      question: "사람들과 있을 때 당신의 위치는?",
      options: [
        { text: "대화 중간중간 날카로운 팩트를 던진다", value: "philosopher", score: 2 },
        { text: "흐름에 맞춰 다정하게 리액션한다", value: "maid", score: 2 },
        { text: "리더가 되어 흐름을 이끈다", value: "lord", score: 2 },
        { text: "조용히 분위기를 관찰한다", value: "librarian", score: 2 },
      ],
    },
    {
      question: "스트레스를 받을 때 당신의 방식은?",
      options: [
        { text: "글을 쓰거나 기록한다", value: "poet", score: 2 },
        { text: "단둘이 깊은 대화를 한다", value: "alchemist", score: 2 },
        { text: "행동으로 바로 해결하려 한다", value: "lord", score: 2 },
        { text: "혼자 있으면서 감정을 녹인다", value: "librarian", score: 2 },
      ],
    },
    {
      question: "친구가 고민을 털어놓았을 때 나는?",
      options: [
        { text: "문제의 본질을 날카롭게 짚는다", value: "philosopher", score: 2 },
        { text: "감정적으로 공감해준다", value: "maid", score: 2 },
        { text: "해결책을 구조적으로 설명한다", value: "alchemist", score: 2 },
        { text: "진심 어린 위로를 전한다", value: "librarian", score: 2 },
      ],
    },
    {
      question: "어릴 적 나는 어떤 아이였나요?",
      options: [
        { text: "'왜?'라는 질문을 많이 했다", value: "philosopher", score: 2 },
        { text: "노래하고 그림 그리며 놀았다", value: "poet", score: 2 },
        { text: "친구들을 통솔하는 리더였다", value: "lord", score: 2 },
        { text: "혼자 조용히 책 읽기 좋아했다", value: "librarian", score: 2 },
      ],
    },
    {
      question: "이상적인 휴일을 보내는 방법은?",
      options: [
        { text: "고요한 자연 속 글쓰기", value: "poet", score: 2 },
        { text: "사람들과 프로젝트 진행", value: "lord", score: 2 },
        { text: "책이나 강의 듣기", value: "philosopher", score: 2 },
        { text: "누워서 유튜브 정주행", value: "librarian", score: 2 },
      ],
    },
    {
      question: "내가 끌리는 말의 스타일은?",
      options: [
        { text: "문장에 시가 섞인 표현", value: "poet", score: 2 },
        { text: "명확하고 논리적인 말", value: "philosopher", score: 2 },
        { text: "따뜻한 마음이 느껴지는 말", value: "maid", score: 2 },
        { text: "단호하고 직선적인 말", value: "lord", score: 2 },
      ],
    },
    {
      question: "가장 하고 싶은 여행 스타일은?",
      options: [
        { text: "아무 계획 없는 유럽 감성여행", value: "poet", score: 2 },
        { text: "박물관 중심의 역사탐방", value: "librarian", score: 2 },
        { text: "자연 속 철학적 사색 여행", value: "philosopher", score: 2 },
        { text: "서바이벌 캠프 도전 여행", value: "lord", score: 2 },
      ],
    },
    {
      question: "나의 대화 스타일은?",
      options: [
        { text: "혼자 말보단 듣는 게 편하다", value: "librarian", score: 2 },
        { text: "흐름을 주도하며 리드한다", value: "lord", score: 2 },
        { text: "한 마디에도 감정을 담는다", value: "maid", score: 2 },
        { text: "주제에서 벗어나지 않고 정리한다", value: "alchemist", score: 2 },
      ],
    },
    {
      question: "사랑에 빠졌을 때 나는?",
      options: [
        { text: "예술 작품에 녹여낸다", value: "poet", score: 2 },
        { text: "감정 표현은 못하지만 마음이 깊다", value: "philosopher", score: 2 },
        { text: "따뜻하게 행동으로 표현한다", value: "maid", score: 2 },
        { text: "솔직하고 직접적으로 고백한다", value: "lord", score: 2 },
      ],
    },
    {
      question: "당신이 꿈꾸는 인생은?",
      options: [
        { text: "사람들에게 영감을 주는 삶", value: "poet", score: 2 },
        { text: "누군가의 삶을 도와주는 삶", value: "maid", score: 2 },
        { text: "지식을 남기는 삶", value: "philosopher", score: 2 },
        { text: "모두를 지휘하는 리더의 삶", value: "lord", score: 2 },
      ],
    },
  ],
  results: [
    {
      type: "philosopher",
      title: "🏛 고대 철학자",
      desc: "진리와 본질을 추구하는, 사고 중심의 인간.\n사람을 볼 때도, 세상을 볼 때도 구조를 먼저 읽는 당신.\n전생에서는 지중해 해안의 대리석 의자에서 제자를 가르쳤을 지도 모릅니다.",
      subDesc: "- 구조와 본질을 중시\n- 논리적이고 분석적\n- 깊은 사색가",
      recommend: ["사색, 토론, 연구"],
      icon: "🏛",
    },
    {
      type: "alchemist",
      title: "🧪 중세 연금술사",
      desc: "눈에 보이지 않는 원리를 탐구하고, 끊임없이 실험하는 탐색가.\n감정보다 사실, 이론보다 적용을 중시하는 당신은 전생에 지하 연구소의 주인이었을 수도.",
      subDesc: "- 실험과 탐구를 즐김\n- 원리와 구조에 집착\n- 현실 적용에 강점",
      recommend: ["실험, 연구, 창작"],
      icon: "🧪",
    },
    {
      type: "poet",
      title: "🐾 방랑 시인",
      desc: "감성적이고 자유로운 영혼. 사랑과 계절, 삶을 글과 노래로 풀던 존재.\n길 위의 낙엽처럼 떠돌며 가장 깊은 감정을 품은 시인이었습니다.",
      subDesc: "- 감성적, 자유분방\n- 예술적 표현에 강점\n- 낭만적 유목민",
      recommend: ["예술, 여행, 창작"],
      icon: "🎻",
    },
    {
      type: "lord",
      title: "👑 전장의 군주",
      desc: "판단, 결단, 통제의 아이콘. 누구보다 책임감 있고 리더십이 강한 존재.\n당신은 전생에 군대를 지휘하고 결정을 내리던 전장의 왕 또는 여왕이었을 수도 있습니다.",
      subDesc: "- 리더십, 결단력\n- 책임감 강함\n- 통제와 전략에 능함",
      recommend: ["리더십, 전략, 조직"],
      icon: "👑",
    },
    {
      type: "maid",
      title: "💌 궁중 시녀",
      desc: "감정적으로 섬세하며, 배려와 정서적 케어에 능한 사람.\n타인을 먼저 생각하고 돕는 따뜻한 성향은 궁중에서 가장 신뢰받는 시녀였던 전생과 닮아 있습니다.",
      subDesc: "- 섬세하고 배려심 깊음\n- 정서적 공감력\n- 케어와 지원에 강점",
      recommend: ["상담, 케어, 서비스"],
      icon: "💌",
    },
    {
      type: "librarian",
      title: "📜 도서관 사서",
      desc: "말보다 관찰, 감정보다 기억과 정리에 능한 성향.\n당신은 오래된 기록을 지키던 사람으로, 지금도 모든 것을 기억하고 싶은 사람입니다.",
      subDesc: "- 관찰력, 기억력\n- 정리와 기록에 강점\n- 조용한 환경 선호",
      recommend: ["기록, 정리, 연구"],
      icon: "📜",
    },
    {
      type: "councilor",
      title: "🧠 비밀 회의 조정관",
      desc: "겉으로는 조용하지만, 모든 걸 설계하고 흐름을 파악하는 전략가.\n전생엔 국가를 움직이던 내각의 설계자였을 가능성이 크죠.",
      subDesc: "- 전략적 사고\n- 설계와 조율에 강점\n- 배후에서 움직임",
      recommend: ["전략, 설계, 기획"],
      icon: "🧠",
    },
    {
      type: "artist",
      title: "🎭 가면극 예술가",
      desc: "언제나 타인의 시선 속에서 자신의 모습을 바꾸고 조율하던 사람.\n당신은 예술을 통해 감정을 숨기고 표현하던 전생의 연기자였을지도 몰라요.",
      subDesc: "- 감정 조율, 표현력\n- 다양한 역할 수행\n- 예술적 감각",
      recommend: ["연기, 예술, 소통"],
      icon: "🎭",
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
    // 동점일 경우 마지막 선택 경향 기반 랜덤
    let resultType = candidates[0];
    if (candidates.length > 1) {
      const last = answers.slice().reverse().find(a => candidates.includes(a.value));
      resultType = last ? last.value : candidates[Math.floor(Math.random() * candidates.length)];
    }
    return this.results.find(r => r.type === resultType) || this.results[0];
  },
}; 