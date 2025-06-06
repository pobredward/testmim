import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import AppleProvider from "next-auth/providers/apple";
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, query, where, collection, getDocs } from "firebase/firestore";

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
          // 소셜 제공자별로 고유한 UID 생성
          const providerId = account.providerAccountId || user.id;
          const uniqueUID = `${account.provider}_${providerId}`;
          
          console.log("🔐 로그인 시도:", {
            provider: account.provider,
            email: user.email,
            providerId: providerId,
            uniqueUID: uniqueUID,
            userId: user.id
          });

          // UID를 document ID로 사용
          const userRef = doc(db, "users", uniqueUID);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            // 새 사용자인 경우 Firestore에 사용자 정보 저장
            const userData = {
              uid: uniqueUID,
              email: user.email,
              name: user.name || "",
              image: user.image || "",
              provider: account.provider,
              providerId: providerId,
              // 온보딩 관련 필드 초기화
              nickname: "",
              birthDate: "",
              gender: "",
              bio: "",
              onboardingCompleted: false,
              // 시간 필드
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            };
            
            await setDoc(userRef, userData);
            console.log("✅ 새 사용자 생성:", {
              uid: uniqueUID,
              email: user.email,
              provider: account.provider,
              onboardingCompleted: false
            });
          } else {
            // 기존 사용자인 경우 로그인 시간 및 프로필 정보 업데이트
            await setDoc(userRef, {
              name: user.name || "",
              image: user.image || "",
              lastLoginAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }, { merge: true });
            
            const userData = userDoc.data();
            console.log("🔄 기존 사용자 로그인:", {
              uid: uniqueUID,
              email: user.email,
              provider: account.provider,
              onboardingCompleted: userData.onboardingCompleted
            });
          }
          
          // user 객체에 고유 UID 저장 (JWT에서 사용)
          user.id = uniqueUID;
        }
        return true;
      } catch (error) {
        console.error("❌ Firebase 사용자 저장 오류:", error);
        return true; // 에러가 발생해도 로그인은 계속 진행
      }
    },
    async session({ session, token }) {
      console.log("🔍 세션 콜백:", {
        email: session.user?.email,
        tokenUID: token.uid,
        provider: token.provider
      });

      if (session.user?.email && token.uid) {
        // 세션에 추가 정보 포함
        session.user.provider = token.provider as string;
        session.user.id = token.uid as string;
        
        // UID를 사용하여 Firestore에서 사용자 정보 조회
        try {
          const userRef = doc(db, "users", token.uid as string);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            session.user.uid = userData.uid;
            session.user.createdAt = userData.createdAt;
            session.user.nickname = userData.nickname;
            session.user.birthDate = userData.birthDate;
            session.user.gender = userData.gender;
            session.user.bio = userData.bio;
            session.user.onboardingCompleted = userData.onboardingCompleted || false;
            
            console.log("📋 세션 정보 업데이트:", {
              uid: userData.uid,
              onboardingCompleted: userData.onboardingCompleted,
              nickname: userData.nickname
            });
          }
        } catch (error) {
          console.error("❌ 세션 정보 조회 오류:", error);
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
        console.log("🎫 JWT 토큰 업데이트:", {
          uid: user.id,
          provider: account?.provider
        });
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