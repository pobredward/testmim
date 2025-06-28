"use client";

import { useState } from 'react';
import { 
  getExpRequiredForLevel, 
  calculateLevelFromExp,
  giveExpForTestCompletion,
  debugExpSystem 
} from '@/utils/expLevel';
import { getUserFromFirestore } from '@/utils/userAuth';
import { useSession } from 'next-auth/react';

export default function ExpSystemDebugPage() {
  const { data: session } = useSession();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // 기본 함수 테스트
  const testBasicFunctions = () => {
    addResult("=== 기본 함수 테스트 시작 ===");
    
    // 레벨별 필요 경험치 테스트
    for (let level = 1; level <= 10; level++) {
      const requiredExp = getExpRequiredForLevel(level);
      addResult(`레벨 ${level} 필요 경험치: ${requiredExp}`);
    }
    
    // 경험치별 레벨 계산 테스트
    const testExpValues = [0, 5, 10, 15, 30, 60, 100, 150, 210];
    for (const exp of testExpValues) {
      const calculatedLevel = calculateLevelFromExp(exp);
      addResult(`경험치 ${exp} → 레벨 ${calculatedLevel}`);
    }
    
    addResult("=== 기본 함수 테스트 완료 ===");
  };

  // 경계값 테스트
  const testBoundaryValues = () => {
    addResult("=== 경계값 테스트 시작 ===");
    
    // 레벨업 임계점 테스트
    const boundaryTests = [
      { exp: 9, expectedLevel: 1, description: "레벨 1 → 2 직전" },
      { exp: 10, expectedLevel: 2, description: "레벨 1 → 2 정확히" },
      { exp: 11, expectedLevel: 2, description: "레벨 2에서 1 경험치" },
      { exp: 29, expectedLevel: 2, description: "레벨 2 → 3 직전" },
      { exp: 30, expectedLevel: 3, description: "레벨 2 → 3 정확히" },
      { exp: 59, expectedLevel: 3, description: "레벨 3 → 4 직전" },
      { exp: 60, expectedLevel: 4, description: "레벨 3 → 4 정확히" },
    ];
    
    for (const test of boundaryTests) {
      const actualLevel = calculateLevelFromExp(test.exp);
      const passed = actualLevel === test.expectedLevel;
      addResult(`${passed ? '✅' : '❌'} ${test.description}: 경험치 ${test.exp} → 레벨 ${actualLevel} (예상: ${test.expectedLevel})`);
    }
    
    addResult("=== 경계값 테스트 완료 ===");
  };

  // 디버깅 시스템 테스트
  const testDebugSystem = () => {
    addResult("=== 디버깅 시스템 테스트 시작 ===");
    
    try {
      // debugExpSystem 함수는 매개변수를 받지 않음
      const debugInfo = debugExpSystem();
      addResult(`디버깅 정보: ${JSON.stringify(debugInfo, null, 2)}`);
      
      // 추가 테스트: 특정 경험치 값들에 대한 레벨 계산
      const testExpValues = [0, 15, 30, 60, 100, 150, 210, 300];
      for (const exp of testExpValues) {
        const level = calculateLevelFromExp(exp);
        addResult(`경험치 ${exp} → 레벨 ${level}`);
      }
    } catch (error) {
      addResult(`❌ 디버깅 시스템 오류: ${error}`);
    }
    
    addResult("=== 디버깅 시스템 테스트 완료 ===");
  };

  // 실제 경험치 지급 테스트
  const testRealExpGiving = async () => {
    if (!session?.user?.id) {
      addResult("❌ 로그인이 필요합니다.");
      return;
    }

    addResult("=== 실제 경험치 지급 테스트 시작 ===");
    setLoading(true);

    try {
      // 현재 사용자 정보 조회
      const currentUserData = await getUserFromFirestore(session.user.id);
      addResult(`현재 사용자 정보: 레벨 ${currentUserData?.level || 1}, 경험치 ${currentUserData?.exp || 0}`);

      // 테스트용 경험치 지급
      const result = await giveExpForTestCompletion(
        session.user.id,
        "test_debug", // 디버깅용 테스트 코드
        currentUserData || undefined
      );

      addResult(`경험치 지급 결과: ${JSON.stringify(result, null, 2)}`);
      
      if (result.leveledUp) {
        addResult(`🎉 레벨업! ${result.oldLevel} → ${result.newLevel}`);
      }
    } catch (error) {
      addResult(`❌ 경험치 지급 오류: ${error}`);
    } finally {
      setLoading(false);
    }
    
    addResult("=== 실제 경험치 지급 테스트 완료 ===");
  };

  // 성능 테스트
  const testPerformance = () => {
    addResult("=== 성능 테스트 시작 ===");
    
    const iterations = 1000;
    
    // 레벨 계산 성능 테스트
    const start1 = performance.now();
    for (let i = 0; i < iterations; i++) {
      calculateLevelFromExp(Math.floor(Math.random() * 1000));
    }
    const end1 = performance.now();
    addResult(`레벨 계산 ${iterations}회: ${(end1 - start1).toFixed(2)}ms`);
    
    // 필요 경험치 계산 성능 테스트
    const start2 = performance.now();
    for (let i = 0; i < iterations; i++) {
      getExpRequiredForLevel(Math.floor(Math.random() * 50) + 1);
    }
    const end2 = performance.now();
    addResult(`필요 경험치 계산 ${iterations}회: ${(end2 - start2).toFixed(2)}ms`);
    
    addResult("=== 성능 테스트 완료 ===");
  };

  // 모든 테스트 실행
  const runAllTests = async () => {
    clearResults();
    addResult("🚀 전체 테스트 시작");
    
    testBasicFunctions();
    testBoundaryValues();
    testDebugSystem();
    testPerformance();
    
    if (session?.user?.id) {
      await testRealExpGiving();
    } else {
      addResult("⚠️ 실제 경험치 지급 테스트는 로그인이 필요합니다.");
    }
    
    addResult("✅ 전체 테스트 완료");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            🧪 경험치 시스템 테스트 도구
          </h1>
          
          {/* 사용자 정보 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">현재 사용자</h2>
            {session?.user ? (
              <p className="text-blue-700">
                {session.user.name} ({session.user.email})
              </p>
            ) : (
              <p className="text-blue-700">로그인하지 않음</p>
            )}
          </div>

          {/* 테스트 버튼들 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={testBasicFunctions}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              기본 함수 테스트
            </button>
            
            <button
              onClick={testBoundaryValues}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              경계값 테스트
            </button>
            
            <button
              onClick={testDebugSystem}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              디버깅 시스템
            </button>
            
            <button
              onClick={testRealExpGiving}
              disabled={!session?.user?.id || loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '실행중...' : '실제 지급 테스트'}
            </button>
            
            <button
              onClick={testPerformance}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              성능 테스트
            </button>
            
            <button
              onClick={runAllTests}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '실행중...' : '전체 테스트'}
            </button>
          </div>

          {/* 컨트롤 버튼들 */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              결과 지우기
            </button>
          </div>

          {/* 테스트 결과 */}
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            <h3 className="text-white font-bold mb-4">테스트 결과:</h3>
            {testResults.length === 0 ? (
              <p className="text-gray-500">테스트를 실행해주세요.</p>
            ) : (
              <div>
                {testResults.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 안내 메시지 */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">사용 안내</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• 기본 함수 테스트: 레벨/경험치 계산 함수들의 정확성 검증</li>
              <li>• 경계값 테스트: 레벨업 임계점에서의 정확한 동작 확인</li>
              <li>• 실제 지급 테스트: Firebase 연동하여 실제 경험치 지급 (로그인 필요)</li>
              <li>• 성능 테스트: 대량 계산 시의 성능 측정</li>
              <li>• 전체 테스트: 모든 테스트를 순차적으로 실행</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 