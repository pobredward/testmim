"use client";
import { EGENTETO_TEST } from "@/data/tests/egenteto";
import { SECRETJOB_TEST } from "@/data/tests/secretjob";
import { ANIMALPERSONALITY_TEST } from "@/data/tests/animalpersonality";
import { PASTLIFE_TEST } from "@/data/tests/pastlife";
import { SPEECHSTYLE_TEST } from "@/data/tests/speechstyle";
import { useParams } from "next/navigation";

export default function AllResultsPage() {
  const { testCode } = useParams<{ testCode: string }>();
  const TEST_DATA =
    testCode === EGENTETO_TEST.code ? EGENTETO_TEST :
    testCode === SECRETJOB_TEST.code ? SECRETJOB_TEST :
    testCode === ANIMALPERSONALITY_TEST.code ? ANIMALPERSONALITY_TEST :
    testCode === PASTLIFE_TEST.code ? PASTLIFE_TEST :
    testCode === SPEECHSTYLE_TEST.code ? SPEECHSTYLE_TEST :
    null;

  if (!TEST_DATA) {
    return <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">존재하지 않는 테스트입니다.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: TEST_DATA.mainColor }}>
        모든 결과 보기
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TEST_DATA.results.map((result, idx) => (
          <div key={idx} className="rounded-2xl shadow-lg bg-white p-6 flex flex-col items-center border border-gray-100 hover:shadow-xl transition">
            <div className="text-6xl mb-4" style={{ filter: 'drop-shadow(0 2px 8px #eee)' }}>{result.icon}</div>
            <div className="font-bold text-lg mb-2 text-center" style={{ color: TEST_DATA.mainColor }}>{result.title}</div>
            <div className="text-gray-700 text-sm whitespace-pre-line text-center mb-2 leading-relaxed">{result.desc}</div>
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
          </div>
        ))}
      </div>
    </div>
  );
} 