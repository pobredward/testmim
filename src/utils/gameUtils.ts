import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { GameResult, GameStats, UserGameStats } from '../types/games';
import { awardExperience } from './expLevel';

export const saveGameResult = async (gameResult: GameResult): Promise<boolean> => {
  try {
    const resultRef = doc(collection(db, 'gameResults'));
    const resultWithTimestamp = {
      ...gameResult,
      completedAt: serverTimestamp(),
    };
    
    await setDoc(resultRef, resultWithTimestamp);
    
    // Update user game stats
    await updateUserGameStats(gameResult);
    
    // Award experience points
    await awardExperience(gameResult.userId, gameResult.experienceGained);
    
    return true;
  } catch (error) {
    console.error('게임 결과 저장 오류:', error);
    return false;
  }
};

export const updateUserGameStats = async (gameResult: GameResult): Promise<void> => {
  try {
    const userStatsRef = doc(db, 'userGameStats', gameResult.userId);
    const userStatsDoc = await getDoc(userStatsRef);
    
    if (userStatsDoc.exists()) {
      const currentStats = userStatsDoc.data() as UserGameStats;
      const gameStats = currentStats.gameStats[gameResult.gameId] || {
        gameId: gameResult.gameId,
        totalPlays: 0,
        bestScore: 0,
        averageScore: 0,
        totalExperienceGained: 0,
      };
      
      // Update game-specific stats
      const newTotalPlays = gameStats.totalPlays + 1;
      const newBestScore = Math.max(gameStats.bestScore, gameResult.score);
      const newTotalExp = gameStats.totalExperienceGained + gameResult.experienceGained;
      const newAverageScore = ((gameStats.averageScore * gameStats.totalPlays) + gameResult.score) / newTotalPlays;
      
      const updatedGameStats = {
        ...gameStats,
        totalPlays: newTotalPlays,
        bestScore: newBestScore,
        averageScore: Math.round(newAverageScore),
        totalExperienceGained: newTotalExp,
        lastPlayedAt: new Date().toISOString(),
      };
      
      // Update overall user stats
      const updatedUserStats: UserGameStats = {
        ...currentStats,
        gameStats: {
          ...currentStats.gameStats,
          [gameResult.gameId]: updatedGameStats,
        },
        totalGamesPlayed: currentStats.totalGamesPlayed + 1,
        totalExperienceFromGames: currentStats.totalExperienceFromGames + gameResult.experienceGained,
      };
      
      // Update favorite game if this game has more plays
      const favoriteGame = Object.entries(updatedUserStats.gameStats)
        .reduce((prev, [gameId, stats]) => 
          stats.totalPlays > (updatedUserStats.gameStats[prev]?.totalPlays || 0) ? gameId : prev
        , gameResult.gameId);
      
      updatedUserStats.favoriteGameId = favoriteGame;
      
      await updateDoc(userStatsRef, updatedUserStats as any);
    } else {
      // Create new user game stats
      const newUserStats: UserGameStats = {
        userId: gameResult.userId,
        gameStats: {
          [gameResult.gameId]: {
            gameId: gameResult.gameId,
            totalPlays: 1,
            bestScore: gameResult.score,
            averageScore: gameResult.score,
            totalExperienceGained: gameResult.experienceGained,
            lastPlayedAt: new Date().toISOString(),
          },
        },
        totalGamesPlayed: 1,
        totalExperienceFromGames: gameResult.experienceGained,
        favoriteGameId: gameResult.gameId,
      };
      
      await setDoc(userStatsRef, newUserStats as any);
    }
  } catch (error) {
    console.error('사용자 게임 통계 업데이트 오류:', error);
    throw error;
  }
};

export const getUserGameStats = async (userId: string): Promise<UserGameStats | null> => {
  try {
    const userStatsRef = doc(db, 'userGameStats', userId);
    const userStatsDoc = await getDoc(userStatsRef);
    
    if (userStatsDoc.exists()) {
      return userStatsDoc.data() as UserGameStats;
    }
    
    return null;
  } catch (error) {
    console.error('사용자 게임 통계 조회 오류:', error);
    return null;
  }
};

export async function getGameLeaderboard(gameId: string, limitCount: number = 10): Promise<any[]> {
  try {
    const gameResultsRef = collection(db, 'game_results');
    const q = query(
      gameResultsRef,
      where('gameId', '==', gameId),
      orderBy('score', gameId === 'reaction-time' ? 'asc' : 'desc'), // For reaction time, lower is better
      limit(limitCount)
    );
    
        const querySnapshot = await getDocs(q);
    const leaderboard = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot, index) => {
        const data = docSnapshot.data();
        
        // Get user display name
        let userName = 'Unknown';
        if (data.userId) {
          try {
            const userRef = doc(db, 'users', data.userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data() as any;
              userName = userData.displayName || userData.name || userName;
            }
          } catch (error) {
            console.warn('Failed to get user name:', error);
          }
        }

        return {
          userId: data.userId,
          userName,
          score: data.score,
          details: data.details || {},
          completedAt: data.completedAt?.toDate?.()?.toISOString() || data.completedAt,
          rank: index + 1,
        };
      })
    );

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