import { db } from "@/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Firebase 환경 변수 확인
 */
export function checkFirebaseEnvVars(): { [key: string]: boolean } {
  const envVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  console.log("🔧 Firebase 환경 변수 확인:", envVars);
  
  const missingVars = Object.entries(envVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error("❌ 누락된 Firebase 환경 변수:", missingVars);
  } else {
    console.log("✅ 모든 Firebase 환경 변수가 설정되었습니다.");
  }

  return envVars;
}

/**
 * Firestore 연결 테스트
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    if (!db) {
      console.error("❌ Firestore DB 인스턴스가 없습니다.");
      return false;
    }

    // 테스트 문서 생성 및 읽기
    const testDocRef = doc(db, "test", "connection-test");
    const testData = {
      timestamp: new Date(),
      test: true,
    };

    // 쓰기 테스트
    await setDoc(testDocRef, testData);
    console.log("✅ Firestore 쓰기 테스트 성공");

    // 읽기 테스트
    const docSnap = await getDoc(testDocRef);
    if (docSnap.exists()) {
      console.log("✅ Firestore 읽기 테스트 성공:", docSnap.data());
      return true;
    } else {
      console.error("❌ Firestore 읽기 테스트 실패: 문서가 존재하지 않음");
      return false;
    }
  } catch (error) {
    console.error("❌ Firestore 연결 테스트 실패:", error);
    return false;
  }
}

/**
 * Firebase 전체 상태 진단
 */
export async function diagnoseFirebase(): Promise<void> {
  console.log("🔍 Firebase 상태 진단 시작...");
  
  // 1. 환경 변수 확인
  const envStatus = checkFirebaseEnvVars();
  
  // 2. Firestore 연결 테스트
  const connectionStatus = await testFirestoreConnection();
  
  // 3. 결과 요약
  console.log("📋 Firebase 상태 진단 결과:", {
    환경변수: Object.values(envStatus).every(Boolean) ? "✅ 정상" : "❌ 누락 있음",
    Firestore연결: connectionStatus ? "✅ 정상" : "❌ 실패",
  });
}

/**
 * 사용자 생성 시뮬레이션 (디버깅용)
 */
export async function simulateUserCreation(testEmail: string): Promise<void> {
  try {
    const testUID = `test_${Date.now()}`;
    const testUserRef = doc(db, "users", testUID);
    
    const userData = {
      uid: testUID,
      email: testEmail,
      name: "테스트 사용자",
      provider: "google",
      providerId: "test123",
      nickname: "",
      birthDate: "",
      gender: "",
      bio: "",
      onboardingCompleted: false,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    };

    await setDoc(testUserRef, userData);
    console.log("✅ 테스트 사용자 생성 성공:", { uid: testUID, email: testEmail });

    // 생성된 사용자 확인
    const userDoc = await getDoc(testUserRef);
    if (userDoc.exists()) {
      console.log("✅ 테스트 사용자 조회 성공:", userDoc.data());
    } else {
      console.error("❌ 테스트 사용자 조회 실패");
    }
  } catch (error) {
    console.error("❌ 테스트 사용자 생성 실패:", error);
  }
} 