import { DefaultSession, DefaultJWT } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    provider?: string
    user: {
      id?: string
    } & DefaultSession["user"]
  }

  interface User {
    id?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    provider?: string
    accessToken?: string
    id?: string
  }
} 