import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import AppleProvider from "next-auth/providers/apple";
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

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
      try {
        if (account && user.email) {
          // Firebase에서 사용자 확인
          const userRef = doc(db, "users", user.email);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            // 새 사용자인 경우 Firestore에 사용자 정보 저장
            const userData = {
              uid: user.id,
              email: user.email,
              name: user.name || "",
              image: user.image || "",
              provider: account.provider,
              providerId: account.providerAccountId,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            };
            
            await setDoc(userRef, userData);
            console.log("새 사용자 생성:", user.email);
          } else {
            // 기존 사용자인 경우 로그인 시간 업데이트
            await setDoc(userRef, {
              lastLoginAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }, { merge: true });
            console.log("기존 사용자 로그인:", user.email);
          }
        }
        return true;
      } catch (error) {
        console.error("Firebase 사용자 저장 오류:", error);
        return true; // 에러가 발생해도 로그인은 계속 진행
      }
    },
    async session({ session, token }) {
      if (session.user?.email) {
        // 세션에 추가 정보 포함
        session.user.provider = token.provider as string;
        
        // Firestore에서 사용자 정보 조회
        try {
          const userRef = doc(db, "users", session.user.email);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            session.user.uid = userData.uid;
            session.user.createdAt = userData.createdAt;
          }
        } catch (error) {
          console.error("세션 정보 조회 오류:", error);
        }
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.provider = account.provider;
      }
      if (user) {
        token.uid = user.id;
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