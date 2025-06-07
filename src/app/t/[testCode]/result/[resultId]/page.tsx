"use client";

import { getTestByCode } from "@/data/tests";
import { db, analytics } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { TestAnswer } from "@/types/tests";
import { logEvent } from "firebase/analytics";

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

export default function TestResultPage() {
  const { testCode, resultId } = useParams<{ testCode: string; resultId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<TestAnswer[] | null>(null);
  const [copied, setCopied] = useState(false);

  // 공유 링크 여부
  const isShare = searchParams.get("from") === "share";

  // 테스트 데이터 분기
  const TEST_DATA = getTestByCode(testCode);

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      setError(null);
      try {
        const ref = doc(db, "results", resultId);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("결과를 찾을 수 없습니다.");
        setAnswers(snap.data().answers);
      } catch {
        setError("오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    if (resultId) fetchResult();
  }, [resultId]);

  if (!TEST_DATA) {
    return <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">존재하지 않는 테스트입니다.</div>;
  }

  if (loading)
    return <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">불러오는 중...</div>;
  if (error)
    return <div className="flex flex-col items-center justify-center min-h-[40vh] text-red-400">{error}</div>;
  if (!answers)
    return <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">결과 정보를 찾을 수 없습니다.</div>;

  const result = TEST_DATA.calculateResult(answers!);
  const shareUrl = `/t/${TEST_DATA.code}/result/${resultId}?from=share`;

  // 소셜 미디어 공유 함수들
  const shareToKakao = async () => {
    if (analytics) logEvent(analytics, "share_result_kakao", { test_code: testCode, result_id: resultId });
    
    // 카카오톡 SDK 초기화 (실제 사용시 카카오 JavaScript 키 필요)
    if (typeof window !== "undefined" && window.Kakao) {
      // 카카오 JavaScript 키가 필요합니다. 
      // .env.local 파일에 NEXT_PUBLIC_KAKAO_JS_KEY=your_key_here 추가 후 사용하세요.
      const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      
      if (!kakaoKey) {
        // 카카오 키가 없는 경우 링크 복사로 대체
        await navigator.clipboard.writeText(window.location.origin + shareUrl);
        alert("링크가 복사되었습니다! 카카오톡에서 직접 공유해주세요.");
        return;
      }
      
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
      }
      
      // 커스텀 템플릿 사용 (템플릿 ID: 121334)
      const testStartUrl = `/detail/${testCode}`;
      const resultImageUrl = window.location.origin + TEST_DATA.thumbnailUrl; // 각 테스트별 썸네일 이미지 사용
      
      try {
        await window.Kakao.Share.sendCustom({
          templateId: 121334,
          templateArgs: {
            'THU': result.title, // 테스트 결과 제목
            'TDC': result.desc.slice(0, 80), // 테스트 결과 설명 (80자 제한)
            'TTL': TEST_DATA.title, // 테스트 이름
            'IMG': resultImageUrl, // 테스트별 썸네일 이미지
            'RLT': shareUrl, // 친구 결과 보러가기 링크
            'TST': testStartUrl, // 나도 테스트 하러가기 링크
            'ICO': result.icon || '🎯' // 결과 이모지
          }
        });
      } catch (error) {
        console.error('카카오톡 커스텀 템플릿 공유 실패:', error);
        console.log('기본 템플릿으로 대체 시도...');
        
        // 커스텀 템플릿 실패 시 기본 피드 템플릿으로 대체
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `${result.title}`,
            description: result.desc.length > 100 ? result.desc.substring(0, 100) + '...' : result.desc,
            imageUrl: window.location.origin + '/og-image.png',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          itemContent: {
            profileText: TEST_DATA.title,
            profileImageUrl: window.location.origin + '/favicon-32x32.png',
            titleImageText: `${result.title} (${result.icon || '🎯'})`,
            titleImageCategory: '테스트 결과',
          },
          social: {
            likeCount: Math.floor(Math.random() * 1000) + 100,
            commentCount: Math.floor(Math.random() * 50) + 10,
            sharedCount: Math.floor(Math.random() * 200) + 50,
          },
          buttons: [
            {
              title: '친구 결과 보러가기',
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            {
              title: '나도 테스트 하러가기',
              link: {
                mobileWebUrl: testStartUrl,
                webUrl: testStartUrl,
              },
            },
          ],
          installTalk: false,
          success: function(result: any) {
            console.log('카카오톡 기본 템플릿 공유 성공:', result);
          },
          fail: function(error: any) {
            console.error('카카오톡 공유 완전 실패:', error);
            // 최종 실패 시 링크 복사로 대체
            navigator.clipboard.writeText(window.location.origin + shareUrl);
            alert("카카오톡 공유에 실패했습니다. 링크가 복사되었습니다!");
          },
        });
      }
    } else {
      // 카카오 SDK가 없는 경우 링크 복사
      await navigator.clipboard.writeText(window.location.origin + shareUrl);
      alert("링크가 복사되었습니다! 카카오톡에서 직접 공유해주세요.");
    }
  };

  const shareToTwitter = () => {
    if (analytics) logEvent(analytics, "share_result_twitter", { test_code: testCode, result_id: resultId });
    
    const text = `${TEST_DATA.title} 결과: ${result.title}`;
    const hashtags = "테스트,심리테스트";
    const fullShareUrl = window.location.origin + shareUrl;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullShareUrl)}&hashtags=${hashtags}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = () => {
    if (analytics) logEvent(analytics, "share_result_facebook", { test_code: testCode, result_id: resultId });
    
    const fullShareUrl = window.location.origin + shareUrl;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`;
    window.open(url, '_blank', 'width=580,height=400');
  };

  const shareToBluesky = () => {
    if (analytics) logEvent(analytics, "share_result_bluesky", { test_code: testCode, result_id: resultId });
    
    const fullShareUrl = window.location.origin + shareUrl;
    const text = `${TEST_DATA.title} 결과: ${result.title} ${fullShareUrl}`;
    const url = `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const copyLink = async () => {
    if (analytics) logEvent(analytics, "share_result_copy", { test_code: testCode, result_id: resultId });
    
    await navigator.clipboard.writeText(window.location.origin + shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b ${TEST_DATA.bgGradient} rounded-xl shadow p-6 sm:p-10 mt-4 mb-8`}>
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-5xl">
        {result.icon}
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: TEST_DATA.mainColor }}>{result.title}</h1>
      {testCode === "egenteto" && result.tetoPercent !== undefined && result.egenPercent !== undefined && (
        <div className="text-base text-gray-700 mb-2">에겐력 <span className="font-bold text-blue-700">{result.egenPercent}%</span> / 테토력 <span className="font-bold text-pink-600">{result.tetoPercent}%</span></div>
      )}
      <p className="text-gray-700 mb-4 text-center whitespace-pre-line">{result.desc}</p>
      {result.subDesc && (
        <div className="text-gray-500 text-xs whitespace-pre-line text-center mb-2">{result.subDesc}</div>
      )}
      {result.recommend && result.recommend.length > 0 && (
        <div className="text-xs text-blue-700 mb-2 text-center">
          <b>추천:</b> {result.recommend.join(", ")}
        </div>
      )}
      {result.imageDesc && (
        <div className="text-xs text-gray-400 mb-1 text-center">이미지 추천: {result.imageDesc}</div>
      )}
      
      {/* 공유/테스트 해보기 버튼 분기 */}
      {!isShare ? (
        <>
          {/* 소셜 미디어 공유 버튼들 */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="text-lg font-semibold mb-2" style={{ color: TEST_DATA.mainColor }}>
              결과 공유하기
            </div>
            
            {/* 첫 번째 줄: 카카오톡, 트위터 */}
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow bg-yellow-400 text-gray-800 hover:bg-yellow-500 transition-colors"
                onClick={shareToKakao}
              >
                <span className="text-lg">💬</span>
                카카오톡
              </button>
              
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow bg-blue-400 text-white hover:bg-blue-500 transition-colors"
                onClick={shareToTwitter}
              >
                <span className="text-lg">🐦</span>
                트위터
              </button>
            </div>
            
            {/* 두 번째 줄: 페이스북, 블루스카이 */}
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={shareToFacebook}
              >
                <span className="text-lg">📘</span>
                페이스북
              </button>
              
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={shareToBluesky}
              >
                <span className="text-lg">🦋</span>
                블루스카이
              </button>
            </div>
            
            {/* 링크 복사 버튼 */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              onClick={copyLink}
            >
              <span className="text-lg">🔗</span>
              {copied ? "복사됨!" : "링크 복사"}
            </button>
          </div>
          
          <button
            className="px-8 py-3 rounded-full text-lg font-semibold shadow bg-gray-100 border-2 mb-2 mt-2"
            style={{ borderColor: TEST_DATA.mainColor, color: TEST_DATA.mainColor }}
            onClick={() => router.push(`/t/${TEST_DATA.code}/results`)}
          >
            모든 결과 보기
          </button>
        </>
      ) : (
        <button
          className="px-8 py-3 rounded-full text-lg font-semibold shadow bg-blue-500 text-white hover:bg-blue-600 transition border-2 border-blue-500 mb-2"
          onClick={() => router.push(`/detail/${TEST_DATA.code}`)}
          style={{ maxWidth: 320 }}
        >
          나도 테스트 해보기
        </button>
      )}
      {copied && <div className="text-green-600 text-sm mt-1">링크가 복사되었습니다!</div>}
    </div>
  );
} 