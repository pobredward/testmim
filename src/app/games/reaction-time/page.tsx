'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getGameById } from '../../../data/games';
import { GameResult, ReactionGameResult } from '../../../types/games';
// import { saveGameResult, getScoreRating } from '../../../utils/gameUtils';

type GameState = 'ready' | 'waiting' | 'react' | 'too-early' | 'result';

interface AttemptResult {
  time: number;
  round: number;
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
  
  const gameData = getGameById('reaction-time');
  const totalRounds = 3;

  // Load best time from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('reaction-time-best');
    if (saved) {
      setBestTime(parseInt(saved));
    }
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!session) {
      router.push('/signin?redirect=/games/reaction-time');
    }
  }, [session, router]);

  const startGame = useCallback(() => {
    if (gameState !== 'ready') return;
    
    setGameState('waiting');
    const randomDelay = Math.random() * 3000 + 2000; // 2-5 seconds
    
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('react');
    }, randomDelay);
  }, [gameState]);

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
    
    const times = attempts.map(a => a.time);
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const bestAttempt = Math.min(...times);
    const accuracy = 100; // Since we completed all rounds
    
    return {
      attempts: times,
      averageTime: Math.round(averageTime),
      bestTime: bestAttempt,
      accuracy,
    };
  };

  const getScoreFromAverage = (avgTime: number): number => {
    if (avgTime < 250) return 100;
    if (avgTime < 300) return 90;
    if (avgTime < 400) return 80;
    if (avgTime < 500) return 70;
    if (avgTime < 600) return 60;
    if (avgTime < 800) return 50;
    return 40;
  };

  const getRating = (avgTime: number): string => {
    if (avgTime < 250) return '🔥 놀라운 반사신경!';
    if (avgTime < 300) return '⚡ 매우 빠름!';
    if (avgTime < 400) return '🎯 빠름';
    if (avgTime < 500) return '👍 평균 이상';
    if (avgTime < 600) return '👌 평균';
    return '🐌 연습이 필요해요';
  };

  const saveResult = async () => {
    if (!session?.user?.email || attempts.length === 0) return;
    
    const results = calculateResults();
    if (!results) return;
    
    setLoading(true);
    
    try {
      const score = getScoreFromAverage(results.averageTime);
      const expGained = score >= 70 ? 10 : 5; // Higher EXP for good performance
      
      // Update best time in localStorage
      if (!bestTime || results.bestTime < bestTime) {
        setBestTime(results.bestTime);
        localStorage.setItem('reaction-time-best', results.bestTime.toString());
      }
      
      const gameResult: GameResult = {
        gameId: 'reaction-time',
        userId: session.user.email,
        score: results.averageTime,
        details: results,
        experienceGained: expGained,
        completedAt: new Date().toISOString(),
        duration: 60, // Estimated game duration
      };
      
      // Would save to Firebase here
      // await saveGameResult(gameResult);
      
      console.log('Game result:', gameResult);
      
    } catch (error) {
      console.error('Failed to save game result:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameState === 'result' && attempts.length === totalRounds) {
      saveResult();
    }
  }, [gameState, attempts.length, totalRounds]);

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
        return `라운드 ${currentRound}/${totalRounds}\n클릭하여 시작`;
      case 'waiting':
        return '기다리세요...';
      case 'react':
        return '지금 클릭!';
      case 'too-early':
        return '너무 빨라요!\n다시 시도하세요';
      default:
        return '';
    }
  };

  if (!session) {
    return null; // Will redirect
  }

  if (gameState === 'result') {
    const results = calculateResults();
    if (!results) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚡</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              반응속도 게임 완료!
            </h1>
            <p className="text-gray-600">
              {getRating(results.averageTime)}
            </p>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">게임 결과</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {results.averageTime}ms
                </div>
                <div className="text-sm text-blue-700">평균 반응시간</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {results.bestTime}ms
                </div>
                <div className="text-sm text-green-700">최고 기록</div>
              </div>
            </div>

            {/* Attempt Details */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-3">시도 기록</h3>
              <div className="space-y-2">
                {attempts.map((attempt, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">라운드 {attempt.round}</span>
                    <span className={`font-bold ${attempt.time === results.bestTime ? 'text-green-600' : 'text-gray-700'}`}>
                      {attempt.time}ms
                      {attempt.time === results.bestTime && ' 🏆'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Best */}
            {bestTime && (
              <div className="text-center p-4 bg-yellow-50 rounded-lg mb-6">
                <div className="text-lg font-bold text-yellow-700">
                  개인 최고 기록: {bestTime}ms
                </div>
                {results.bestTime === bestTime && (
                  <div className="text-sm text-yellow-600 mt-1">
                    🎉 새로운 개인 기록 달성!
                  </div>
                )}
              </div>
            )}

            {/* Experience Points */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-700">
                💎 +{getScoreFromAverage(results.averageTime) >= 70 ? 10 : 5} EXP 획득!
              </div>
              <div className="text-sm text-purple-600 mt-1">
                좋은 기록일수록 더 많은 경험치를 얻어요
              </div>
            </div>
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
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mr-3 text-white">4</span>
              총 3라운드 진행됩니다
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-4">
            <span className="text-lg font-bold text-gray-700">
              라운드 {currentRound} / {totalRounds}
            </span>
          </div>
          
          <div
            className={`
              w-full h-64 sm:h-80 rounded-xl transition-all duration-200 cursor-pointer
              flex items-center justify-center text-white text-xl font-bold
              select-none
              ${getGameAreaStyle()}
            `}
            onClick={gameState === 'ready' ? startGame : handleClick}
          >
            <div className="text-center whitespace-pre-line">
              {getGameAreaText()}
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

        {/* Progress */}
        {attempts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">진행 상황</h3>
            <div className="space-y-2">
              {attempts.map((attempt, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">라운드 {attempt.round}</span>
                  <span className="font-bold text-blue-600">{attempt.time}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Record */}
        {bestTime && (
          <div className="bg-white rounded-xl shadow-lg p-6">
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
      </div>
    </div>
  );
} 