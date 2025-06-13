import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

export interface UserData {
  uid: string;
  email: string;
  name?: string;
  image?: string;
  provider: string;
  providerId: string;
  nickname?: string;
  birthDate?: string;
  gender?: string;
  bio?: string;
  onboardingCompleted?: boolean;
  role?: "admin" | "user";
  createdAt?: any;
  updatedAt?: any;
  lastLoginAt?: any;
}

/**
 * 새 사용자를 Firestore에 생성
 */
export async function createUserInFirestore(userData: Partial<UserData>): Promise<void> {
  if (!userData.uid || !userData.email) {
    throw new Error("UID와 이메일은 필수입니다.");
  }

  const userRef = doc(db, "users", userData.uid);
  
  const newUserData: UserData = {
    uid: userData.uid,
    email: userData.email,
    name: userData.name || "",
    image: userData.image || "",
    provider: userData.provider || "unknown",
    providerId: userData.providerId || "",
    // 온보딩 관련 필드 초기화
    nickname: "",
    birthDate: "",
    gender: "",
    bio: "",
    onboardingCompleted: false,
    // 권한 관련 필드
    role: "user",
    // 시간 필드
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  await setDoc(userRef, newUserData);
  
  console.log("✅ 새 사용자 생성 완료:", {
    uid: userData.uid,
    email: userData.email,
    provider: userData.provider
  });
}

/**
 * 기존 사용자 정보 업데이트 (로그인 시)
 */
export async function updateUserLoginInfo(uid: string, updates: Partial<UserData>): Promise<void> {
  if (!uid) {
    throw new Error("UID가 필요합니다.");
  }

  const userRef = doc(db, "users", uid);
  
  const updateData = {
    ...updates,
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, updateData, { merge: true });
  
  console.log("🔄 사용자 로그인 정보 업데이트 완료:", {
    uid,
    updates: Object.keys(updates)
  });
}

/**
 * 온보딩 정보 업데이트
 */
export async function updateUserOnboarding(
  uid: string, 
  onboardingData: {
    nickname: string;
    birthDate: string;
    gender: string;
    bio?: string;
  }
): Promise<void> {
  if (!uid) {
    throw new Error("UID가 필요합니다.");
  }

  const userRef = doc(db, "users", uid);
  
  const updateData = {
    nickname: onboardingData.nickname.trim(),
    birthDate: onboardingData.birthDate,
    gender: onboardingData.gender,
    bio: onboardingData.bio?.trim() || "",
    onboardingCompleted: true,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(userRef, updateData);
  
  console.log("✅ 온보딩 정보 업데이트 완료:", {
    uid,
    nickname: onboardingData.nickname
  });
}

/**
 * 사용자 정보 조회
 */
export async function getUserFromFirestore(uid: string): Promise<UserData | null> {
  if (!uid) {
    throw new Error("UID가 필요합니다.");
  }

  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  }

  return null;
}

/**
 * 사용자 존재 여부 확인
 */
export async function checkUserExists(uid: string): Promise<boolean> {
  if (!uid) {
    return false;
  }

  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  } catch (error) {
    console.error("사용자 존재 확인 오류:", error);
    return false;
  }
}

/**
 * 고유 UID 생성 (소셜 제공자 기반)
 */
export function generateUniqueUID(provider: string, providerId: string): string {
  return `${provider}_${providerId}`;
}

/**
 * Firebase 연결 상태 확인
 */
export function checkFirebaseConnection(): boolean {
  try {
    return !!db;
  } catch (error) {
    console.error("Firebase 연결 확인 오류:", error);
    return false;
  }
} 