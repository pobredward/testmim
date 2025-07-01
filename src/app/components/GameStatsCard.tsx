"use client";

import React, { useEffect, useState } from 'react';
import { getUserDailyPlayCount, getGameLeaderboard, getUserBestScore } from '@/utils/gameUtils';

interface GameStatsCardProps {
  userId: string;
}

interface GameStats {
  gameId: string;
  gameName: string;
  icon: string;
  dailyPlaysUsed: number;
  dailyPlayLimit: number;
  bestScore: number | null;
  userRank: number | null;
  totalPlayers: number;
}

export default function GameStatsCard({ userId }: GameStatsCardProps) {
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameStats();
  }, [userId]);

  const loadGameStats = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const games = [
        { gameId: 'reaction-time', gameName: '반응속도', icon: '⚡' }
      ];

      const statsPromises = games.map(async (game) => {
        const [dailyPlays, bestScore, leaderboard] = await Promise.all([
          getUserDailyPlayCount(userId, game.gameId),
          getUserBestScore(userId, game.gameId),
          getGameLeaderboard(game.gameId, 100) // 더 많이 가져와서 사용자 순위 찾기
        ]);

        // 사용자 순위 찾기
        const userRank = leaderboard.findIndex(entry => entry.userId === userId) + 1;

        return {
          gameId: game.gameId,
          gameName: game.gameName,
          icon: game.icon,
          dailyPlaysUsed: dailyPlays,
          dailyPlayLimit: 5,
          bestScore,
          userRank: userRank > 0 ? userRank : null,
          totalPlayers: leaderboard.length,
        };
      });

      const stats = await Promise.all(statsPromises);
      setGameStats(stats);
    } catch (error) {
      console.error('게임 통계 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (gameId: string, score: number | null) => {
    if (score === null) return 'N/A';
    
    if (gameId === 'reaction-time') {
      return `${score}ms`;
    }
    
    return score.toString();
  };

  const getRemainingPlays = (used: number, limit: number) => {
    return Math.max(0, limit - used);
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">🎮 미니게임 기록</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span className="text-gray-500">통계를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">🎮 미니게임 기록</h3>
        <button 
          onClick={loadGameStats}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors"
        >
          새로고침
        </button>
      </div>

      <div className="space-y-4">
        {gameStats.map((game) => (
          <div key={game.gameId} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{game.icon}</span>
              <span className="text-lg font-semibold text-gray-700">{game.gameName}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 최고 기록 */}
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-500 mb-1">최고 기록</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatScore(game.gameId, game.bestScore)}
                </p>
              </div>

              {/* 순위 */}
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-500 mb-1">내 순위</p>
                <p className="text-lg font-bold text-gray-800">
                  {game.userRank ? `${game.userRank}위` : 'N/A'}
                  {game.totalPlayers > 0 && (
                    <span className="text-xs text-gray-400 ml-1">/ {game.totalPlayers}명</span>
                  )}
                </p>
              </div>

              {/* 남은 플레이 횟수 */}
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-500 mb-1">오늘 남은 횟수</p>
                <p className={`text-lg font-bold ${
                  getRemainingPlays(game.dailyPlaysUsed, game.dailyPlayLimit) === 0 
                    ? 'text-red-500' 
                    : 'text-gray-800'
                }`}>
                  {getRemainingPlays(game.dailyPlaysUsed, game.dailyPlayLimit)}회
                </p>
                <p className="text-xs text-gray-400">
                  (총 {game.dailyPlayLimit}회)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 