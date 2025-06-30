import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { GameResult } from '../types/games';
import { awardExperience } from './expLevel';

export const saveGameResult = async (gameResult: GameResult, isPersonalBest: boolean = false): Promise<boolean> => {
  try {
    const resultRef = doc(collection(db, 'gameResults'));
    const resultWithTimestamp = {
      ...gameResult,
      isPersonalBest,
      completedAt: serverTimestamp(),
    };
    
    await setDoc(resultRef, resultWithTimestamp);
    
    // Award experience points only for personal bests
    if (isPersonalBest) {
      await awardExperience(gameResult.userId, gameResult.experienceGained);
    }
    
    return true;
  } catch (error) {
    console.error('게임 결과 저장 오류:', error);
    return false;
  }
};

// Get user's best score for a specific game
export const getUserBestScore = async (userId: string, gameId: string): Promise<number | null> => {
  try {
    const gameResultsRef = collection(db, 'gameResults');
    const q = query(
      gameResultsRef,
      where('userId', '==', userId),
      where('gameId', '==', gameId),
      where('isPersonalBest', '==', true),
      orderBy('score', gameId === 'reaction-time' ? 'asc' : 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const bestResult = querySnapshot.docs[0].data();
      return bestResult.score;
    }
    
    return null;
  } catch (error) {
    console.error('사용자 최고 점수 조회 오류:', error);
    return null;
  }
};

// Get user's total play count for a specific game
export const getUserGamePlayCount = async (userId: string, gameId: string): Promise<number> => {
  try {
    const gameResultsRef = collection(db, 'gameResults');
    const q = query(
      gameResultsRef,
      where('userId', '==', userId),
      where('gameId', '==', gameId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('사용자 게임 플레이 횟수 조회 오류:', error);
    return 0;
  }
};

// Get user's personal best records across all games
export const getUserPersonalBests = async (userId: string): Promise<any[]> => {
  try {
    const gameResultsRef = collection(db, 'gameResults');
    const q = query(
      gameResultsRef,
      where('userId', '==', userId),
      where('isPersonalBest', '==', true),
      orderBy('completedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('사용자 개인 최고 기록 조회 오류:', error);
    return [];
  }
};

// Get Korean date in YYYY-MM-DD format
export const getKoreanDate = (): string => {
  const now = new Date();
  const koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
  return koreanTime.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Get user's daily play count for a specific game
export const getUserDailyPlayCount = async (userId: string, gameId: string): Promise<number> => {
  try {
    const dailyPlayRef = doc(db, 'dailyPlayCounts', userId);
    const dailyPlayDoc = await getDoc(dailyPlayRef);
    
    const today = getKoreanDate();
    
    if (dailyPlayDoc.exists()) {
      const data = dailyPlayDoc.data();
      const lastPlayDate = data.lastPlayDate;
      const gamePlayCounts = data.gamePlayCounts || {};
      
      // If date has changed, reset count for this game
      if (lastPlayDate !== today) {
        return 0;
      }
      
      return gamePlayCounts[gameId] || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('일일 플레이 횟수 조회 오류:', error);
    return 0;
  }
};

// Increment user's daily play count for a specific game
export const incrementUserDailyPlayCount = async (userId: string, gameId: string): Promise<number> => {
  try {
    const dailyPlayRef = doc(db, 'dailyPlayCounts', userId);
    const dailyPlayDoc = await getDoc(dailyPlayRef);
    
    const today = getKoreanDate();
    let newCount = 1;
    
    if (dailyPlayDoc.exists()) {
      const data = dailyPlayDoc.data();
      const lastPlayDate = data.lastPlayDate;
      const gamePlayCounts = data.gamePlayCounts || {};
      
      if (lastPlayDate === today) {
        // Same day, increment count
        newCount = (gamePlayCounts[gameId] || 0) + 1;
      } else {
        // New day, reset count to 1
        newCount = 1;
      }
      
      // Update the document
      await updateDoc(dailyPlayRef, {
        lastPlayDate: today,
        [`gamePlayCounts.${gameId}`]: newCount,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new document
      await setDoc(dailyPlayRef, {
        userId,
        lastPlayDate: today,
        gamePlayCounts: {
          [gameId]: newCount,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    
    return newCount;
  } catch (error) {
    console.error('일일 플레이 횟수 증가 오류:', error);
    throw error;
  }
};

// Check if user can play (hasn't reached daily limit)
export const canUserPlay = async (userId: string, gameId: string, dailyLimit: number = 5): Promise<{ canPlay: boolean; currentCount: number }> => {
  try {
    const currentCount = await getUserDailyPlayCount(userId, gameId);
    return {
      canPlay: currentCount < dailyLimit,
      currentCount,
    };
  } catch (error) {
    console.error('플레이 가능 여부 확인 오류:', error);
    return { canPlay: true, currentCount: 0 };
  }
};

export async function getGameLeaderboard(gameId: string, limitCount: number = 10): Promise<any[]> {
  try {
    console.log('Fetching leaderboard for gameId:', gameId);
    const gameResultsRef = collection(db, 'gameResults');
    
    // Query only personal best records for this game
    const personalBestQuery = query(
      gameResultsRef,
      where('gameId', '==', gameId),
      where('isPersonalBest', '==', true),
      limit(limitCount * 2) // Get more results in case we need to filter duplicates
    );
    
    const querySnapshot = await getDocs(personalBestQuery);
    console.log('Found personal best documents:', querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.log('No personal best documents found for gameId:', gameId);
      return [];
    }
    
    // Get all personal best results
    const results = querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        ...data
      };
    });
    
    console.log('Raw personal best results:', results);
    
    // Remove duplicate users (keep the best score for each user)
    const uniqueResults = new Map();
    results.forEach(result => {
      const existingResult = uniqueResults.get(result.userId);
      if (!existingResult) {
        uniqueResults.set(result.userId, result);
      } else {
        // For reaction-time, lower is better; for others, higher is better
        const isBetter = gameId === 'reaction-time' 
          ? result.score < existingResult.score 
          : result.score > existingResult.score;
        
        if (isBetter) {
          uniqueResults.set(result.userId, result);
        }
      }
    });
    
    // Convert back to array and sort
    const uniqueResultsArray = Array.from(uniqueResults.values());
    const sortedResults = uniqueResultsArray.sort((a, b) => {
      if (gameId === 'reaction-time') {
        return a.score - b.score; // Lower is better
      } else {
        return b.score - a.score; // Higher is better
      }
    });
    
    const leaderboard = sortedResults.slice(0, limitCount).map((data, index) => {
      // Use stored userName or fallback to userId-based name
      const userName = data.userName || 
                      data.userId?.split('@')[0] || 
                      `Player ${data.userId?.substring(0, 8) || 'Unknown'}`;

      return {
        userId: data.userId,
        userName,
        score: data.score,
        details: data.details || {},
        completedAt: data.completedAt?.toDate?.()?.toISOString() || data.completedAt || new Date().toISOString(),
        rank: index + 1,
      };
    });

    console.log('Final leaderboard:', leaderboard);
    return leaderboard;
  } catch (error) {
    console.error('Failed to fetch game leaderboard:', error);
    return [];
  }
}

export const formatGameDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}분 ${remainingSeconds}초`;
  }
  return `${remainingSeconds}초`;
};

export const getScoreRating = (score: number, gameId: string): string => {
  // This can be customized based on each game's scoring system
  switch (gameId) {
    case 'reaction-time':
      if (score < 300) return '완벽!';
      if (score < 500) return '훌륭!';
      if (score < 700) return '좋음';
      if (score < 1000) return '보통';
      return '연습 필요';
    
    case 'number-memory':
      if (score >= 8) return '천재!';
      if (score >= 6) return '우수!';
      if (score >= 4) return '좋음';
      if (score >= 3) return '보통';
      return '연습 필요';
    
    case 'color-matching':
      if (score >= 90) return '완벽!';
      if (score >= 80) return '훌륭!';
      if (score >= 70) return '좋음';
      if (score >= 60) return '보통';
      return '연습 필요';
    
    default:
      return '완료';
  }
}; 