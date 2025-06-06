import type { TestAnswer, TestResult } from "@/types/tests";

export const SPEECHSTYLE_TEST = {
  code: "speechstyle",
  docId: "speechstyle",
  title: "당신의 말버릇은 몇 년도 스타일일까?",
  description: "당신의 말투와 표현은 어느 시대의 스타일일까요?\n일상 속에서 사용하는 말버릇을 통해 당신의 언어 스타일을 알아보세요.",
  bgGradient: "from-[#f8fafc] via-[#fceabb] to-[#f8fafc]", // 밝은 노랑~연베이지~밝은 회색
  mainColor: "#f9a825",
  icon: "📱",
  thumbnailUrl: "/thumbnails/speechstyle_thumb.png",
  tags: ["말투", "언어", "유행어"],
  seoKeywords: "말버릇 테스트, 말투 테스트",
  views: 0,
  likes: 0,
  scraps: 0,
  category: "감성",
  questions: [
    {
      question: "친구와의 대화에서 자주 사용하는 표현은?",
      options: [
        { text: '"ㅇㅋ~"', value: "2000", score: 2 },
        { text: '"ㄹㅇㅋㅋ"', value: "2015", score: 2 },
        { text: '"그냥 그렇다구요~"', value: "2020", score: 2 },
        { text: '"그건 좀 아닌 것 같아."', value: "1990", score: 2 },
      ],
    },
    {
      question: "감탄할 때 주로 사용하는 말은?",
      options: [
        { text: '"헐 대박"', value: "2010", score: 2 },
        { text: '"와우~"', value: "2000", score: 2 },
        { text: '"미쳤다 진짜"', value: "2020", score: 2 },
        { text: '"정말 놀랍군요."', value: "1990", score: 2 },
      ],
    },
    {
      question: "슬플 때 자주 하는 말은?",
      options: [
        { text: '"ㅠㅠ"', value: "2000", score: 2 },
        { text: '"슬프다 진짜"', value: "2015", score: 2 },
        { text: '"이게 나라냐"', value: "2020", score: 2 },
        { text: '"참 안타깝네요."', value: "1990", score: 2 },
      ],
    },
    {
      question: "기뻐할 때 주로 사용하는 표현은?",
      options: [
        { text: '"행복해~"', value: "2000", score: 2 },
        { text: '"개좋아"', value: "2015", score: 2 },
        { text: '"찐행복"', value: "2020", score: 2 },
        { text: '"기쁘네요."', value: "1990", score: 2 },
      ],
    },
    {
      question: "친구에게 칭찬할 때 자주 하는 말은?",
      options: [
        { text: '"짱이야"', value: "2000", score: 2 },
        { text: '"갓"', value: "2015", score: 2 },
        { text: '"레전드"', value: "2020", score: 2 },
        { text: '"대단하네요."', value: "1990", score: 2 },
      ],
    },
    {
      question: "화났을 때 주로 사용하는 표현은?",
      options: [
        { text: '"열받아"', value: "2000", score: 2 },
        { text: '"빡쳐"', value: "2015", score: 2 },
        { text: '"화나서 손 떨림"', value: "2020", score: 2 },
        { text: '"화가 납니다."', value: "1990", score: 2 },
      ],
    },
    {
      question: "놀랐을 때 자주 하는 말은?",
      options: [
        { text: '"헉"', value: "2000", score: 2 },
        { text: '"어이없네"', value: "2015", score: 2 },
        { text: '"실화냐"', value: "2020", score: 2 },
        { text: '"정말요?"', value: "1990", score: 2 },
      ],
    },
    {
      question: "친구와 헤어질 때 주로 사용하는 표현은?",
      options: [
        { text: '"잘가~"', value: "2000", score: 2 },
        { text: '"ㅂㅂ"', value: "2015", score: 2 },
        { text: '"안녕히 계세요 여러분~"', value: "2020", score: 2 },
        { text: '"안녕히 가세요."', value: "1990", score: 2 },
      ],
    },
    {
      question: "자신을 소개할 때 자주 사용하는 말은?",
      options: [
        { text: '"나야 나~"', value: "2000", score: 2 },
        { text: '"ㅇㅇ임"', value: "2015", score: 2 },
        { text: '"저는 OOO입니다~"', value: "2020", score: 2 },
        { text: '"제 이름은 OOO입니다."', value: "1990", score: 2 },
      ],
    },
    {
      question: "감사할 때 주로 사용하는 표현은?",
      options: [
        { text: '"고마워~"', value: "2000", score: 2 },
        { text: '"ㄳ"', value: "2015", score: 2 },
        { text: '"감사합니당~"', value: "2020", score: 2 },
        { text: '"감사합니다."', value: "1990", score: 2 },
      ],
    },
  ],
  results: [
    {
      type: "1990",
      title: "🕺 1990년대 후반 스타일",
      desc: "정중하고 격식을 중시하는 말투\n\n\"감사합니다.\", \"안녕히 가세요.\" 등 공손한 표현 사용",
      icon: "🕺",
    },
    {
      type: "2000",
      title: "💃 2000년대 초반 스타일",
      desc: "밝고 경쾌한 말투\n\n\"헐 대박\", \"짱이야\" 등 감탄사와 유행어 사용",
      icon: "💃",
    },
    {
      type: "2010",
      title: "🕶️ 2010년대 초반 스타일",
      desc: "인터넷 신조어와 이모티콘 활용\n\n\"ㄳ\", \"ㅇㅋ~\" 등 축약어 사용",
      icon: "🕶️",
    },
    {
      type: "2015",
      title: "🎧 2010년대 중반 스타일",
      desc: "감정을 직설적으로 표현\n\n\"빡쳐\", \"개좋아\" 등 강한 어휘 사용",
      icon: "🎧",
    },
    {
      type: "2020",
      title: "📱 2020년대 초반 스타일",
      desc: "유행하는 밈과 표현 사용\n\n\"찐행복\", \"실화냐\" 등 인터넷 밈 활용",
      icon: "📱",
    },
    {
      type: "MIXED",
      title: "🤖 혼합형 스타일",
      desc: "다양한 시대의 표현을 혼합하여 사용\n\n상황에 따라 말투를 유연하게 조절",
      icon: "🤖",
    },
  ] as TestResult[],
  calculateResult(answers: TestAnswer[]): TestResult {
    // 연도별 점수 집계
    const yearScores: Record<string, number> = { "1990": 0, "2000": 0, "2010": 0, "2015": 0, "2020": 0 };
    answers.forEach((a) => {
      if (yearScores[a.value] !== undefined) {
        yearScores[a.value] += a.score;
      }
    });
    // 최고 점수 연도 찾기
    const maxScore = Math.max(...Object.values(yearScores));
    const candidates = Object.entries(yearScores)
      .filter(([, score]) => score === maxScore)
      .map(([year]) => year);
    // 동점 2개 이상이면 혼합형
    if (candidates.length > 1) {
      return this.results.find((r) => r.type === "MIXED")!;
    }
    return this.results.find((r) => r.type === candidates[0])!;
  },
} 