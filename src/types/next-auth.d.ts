import "next-auth";
import { Timestamp } from "firebase/firestore";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
      uid?: string;
      createdAt?: Timestamp;
      nickname?: string;
      birthDate?: string;
      gender?: string;
      bio?: string;
      onboardingCompleted?: boolean;
      role?: "admin" | "user";
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string;
    uid?: string;
    createdAt?: Timestamp;
    nickname?: string;
    birthDate?: string;
    gender?: string;
    bio?: string;
    onboardingCompleted?: boolean;
    role?: "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    uid?: string;
    onboardingCompleted?: boolean;
  }
} 