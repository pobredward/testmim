import type { TestAnswer, TestResult } from "@/types/tests";

export const SNSLESS_TEST = {
  code: "snsless",
  docId: "snsless",
  title: "SNS 없이 1년, 나는 어떤 사람일까?",
  description: "당신이 SNS를 끊고 1년을 산다면 어떤 자아가 드러날까요? 평소 드러나지 않았던 당신의 진짜 모습, 지금 확인해보세요.",
  bgGradient: "from-[#ffffff] via-[#ffffff] to-[#e3f2fd]",
  mainColor: "#6a1b9a",
  icon: "🧠",
  thumbnailUrl: "/thumbnails/snsless_thumb.png",
  tags: ["SNS", "디지털디톡스"],
  seoKeywords: "SNS 중독, SNS 테스트, 디지털 디톡스",
  views: 0,
  likes: 0,
  scraps: 0,
  category: "자아",
  questions: [
    { question: "1. SNS를 끊은 첫 주, 당신은?", options: [ { text: "드디어 조용한 시간이 생겼다.", value: "독립형", score: 2 }, { text: "다른 사람은 뭘 하고 있을까 괜히 궁금하다.", value: "불안형", score: 2 }, { text: "관찰 일기를 써보기로 한다.", value: "관찰자형", score: 2 }, { text: "이참에 영상 하나 찍어볼까?", value: "창작자형", score: 2 } ] },
    { question: "2. 나만의 시간을 보내는 방법은?", options: [ { text: "산책이나 책 읽기", value: "독립형", score: 2 }, { text: "다른 사람들은 뭘 하나 찾아봄", value: "불안형", score: 2 }, { text: "조용히 주변을 관찰하며 그림 그리기", value: "관찰자형", score: 2 }, { text: "음악, 영상, 글 등 콘텐츠 만들기", value: "창작자형", score: 2 } ] },
    { question: "3. 친구와의 대화에서 SNS 이야기가 나올 때 나는?", options: [ { text: "잘 모르지만 관심 없음", value: "독립형", score: 2 }, { text: "괜히 나만 소외된 기분", value: "불안형", score: 2 }, { text: "관찰 포인트로 삼는다", value: "관찰자형", score: 2 }, { text: "그걸 계기로 새로운 콘텐츠 아이디어를 떠올림", value: "창작자형", score: 2 } ] },
    { question: "4. 하루가 끝났을 때 드는 생각은?", options: [ { text: "혼자만의 시간이 충만했다", value: "독립형", score: 2 }, { text: "뭔가 빠진 것 같고 허전하다", value: "불안형", score: 2 }, { text: "내 행동을 분석하며 반성한다", value: "관찰자형", score: 2 }, { text: "오늘 뭘 만들었는지 떠올린다", value: "창작자형", score: 2 } ] },
    { question: "5. SNS를 다시 하게 된다면?", options: [ { text: "굳이 필요하지 않다", value: "독립형", score: 2 }, { text: "너무 그리웠다", value: "불안형", score: 2 }, { text: "관찰 결과를 공유하고 싶다", value: "관찰자형", score: 2 }, { text: "내가 만든 걸 보여주고 싶다", value: "창작자형", score: 2 } ] },
    { question: "6. 누군가 나를 잊고 있을까 봐 걱정될 때는?", options: [ { text: "별로 신경 안 쓴다", value: "독립형", score: 2 }, { text: "무시받는 것 같아 속상하다", value: "불안형", score: 2 }, { text: "이 상황 자체가 흥미롭다", value: "관찰자형", score: 2 }, { text: "이 감정을 창작에 담는다", value: "창작자형", score: 2 } ] },
    { question: "7. 가장 편안한 공간은?", options: [ { text: "자기 방이나 혼자 있는 곳", value: "독립형", score: 2 }, { text: "대화가 가능한 장소", value: "불안형", score: 2 }, { text: "조용한 공공장소 (도서관, 카페 등)", value: "관찰자형", score: 2 }, { text: "창작 활동이 가능한 공간", value: "창작자형", score: 2 } ] },
    { question: "8. 시간 여유가 생겼을 때 제일 먼저 하는 행동은?", options: [ { text: "혼자 있는 걸 즐긴다", value: "독립형", score: 2 }, { text: "누구랑 얘기할까 고민한다", value: "불안형", score: 2 }, { text: "주변을 찬찬히 살펴본다", value: "관찰자형", score: 2 }, { text: "뭔가 새로운 걸 만든다", value: "창작자형", score: 2 } ] },
    { question: "9. 정보는 주로 어디서 얻는가?", options: [ { text: "책, 다큐멘터리 등 오프라인 중심", value: "독립형", score: 2 }, { text: "SNS 타임라인과 피드백", value: "불안형", score: 2 }, { text: "현장 관찰과 기록", value: "관찰자형", score: 2 }, { text: "크리에이터 콘텐츠와 제작 과정", value: "창작자형", score: 2 } ] },
    { question: "10. SNS가 없는 세상에서 당신은?", options: [ { text: "오히려 더 잘 살 수 있을 듯", value: "독립형", score: 2 }, { text: "불안하고 외로울 듯", value: "불안형", score: 2 }, { text: "관찰과 해석의 재미가 더 커질 듯", value: "관찰자형", score: 2 }, { text: "창작 의욕은 더 강해질 듯", value: "창작자형", score: 2 } ] }
  ],
  results: [
    { 
      type: "독립형", 
      title: "🌿 독립형 – 디지털 속 고요한 섬", 
      desc: "혼자만의 시간에서 진짜 자아를 찾는 유형!", 
      subDesc: "외부 자극이 사라질수록 오히려 빛나는 당신의 내면.", 
      icon: "🌿",
      hashtags: ["#혼자잘삼", "#내면집중", "#조용한힘"],
    },
    { 
      type: "관찰자형", 
      title: "🔍 관찰자형 – 세상과 나 사이의 기록자", 
      desc: "소음이 사라질수록, 더 깊게 세상을 읽는 눈!", 
      subDesc: "당신은 늘 주변을 관찰하고 해석하는 성향입니다.", 
      icon: "🔍",
      hashtags: ["#관찰력", "#일기체질", "#해석자"],
    },
    { 
      type: "창작자형", 
      title: "🎨 창작자형 – 표현 없이 못 사는 감성기계", 
      desc: "SNS 없이도 끊임없이 무언가를 만들어내는 당신!", 
      subDesc: "내면에서 우러나는 아이디어를 콘텐츠로 풀어내는 예술형", 
      icon: "🎨",
      hashtags: ["#예술적자아", "#감성충만", "#창조본능"],
    },
    { 
      type: "불안형", 
      title: "📱 불안형 – 연결이 끊기면 흔들리는 마음", 
      desc: "SNS가 단절되면 허전함이 먼저 다가오는 당신", 
      subDesc: "외부와의 연결감이 중요한 정서형 인간", 
      icon: "📱",
      hashtags: ["#FOMO", "#연결중독", "#정서의존"],
    },
    { 
      type: "유연형", 
      title: "🌀 유연형 – 모든 자아를 넘나드는 당신", 
      desc: "어떤 환경에서도 나름대로 적응해내는 유연한 플레이어", 
      subDesc: "혼자서도, 함께서도 괜찮은 균형 잡힌 당신", 
      icon: "🌀",
      hashtags: ["#밸런스", "#적응력", "#디지털중립"],
    }
  ],
  calculateResult(answers: TestAnswer[]): TestResult {
    // 유형별 점수 집계
    const types = ["독립형", "관찰자형", "창작자형", "불안형"];
    const scores: Record<string, number> = Object.fromEntries(types.map(t => [t, 0]));
    answers.forEach((a) => {
      if (scores[a.value] !== undefined) scores[a.value] += a.score;
    });
    
    // 최고 점수 유형 찾기
    const maxScore = Math.max(...Object.values(scores));
    const candidates = Object.entries(scores)
      .filter(([, score]) => score === maxScore)
      .map(([type]) => type);
    
    // 12점 이상이고 동점이 아니면 해당 유형, 그렇지 않으면 유연형
    if (maxScore >= 12 && candidates.length === 1) {
      return this.results.find(r => r.type === candidates[0]) || this.results[this.results.length - 1];
    }
    
    // 동점이거나 12점 미만이면 유연형
    return this.results.find(r => r.type === "유연형") || this.results[this.results.length - 1];
  }
}; 