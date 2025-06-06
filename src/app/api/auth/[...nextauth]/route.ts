import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import AppleProvider from "next-auth/providers/apple";

console.log("🔧 NextAuth 환경변수 확인:", {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "설정됨" : "설정안됨",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "설정됨" : "설정안됨"
});

// 환경변수가 설정된 제공자들만 추가
const providers = [];

// Google
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log("✅ Google Provider 추가됨");
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Facebook
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  console.log("✅ Facebook Provider 추가됨");
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  );
}

// Naver
if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
  console.log("✅ Naver Provider 추가됨");
  providers.push(
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    })
  );
}

// Kakao
if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
  console.log("✅ Kakao Provider 추가됨");
  providers.push(
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    })
  );
}

// Apple
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
  console.log("✅ Apple Provider 추가됨");
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    })
  );
}

console.log(`🔧 총 ${providers.length}개의 제공자가 설정됨`);

const handler = NextAuth({
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 Sign In Callback:", {
        user: user?.email,
        account: account?.provider,
        profile: profile?.name || profile?.email
      });
      return true;
    },
    async jwt({ token, account, user }) {
      console.log("🎫 JWT Callback:", {
        user: user?.email,
        account: account?.provider,
        hasToken: !!token
      });
      
      if (account) {
        token.provider = account.provider;
      }
      
      if (user) {
        token.id = user.id;
      }
      
      console.log("🎫 JWT Token after update:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("📋 SESSION CALLBACK CALLED:", {
        hasSession: !!session,
        hasToken: !!token,
        tokenProvider: token?.provider
      });
      
      if (token?.provider) {
        (session as any).provider = token.provider;
      }
      
      if (token?.id) {
        session.user.id = token.id;
      }
      
      console.log("📋 Final session:", session);
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  debug: true,
});

export { handler as GET, handler as POST }; 