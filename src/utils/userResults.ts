import { collection, query, where, orderBy, getDocs, doc, getDoc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getTestByCode } from "@/data/tests";

export interface UserTestResult {
  id: string;
  testCode: string;
  testTitle: string;
  testThumbnail: string;
  resultTitle: string;
  resultDescription: string;
  resultImage?: string;
  completedAt: any; // Firestore Timestamp
  shareUrl: string;
}

/**
 * 사용자의 모든 테스트 결과 조회
 */
export async function getUserTestResults(userId: string): Promise<UserTestResult[]> {
  try {
    if (!userId) return [];

    const resultsRef = collection(db, "results");
    const q = query(
      resultsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const results: UserTestResult[] = [];

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const testData = getTestByCode(data.testCode);
      
      if (testData) {
        // 답변으로부터 결과 계산
        const testResult = testData.calculateResult(data.answers);
        
        results.push({
          id: doc.id,
          testCode: data.testCode,
          testTitle: testData.title,
          testThumbnail: testData.thumbnailUrl,
          resultTitle: testResult.title,
          resultDescription: testResult.description,
          resultImage: testResult.image,
          completedAt: data.createdAt,
          shareUrl: `/t/${data.testCode}/result/${doc.id}?from=share`
        });
      }
    }

    return results;
  } catch (error) {
    console.error("사용자 테스트 결과 조회 오류:", error);
    return [];
  }
}

/**
 * 사용자의 테스트 결과 통계
 */
export async function getUserTestStats(userId: string) {
  try {
    const results = await getUserTestResults(userId);
    
    // 카테고리별 통계
    const categoryStats: { [key: string]: number } = {};
    const monthlyStats: { [key: string]: number } = {};
    
    results.forEach(result => {
      const testData = getTestByCode(result.testCode);
      if (testData) {
        // 카테고리별 집계
        categoryStats[testData.category] = (categoryStats[testData.category] || 0) + 1;
        
        // 월별 집계
        const month = new Date(result.completedAt.seconds * 1000).toISOString().slice(0, 7);
        monthlyStats[month] = (monthlyStats[month] || 0) + 1;
      }
    });

    return {
      totalTests: results.length,
      categoryStats,
      monthlyStats,
      recentTests: results.slice(0, 5)
    };
  } catch (error) {
    console.error("사용자 테스트 통계 조회 오류:", error);
    return {
      totalTests: 0,
      categoryStats: {},
      monthlyStats: {},
      recentTests: []
    };
  }
}

/**
 * 테스트 결과 삭제
 */
export async function deleteTestResult(resultId: string, userId: string): Promise<boolean> {
  try {
    if (!resultId || !userId) {
      throw new Error("결과 ID와 사용자 ID가 필요합니다.");
    }

    // 결과 문서 참조
    const resultRef = doc(db, "results", resultId);
    
    // 결과 문서 조회하여 소유자 확인
    const resultDoc = await getDoc(resultRef);
    if (!resultDoc.exists()) {
      throw new Error("결과를 찾을 수 없습니다.");
    }

    const resultData = resultDoc.data();
    if (resultData.userId !== userId) {
      throw new Error("다른 사용자의 결과는 삭제할 수 없습니다.");
    }

    // 결과 삭제
    await deleteDoc(resultRef);
    console.log("테스트 결과가 삭제되었습니다:", resultId);
    return true;
  } catch (error) {
    console.error("테스트 결과 삭제 오류:", error);
    throw error;
  }
}

/**
 * 테스트 결과를 사용자와 연결하여 저장 (기존 결과 저장 로직 수정용)
 */
export async function saveTestResultWithUser(
  testCode: string,
  answers: any[],
  userId?: string,
  userNickname?: string
) {
  try {
    const testData = getTestByCode(testCode);
    if (!testData) throw new Error("테스트를 찾을 수 없습니다.");

    const result = testData.calculateResult(answers);
    const resultData = {
      testCode,
      answers,
      result,
      userId: userId || null,
      userNickname: userNickname || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Firestore에 저장 로직은 기존과 동일하게 처리
    // 이 함수는 기존 저장 로직에서 사용자 정보를 추가로 저장할 때 사용

    return resultData;
  } catch (error) {
    console.error("테스트 결과 저장 오류:", error);
    throw error;
  }
} 