import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSesssion(request) {
  const respsonse = NextResponse.next({
    request: { headers: request.headers }
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,  
    {
      cookies: {
        getAll() {
          return request.cookies
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            respsonse.cookies.set(name, value, options);
          });
        }
      }
    }
  )

  await supabase.auth.getUser()

  return respsonse;
}
