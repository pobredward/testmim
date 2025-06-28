export interface MiniGame {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'reaction' | 'memory' | 'focus' | 'logic';
  estimatedTime: number; // in minutes
  experienceReward: number;
  isAvailable: boolean;
  comingSoon?: boolean;
}

export interface GameResult {
  gameId: string;
  userId: string;
  score: number;
  details: Record<string, any>; // game-specific data
  experienceGained: number;
  completedAt: string;
  duration: number; // in seconds
}

export interface GameStats {
  gameId: string;
  totalPlays: number;
  bestScore: number;
  averageScore: number;
  totalExperienceGained: number;
  lastPlayedAt?: string;
}

export interface UserGameStats {
  userId: string;
  gameStats: Record<string, GameStats>;
  totalGamesPlayed: number;
  totalExperienceFromGames: number;
  favoriteGameId?: string;
}

// Reaction time game specific types
export interface ReactionGameResult {
  attempts: number[];
  averageTime: number;
  bestTime: number;
  accuracy: number;
}

// Memory game specific types  
export interface MemoryGameResult {
  maxSequenceLength: number;
  finalScore: number;
  mistakes: number;
}

// Color matching game specific types
export interface ColorGameResult {
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  timeRemaining: number;
  difficulty: 'easy' | 'medium' | 'hard';
} 