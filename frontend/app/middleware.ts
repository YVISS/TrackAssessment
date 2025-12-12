import { auth as nextAuthMiddleware } from "../auth"
import { updateSession as supabaseMiddleware } from "../utils/supabase/middleware"

// Combine NextAuth and Supabase middleware
export async function middleware(request: any) {
  // Run Supabase middleware first
  const supabaseResponse = await supabaseMiddleware(request)

  // Then run NextAuth middleware
  const nextAuthResponse = await nextAuthMiddleware(request)

  // Return the response from NextAuth (or combine if needed)
  return nextAuthResponse
}