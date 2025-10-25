import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
 
const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID!
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET!

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [],
})