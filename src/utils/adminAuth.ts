import { getSession } from "next-auth/react";
import { collection, getDocs, query, orderBy, limit, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

// 관리자 권한 확인
export async function isAdmin(sessionUserId?: string): Promise<boolean> {
  if (!sessionUserId) return false;
  
  try {
    const userRef = doc(db, "users", sessionUserId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === "admin";
    }
    
    return false;
  } catch (error) {
    console.error("관리자 권한 확인 오류:", error);
    return false;
  }
}

// 클라이언트에서 관리자 권한 확인
export async function checkAdminAccess(): Promise<boolean> {
  const session = await getSession();
  if (!session?.user?.id) return false;
  
  return session.user.role === "admin";
}

// 모든 사용자 조회 (관리자용)
export async function getAllUsers() {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("사용자 목록 조회 오류:", error);
    throw error;
  }
}

// 테스트 통계 조회
export async function getTestStatistics() {
  try {
    const resultsRef = collection(db, "results");
    const resultsSnapshot = await getDocs(resultsRef);
    
    // 테스트별 참여자 수 계산
    const testStats: { [testCode: string]: number } = {};
    
    resultsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const testCode = data.testCode;
      if (testCode) {
        testStats[testCode] = (testStats[testCode] || 0) + 1;
      }
    });
    
    return testStats;
  } catch (error) {
    console.error("테스트 통계 조회 오류:", error);
    throw error;
  }
}

// 특정 테스트의 상세 결과 조회
export async function getTestDetailedStats(testCode: string) {
  try {
    const resultsRef = collection(db, "results");
    const q = query(
      resultsRef, 
      where("testCode", "==", testCode), 
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("테스트 상세 통계 조회 오류:", error);
    throw error;
  }
} 