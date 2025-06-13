"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { diagnoseFirebase, simulateUserCreation, checkFirebaseEnvVars, testFirestoreConnection } from "@/utils/firebaseDebug";

export default function FirebaseDebugPage() {
  const { data: session } = useSession();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addLog = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runDiagnosis = async () => {
    setIsRunning(true);
    setResults([]);
    
    addLog("Firebase 진단을 시작합니다...");
    
    try {
      // 환경 변수 확인
      addLog("환경 변수를 확인합니다...");
      const envVars = checkFirebaseEnvVars();
      const missingVars = Object.entries(envVars).filter(([_, value]) => !value).map(([key]) => key);
      
      if (missingVars.length > 0) {
        addLog(`❌ 누락된 환경 변수: ${missingVars.join(", ")}`);
      } else {
        addLog("✅ 모든 환경 변수가 설정되었습니다.");
      }

      // Firestore 연결 테스트
      addLog("Firestore 연결을 테스트합니다...");
      const connectionStatus = await testFirestoreConnection();
      
      if (connectionStatus) {
        addLog("✅ Firestore 연결이 성공했습니다.");
      } else {
        addLog("❌ Firestore 연결에 실패했습니다.");
      }

      // 전체 진단 실행
      await diagnoseFirebase();
      addLog("🎯 Firebase 진단이 완료되었습니다. 개발자 도구 콘솔을 확인하세요.");
      
    } catch (error) {
      addLog(`❌ 진단 중 오류 발생: ${error}`);
      console.error("Firebase 진단 오류:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const runUserCreationTest = async () => {
    setIsRunning(true);
    addLog("테스트 사용자 생성을 시작합니다...");
    
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      await simulateUserCreation(testEmail);
      addLog(`✅ 테스트 사용자 생성 완료: ${testEmail}`);
    } catch (error) {
      addLog(`❌ 테스트 사용자 생성 실패: ${error}`);
      console.error("테스트 사용자 생성 오류:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearLogs = () => {
    setResults([]);
  };

  // 관리자가 아닌 경우 접근 제한
  if (!session?.user || session.user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">접근 제한</h1>
          <p className="text-gray-600">이 페이지는 관리자만 접근할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">🔧 Firebase 디버그 도구</h1>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={runDiagnosis}
              disabled={isRunning}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
            >
              {isRunning ? "진단 중..." : "Firebase 전체 진단"}
            </button>
            
            <button
              onClick={runUserCreationTest}
              disabled={isRunning}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors ml-2"
            >
              {isRunning ? "테스트 중..." : "사용자 생성 테스트"}
            </button>
            
            <button
              onClick={clearLogs}
              disabled={isRunning}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors ml-2"
            >
              로그 지우기
            </button>
          </div>

          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            <h3 className="text-green-300 mb-2">💻 실행 로그:</h3>
            {results.length === 0 ? (
              <p className="text-gray-500">로그가 없습니다. 위 버튼을 클릭하여 테스트를 실행하세요.</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 사용 방법:</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• <strong>Firebase 전체 진단:</strong> 환경 변수 및 Firestore 연결 상태를 확인합니다.</li>
              <li>• <strong>사용자 생성 테스트:</strong> 실제로 Firestore에 테스트 사용자를 생성해봅니다.</li>
              <li>• 상세한 로그는 브라우저 개발자 도구의 콘솔에서 확인할 수 있습니다.</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">🔍 현재 세션 정보:</h3>
            <pre className="text-blue-700 text-sm">
              {JSON.stringify(
                {
                  uid: session.user.id,
                  email: session.user.email,
                  provider: session.user.provider,
                  onboardingCompleted: session.user.onboardingCompleted,
                  role: session.user.role,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 