'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { availableGames, getAvailableGames, getComingSoonGames, getDifficultyColor, getDifficultyText } from '../../data/games';
import { MiniGame } from '../../types/games';

export default function GamesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [availableGamesList, setAvailableGamesList] = useState<MiniGame[]>([]);
  const [comingSoonGamesList, setComingSoonGamesList] = useState<MiniGame[]>([]);

  useEffect(() => {
    setAvailableGamesList(getAvailableGames());
    setComingSoonGamesList(getComingSoonGames());
  }, []);

  const handleGameClick = (gameId: string, isAvailable: boolean) => {
    if (isAvailable) {
      router.push(`/games/${gameId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            미니게임
          </h1>
          <p className="text-gray-600">
            재미있는 미니게임을 플레이하고 경험치를 획득해보세요!
          </p>
          

        </div>

        {/* User Status */}
        {!session && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-blue-600 mr-3">💡</div>
              <div>
                <p className="text-blue-800 font-medium">게스트 모드로 플레이 중</p>
                <p className="text-blue-700 text-sm">
                  로그인하시면 경험치를 획득하고 랭킹에 참여할 수 있습니다!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Available Games */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">🚀</span>
            지금 플레이 가능
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {availableGamesList.map((game) => (
              <div
                key={game.id}
                onClick={() => handleGameClick(game.id, game.isAvailable)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100"
              >
                <div className="p-6">
                  <div className="text-4xl mb-4 text-center">{game.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                    {game.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                      {getDifficultyText(game.difficulty)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ~{game.estimatedTime}분
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-purple-600">
                      <span className="text-sm mr-1">💎</span>
                      <span className="text-sm font-medium">+{game.experienceReward} EXP</span>
                    </div>
                    <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                      플레이
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Games */}
        {comingSoonGamesList.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">🔮</span>
              곧 출시 예정
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {comingSoonGamesList.map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 opacity-75"
                >
                  <div className="p-6 relative">
                    <div className="absolute top-3 right-3">
                      <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                        준비중
                      </span>
                    </div>
                    
                    <div className="text-4xl mb-4 text-center filter grayscale">
                      {game.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-500 mb-3 text-center">
                      {game.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 text-center leading-relaxed">
                      {game.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        {getDifficultyText(game.difficulty)}
                      </span>
                      <span className="text-sm text-gray-400">
                        ~{game.estimatedTime}분
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-400">
                        <span className="text-sm mr-1">💎</span>
                        <span className="text-sm font-medium">+{game.experienceReward} EXP</span>
                      </div>
                      <button 
                        className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                        disabled
                      >
                        준비중
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 