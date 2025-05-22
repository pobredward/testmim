"use client";
import { LOLLANE_TEST } from "@/data/tests/lollane";
import { db, analytics } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { TestAnswer } from "@/types/tests";
import { logEvent } from "firebase/analytics";

export default function LollaneTestResultPage() {
  const { resultId } = useParams<{ resultId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<TestAnswer[] | null>(null);
  const [copied, setCopied] = useState(false);

  const isShare = searchParams.get("from") === "share";
  const TEST_DATA = LOLLANE_TEST;

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
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/t/${TEST_DATA.code}/result/${resultId}?from=share`;

  return (
    <div className={`min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b ${TEST_DATA.bgGradient} rounded-xl shadow p-6 sm:p-10 mt-4 mb-8`}>
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-5xl">
        {result.icon}
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: TEST_DATA.mainColor }}>{result.title}</h1>
      <p className="text-gray-700 mb-4 text-center whitespace-pre-line">{result.desc}</p>
      {result.subDesc && (
        <div className="text-gray-500 text-xs whitespace-pre-line text-center mb-2">{result.subDesc}</div>
      )}
      {result.hashtags && result.hashtags.length > 0 && (
        <div className="text-xs text-blue-700 mb-2 text-center">
          <b>해시태그:</b> {result.hashtags.join(", ")}
        </div>
      )}
      {!isShare ? (
        <>
        <button
          className="px-8 py-3 rounded-full text-lg font-semibold shadow bg-white border-2 mb-2"
          style={{ borderColor: TEST_DATA.mainColor, color: TEST_DATA.mainColor }}
          onClick={async () => {
            if (analytics) logEvent(analytics, "share_result", { test_code: TEST_DATA.code, result_id: resultId });
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          친구에게 공유하기
        </button>
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
      {copied && <div className="text-green-600 text-sm mt-1">복사되었습니다!</div>}
    </div>
  );
} 