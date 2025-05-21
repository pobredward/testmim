import type { TestAnswer, TestResult } from "@/types/tests";

export const SECRETJOB_TEST = {
  code: "secretjob",
  docId: "secretjob",
  title: "내 안의 비밀 직업은?",
  description: "MBTI나 성향으로 가려졌던 숨겨진 직업 본능을 밝혀드립니다! 당신의 내면을 직업군으로 비유해보세요.",
  thumbnailUrl: "", // 썸네일 이미지가 있다면 경로 입력, 없으면 빈 문자열
  mainColor: "#7e5bef",
  icon: "🧩",
  bgGradient: "from-purple-100 to-blue-100",
  tags: ["직업", "성향", "심리"],
  views: 0,
  likes: 0,
  scraps: 0,
  category: "자아",
  questions: [
    {
      question: "가장 마음이 편한 시간은 언제인가요?",
      options: [
        { text: "모두 잠든 새벽, 조용한 시간", value: "A", score: 1, type: "내면 분석가" },
        { text: "친구들과 수다 떠는 오후", value: "B", score: 1, type: "감정 연출가" },
        { text: "팀을 이끄는 바쁜 회의 시간", value: "C", score: 1, type: "전투 조율가" }
      ]
    },
    {
      question: "혼자 있을 때 보통 하는 일은?",
      options: [
        { text: "유튜브 알고리즘 파도타기", value: "A", score: 1, type: "데이터 마법사" },
        { text: "낯선 장소로 즉흥 여행", value: "B", score: 1, type: "탐험가" },
        { text: "상상 속 회의", value: "C", score: 1, type: "기획자" }
      ]
    },
    {
      question: "친구가 고민을 털어놨어요. 당신의 반응은?",
      options: [
        { text: "해결책을 제시한다", value: "A", score: 1, type: "데이터 마법사" },
        { text: "끝까지 경청하며 공감한다", value: "B", score: 1, type: "평화 유지군" },
        { text: "개그로 전환한다", value: "C", score: 1, type: "감정 연출가" }
      ]
    },
    {
      question: "집단 프로젝트 시 내 역할은?",
      options: [
        { text: "기획과 설계", value: "A", score: 1, type: "기획자" },
        { text: "분위기 메이커", value: "B", score: 1, type: "감정 연출가" },
        { text: "리더/의사결정", value: "C", score: 1, type: "전투 조율가" }
      ]
    },
    {
      question: "사람 많은 자리에선 나는…",
      options: [
        { text: "에너지 고갈…", value: "A", score: 1, type: "내면 분석가" },
        { text: "에너지 뿜뿜!", value: "B", score: 1, type: "감정 연출가" },
        { text: "중심이 되어 컨트롤", value: "C", score: 1, type: "전투 조율가" }
      ]
    },
    {
      question: "정보를 접할 때 당신은?",
      options: [
        { text: "구조 분석함", value: "A", score: 1, type: "데이터 마법사" },
        { text: "공감 포인트 찾음", value: "B", score: 1, type: "평화 유지군" },
        { text: "내가 어떻게 써먹을까 생각", value: "C", score: 1, type: "기획자" }
      ]
    },
    {
      question: "당신의 SNS 사용 패턴은?",
      options: [
        { text: "잘 안함", value: "A", score: 1, type: "내면 분석가" },
        { text: "짤 저장소", value: "B", score: 1, type: "감정 연출가" },
        { text: "트렌드 리딩용", value: "C", score: 1, type: "기획자" }
      ]
    },
    {
      question: "좋아하는 영화 스타일은?",
      options: [
        { text: "스릴러/추리", value: "A", score: 1, type: "내면 분석가" },
        { text: "로맨틱코미디", value: "B", score: 1, type: "감정 연출가" },
        { text: "전쟁/정치/범죄", value: "C", score: 1, type: "전투 조율가" }
      ]
    },
    {
      question: "내 책상 위 풍경은?",
      options: [
        { text: "분석 자료와 메모", value: "A", score: 1, type: "데이터 마법사" },
        { text: "작은 피규어/캐릭터", value: "B", score: 1, type: "감정 연출가" },
        { text: "깔끔+도구 정렬", value: "C", score: 1, type: "기획자" }
      ]
    },
    {
      question: "한 단어로 나를 표현하면?",
      options: [
        { text: "정적", value: "A", score: 1, type: "내면 분석가" },
        { text: "유쾌", value: "B", score: 1, type: "감정 연출가" },
        { text: "통제력", value: "C", score: 1, type: "전투 조율가" }
      ]
    }
  ],
  results: [
    {
      type: "내면 분석가",
      title: "내면 분석가 (그림자 정신과의사형)",
      desc: "당신은 관찰과 분석의 대가. 감정보다는 구조를 보며, 말수는 적지만 내면은 깊습니다.",
      subDesc: "대화를 듣기보단 '해석'하며, 타인의 숨은 감정도 잘 읽어냅니다.",
      recommend: ["감성적인 평화 유지군", "통찰력 있는 기획자"],
      imageDesc: "검은 후드, 조용한 눈빛, 책상에 분석 노트",
      icon: "🔍"
    },
    {
      type: "데이터 마법사",
      title: "데이터 마법사 (통계지배자형)",
      desc: "당신은 수치와 패턴을 읽어내는 마법사. 직관보다 근거가 먼저입니다.",
      subDesc: "무엇이든 '이게 왜 그런지를 먼저 묻는 사람'.",
      recommend: ["감각적 연출가", "논리적 기획자"],
      imageDesc: "엑셀 창 열어둔 노트북, 코드 같은 수첩",
      icon: "📊"
    },
    {
      type: "감정 연출가",
      title: "감정 연출가 (에너지 조율가형)",
      desc: "당신은 '분위기'라는 무형의 언어를 가장 잘 아는 사람.",
      subDesc: "대화에 생기를 불어넣고, 무거운 자리를 유쾌하게 만드는 감정 연출의 마스터입니다.",
      recommend: ["조용한 분석가", "전략적 기획자"],
      imageDesc: "마이크, 환한 웃음, 핑크 조명",
      icon: "🎭"
    },
    {
      type: "전투 조율가",
      title: "전투 조율가 (냉정한 사령관형)",
      desc: "큰 판을 보는 능력자. 감정보다는 '판단'과 '결정'을 선호합니다.",
      subDesc: "리더십이 자연스럽게 발휘되며, 위기 상황에서도 평정을 잃지 않습니다.",
      recommend: ["데이터 마법사", "연출가"],
      imageDesc: "지도 위 핀 꽂는 모습, 디지털 워치",
      icon: "🧭"
    },
    {
      type: "평화 유지군",
      title: "평화 유지군 (감정 중재자형)",
      desc: "당신은 누구와도 갈등을 만들지 않는 감성의 중재자.",
      subDesc: "갈등 회피가 아니라, '조율'을 선택하는 지혜로운 사람입니다.",
      recommend: ["리더형 조율가", "에너지 연출가"],
      imageDesc: "향 피우는 명상 공간, 평온한 표정",
      icon: "🧘"
    },
    {
      type: "기획자",
      title: "기획자 (창조 설계자형)",
      desc: "모든 아이디어의 구조와 미래를 먼저 상상해보는 사람.",
      subDesc: "당신은 현실보단 '그럴듯한 청사진'을 먼저 그리는 타입입니다.",
      recommend: ["데이터 마법사", "전투 조율가"],
      imageDesc: "화이트보드 + 낙서 가득한 다이어리",
      icon: "🧩"
    }
  ] as TestResult[],
  calculateResult(answers: TestAnswer[]): TestResult {
    const typeScores: Record<string, number> = {};
    answers.forEach(ans => {
      if (ans.type) typeScores[ans.type] = (typeScores[ans.type] || 0) + ans.score;
    });
    const bestType = Object.entries(typeScores).sort((a, b) => b[1] - a[1])[0]?.[0];
    return this.results.find(r => r.type === bestType) || this.results[0];
  }
}; 