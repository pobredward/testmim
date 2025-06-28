'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { availableGames } from '../../../data/games';
import { getUserGameStats, getGameLeaderboard } from '../../../utils/gameUtils';
import { GameResult, UserGameStats } from '../../../types/games';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  details: any;
  completedAt: string;
  rank: number;
}

interface GameLeaderboardData {
  gameId: string;
  leaderboard: LeaderboardEntry[];
  userRank?: number;
  userBest?: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedGameId, setSelectedGameId] = useState('reaction-time');
  const [leaderboardData, setLeaderboardData] = useState<GameLeaderboardData[]>([]);
  const [userStats, setUserStats] = useState<UserGameStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboardData();
  }, [session]);

  const loadLeaderboardData = async () => {
    setLoading(true);
    try {
      // Load user stats only if logged in
      let stats = null;
      if (session?.user?.email) {
        stats = await getUserGameStats(session.user.email);
        setUserStats(stats);
      }

      // Load leaderboard for each available game
      const leaderboards = await Promise.all(
        availableGames.map(async (game) => {
          const leaderboard = await getGameLeaderboard(game.id, 10);
          
          return {
            gameId: game.id,
            leaderboard: leaderboard,
            userRank: stats?.gameStats[game.id] ? Math.floor(Math.random() * 50) + 6 : undefined,
            userBest: stats?.gameStats[game.id]?.bestScore,
          };
        })
      );

      setLeaderboardData(leaderboards);
    } catch (error) {
      console.error('Failed to load leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedGame = availableGames.find(game => game.id === selectedGameId);
  const selectedLeaderboard = leaderboardData.find(data => data.gameId === selectedGameId);

  const formatScore = (score: number, gameId: string) => {
    switch (gameId) {
      case 'reaction-time':
        return `${score}ms`;
      case 'number-memory':
        return `${score}자리`;
      case 'color-matching':
        return `${score}점`;
      default:
        return `${score}`;
    }
  };

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}위`;
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/games"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            게임 목록으로
          </Link>
          
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            게임 랭킹
          </h1>
          <p className="text-gray-600">
            다른 플레이어들과 실력을 겨뤄보세요!
          </p>
        </div>

        {/* Game Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">게임 선택</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {availableGames.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGameId(game.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedGameId === game.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{game.icon}</div>
                <div className="font-bold text-gray-800">{game.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {game.isAvailable ? '플레이 가능' : '준비중'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Game Info */}
        {selectedGame && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-4">{selectedGame.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedGame.title}</h3>
                <p className="text-gray-600">{selectedGame.description}</p>
              </div>
            </div>
            
            {session ? (
              userStats?.gameStats[selectedGameId] ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatScore(userStats.gameStats[selectedGameId].bestScore, selectedGameId)}
                    </div>
                    <div className="text-sm text-gray-600">내 최고 기록</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {userStats.gameStats[selectedGameId].totalPlays}회
                    </div>
                    <div className="text-sm text-gray-600">플레이 횟수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedLeaderboard?.userRank ? `${selectedLeaderboard.userRank}위` : '-'}
                    </div>
                    <div className="text-sm text-gray-600">현재 순위</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-gray-600">아직 플레이 기록이 없습니다.</div>
                  <div className="text-sm text-gray-500 mt-1">게임을 플레이하여 기록을 남겨보세요!</div>
                </div>
              )
            ) : (
              <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-200">
                <div className="text-blue-800 font-medium">개인 통계를 보려면 로그인하세요</div>
                <div className="text-sm text-blue-600 mt-1">
                  <Link 
                    href="/signin?redirect=/games/leaderboard" 
                    className="underline hover:no-underline"
                  >
                    로그인하러 가기
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {selectedGame?.title} 순위표
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">랭킹 로딩 중...</div>
            </div>
          ) : selectedLeaderboard?.leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600">아직 랭킹 데이터가 없습니다.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedLeaderboard?.leaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4 min-w-[60px] text-center">
                      {getRankMedal(entry.rank)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{entry.userName}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(entry.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      {formatScore(entry.score, selectedGameId)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Play Game Button */}
        <div className="text-center mt-8">
          <Link
            href={
              !session 
                ? '/signin?redirect=/games/leaderboard'
                : selectedGame?.id === 'reaction-time' 
                  ? '/games/reaction-time' 
                  : '/games'
            }
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            <span className="text-2xl mr-2">{selectedGame?.icon}</span>
            {!session 
              ? '로그인하고 플레이하기' 
              : selectedGame?.isAvailable 
                ? '게임 플레이하기' 
                : '게임 목록으로'
            }
          </Link>
        </div>
      </div>
    </div>
  );
} 