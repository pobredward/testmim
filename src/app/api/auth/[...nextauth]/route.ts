import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import AppleProvider from "next-auth/providers/apple";
import { getUserById, createUser } from "@/lib/firestore";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !user.email) return false;
      
      try {
        // 사용자 ID 생성 (이메일 기반)
        const userId = user.email.replace(/[@.]/g, '_');
        
        // 기존 사용자 확인
        const existingUser = await getUserById(userId);
        
        if (!existingUser) {
          // 새 사용자 생성
          await createUser({
            id: userId,
            email: user.email,
            name: user.name || profile?.name || '',
            image: user.image || profile?.image,
            provider: account.provider,
            providerId: account.providerAccountId,
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const userId = session.user.email.replace(/[@.]/g, '_');
        const user = await getUserById(userId);
        
        if (user) {
          session.user.id = user.id;
          session.user.nickname = user.nickname;
          session.user.gender = user.gender;
          session.user.isProfileComplete = user.isProfileComplete;
        }
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.provider = account.provider;
      }
      if (user?.email) {
        token.userId = user.email.replace(/[@.]/g, '_');
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST }; 