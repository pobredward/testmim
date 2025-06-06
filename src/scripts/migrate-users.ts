import { db } from "@/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore";

/**
 * 사용자 컬렉션을 이메일 기반에서 UID 기반으로 마이그레이션
 * 주의: 이 스크립트는 한 번만 실행해야 합니다.
 */
export async function migrateUsersToUID() {
  try {
    console.log("🔄 사용자 데이터 마이그레이션 시작...");
    
    // 기존 users 컬렉션의 모든 문서 조회
    const usersSnapshot = await getDocs(collection(db, "users"));
    
    if (usersSnapshot.empty) {
      console.log("📝 마이그레이션할 사용자 데이터가 없습니다.");
      return;
    }

    const batch = writeBatch(db);
    let migratedCount = 0;
    let skippedCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const oldDocId = userDoc.id; // 현재는 이메일
      
      // UID가 있는 경우에만 마이그레이션
      if (userData.uid && userData.uid !== oldDocId) {
        // 새로운 UID 기반 document 생성
        const newUserRef = doc(db, "users", userData.uid);
        batch.set(newUserRef, userData);
        
        // 기존 이메일 기반 document 삭제 (UID와 다른 경우만)
        const oldUserRef = doc(db, "users", oldDocId);
        batch.delete(oldUserRef);
        
        console.log(`✅ 마이그레이션: ${userData.email} (${oldDocId} → ${userData.uid})`);
        migratedCount++;
      } else {
        console.log(`⏭️  스킵: ${userData.email} (이미 UID 기반이거나 UID 없음)`);
        skippedCount++;
      }
    }

    // 배치 실행
    if (migratedCount > 0) {
      await batch.commit();
      console.log(`🎉 마이그레이션 완료! ${migratedCount}명 마이그레이션, ${skippedCount}명 스킵`);
    } else {
      console.log("📝 마이그레이션할 데이터가 없습니다.");
    }

  } catch (error) {
    console.error("❌ 마이그레이션 오류:", error);
    throw error;
  }
}

/**
 * 중복 사용자 확인 (디버깅용)
 */
export async function checkDuplicateUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const emails = new Map<string, string[]>();
    
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.email) {
        if (!emails.has(data.email)) {
          emails.set(data.email, []);
        }
        emails.get(data.email)!.push(doc.id);
      }
    });

    console.log("📊 사용자 중복 확인:");
    emails.forEach((docIds, email) => {
      if (docIds.length > 1) {
        console.log(`⚠️  중복 발견: ${email} → ${docIds.join(', ')}`);
      }
    });
    
  } catch (error) {
    console.error("❌ 중복 확인 오류:", error);
  }
} 