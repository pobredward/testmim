# 테스트밈 (TestMim)

무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음

## 소셜 미디어 공유 설정

테스트 결과 페이지에서 다양한 소셜 미디어 플랫폼으로 공유할 수 있습니다.

### 지원하는 플랫폼

✅ **카카오톡** - JavaScript SDK 사용  
✅ **트위터(X)** - Web Intent 사용  
✅ **페이스북** - 공유 대화상자 사용  
✅ **블루스카이** - Intent 링크 사용  
✅ **링크 복사** - 클립보드 API 사용

### 카카오톡 공유 설정 (선택사항)

카카오톡 공유 기능을 사용하려면:

1. [카카오 디벨로퍼스](https://developers.kakao.com/) 회원가입
2. 애플리케이션 생성 및 JavaScript 키 발급
3. 웹 플랫폼 도메인 등록
4. 프로젝트 루트에 `.env.local` 파일 생성:
   ```
   NEXT_PUBLIC_KAKAO_JS_KEY=your_javascript_key_here
   ```

> 📝 **참고**: 카카오 키가 설정되지 않은 경우에도 링크 복사로 대체되므로, 다른 공유 기능들은 정상적으로 작동합니다.

### 필요한 추가 설정

#### Open Graph 메타태그 (권장)
페이스북, 트위터 공유 시 미리보기가 제대로 표시되도록 각 테스트 결과 페이지에 Open Graph 메타태그를 설정하는 것을 권장합니다.

#### 이미지 파일
- `/public/og-image.png`: 기본 Open Graph 이미지
- 카카오톡 공유 시 사용할 이미지 URL 설정

### 사용 방법

테스트 결과 페이지에서 "결과 공유하기" 섹션의 버튼들을 클릭하면:

1. **카카오톡**: 카카오톡 앱이나 웹에서 공유 대화상자 열림
2. **트위터**: 트위터 웹에서 트윗 작성 창 열림  
3. **페이스북**: 페이스북 공유 대화상자 열림
4. **블루스카이**: 블루스카이 웹에서 포스트 작성 창 열림
5. **링크 복사**: 클립보드에 결과 링크 복사

각 공유는 Google Analytics로 추적됩니다.

## 기존 내용

이 프로젝트는 [Next.js](https://nextjs.org)로 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)을 사용하여 부트스트랩되었습니다.

## 시작하기

먼저 개발 서버를 실행하세요:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

`app/page.tsx`를 수정하여 페이지 편집을 시작할 수 있습니다. 파일을 편집하면 페이지가 자동으로 업데이트됩니다.

이 프로젝트는 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)를 사용하여 Google Fonts의 커스텀 폰트인 Geist를 자동으로 최적화하고 로드합니다.

## 더 알아보기

Next.js에 대해 더 알아보려면 다음 리소스를 확인하세요:

- [Next.js 문서](https://nextjs.org/docs) - Next.js 기능과 API에 대해 알아보세요.
- [Next.js 학습](https://nextjs.org/learn) - 대화형 Next.js 튜토리얼입니다.

[Next.js GitHub 저장소](https://github.com/vercel/next.js)를 확인할 수 있습니다 - 여러분의 피드백과 기여를 환영합니다!

## Vercel에 배포

Next.js 앱을 배포하는 가장 쉬운 방법은 Next.js 창작자들이 만든 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)을 사용하는 것입니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 확인하세요.
