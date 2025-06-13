import type { TestAnswer, TestResult } from "@/types/tests";

export const POLITICS_TEST = {
  code: "politics",
  docId: "politics",
  title: "나의 정치색 테스트",
  description: "대한민국 주요 정당과 정치 이슈를 바탕으로, 나의 정치 성향을 알아보세요!",
  bgGradient: "from-[#e0e7ff] via-[#f8fafc] to-[#ffe0e7]",
  mainColor: "#0052a7",
  icon: "🗳️",
  thumbnailUrl: "/thumbnails/politics_thumb.png",
  tags: ["정치", "정당", "성향", "대한민국"],
  seoKeywords: "정치 성향 테스트, 대한민국 정당, 정치색, 민주당, 국민의힘, 진보, 보수, 기본소득, 사회민주주의, 개혁신당, 조국혁신당, 진보당, 사회민주당, 정치 MBTI",
  views: 0,
  likes: 0,
  scraps: 0,
  category: "자아",
  questions: [
    {
      question: "경제 정책에서 더 중요한 것은?",
      options: [
        { text: "복지 확대 및 분배 강화", value: "democratic", score: 2 },
        { text: "시장 자율과 성장 우선", value: "conservative", score: 2 },
        { text: "기본소득 등 혁신적 실험", value: "basic", score: 2 },
      ],
    },
    {
      question: "남북관계에 대한 입장은?",
      options: [
        { text: "대화와 협력 우선", value: "democratic", score: 2 },
        { text: "원칙 있는 대응과 안보 강화", value: "conservative", score: 2 },
        { text: "평화통일 적극 추진", value: "progressive", score: 2 },
      ],
    },
    {
      question: "청년 정책에서 더 공감 가는 것은?",
      options: [
        { text: "청년 기본소득, 주거 지원 등 직접적 복지", value: "basic", score: 2 },
        { text: "일자리 창출, 창업 지원 등 성장 기반 마련", value: "conservative", score: 2 },
        { text: "청년 정치 참여 확대, 제도 혁신", value: "reform", score: 2 },
      ],
    },
    {
      question: "사회적 약자(노동, 여성, 소수자) 정책에 대한 생각은?",
      options: [
        { text: "적극적 차별 해소와 권리 보장", value: "progressive", score: 2 },
        { text: "기회 평등, 최소한의 개입", value: "conservative", score: 2 },
        { text: "사회적 연대와 혁신적 대안 모색", value: "socialdem", score: 2 },
      ],
    },
    {
      question: "부동산 정책에서 더 선호하는 방향은?",
      options: [
        { text: "공공주택 확대, 임대차 보호 강화", value: "democratic", score: 2 },
        { text: "시장 안정화, 규제 완화", value: "conservative", score: 2 },
        { text: "토지공개념, 기본주택 등 실험적 정책", value: "basic", score: 2 },
      ],
    },
    {
      question: "정치 개혁에 대한 입장은?",
      options: [
        { text: "다당제, 연동형 비례대표제 등 제도 개혁", value: "reform", score: 2 },
        { text: "안정적 양당제, 효율적 국정 운영", value: "conservative", score: 2 },
        { text: "시민참여 확대, 직접민주주의 강화", value: "progressive", score: 2 },
      ],
    },
    {
      question: "환경/기후 위기 대응에서 더 중요한 것은?",
      options: [
        { text: "국가 주도 강력한 규제와 투자", value: "democratic", score: 2 },
        { text: "민간 주도 혁신과 시장 유도", value: "conservative", score: 2 },
        { text: "기본소득형 탄소배당 등 새로운 실험", value: "basic", score: 2 },
      ],
    },
    {
      question: "공정/정의에 대한 생각은?",
      options: [
        { text: "사회적 약자 보호와 구조적 개혁", value: "progressive", score: 2 },
        { text: "법치주의, 개인 책임 강조", value: "conservative", score: 2 },
        { text: "사회적 합의와 혁신적 제도 도입", value: "reform", score: 2 },
      ],
    },
    {
      question: "내가 생각하는 이상적 정치인은?",
      options: [
        { text: "국민과 소통, 약자 대변", value: "democratic", score: 2 },
        { text: "원칙과 리더십, 실용적 해결사", value: "conservative", score: 2 },
        { text: "혁신적 아이디어, 미래지향적", value: "reform", score: 2 },
      ],
    },
    {
      question: "내가 가장 공감하는 정치 구호는?",
      options: [
        { text: "함께 잘 사는 사회", value: "democratic", score: 2 },
        { text: "자유와 번영의 대한민국", value: "conservative", score: 2 },
        { text: "모두에게 기본을!", value: "basic", score: 2 },
      ],
    },
  ],
  results: [
    {
      type: "democratic",
      title: "더불어민주당 계열 성향",
      desc: "복지, 분배, 사회적 약자 보호 등 진보적 가치를 중시하며, 대화와 협력, 포용의 정치를 선호합니다.",
      subDesc: "- 사회적 연대와 공공성 강조\n- 약자와 소수자 보호\n- 평화와 협력 지향",
      recommend: [
        "더불어민주당, 조국혁신당 등 진보 계열 정당",
        "공공기관, 복지, 교육 분야",
        "사회적 연대 활동"
      ],
      icon: "🔵",
      hashtags: ["#진보", "#복지", "#포용"],
      condition: (scores: Record<string, number>) => scores.democratic > scores.conservative && scores.democratic >= Math.max(scores.progressive, scores.basic, scores.reform, scores.socialdem),
    },
    {
      type: "conservative",
      title: "국민의힘 계열 성향",
      desc: "시장 자율, 성장, 안보 등 보수적 가치를 중시하며, 실용적이고 원칙 있는 정치를 선호합니다.",
      subDesc: "- 시장경제와 성장 우선\n- 법치와 안보 중시\n- 실용적 해결사",
      recommend: [
        "국민의힘 등 보수 계열 정당",
        "기업, 창업, 경제 분야",
        "실용적 정책 연구"
      ],
      icon: "🔴",
      hashtags: ["#보수", "#시장", "#안보"],
      condition: (scores: Record<string, number>) => scores.conservative > scores.democratic && scores.conservative >= Math.max(scores.progressive, scores.basic, scores.reform, scores.socialdem),
    },
    {
      type: "progressive",
      title: "진보당/조국혁신당 계열 성향",
      desc: "사회적 약자, 평등, 구조적 개혁 등 급진적 진보 가치를 중시하며, 적극적 변화를 추구합니다.",
      subDesc: "- 구조적 개혁과 평등 강조\n- 약자와 소수자 권리 보호\n- 평화통일 지향",
      recommend: [
        "진보당, 조국혁신당 등 급진 진보 정당",
        "시민단체, 인권, 평화운동 분야",
        "사회운동 참여"
      ],
      icon: "🟣",
      hashtags: ["#급진진보", "#개혁", "#평등"],
      condition: (scores: Record<string, number>) => scores.progressive > scores.democratic && scores.progressive >= Math.max(scores.conservative, scores.basic, scores.reform, scores.socialdem),
    },
    {
      type: "basic",
      title: "기본소득당/개혁신당 계열 성향",
      desc: "기본소득, 혁신, 실험적 정책 등 미래지향적 가치를 중시하며, 새로운 대안을 추구합니다.",
      subDesc: "- 기본소득 등 혁신적 정책 선호\n- 미래지향적 사고\n- 실험과 도전",
      recommend: [
        "기본소득당, 개혁신당 등 혁신 정당",
        "스타트업, 정책실험, 미래산업 분야",
        "사회혁신 프로젝트"
      ],
      icon: "🟢",
      hashtags: ["#혁신", "#기본소득", "#미래"],
      condition: (scores: Record<string, number>) => scores.basic > scores.democratic && scores.basic >= Math.max(scores.conservative, scores.progressive, scores.reform, scores.socialdem),
    },
    {
      type: "reform",
      title: "개혁신당/중도개혁 성향",
      desc: "제도 개혁, 시민참여, 균형 잡힌 시각 등 중도·개혁적 가치를 중시합니다.",
      subDesc: "- 제도 개혁과 시민참여 강조\n- 균형 잡힌 시각\n- 유연한 사고",
      recommend: [
        "개혁신당 등 중도개혁 정당",
        "정책연구, 시민사회, 협치 분야",
        "사회적 합의 활동"
      ],
      icon: "🟡",
      hashtags: ["#개혁", "#중도", "#시민참여"],
      condition: (scores: Record<string, number>) => scores.reform > scores.democratic && scores.reform >= Math.max(scores.conservative, scores.progressive, scores.basic, scores.socialdem),
    },
    {
      type: "socialdem",
      title: "사회민주당 계열 성향",
      desc: "사회적 연대, 복지, 평등 등 사회민주주의 가치를 중시하며, 유럽식 복지국가 모델을 선호합니다.",
      subDesc: "- 사회적 연대와 복지 강조\n- 평등과 포용\n- 유럽식 사회민주주의",
      recommend: [
        "사회민주당 등 사회민주주의 정당",
        "복지, 노동, 사회정책 분야",
        "사회적 경제 활동"
      ],
      icon: "🟩",
      hashtags: ["#사회민주주의", "#복지", "#연대"],
      condition: (scores: Record<string, number>) => scores.socialdem > scores.democratic && scores.socialdem >= Math.max(scores.conservative, scores.progressive, scores.basic, scores.reform),
    },
    {
      type: "center",
      title: "중도/스윙보터(균형형)",
      desc: "특정 정당이나 이념에 치우치지 않고, 다양한 가치와 정책을 균형 있게 바라보는 성향입니다.",
      subDesc: "- 다양한 시각을 존중\n- 상황에 따라 유연하게 판단\n- 스윙보터 역할",
      recommend: [
        "중도, 무당층, 합리적 선택",
        "정책비교, 토론, 다양한 경험",
        "사회적 합의와 협력"
      ],
      icon: "⚪️",
      hashtags: ["#중도", "#균형", "#스윙보터"],
      condition: (scores: Record<string, number>) => {
        const values = Object.values(scores);
        const max = Math.max(...values);
        const maxCount = values.filter((v) => v === max).length;
        return maxCount > 1;
      },
    },
  ] as TestResult[],
  calculateResult(answers: TestAnswer[]): TestResult {
    const scores: Record<string, number> = {
      democratic: 0,
      conservative: 0,
      progressive: 0,
      basic: 0,
      reform: 0,
      socialdem: 0,
    };
    answers.forEach((a) => {
      if (scores[a.value] !== undefined) {
        scores[a.value] += a.score;
      }
    });
    for (const result of this.results) {
      if (result.condition && result.condition(scores)) {
        return { ...result };
      }
    }
    // 기본값: 중도
    return this.results.find((r) => r.type === "center")!;
  },
}; 