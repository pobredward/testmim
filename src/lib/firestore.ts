import { db } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { User, UserProfileInput } from '@/types/user';

// 사용자 정보 가져오기
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// 새 사용자 생성
export async function createUser(userData: {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
  providerId: string;
}): Promise<User> {
  const user: Omit<User, 'createdAt' | 'updatedAt'> = {
    ...userData,
    nickname: '',
    gender: undefined,
    isProfileComplete: false,
  };

  try {
    await setDoc(doc(db, 'users', userData.id), {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 생성된 사용자 정보 반환
    const createdUser = await getUserById(userData.id);
    return createdUser!;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// 사용자 프로필 업데이트
export async function updateUserProfile(
  userId: string,
  profileData: UserProfileInput
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      nickname: profileData.nickname,
      gender: profileData.gender,
      isProfileComplete: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// 사용자 정보 업데이트 (일반)
export async function updateUser(
  userId: string,
  updateData: Partial<User>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
} 