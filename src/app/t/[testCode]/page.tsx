"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from 'react-i18next';
import { getTestByCode } from "@/data/tests";
import { getTranslatedTestData } from "@/utils/testTranslations";
import { db, analytics } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import type { TestAnswer } from "@/types/tests";
import { logEvent } from "firebase/analytics";
import { giveExpForTestCompletion } from "@/utils/expLevel";
import { getUserFromFirestore } from "@/utils/userAuth";

// 진행률 표시 컴포넌트
function ProgressBar({ current, total, color }: { current: number; total: number; color: string }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
      <div
        className="h-2 rounded-full transition-all"
        style={{ width: `${percent}%`, background: color }}
      />
    </div>
  );
}

type QuestionOption = { text: string; value: string; score: number; type?: string };

// 질문/선택지 표시 컴포넌트
function Question({
  question,
  options,
  onSelect,
  disabled,
  color,
}: {
  question: string;
  options: QuestionOption[];
  onSelect: (value: string, score: number, type?: string) => void;
  disabled: boolean;
  color: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-6 text-center min-h-[48px]" style={{ color }}>{question}</h2>
      <div className="flex flex-col gap-4">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className="w-full py-2 px-4 rounded-full border-2 text-base font-medium shadow-sm transition disabled:opacity-60 hover:shadow-md"
            style={{ borderColor: color, color, background: "#fff" }}
            onClick={() => onSelect(opt.value, opt.score, opt.type)}
            disabled={disabled}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

// undefined 필드 제거 유틸
function removeUndefined(obj: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

export default function TestRunPage() {
  const { testCode } = useParams<{ testCode: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedTestData, setTranslatedTestData] = useState<any>(null);

  // 테스트 데이터 가져오기 및 번역
  useEffect(() => {
    const originalData = getTestByCode(testCode);
    if (originalData) {
      const translated = getTranslatedTestData(testCode, originalData, i18n.language);
      setTranslatedTestData(translated);
    }
  }, [testCode, i18n.language]);

  if (!translatedTestData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2">{t('common.loading')}</p>
      </div>
    );
  }

  const TEST_DATA = translatedTestData;

  const handleSelect = async (value: string, score: number, type?: string) => {
    const nextAnswers = [...answers, { value, score, type }];
    setAnswers(nextAnswers);
    if (nextAnswers.length < TEST_DATA.questions.length) {
      setCurrent((c) => c + 1);
    } else {
      setSubmitting(true);
      try {
        // 원본 테스트 데이터의 calculateResult 함수 사용
        const originalData = getTestByCode(testCode);
        if (!originalData) throw new Error('Test data not found');
        
        const result = originalData.calculateResult(nextAnswers);
        console.log('[DEBUG] 저장 시도:', { testCode, nextAnswers, result });
        // undefined 필드 제거
        const cleanedAnswers = nextAnswers.map(ans => removeUndefined(ans));
        const cleanedResultType = result.type ?? "";
        const docRef = await addDoc(collection(db, "results"), {
          testCode,
          answers: cleanedAnswers,
          resultType: cleanedResultType,
          userId: session?.user?.id || null,
          userNickname: session?.user?.nickname || session?.user?.name || null,
          createdAt: new Date(),
        });
        console.log('[DEBUG] 저장 성공:', docRef.id);
        
        // 경험치 지급 (로그인된 사용자만)
        if (session?.user?.id) {
          try {
            // 현재 사용자 데이터 조회
            const currentUserData = await getUserFromFirestore(session.user.id);
            
            // 테스트 완료 경험치 지급
            const levelUpResult = await giveExpForTestCompletion(
              session.user.id, 
              testCode, 
              currentUserData || undefined
            );
            
            console.log('✅ 경험치 지급 완료:', levelUpResult);
            
            // 레벨업했다면 결과 페이지에서 모달을 띄우기 위해 URL 파라미터 추가
            if (levelUpResult.leveledUp) {
              router.push(`/t/${testCode}/result/${docRef.id}?levelUp=true&newLevel=${levelUpResult.newLevel}&expGained=${levelUpResult.expGained}`);
            } else {
              router.push(`/t/${testCode}/result/${docRef.id}?expGained=${levelUpResult.expGained}`);
            }
          } catch (expError) {
            console.error('경험치 지급 오류:', expError);
            // 경험치 지급 실패해도 결과 페이지로는 이동
            router.push(`/t/${testCode}/result/${docRef.id}`);
          }
        } else {
          router.push(`/t/${testCode}/result/${docRef.id}`);
        }
      } catch (e) {
        console.error('[DEBUG] 저장 에러:', e);
        setError(t('test.saveError'));
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-red-400">
        {error}
      </div>
    );

  // 시작 전 화면
  if (!started) {
    return (
      <div className={`min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b ${TEST_DATA.bgGradient} rounded-xl shadow p-6 sm:p-10 mt-4 mb-8`}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: TEST_DATA.mainColor }}>{TEST_DATA.title}</h1>
        <p className="text-gray-700 mb-8 text-center">{TEST_DATA.description}</p>
        <button
          className="px-8 py-3 rounded-full text-lg font-semibold shadow bg-white border-2 hover:shadow-lg transition-shadow"
          style={{ borderColor: TEST_DATA.mainColor, color: TEST_DATA.mainColor }}
          onClick={() => {
            if (analytics) logEvent(analytics, "test_start", { test_code: testCode });
            setStarted(true);
          }}
        >
          {t('test.startTest')}
        </button>
      </div>
    );
  }

  // 질문 진행 화면
  const q = TEST_DATA.questions[current];
  return (
    <div className={`min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b ${TEST_DATA.bgGradient} rounded-xl shadow p-6 sm:p-10 mt-4 mb-8`}>
      <ProgressBar current={current + 1} total={TEST_DATA.questions.length} color={TEST_DATA.mainColor} />
      <div className="text-center text-base font-bold mb-2" style={{ color: TEST_DATA.mainColor }}>
        {current + 1} / {TEST_DATA.questions.length}
      </div>
      <Question
        question={q.question}
        options={q.options as QuestionOption[]}
        onSelect={(value, score, type) => handleSelect(value, score, type)}
        disabled={submitting}
        color={TEST_DATA.mainColor}
      />
    </div>
  );
} 