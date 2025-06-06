export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  nickname?: string;
  gender?: 'male' | 'female' | 'other';
  provider: string;
  providerId: string;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileInput {
  nickname: string;
  gender: 'male' | 'female' | 'other';
} 