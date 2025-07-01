import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { UserData } from "./userAuth";

// 경험치 및 레벨 관련 인터페이스
export interface LevelUpResult {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  expGained: number;
  totalExp: number;
}

export interface ExpGainData {
  source: "test_completion" | "mini_game" | "bonus";
  expAmount: number;
  metadata?: Record<string, any>;
}

/**
 * 레벨별 필요 경험치 계산
 * 1레벨: 10exp, 2레벨: 20exp, 3레벨: 30exp, ...
 */
export function getExpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return level * 10;
}

/**
 * 총 경험치를 기반으로 현재 레벨 계산
 */
export function calculateLevelFromExp(totalExp: number): number {
  if (totalExp < 10) return 1;
  
  let level = 1;
  let expUsed = 0;
  
  while (expUsed + getExpRequiredForLevel(level + 1) <= totalExp) {
    expUsed += getExpRequiredForLevel(level + 1);
    level++;
  }
  
  return level;
}

/**
 * 현재 레벨에서 다음 레벨까지 필요한 경험치 계산
 */
export function getExpToNextLevel(currentExp: number, currentLevel: number): {
  currentLevelExp: number;
  expToNext: number;
  nextLevelRequirement: number;
} {
  const nextLevel = currentLevel + 1;
  const nextLevelRequirement = getExpRequiredForLevel(nextLevel);
  
  // 현재 레벨을 위해 사용된 총 경험치
  let expUsedForCurrentLevel = 0;
  for (let i = 2; i <= currentLevel; i++) {
    expUsedForCurrentLevel += getExpRequiredForLevel(i);
  }
  
  // 현재 레벨에서의 경험치
  const currentLevelExp = currentExp - expUsedForCurrentLevel;
  
  // 다음 레벨까지 필요한 경험치
  const expToNext = nextLevelRequirement - currentLevelExp;
  
  return {
    currentLevelExp,
    expToNext: Math.max(0, expToNext),
    nextLevelRequirement,
  };
}

/**
 * 경험치 진행률 계산 (0-100%)
 */
export function calculateExpProgress(currentExp: number, currentLevel: number): number {
  const { currentLevelExp, nextLevelRequirement } = getExpToNextLevel(currentExp, currentLevel);
  
  if (nextLevelRequirement === 0) return 100;
  
  return Math.min(100, (currentLevelExp / nextLevelRequirement) * 100);
}

/**
 * 사용자에게 경험치 지급 및 레벨업 처리
 */
export async function giveExpToUser(
  uid: string,
  expGainData: ExpGainData,
  currentUserData?: UserData
): Promise<LevelUpResult> {
  if (!uid) {
    throw new Error("UID가 필요합니다.");
  }

  // 현재 사용자 데이터에서 경험치/레벨 정보 가져오기
  const currentExp = currentUserData?.exp || 0;
  const currentLevel = currentUserData?.level || 1;
  
  // 새로운 경험치 계산
  const newTotalExp = currentExp + expGainData.expAmount;
  const newLevel = calculateLevelFromExp(newTotalExp);
  
  const leveledUp = newLevel > currentLevel;
  
  // Firebase에 업데이트
  const userRef = doc(db, "users", uid);
  const updateData: Partial<UserData> = {
    exp: newTotalExp,
    level: newLevel,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(userRef, updateData);
  
  console.log("✅ 경험치 지급 완료:", {
    uid,
    source: expGainData.source,
    expGained: expGainData.expAmount,
    oldExp: currentExp,
    newExp: newTotalExp,
    oldLevel: currentLevel,
    newLevel: newLevel,
    leveledUp,
  });

  return {
    leveledUp,
    oldLevel: currentLevel,
    newLevel,
    expGained: expGainData.expAmount,
    totalExp: newTotalExp,
  };
}

/**
 * 테스트 완료 시 경험치 지급
 */
export async function giveExpForTestCompletion(
  uid: string,
  testCode: string,
  currentUserData?: UserData
): Promise<LevelUpResult> {
  const expGainData: ExpGainData = {
    source: "test_completion",
    expAmount: 15, // 테스트 완료 시 15 경험치 지급
    metadata: {
      testCode,
      completedAt: new Date().toISOString(),
    },
  };

  return await giveExpToUser(uid, expGainData, currentUserData);
}

/**
 * 미니게임 완료 시 경험치 지급
 */
export async function giveExpForMiniGameCompletion(
  uid: string,
  gameId: string,
  score: number,
  isPersonalBest: boolean = false,
  currentUserData?: UserData
): Promise<LevelUpResult> {
  // 게임별 기본 경험치와 성과 보너스 계산
  let baseExp = 0; // 기본 경험치
  let bonusExp = 0; // 성과 보너스
  
  if (gameId === 'reaction-time') {
    // 반응속도 게임의 경우 점수(반응시간)가 낮을수록 좋음
    if (score <= 400) {
      baseExp = 5; // 400ms 이내면 5 경험치
    }
    if (score <= 300) {
      baseExp = 20; // 300ms 이내면 20 경험치 (기본 경험치 자체를 20으로)
    }
  }
  
  // 개인 최고기록 갱신시 추가 보너스
  if (isPersonalBest) {
    bonusExp += 5;
  }
  
  const totalExp = baseExp + bonusExp;
  
  const expGainData: ExpGainData = {
    source: "mini_game",
    expAmount: totalExp,
    metadata: {
      gameId,
      score,
      isPersonalBest,
      baseExp,
      bonusExp,
      completedAt: new Date().toISOString(),
    },
  };

  return await giveExpToUser(uid, expGainData, currentUserData);
}

/**
 * 레벨 시스템 통계 정보
 */
export function getLevelSystemStats() {
  const maxLevel = 100; // 최대 레벨 설정
  const stats = [];
  
  let totalExpRequired = 0;
  
  for (let level = 1; level <= maxLevel; level++) {
    const expForThisLevel = getExpRequiredForLevel(level);
    totalExpRequired += expForThisLevel;
    
    stats.push({
      level,
      expRequiredForThisLevel: expForThisLevel,
      totalExpRequired,
    });
  }
  
  return {
    maxLevel,
    levels: stats,
    totalExpForMaxLevel: totalExpRequired,
  };
}

/**
 * 경험치 시스템 디버깅 도구
 */
export function debugExpSystem() {
  console.log("🎮 경험치 시스템 디버깅 정보");
  
  const testCases = [0, 5, 10, 25, 45, 75, 120, 180, 250];
  
  testCases.forEach(exp => {
    const level = calculateLevelFromExp(exp);
    const progress = calculateExpProgress(exp, level);
    const toNext = getExpToNextLevel(exp, level);
    
    console.log(`Exp: ${exp} → Level: ${level} (${progress.toFixed(1)}% to next)`, toNext);
  });
  
  return getLevelSystemStats();
}

/**
 * 간단한 경험치 지급 함수 (backward compatibility)
 * gameUtils.ts에서 사용되는 함수
 */
export async function awardExperience(
  userId: string,
  expAmount: number,
  source: "test_completion" | "mini_game" | "bonus" = "mini_game"
): Promise<void> {
  try {
    const expGainData: ExpGainData = {
      source,
      expAmount,
      metadata: {
        awardedAt: new Date().toISOString(),
      },
    };

    await giveExpToUser(userId, expGainData);
  } catch (error) {
    console.error("경험치 지급 실패:", error);
    throw error;
  }
} 