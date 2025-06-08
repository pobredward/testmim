"use client";
import { getTestByCode } from "@/data/tests";
import { useParams } from "next/navigation";
import type { TestResult } from "@/types/tests";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function AllResultsPage() {
  const { testCode } = useParams<{ testCode: string }>();
  const { t, i18n } = useTranslation();
  const [TEST_DATA, setTestData] = useState(() => getTestByCode(testCode, i18n.language));

  useEffect(() => {
    setTestData(getTestByCode(testCode, i18n.language));
  }, [testCode, i18n.language]);

  if (!TEST_DATA) {
    return <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">{t('test.testNotFound')}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: TEST_DATA.mainColor }}>
        {t('results.allResults')}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TEST_DATA.results.map((result: TestResult, idx: number) => (
          <div key={idx} className="rounded-2xl shadow-lg bg-white p-6 flex flex-col items-center border border-gray-100 hover:shadow-xl transition">
            <div className="text-6xl mb-4" style={{ filter: 'drop-shadow(0 2px 8px #eee)' }}>{result.icon}</div>
            <div className="font-bold text-lg mb-2 text-center" style={{ color: TEST_DATA.mainColor }}>{result.title}</div>
            <div className="text-gray-700 text-sm whitespace-pre-line text-center mb-2 leading-relaxed">{result.desc}</div>
            {result?.subDesc && (
              <div className="text-gray-500 text-xs whitespace-pre-line text-center mb-2">{result.subDesc}</div>
            )}
            {Array.isArray(result?.recommend) && result.recommend.length > 0 && (
              <div className="text-xs text-blue-700 mb-2 text-center">
                <b>{t('results.recommend')}:</b> {result.recommend.join(", ")}
              </div>
            )}
            {result?.imageDesc && (
              <div className="text-xs text-gray-400 mb-1 text-center">{t('results.imageRecommend')}: {result.imageDesc}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 