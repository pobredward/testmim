import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

/**
 * 닉네임 중복 체크
 */
export async function checkNicknameDuplicate(nickname: string, currentUserUID?: string): Promise<boolean> {
  try {
    const normalizedNickname = nickname.trim().toLowerCase();
    const usersRef = collection(db, "users");
    
    // 닉네임이 같은 사용자 검색 (대소문자 구분 없이)
    const q = query(
      usersRef, 
      where("nickname", ">=", normalizedNickname),
      where("nickname", "<=", normalizedNickname + '\uf8ff')
    );
    
    const querySnapshot = await getDocs(q);
    
    // 자기 자신은 제외하고 중복 체크
    const duplicates = querySnapshot.docs.filter(doc => {
      const userData = doc.data();
      return userData.nickname?.toLowerCase() === normalizedNickname && 
             doc.id !== currentUserUID;
    });
    
    return duplicates.length > 0;
  } catch (error) {
    console.error("닉네임 중복 체크 오류:", error);
    return false; // 에러 시 중복이 아닌 것으로 처리
  }
}

/**
 * 닉네임 유효성 검사
 */
export function validateNickname(nickname: string): string | null {
  const trimmed = nickname.trim();
  
  if (!trimmed) {
    return "닉네임을 입력해주세요.";
  }
  
  if (trimmed.length < 2) {
    return "닉네임은 2글자 이상이어야 합니다.";
  }
  
  if (trimmed.length > 20) {
    return "닉네임은 20글자 이하여야 합니다.";
  }
  
  // 특수문자 체크 (한글, 영문, 숫자, 일부 특수문자만 허용)
  const allowedPattern = /^[가-힣a-zA-Z0-9._-]+$/;
  if (!allowedPattern.test(trimmed)) {
    return "닉네임은 한글, 영문, 숫자, '.', '_', '-'만 사용할 수 있습니다.";
  }
  
  // 금지어 체크
  const bannedWords = [
    "admin", "administrator", "관리자", "운영자", 
    "test", "테스트", "null", "undefined",
    "시발", "씨발", "개새끼", "병신"
  ];
  
  const lowerNickname = trimmed.toLowerCase();
  for (const banned of bannedWords) {
    if (lowerNickname.includes(banned.toLowerCase())) {
      return "사용할 수 없는 단어가 포함되어 있습니다.";
    }
  }
  
  return null; // 유효함
}

/**
 * 대안 닉네임 제안
 */
export function suggestAlternativeNicknames(originalNickname: string): string[] {
  const base = originalNickname.trim();
  const suggestions: string[] = [];
  
  // 숫자 추가
  for (let i = 1; i <= 3; i++) {
    suggestions.push(`${base}${i}`);
  }
  
  // 년도 추가
  const currentYear = new Date().getFullYear();
  suggestions.push(`${base}${currentYear}`);
  
  // 랜덤 숫자 추가
  const randomNum = Math.floor(Math.random() * 999) + 1;
  suggestions.push(`${base}${randomNum}`);
  
  // 언더스코어 추가
  suggestions.push(`${base}_`);
  suggestions.push(`_${base}`);
  
  return suggestions.slice(0, 5); // 최대 5개 제안
} 