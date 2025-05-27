import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import AppleProvider from "next-auth/providers/apple";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30일
    updateAge: 60 * 60 * 24,   // 1일마다 세션 갱신
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // 최초 로그인 시 provider, id, email, role 등 추가
      if (account && profile) {
        token.provider = account.provider;
        token.id = (profile as any)?.id || user?.id || account.providerAccountId;
        token.email = (profile as any)?.email || user?.email;
        token.name = (profile as any)?.name || user?.name;
        token.picture = (profile as any)?.picture || (profile as any)?.profile_image || user?.image;
        token.role = "user"; // 기본값, 필요시 커스텀
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 커스텀 정보 추가
      if (!session.user) session.user = {} as any;
      (session.user as any).provider = token.provider;
      (session.user as any).id = token.id;
      (session.user as any).role = token.role;
      (session.user as any).email = token.email;
      (session.user as any).name = token.name;
      (session.user as any).image = token.picture;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
