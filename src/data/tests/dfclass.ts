import type { TestAnswer, TestResult } from "@/types/tests";

export const DFCLASS_TEST = {
  code: "dfclass",
  docId: "dfclass",
  title: "당신에게 어울리는 던파 직업은?",
  description: "다양한 전직 중, 당신의 성향에 가장 어울리는 던전앤파이터 직업을 찾아보세요! 20문항을 통해 당신의 플레이 성향과 딱 맞는 캐릭터를 추천해드립니다.",
  bgGradient: "from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa]",
  mainColor: "#d32f2f",
  icon: "🛡️",
  thumbnailUrl: "/dfclass_thumb.png",
  tags: ["던파", "게임", "직업테스트", "성향분석"],
  views: 0,
  likes: 0,
  scraps: 0,
  category: "게임",
  questions: [
    { question: "1. 당신의 전투 스타일은?", options: [ { text: "한 방에 터뜨리는 강력한 스킬", value: "버서커", score: 2 }, { text: "콤보와 컨트롤을 살리는 스타일", value: "레인저", score: 2 }, { text: "지능적이고 계산된 마법 전투", value: "엘마", score: 2 }, { text: "팀을 서포트하며 안정감 있게", value: "세라핌", score: 2 } ] },
    { question: "2. 파티에서 맡고 싶은 역할은?", options: [ { text: "전방에서 적을 상대하는 근접 딜러", value: "버서커", score: 2 }, { text: "원거리에서 빠르게 딜링", value: "레인저", score: 2 }, { text: "전투의 흐름을 제어하는 전략가", value: "디멘션워커", score: 2 }, { text: "아군을 지키고 돕는 서포터", value: "세라핌", score: 2 } ] },
    { question: "3. 전투 중 가장 중요하다고 생각하는 것은?", options: [ { text: "강력한 한 방", value: "버서커", score: 2 }, { text: "정확한 포지셔닝", value: "레인저", score: 2 }, { text: "전술적인 판단", value: "엘마", score: 2 }, { text: "팀 전체의 밸런스 유지", value: "크루세이더", score: 2 } ] },
    { question: "4. 선호하는 무기 타입은?", options: [ { text: "대검, 너클 등 묵직한 무기", value: "버서커", score: 2 }, { text: "쌍권총, 리볼버 등 총기류", value: "레인저", score: 2 }, { text: "지팡이, 마법도구 등 원소계", value: "엘마", score: 2 }, { text: "성서, 십자가 같은 신성 아이템", value: "크루세이더", score: 2 } ] },
    { question: "5. 내가 게임에서 가장 잘하는 것은?", options: [ { text: "적극적인 돌진과 한타 이니시", value: "버서커", score: 2 }, { text: "끊임없는 거리 조절과 연계", value: "레인저", score: 2 }, { text: "팀원을 지휘하고 도와주는 것", value: "크루세이더", score: 2 }, { text: "예상 못한 스킬로 흐름을 바꾸는 것", value: "디멘션워커", score: 2 } ] },
    { question: "6. 상대에게 가장 무서운 플레이는?", options: [ { text: "순식간에 몰아치는 콤보", value: "레인저", score: 2 }, { text: "쉴 새 없이 깔리는 스킬 범위", value: "엘마", score: 2 }, { text: "지원이 완벽한 팀 플레이", value: "세라핌", score: 2 }, { text: "갑작스럽고 기묘한 공격 패턴", value: "디멘션워커", score: 2 } ] },
    { question: "7. 어떤 플레이가 더 멋있다고 생각해?", options: [ { text: "적진에 뛰어들어 전부 쓸어버리는 플레이", value: "버서커", score: 2 }, { text: "화려한 무브로 적을 요리하는 플레이", value: "레인저", score: 2 }, { text: "한타에서 모든 걸 컨트롤하는 플레이", value: "디멘션워커", score: 2 }, { text: "위기의 아군을 살려내는 결정적인 지원", value: "세라핌", score: 2 } ] },
    { question: "8. 전투 이외의 역할이 있다면?", options: [ { text: "탱커나 딜러 모두 가능", value: "버서커", score: 2 }, { text: "정찰과 기습 담당", value: "레인저", score: 2 }, { text: "상황 판단 후 전황 제어", value: "디멘션워커", score: 2 }, { text: "팀 전체의 유지력 담당", value: "세라핌", score: 2 } ] },
    { question: "9. 나를 더 잘 표현하는 단어는?", options: [ { text: "분노", value: "버서커", score: 2 }, { text: "정확함", value: "레인저", score: 2 }, { text: "창의력", value: "디멘션워커", score: 2 }, { text: "헌신", value: "세라핌", score: 2 } ] },
    { question: "10. 가장 자신 있는 조작 방식은?", options: [ { text: "단순하지만 임팩트 있는 조작", value: "버서커", score: 2 }, { text: "콤보 연결이 매끄러운 조작", value: "레인저", score: 2 }, { text: "정교한 스킬 타이밍", value: "엘마", score: 2 }, { text: "상대나 아군의 상태 판단 중심", value: "크루세이더", score: 2 } ] },
    { question: "11. 싸움에서의 철칙은?", options: [ { text: "일단 돌진!", value: "버서커", score: 2 }, { text: "먼저 보고 먼저 쏘기", value: "레인저", score: 2 }, { text: "먼저 지형과 상황 분석", value: "디멘션워커", score: 2 }, { text: "상대의 카운터를 파악하고 지원", value: "세라핌", score: 2 } ] },
    { question: "12. 전투 외 시간엔 어떤 캐릭터?", options: [ { text: "조용하지만 묵직한 존재감", value: "버서커", score: 2 }, { text: "말이 많고 장난끼 있음", value: "레인저", score: 2 }, { text: "아이디어가 많고 상상력 풍부", value: "디멘션워커", score: 2 }, { text: "친절하고 배려심 깊은 조력자", value: "세라핌", score: 2 } ] },
    { question: "13. 동료가 위험할 때 나는?", options: [ { text: "몸을 던져 막아준다", value: "인파이터", score: 2 }, { text: "적에게 딜로 복수한다", value: "레인저", score: 2 }, { text: "상황을 조정하고 반격 기회를 만든다", value: "엘마", score: 2 }, { text: "즉시 회복과 보호를 건다", value: "세라핌", score: 2 } ] },
    { question: "14. 가장 멋있게 느껴지는 장면은?", options: [ { text: "스킬 하나로 다 쓸어버릴 때", value: "버서커", score: 2 }, { text: "연속 스킬로 적을 공중에 띄울 때", value: "레인저", score: 2 }, { text: "기묘한 연출과 독특한 스킬 사용", value: "디멘션워커", score: 2 }, { text: "팀원이 내 도움으로 살아남을 때", value: "세라핌", score: 2 } ] },
    { question: "15. 성향에 가장 가까운 키워드는?", options: [ { text: "격정", value: "버서커", score: 2 }, { text: "스피드", value: "레인저", score: 2 }, { text: "창의", value: "디멘션워커", score: 2 }, { text: "헌신", value: "세라핌", score: 2 } ] },
    { question: "16. 던전에서 가장 먼저 하는 일은?", options: [ { text: "먼저 돌진해서 적 제압", value: "버서커", score: 2 }, { text: "위치 잡고 딜각 노리기", value: "레인저", score: 2 }, { text: "맵 분석과 트랩 확인", value: "디멘션워커", score: 2 }, { text: "아군 상태 점검", value: "세라핌", score: 2 } ] },
    { question: "17. 당신의 장점은?", options: [ { text: "강한 의지와 돌파력", value: "버서커", score: 2 }, { text: "센스 있는 판단력", value: "레인저", score: 2 }, { text: "유연한 사고방식", value: "디멘션워커", score: 2 }, { text: "책임감과 배려심", value: "크루세이더", score: 2 } ] },
    { question: "18. 나의 약점은?", options: [ { text: "과감하지만 무모함", value: "버서커", score: 2 }, { text: "속도는 있지만 체력 부족", value: "레인저", score: 2 }, { text: "상황이 복잡하면 혼란스러움", value: "디멘션워커", score: 2 }, { text: "혼자선 버티기 어려움", value: "세라핌", score: 2 } ] },
    { question: "19. 플레이 스타일은?", options: [ { text: "직선적이고 화끈한 스타일", value: "버서커", score: 2 }, { text: "계산된 움직임과 거리 조절", value: "레인저", score: 2 }, { text: "상황에 따라 다르게 대응", value: "디멘션워커", score: 2 }, { text: "전체적인 균형과 팀 유지", value: "크루세이더", score: 2 } ] },
    { question: "20. 당신의 궁극기 성향은?", options: [ { text: "한방 폭발력!", value: "버서커", score: 2 }, { text: "콤보 마무리형", value: "레인저", score: 2 }, { text: "화려하고 독특한 연출", value: "디멘션워커", score: 2 }, { text: "전체 회복/보호", value: "세라핌", score: 2 } ] }
  ],
  results: [
    { type: "버서커", title: "💢 버서커 – 광전사", desc: "격정을 전투로 풀어내는 한방의 화신", hashtags: ["#근딜", "#격노", "#광전사"], icon: "💢" },
    { type: "레인저", title: "🎯 레인저 – 콤보 마스터", desc: "빠르고 화려한 손맛을 가진 사격수", hashtags: ["#스킬연계", "#포지셔닝", "#손맛"], icon: "🎯" },
    { type: "엘마", title: "🔥 엘레멘탈 마스터 – 정령술사", desc: "원소를 다루는 전략형 마법 딜러", hashtags: ["#지능캐", "#연속딜", "#운영"], icon: "🔥" },
    { type: "세라핌", title: "✨ 세라핌 – 천상의 서포터", desc: "힐과 버프로 팀을 완성시키는 존재", hashtags: ["#서포터", "#힐러", "#버프장인"], icon: "✨" },
    { type: "디멘션워커", title: "🌌 디멘션 워커 – 차원조율자", desc: "창의적인 스킬 운영과 독특한 감성", hashtags: ["#변칙", "#창의력", "#중거리"], icon: "🌌" },
    { type: "인파이터", title: "👊 인파이터 – 강력한 근접 압박", desc: "파워와 물리력을 기반으로 밀어붙이는 전사", hashtags: ["#압박딜", "#탱커형", "#근딜"], icon: "👊" },
    { type: "스핏파이어", title: "💥 스핏파이어 – 전술형 사수", desc: "무기와 장비를 활용한 탄도전술 마스터", hashtags: ["#전략", "#유틸", "#지능딜러"], icon: "💥" },
    { type: "엔처트리스", title: "🌙 엔처트리스 – 마법 보조 전문", desc: "상태이상과 버프로 아군을 돕는 서포터", hashtags: ["#디버프", "#보조딜", "#마법보조"], icon: "🌙" },
    { type: "소드마스터", title: "⚔️ 소드마스터 – 테크닉의 정점", desc: "빠른 판단과 테크닉이 강점인 근딜", hashtags: ["#기동력", "#연계", "#난이도상"], icon: "⚔️" },
    { type: "소울브링어", title: "🕷️ 소울브링어 – 어둠의 소환자", desc: "암흑 속에서 귀신을 부려 전장을 통제", hashtags: ["#디버프", "#지속딜", "#중거리"], icon: "🕷️" },
    { type: "크루세이더", title: "🛡️ 크루세이더 – 팀의 방패", desc: "보호와 버프에 특화된 강력한 방어형 캐릭터", hashtags: ["#방어형", "#유틸왕", "#지원전문"], icon: "🛡️" },
    { type: "스트라이커", title: "🦶 스트라이커 – 한방의 킥 마스터", desc: "속도와 파워를 모두 가진 극근접형", hashtags: ["#고속딜", "#리스크딜러", "#스킬전"], icon: "🦶" }
  ],
  calculateResult(answers: TestAnswer[]): TestResult {
    // 직업별 점수 집계
    const jobs = ["버서커","레인저","엘마","세라핌","디멘션워커","인파이터","스핏파이어","엔처트리스","소드마스터","소울브링어","크루세이더","스트라이커"];
    const scores: Record<string, number> = Object.fromEntries(jobs.map(j => [j, 0]));
    answers.forEach((a, idx) => {
      if (scores[a.value] !== undefined) scores[a.value] += a.score;
    });
    // 최고 점수 직업 찾기
    const maxScore = Math.max(...Object.values(scores));
    const candidates = jobs.filter(j => scores[j] === maxScore && maxScore > 0);
    // 동점 시 최근 선택 우선, 없으면 랜덤
    let resultType = candidates[0];
    if (candidates.length > 1) {
      const last = answers.slice().reverse().find(a => candidates.includes(a.value));
      resultType = last ? last.value : candidates[Math.floor(Math.random() * candidates.length)];
    }
    return this.results.find(r => r.type === resultType) || this.results[0];
  }
}; 