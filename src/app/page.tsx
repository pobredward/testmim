import HomeClient from "./HomeClient";

export const metadata = {
  title: "테스트밈 | 무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음",
  description: "테스트밈은 다양한 무료 심리테스트, 성향테스트, MBTI, 연애, 동물, 게임 등 재미있는 테스트를 한 곳에 모아둔 사이트입니다. 지금 바로 나에게 맞는 테스트를 찾아보세요!",
  keywords: "테스트밈, 심리테스트, 무료테스트, 성향테스트, MBTI, 연애테스트, 동물테스트, 게임테스트, 재미있는 테스트, testmim, 성격테스트, 인기테스트",
  openGraph: {
    title: "테스트밈 | 무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음",
    description: "테스트밈은 다양한 무료 심리테스트, 성향테스트, MBTI, 연애, 동물, 게임 등 재미있는 테스트를 한 곳에 모아둔 사이트입니다. 지금 바로 나에게 맞는 테스트를 찾아보세요!",
    url: "https://www.testmim.com/",
    type: "website",
  },
  alternates: {
    canonical: "https://www.testmim.com/",
  },
};

export default function Home() {
  return <HomeClient />;
}
