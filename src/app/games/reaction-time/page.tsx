'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getGameById } from '../../../data/games';
import { GameResult, ReactionGameResult } from '../../../types/games';
import { getGameLeaderboard, saveGameResult, getUserDailyPlayCount, incrementUserDailyPlayCount, canUserPlay, getUserBestScore } from '../../../utils/gameUtils';
import { giveExpForMiniGameCompletion } from '../../../utils/expLevel';
import { getUserFromFirestore } from '../../../utils/userAuth';
import LevelUpModal from '../../components/LevelUpModal';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
// import { getScoreRating } from '../../../utils/gameUtils';

type GameState = 'ready' | 'waiting' | 'react' | 'too-early' | 'result';

interface AttemptResult {
  time: number;
  round: number;
}

interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  details: any;
  completedAt: string;
  rank: number;
}

export default function ReactionTimePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentRound, setCurrentRound] = useState(1);
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [dailyPlays, setDailyPlays] = useState(0);
  const [canPlay, setCanPlay] = useState(true);
  
  // 레벨업 모달 관련 상태
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState({
    oldLevel: 1,
    newLevel: 1,
    expGained: 0,
    totalExp: 0,
  });

  const gameData = getGameById('reaction-time');
  const totalRounds = 1;
  const DAILY_PLAY_LIMIT = 5;

  // Load best time and daily plays
  useEffect(() => {
    const saved = localStorage.getItem('reaction-time-best');
    if (saved) {
      setBestTime(parseInt(saved));
    }
    
    // Check daily plays from Firebase (only for logged in users)
    const loadDailyPlays = async () => {
      if (session?.user?.email) {
        try {
          const currentPlays = await getUserDailyPlayCount(session.user.email, 'reaction-time');
          setDailyPlays(currentPlays);
          setCanPlay(currentPlays < DAILY_PLAY_LIMIT);
        } catch (error) {
          console.error('Failed to load daily plays:', error);
          setDailyPlays(0);
          setCanPlay(true);
        }
      } else {
        // Guest users have no daily limit
        setDailyPlays(0);
        setCanPlay(true);
      }
    };
    
    loadDailyPlays();
  }, [session]);

  // Load leaderboard data
  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const leaderboardData = await getGameLeaderboard('reaction-time', 10);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Note: Allow playing without login, encourage login after game

  const startGame = useCallback(async () => {
    if (gameState !== 'ready') return;
    
    // Check daily play limit (only for logged in users)
    if (session?.user?.email) {
      try {
        const { canPlay: userCanPlay, currentCount } = await canUserPlay(session.user.email, 'reaction-time', DAILY_PLAY_LIMIT);
        
        if (!userCanPlay) {
          alert(`하루 ${DAILY_PLAY_LIMIT}회 플레이 제한에 도달했습니다. 내일 다시 시도해주세요!`);
          return;
        }

        // Increment play count
        const newPlayCount = await incrementUserDailyPlayCount(session.user.email, 'reaction-time');
        setDailyPlays(newPlayCount);
        setCanPlay(newPlayCount < DAILY_PLAY_LIMIT);
      } catch (error) {
        console.error('Failed to check/update play count:', error);
        // Continue with game for error cases
      }
    }
    
    setGameState('waiting');
    const randomDelay = Math.random() * 3000 + 2000; // 2-5 seconds
    
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('react');
    }, randomDelay);
  }, [gameState, session]);

  const handleClick = useCallback(() => {
    if (gameState === 'waiting') {
      // Too early click
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setGameState('too-early');
      return;
    }
    
    if (gameState === 'too-early') {
      // Handle retry after too early click - start new game immediately
      setAttempts([]);
      setCurrentTime(null);
      setCurrentRound(1);
      setGameState('ready');
      return;
    }
    
    if (gameState === 'react') {
      const reactionTime = Date.now() - startTimeRef.current;
      setCurrentTime(reactionTime);
      
      const newAttempt: AttemptResult = {
        time: reactionTime,
        round: currentRound,
      };
      
      setAttempts(prev => [...prev, newAttempt]);
      
      if (currentRound >= totalRounds) {
        setGameState('result');
      } else {
        setCurrentRound(prev => prev + 1);
        setGameState('ready');
      }
    }
  }, [gameState, currentRound, totalRounds]);

  const resetGame = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setGameState('ready');
    setCurrentRound(1);
    setAttempts([]);
    setCurrentTime(null);
  };

  const tryAgain = () => {
    setGameState('ready');
  };

  const calculateResults = () => {
    if (attempts.length === 0) return null;
    
    const lastAttempt = attempts[attempts.length - 1];
    const isSuccess = lastAttempt.time < 999999;
    
    return {
      attempts: attempts.map(a => a.time),
      reactionTime: isSuccess ? lastAttempt.time : 0,
      isSuccess,
      failedAttempts: isSuccess ? 0 : 1,
    };
  };

  const getScoreFromTime = (reactionTime: number): number => {
    if (reactionTime < 250) return 100;
    if (reactionTime < 300) return 90;
    if (reactionTime < 400) return 80;
    if (reactionTime < 500) return 70;
    if (reactionTime < 600) return 60;
    if (reactionTime < 800) return 50;
    return 40;
  };

  const getRating = (reactionTime: number): string => {
    if (!reactionTime) return '😢 실패했습니다';
    if (reactionTime < 250) return '🔥 놀라운 반사신경!';
    if (reactionTime < 300) return '⚡ 매우 빠름!';
    if (reactionTime < 400) return '🎯 빠름';
    if (reactionTime < 500) return '👍 평균 이상';
    if (reactionTime < 600) return '👌 평균';
    return '🐌 연습이 필요해요';
  };

  const formatScore = (score: number): string => {
    return `${score}ms`;
  };

  const getRankMedal = (rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}위`;
    }
  };

  const saveResult = async () => {
    const results = calculateResults();
    if (!results) return;
    
    setLoading(true);
    
    try {
      // Always update local storage and check for personal best
      let isNewPersonalBest = false;
      
      if (results.isSuccess) {
        if (!bestTime || results.reactionTime < bestTime) {
          setBestTime(results.reactionTime);
          localStorage.setItem('reaction-time-best', results.reactionTime.toString());
          isNewPersonalBest = true;
        }
      }
      
      // Save to Firebase if user is logged in (but mark as personal best only if applicable)
      if (session?.user?.email && results.isSuccess) {
        const score = getScoreFromTime(results.reactionTime);
        const expGained = score >= 70 ? 10 : 5;
        
        // Get user's nickname from users collection
        let userName = session.user.name || 
                      session.user.email?.split('@')[0] || 
                      `Player ${session.user.email?.substring(0, 8)}`;
        
        try {
          const userRef = doc(db, 'users', session.user.email);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Use nickname first, then fallback to displayName, name, etc.
            userName = userData.nickname || 
                      userData.displayName || 
                      userData.name || 
                      userName;
          }
        } catch (error) {
          console.warn('Failed to get user nickname:', error);
          // Use fallback userName
        }
        
        const gameResult: GameResult = {
          gameId: 'reaction-time',
          userId: session.user.email,
          userName: userName,
          score: results.reactionTime,
          details: results,
          experienceGained: expGained,
          completedAt: new Date().toISOString(),
          duration: 30, // Single round duration
        };
        
        const saveSuccess = await saveGameResult(gameResult, isNewPersonalBest);
        
        if (saveSuccess) {
          console.log('Game result saved to Firebase:', gameResult);
          // Refresh leaderboard after saving result  
          loadLeaderboard();
        }

        // 미니게임 완료시 경험치 지급 (성공한 경우에만)
        if (session?.user?.id) {
          try {
            // 현재 사용자 데이터 조회
            const currentUserData = await getUserFromFirestore(session.user.id);
            
            // 미니게임 완료 경험치 지급
            const levelUpResult = await giveExpForMiniGameCompletion(
              session.user.id,
              'reaction-time',
              results.reactionTime,
              isNewPersonalBest,
              currentUserData || undefined
            );
            
            console.log('✅ 미니게임 경험치 지급 완료:', levelUpResult);
            
            // 레벨업했다면 모달 표시
            if (levelUpResult.leveledUp) {
              setLevelUpData({
                oldLevel: levelUpResult.oldLevel,
                newLevel: levelUpResult.newLevel,
                expGained: levelUpResult.expGained,
                totalExp: levelUpResult.totalExp,
              });
              
              // 결과 페이지가 완전히 로드된 후 모달 표시
              setTimeout(() => {
                setShowLevelUpModal(true);
              }, 1000);
            }
          } catch (expError) {
            console.error('미니게임 경험치 지급 오류:', expError);
            // 경험치 지급 실패해도 게임 결과는 정상 표시
          }
        }
      } else {
        console.log('Result not saved to Firebase - user not logged in or failed');
      }
      
    } catch (error) {
      console.error('Failed to save game result:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameState === 'result' && attempts.length > 0) {
      saveResult();
    }
  }, [gameState, attempts.length]);

  const getGameAreaStyle = () => {
    switch (gameState) {
      case 'ready':
        return 'bg-gray-200 hover:bg-gray-300';
      case 'waiting':
        return 'bg-red-500';
      case 'react':
        return 'bg-green-500';
      case 'too-early':
        return 'bg-red-600';
      default:
        return 'bg-gray-200';
    }
  };

  const getGameAreaText = () => {
    switch (gameState) {
      case 'ready':
        return `클릭하여 시작\n(${DAILY_PLAY_LIMIT - dailyPlays}번 남음)`;
      case 'waiting':
        return '기다리세요...';
      case 'react':
        return '지금 클릭!';
      case 'too-early':
        return `너무 빨라요!\n실패\n클릭하여 결과 확인`;
      default:
        return '';
    }
  };

  if (gameState === 'result') {
    const results = calculateResults();
    if (!results) return null;

    return (
      <>
        {/* 레벨업 모달 */}
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          expGained={levelUpData.expGained}
          totalExp={levelUpData.totalExp}
        />

        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
          <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚡</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              반응속도 게임 완료!
            </h1>
            <p className="text-gray-600">
              {getRating(results.reactionTime)}
            </p>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">게임 결과</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {results.isSuccess ? `${results.reactionTime}ms` : 'FAIL'}
                </div>
                <div className="text-sm text-blue-700">반응시간</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {bestTime ? `${bestTime}ms` : 'N/A'}
                </div>
                <div className="text-sm text-green-700">개인 최고 기록</div>
              </div>
            </div>

            {/* Game Result */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-3">게임 결과</h3>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                {results.isSuccess ? (
                  <div>
                    <span className="text-lg font-bold text-green-600">성공! ✅</span>
                    <div className="text-sm text-gray-600 mt-1">반응시간: {results.reactionTime}ms</div>
                  </div>
                ) : (
                  <div>
                    <span className="text-lg font-bold text-red-600">실패! ❌</span>
                    <div className="text-sm text-gray-600 mt-1">너무 빨리 클릭했습니다</div>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Best */}
            {results.isSuccess && results.reactionTime === bestTime && (
              <div className="text-center p-4 bg-yellow-50 rounded-lg mb-6">
                <div className="text-lg font-bold text-yellow-700">
                  🎉 새로운 개인 기록 달성!
                </div>
                <div className="text-sm text-yellow-600 mt-1">
                  {results.reactionTime}ms
                </div>
              </div>
            )}

            {/* Experience Points / Login Prompt */}
            {session ? (
              results.isSuccess && results.reactionTime === bestTime ? (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-700">
                    💎 +{getScoreFromTime(results.reactionTime) >= 70 ? 10 : 5} EXP 획득!
                  </div>
                  <div className="text-sm text-purple-600 mt-1">
                    새로운 개인 기록으로 경험치를 획득했어요!
                  </div>
                </div>
              ) : results.isSuccess ? (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-700">
                    개인 기록을 갱신하지 못했습니다
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    더 빠른 반응으로 도전해보세요!
                  </div>
                </div>
              ) : null
            ) : (
              results.isSuccess && (
                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-lg font-bold text-amber-700 mb-2">
                    🔒 게임 기록을 저장하고 경험치를 얻으려면 로그인하세요
                  </div>
                  <div className="text-sm text-amber-600 mb-3">
                    로그인하면 기록 저장, 경험치 획득, 랭킹 참여가 가능해요!
                  </div>
                  <Link
                    href="/signin?redirect=/games/reaction-time"
                    className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    로그인하러 가기
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetGame}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              다시 플레이
            </button>
            <Link
              href="/games"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
            >
              다른 게임 플레이
            </Link>
          </div>
        </div>
      </div>
    </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
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
          
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {gameData?.title || '반응속도 게임'}
          </h1>
          <p className="text-gray-600">
            초록색으로 바뀌는 순간 빠르게 클릭하세요!
          </p>
          
          {/* Daily play counter */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <span className="text-blue-700 font-medium">
                오늘 플레이 횟수: {dailyPlays}/{DAILY_PLAY_LIMIT}
              </span>
              {dailyPlays >= DAILY_PLAY_LIMIT && (
                <div className="text-sm text-red-600 mt-1">
                  오늘의 플레이 제한에 도달했습니다. 내일 다시 시도해주세요!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">게임 방법</h2>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
              아래 영역을 클릭하여 게임을 시작하세요
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold mr-3 text-white">2</span>
              빨간색일 때는 기다리세요
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold mr-3 text-white">3</span>
              초록색으로 바뀌는 순간 빠르게 클릭!
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold mr-3 text-white">4</span>
              개인 기록을 갱신하면 랭킹에 등록됩니다
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          
          <div
            className={`
              w-full h-64 sm:h-80 rounded-xl transition-all duration-200 
              flex items-center justify-center text-white text-xl font-bold
              select-none
              ${dailyPlays >= DAILY_PLAY_LIMIT ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer ' + getGameAreaStyle()}
            `}
            onClick={dailyPlays >= DAILY_PLAY_LIMIT ? undefined : (gameState === 'ready' ? startGame : handleClick)}
          >
            <div className="text-center whitespace-pre-line">
              {dailyPlays >= DAILY_PLAY_LIMIT ? '오늘의 플레이 완료\n내일 다시 도전하세요!' : getGameAreaText()}
            </div>
          </div>
          
          {currentTime && gameState === 'ready' && (
            <div className="text-center mt-4">
              <div className="text-2xl font-bold text-green-600">
                {currentTime}ms
              </div>
              <div className="text-sm text-gray-600">이번 시도</div>
            </div>
          )}
        </div>

        {/* Best Record */}
        {bestTime && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 mb-2">
                🏆 개인 최고 기록
              </div>
              <div className="text-2xl font-bold text-yellow-700">
                {bestTime}ms
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              🏆 반응속도 게임 랭킹
            </h3>
          </div>
          
          {leaderboardLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">랭킹 로딩 중...</div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600">아직 랭킹 데이터가 없습니다.</div>
              <div className="text-sm text-gray-500 mt-1">첫 번째 플레이어가 되어보세요!</div>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-xl mr-4 min-w-[50px] text-center">
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
                    <div className="text-lg font-bold text-blue-600">
                      {formatScore(entry.score)}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
} 