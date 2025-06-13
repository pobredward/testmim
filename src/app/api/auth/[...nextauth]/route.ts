import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import AppleProvider from "next-auth/providers/apple";
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, query, where, collection, getDocs } from "firebase/firestore";
import { 
  createUserInFirestore, 
  updateUserLoginInfo, 
  getUserFromFirestore, 
  checkUserExists,
  generateUniqueUID,
  checkFirebaseConnection 
} from "@/utils/userAuth";

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
        if (!account || !user.email) {
          console.log("❌ 계정 정보 또는 이메일이 없습니다:", { account, userEmail: user.email });
          return false;
        }

        // Firebase 연결 확인
        if (!checkFirebaseConnection()) {
          console.error("❌ Firestore 연결이 설정되지 않았습니다.");
          return true; // 로그인은 계속 진행하되 DB 저장은 실패
        }

        // 소셜 제공자별로 고유한 UID 생성
        const providerId = account.providerAccountId || user.id;
        const uniqueUID = generateUniqueUID(account.provider, providerId);
        
        console.log("🔐 로그인 시도:", {
          provider: account.provider,
          email: user.email,
          providerId: providerId,
          uniqueUID: uniqueUID,
          userId: user.id
        });

        // 사용자 존재 여부 확인
        const userExists = await checkUserExists(uniqueUID);
        
        if (!userExists) {
          // 새 사용자 생성
          await createUserInFirestore({
            uid: uniqueUID,
            email: user.email,
            name: user.name || "",
            image: user.image || "",
            provider: account.provider,
            providerId: providerId,
          });
          
          console.log("✅ 새 사용자 생성 성공:", {
            uid: uniqueUID,
            email: user.email,
            provider: account.provider
          });
        } else {
          // 기존 사용자 로그인 정보 업데이트
          await updateUserLoginInfo(uniqueUID, {
            name: user.name || "",
            image: user.image || "",
          });
          
          console.log("🔄 기존 사용자 로그인 성공:", {
            uid: uniqueUID,
            email: user.email,
            provider: account.provider
          });
        }
        
        // user 객체에 고유 UID 저장 (JWT에서 사용)
        user.id = uniqueUID;
        
        return true;
      } catch (error) {
        console.error("❌ Firebase 사용자 저장 오류:", error);
        // Firebase 오류의 경우 상세 정보 로깅
        if (error instanceof Error) {
          console.error("오류 상세:", {
            message: error.message,
            stack: error.stack,
          });
        }
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
          const userData = await getUserFromFirestore(token.uid as string);
          
          if (userData) {
            session.user.uid = userData.uid;
            session.user.createdAt = userData.createdAt;
            session.user.nickname = userData.nickname || "";
            session.user.birthDate = userData.birthDate || "";
            session.user.gender = userData.gender || "";
            session.user.bio = userData.bio || "";
            session.user.onboardingCompleted = userData.onboardingCompleted || false;
            session.user.role = userData.role || "user";
            
            console.log("📋 세션 정보 업데이트 성공:", {
              uid: userData.uid,
              onboardingCompleted: userData.onboardingCompleted,
              nickname: userData.nickname
            });
          } else {
            console.warn("⚠️ 세션 콜백에서 사용자 문서를 찾을 수 없습니다:", token.uid);
            // 사용자 문서가 없는 경우 기본값 설정
            session.user.onboardingCompleted = false;
          }
        } catch (error) {
          console.error("❌ 세션 정보 조회 오류:", error);
          // 세션 정보 조회 실패 시 기본값 설정
          session.user.onboardingCompleted = false;
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